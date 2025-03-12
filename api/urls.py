from django.urls import path
from .views import PostList
from .views import CommentList

urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'),
    path('comments/', CommentList.as_view(), name='comment-list'),
    #path('upload/', PictureUpload.as_view(), name='picture-upload'),
]