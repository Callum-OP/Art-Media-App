# Generated by Django 5.0.1 on 2025-05-19 01:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_comment_username_remove_post_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='title',
            field=models.TextField(default='My art'),
        ),
    ]
