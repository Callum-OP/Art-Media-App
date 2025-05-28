from uuid import UUID
from rest_framework.views import APIView
from rest_framework.response import Response # For sending a response
from rest_framework import status
from .models import Post, Comment, CustomUser, PostLike
from .serializers import CreateUserSerializer, UserSerializer, PostSerializer, CommentSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout # For login authentication
from django.db.models import Q # For search functionality
from django.contrib.auth.hashers import make_password # For hashing passwords

def checkID(pk):
    try:
        return UUID(pk)
    except ValueError:
        return None


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
            # After login a csrf token will be available within cookies 
            # for use in accessing views that are for logged in users only
            data = Response({'id': user.id, 'username':  user.username})
            return data
        else:
            return Response("Invalid username or password", status=401)


class UserList(APIView):
    # Create a new user
    def post(self, request):
        # Ensure username is unique
        if not CustomUser.objects.filter(username=request.POST.get('username')).exists():
            data = request.data.copy()
            # Hash password
            data['password'] = make_password(data.get('password'))
            serializer = CreateUserSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                # Check user now exists
                username = request.POST.get('username')
                password = request.POST.get('password')
                user = authenticate(request, username=username, password=password)
                print(user)
                if user is not None:
                    # Login user
                    login(request, user)
                    # After login a csrf token will be available within cookies 
                    # for use in accessing views that are for logged in users only
                    data = Response({'id': user.id, 'username':  user.username}, status=status.HTTP_201_CREATED)
                    return data
                else:
                    return Response("Invalid username or password", status=401)
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)


class SpecificUser(APIView):
    # View specific user
    def get(self, request, pk):
        # Check if request has valid id
        pk = checkID(pk)
        if pk is None:
            return Response({"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if user exists
        try:
            user = CustomUser.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
     # Edit a user account
    @permission_classes([IsAuthenticated]) # Logged in users only
    def put(self, request, pk):
        # Check if request has valid id
        userID = checkID(pk)
        if userID is None:
            return Response({"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if user exists, then edit it
        try:
            data = request.data.copy()
            # Hash password
            data['password'] = make_password(data.get('password'))
            user = CustomUser.objects.get(pk=userID)
            serializer = UserSerializer(user, data=data)
            if serializer.is_valid():
                # If image has changed then delete the old image file
                if 'profile_pic' in serializer.validated_data:
                    if serializer.validated_data['profile_pic'] != user.profile_pic:
                        user.profile_pic.delete(save=False)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    

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


class SpecificPost(APIView):
    # View a post
    def get(self, request, pk):
        # Check if request has valid id
        postID = checkID(pk)
        if postID is None:
            return Response({"error": "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if post exists, then return it
        try:
            post = Post.objects.get(pk=postID)
            serializer = PostSerializer(post)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    # Edit a post
    @permission_classes([IsAuthenticated]) # Logged in users only
    def put(self, request, pk):
        # Check if request has valid id
        postID = checkID(pk)
        if postID is None:
            return Response({"error": "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if post exists, then edit it
        try:
            post = Post.objects.get(pk=postID)
            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid():
                # If image has changed then delete the old image file
                if 'image' in serializer.validated_data:
                    if serializer.validated_data['image'] != post.image:
                        post.image.delete(save=False)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
    # Delete a post
    @permission_classes([IsAuthenticated]) # Logged in users only
    def delete(self, request, pk):
        # Check if request has valid id
        postID = checkID(pk)
        if postID is None:
            return Response({"error": "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if post exists then delete it
        try:
            post = Post.objects.get(pk=postID)
            post.delete()
            return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
class SearchPosts(APIView):
    # Search and filter posts by title or text contained in post or user id that made post
    def get(self, request, search):
        # Check if request has valid id, if not then search by title or text
        userID = checkID(search)
        # Search by user
        if userID is None:
            posts = Post.objects.filter(Q(title__icontains=search) | Q(text__icontains=search))
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data)
        # Search by posts
        else:
            posts = Post.objects.filter(user=search)
            if (posts):
                serializer = PostSerializer(posts, many=True)
                return Response(serializer.data)
                
class LikePost(APIView):
    # View likes of post
    def get(self, request, pk, fk):
        # Check if request has valid id
        postID = checkID(fk)
        if postID is None:
            return Response({"error": "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if post exists, then return likes
        try:
            post = Post.objects.get(pk=postID)
            postLikeCount = post.likes.all().count()
            return Response({"likes": postLikeCount})
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
    # Like a post
    @permission_classes([IsAuthenticated]) # Logged in users only
    def post(self, request, pk, fk):
        # Check if request has valid id
        postID = checkID(fk)
        if postID is None:
            return Response({"error": "Invalid post ID"}, status=status.HTTP_400_BAD_REQUEST)
        userID = checkID(pk)
        if userID is None:
            return Response({"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if post and user exists then add or remove like
        try:
            post = Post.objects.get(pk=postID)
            user = CustomUser.objects.get(pk=userID)
            if user not in post.likes.all():
                postLike = PostLike(post=post, user=user)
                postLike.save()
                like = True
            else:
                post.likes.remove(user)
                like = False
            return Response({"like": like})
        except (Post.DoesNotExist, CustomUser.DoesNotExist):
            return Response({"error": "Post or user not found"}, status=status.HTTP_404_NOT_FOUND)


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
        # Check if request has valid id
        commentID = checkID(pk)
        if commentID is None:
            return Response({"error": "Invalid comment ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if comment exists, then return it
        try:
            comment = Comment.objects.get(pk=commentID)
            serializer = CommentSerializer(comment)
            return Response(serializer.data)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)
        
    # Edit a comment
    @permission_classes([IsAuthenticated]) # Logged in users only
    def put(self, request, fk, pk):
        # Check if request has valid id
        commentID = checkID(pk)
        if commentID is None:
            return Response({"error": "Invalid comment ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if comment exists, then edit it
        comment = Comment.objects.get(pk=commentID)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete a comment
    @permission_classes([IsAuthenticated]) # Logged in users only
    def delete(self, request, fk, pk):
        # Check if request has valid id
        commentID = checkID(pk)
        if commentID is None:
            return Response({"error": "Invalid comment ID"}, status=status.HTTP_400_BAD_REQUEST)
        # Check if comment exists, then delete it
        try:
            comment = Comment.objects.get(pk=commentID)
            comment.delete()
            return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)