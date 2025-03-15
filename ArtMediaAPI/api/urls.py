from django.urls import path
from .views import PostList
from .views import CommentList
from .views import SpecificPost
from .views import SpecificComment
from .views import Image

urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'),
    path('posts/<int:pk>/', SpecificPost.as_view(), name='post'),
    path('posts/<int:fk>/comments/<int:pk>/', SpecificComment.as_view(), name='comment'),
    path('comments/', CommentList.as_view(), name='comment-list'),
    path('posts/<int:pk>/image/', Image.as_view(), name='image'),
]