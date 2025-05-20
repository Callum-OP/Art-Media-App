from rest_framework import serializers
from .models import Post
from .models import Comment
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    

    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'title', 'text', 'comments', 'created_at']