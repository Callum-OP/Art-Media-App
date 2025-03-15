from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Post
from .models import Comment
from .serializers import UserSerializer
from .serializers import PostSerializer
from .serializers import CommentSerializer


class RegisterUser(APIView):
    # Create a new user
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account created"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)

class PostList(APIView):
    # View all posts
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    # Create a new post
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
    def put(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        
    # Delete a post
    def delete(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            post.delete()
            return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)


class CommentList(APIView):
    # Create a new comment
    def post(self, request):
        try:
            serializer = CommentSerializer(data=request.data)
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
    def put(self, request, fk, pk):
        comment = Comment.objects.get(pk=pk)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete a comment
    def delete(self, request, fk, pk):
        try:
            comment = Comment.objects.get(pk=pk)
            comment.delete()
            return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)