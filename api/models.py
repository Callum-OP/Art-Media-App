from django.db import models

class Post(models.Model):
    username = models.CharField(max_length=255)
    image = models.ImageField(upload_to='uploads/')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name