from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from django.conf import settings
from .models import Post
from .models import Comment
from .serializers import UserSerializer
from .serializers import PostSerializer
from .serializers import CommentSerializer
from django.middleware.csrf import get_token
from rest_framework.decorators import permission_classes
# from django.contrib.auth.decorators import login_required
# from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth.mixins import LoginRequiredMixin
from .models import CustomUser
from django.contrib.auth import authenticate, login, logout


class Login(APIView):
    # Log out of user account
    def get(self, request):
        logout(request)
        return Response("Successfully logged out")

    # Log into a user account
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # Ensure that user exists
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response("Successfully logged in")
            # After login a crsf token will be available within cookies 
            # put the token in a header labelled X-CSRFToken 
            # for use in accessing views that are for logged in users only
        else:
            return Response("Invalid username or password", status=401)


class UserList(APIView):
    # View all users
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    # Create a new user
    def post(self, request):
        # Ensure username is unique
        if not CustomUser.objects.filter(username=request.POST.get('username')).exists():
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Account created"}, status=status.HTTP_201_CREATED)
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)


class PostList(APIView):
    # View all posts
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        if request.user.is_authenticated:
            print("User is logged in!")
        else:
            print("User is not logged in.")
        return Response(serializer.data)

    # Create a new post
    @permission_classes([IsAuthenticated]) # Logged in users only
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)


class Image(APIView):
    # View an image
    def get(self, request, pk):
        post = Post.objects.get(pk=pk)
        return render(request, 'image.html', {'post': post})


class SpecificPost(APIView):
    # View a post
    def get(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    # Edit a post
    @permission_classes([IsAuthenticated]) # Logged in users only
    def put(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        
    # Delete a post
    @permission_classes([IsAuthenticated]) # Logged in users only
    def delete(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            post.delete()
            return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)


class CommentList(APIView):
    # Create a new comment
    @permission_classes([IsAuthenticated]) # Logged in users only
    def post(self, request, fk):
        data = request.data.copy()
        data['post'] = fk
        try:
            serializer = CommentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)


class SpecificComment(APIView):
    # View a comment
    def get(self, request, fk, pk):
        comment = Comment.objects.get(pk=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    # Edit a comment
    @permission_classes([IsAuthenticated]) # Logged in users only
    def put(self, request, fk, pk):
        comment = Comment.objects.get(pk=pk)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete a comment
    @permission_classes([IsAuthenticated]) # Logged in users only
    def delete(self, request, fk, pk):
        try:
            comment = Comment.objects.get(pk=pk)
            comment.delete()
            return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)