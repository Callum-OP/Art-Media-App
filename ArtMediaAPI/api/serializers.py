from rest_framework import serializers
from .models import Post
from .models import Comment
from .models import CustomUser
from .models import FollowUser

# Serializer for creating users
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'email', 'profile_pic', 'bio', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}


# Serializer for viewing and editing user details without editing password
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'profile_pic', 'bio', 'created_at']


# Serializer for following and unfollowing users
class FollowUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowUser
        fields = ['follower', 'following', 'created_at']


# Serializer for creating, editing and viewing comments
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


# Serializer for creating, editing and viewing posts
class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    

    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'title', 'text', 'likes', 'comments', 'created_at']