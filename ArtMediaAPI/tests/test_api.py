import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from api.models import CustomUser, Post, Comment

@pytest.mark.django_db
def test_create_user_and_login():
    client = APIClient()
    user_data = {
        "username": "artuser",
        "password": "test1234",
        "email": "artuser@test.com"
    }

    # Create user
    create_response = client.post(reverse("user-list"), user_data)
    assert create_response.status_code == 201
    assert "username" in create_response.data

    # Login user
    login_data = {
        "username": "artuser",
        "password": "test1234"
    }
    login_response = client.post(reverse("login"), login_data)
    assert login_response.status_code == 200
    assert login_response.data["username"] == "artuser"

@pytest.mark.django_db
class TestSpecificPostAPI:

    # Create post and comment
    def setup_method(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="poster", password="test1234")
        self.client.force_authenticate(user=self.user)
        self.post = Post.objects.create(title="Test Post", text="This is a test", user=self.user)
        self.comment = Comment.objects.create(post=self.post, text="This is a test", user=self.user)


    # View post details
    def test_get_post(self):
        url = reverse("post", args=[self.post.id])
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data["title"] == "Test Post"

    # Edit post
    def test_update_post(self):
        url = reverse("post", args=[self.post.id])
        data = {"title": "Updated Post", "text": "This is a new test", "user": self.user.id}
        response = self.client.put(url, data)
        assert response.status_code == 200
        assert response.data["title"] == "Updated Post"

    # Delete post
    def test_delete_post(self):
        url = reverse("post", args=[self.post.id])
        response = self.client.delete(url)
        assert response.status_code == 204
        assert not Post.objects.filter(id=self.post.id).exists()

    # Invalid id post
    def test_invalid_post_id(self):
        url = reverse("post", args=["bad-id"])
        response = self.client.get(url)
        assert response.status_code == 400


    # View comment details
    def test_get_comment(self):
        url = reverse("comment", kwargs={"fk": self.post.id, "pk": self.comment.id})
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data["text"] == "This is a test"

    # Edit comment
    def test_update_comment(self):
        url = reverse("comment", kwargs={"fk": self.post.id, "pk": self.comment.id})
        data = {"post": self.post.id, "text": "This is a new test", "user": self.user.id}
        response = self.client.put(url, data)
        assert response.status_code == 200
        assert response.data["text"] == "This is a new test"

    # Delete comment
    def test_delete_comment(self):
        url = reverse("comment", kwargs={"fk": self.post.id, "pk": self.comment.id})
        response = self.client.delete(url)
        assert response.status_code == 204
        assert not Comment.objects.filter(id=self.comment.id).exists()

    # Invalid id comment
    def test_invalid_comment_id(self):
        url = reverse("comment", kwargs={"fk": self.post.id, "pk": "bad-id"})
        response = self.client.get(url)
        assert response.status_code == 400
