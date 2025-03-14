from django.contrib.auth import views as auth_views
from django.urls import path
from .views import PostList
from .views import SpecificPost
from .views import SpecificComment
from .views import Image
from .views import CommentList
from .views import RegisterUser

urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'), # Creating a post and viewing all posts
    path('posts/<int:pk>/', SpecificPost.as_view(), name='post'), # Viewing, editng and deleting a post
    path('posts/<int:fk>/comments/<int:pk>/', SpecificComment.as_view(), name='comment'), # Viewing, editng and deleting a comment
    path('posts/<int:pk>/image/', Image.as_view(), name='image'), # Viewing an image
    path('comments/', CommentList.as_view(), name='comment-list'), # Creating a comment
    path('users/', RegisterUser.as_view(), name='register-user'), # Creating a user account
]