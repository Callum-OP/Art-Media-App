from django.contrib.auth import views as auth_views
from django.urls import path
from .views import PostList
from .views import SpecificPost
from .views import Image
from .views import CommentList
from .views import SpecificComment
from .views import UserList
from .views import SpecificUser
from .views import Login


urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'), # Creating a post and viewing all posts
    path('posts/<str:pk>/', SpecificPost.as_view(), name='post'), # Viewing, editing and deleting a post
    path('posts/<str:fk>/comments/', CommentList.as_view(), name='comment-list'), # Creating a comment
    path('posts/<str:fk>/comments/<str:pk>/', SpecificComment.as_view(), name='comment'), # Viewing, editing and deleting a comment
    path('posts/<str:pk>/image/', Image.as_view(), name='image'), # Viewing an image
    path('users/', UserList.as_view(), name='user-list'), # Creating a user account
    path('users/<str:pk>/', SpecificUser.as_view(), name='user'), # Viewing a specific user account
    path('login/', Login.as_view(), name='login'), # Logging and out of a user account
]