from django.contrib.auth import views as auth_views
from django.urls import path
from .views import PostList
from .views import SpecificPost
from .views import CommentList
from .views import SpecificComment
from .views import UserList
from .views import SpecificUser
from .views import Login
from .views import SearchPosts
from .views import LikePost
from .views import FollowUserList


urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'), # Creating a post and viewing all posts
    path('posts/<str:pk>/', SpecificPost.as_view(), name='post'), # Viewing, editing and deleting a post
    path('posts/<str:fk>/comments/', CommentList.as_view(), name='comment-list'), # Creating a comment
    path('posts/<str:fk>/comments/<str:pk>/', SpecificComment.as_view(), name='comment'), # Viewing, editing and deleting a comment
    path('posts/search/<str:search>/', SearchPosts.as_view(), name='search'), # Search posts and filter results
    path('posts/<str:fk1>/likes/<str:fk2>/', LikePost.as_view(), name='post-like'), # Liking a post
    path('users/', UserList.as_view(), name='user-list'), # Creating a user account
    path('users/<str:pk>/', SpecificUser.as_view(), name='user'), # Viewing a specific user account
    path('users/<str:fk1>/following/<str:fk2>/', FollowUserList.as_view(), name='follow-user'), # Following, unfollowing and viewing follwed users
    path('login/', Login.as_view(), name='login'), # Logging and out of a user account
]