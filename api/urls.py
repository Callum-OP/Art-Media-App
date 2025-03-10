from django.urls import path
from .views import PostList

urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'),
    #path('upload/', PictureUpload.as_view(), name='picture-upload'),
]