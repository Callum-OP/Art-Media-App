from django.db import models
import django.utils.timezone
import uuid

class Post(models.Model):
    # Stores unique id, username, image, body of text and time created
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255)
    image = models.ImageField(upload_to='uploads/', blank=True) # Image is optional
    text = models.TextField()
    created_at = models.DateTimeField(default=django.utils.timezone.now)

    def __str__(self):
        return self.name

class Comment(models.Model):
    # Stores unique id, post ID, username, body of text and time created
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE) # Ensure when post is deleted, comments are also deleted
    username = models.CharField(max_length=255)
    text = models.TextField()
    created_at = models.DateTimeField(default=django.utils.timezone.now)

    def __str__(self):
        return f"{self.name} (Sub-item of {self.post.name})"