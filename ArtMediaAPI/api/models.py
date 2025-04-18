from django.db import models
from django.conf import settings
import django.utils.timezone
import uuid
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField()
    created_at = models.DateTimeField(default=django.utils.timezone.now)

    def __str__(self):
        return self.username


def validate_file(value):
    # Check if a file matches the extensions allowed
    valid_extensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi', '.mkv', '.gif']
    import os
    ext = os.path.splitext(value.name)[1]
    if ext.lower() not in valid_extensions:
        raise ValidationError(f'{ext} file type is unsupported: {ext}. Only image and video files are allowed here.')


class Post(models.Model):
    # Stores unique id, username, image, body of text and time created
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='post_user', on_delete=models.CASCADE) # Ensure when user is deleted, their posts are also deleted
    image = models.FileField(upload_to='uploads/', blank=True, validators=[validate_file]) # Image/video is optional
    text = models.TextField()
    created_at = models.DateTimeField(default=django.utils.timezone.now)

    def __str__(self):
        return self.name


class Comment(models.Model):
    # Stores unique id, post ID, username, body of text and time created
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comment_user', on_delete=models.CASCADE) # Ensure when user is deleted, their comments are also deleted
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE) # Ensure when post is deleted, comments are also deleted
    text = models.TextField()
    created_at = models.DateTimeField(default=django.utils.timezone.now)

    def __str__(self):
        return f"{self.name} (Sub-item of {self.post.name})"