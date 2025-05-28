import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
// Class for calling the api for the app
export class WebService {

  private postID: any;
  private commentID: any;
  private token: any
  private userID: any
  img: any;

  constructor(private authService: AuthService, 
    private http: HttpClient, 
    private route: ActivatedRoute) {
  }

  post_list: any;

  getpostID() {
    this.postID = this.route.snapshot.params['id'];
    return this.postID;
  }

  // URL requests for IDs, tokens and user details
  getUser(userID: any) {
    return this.http.get(
      'http://127.0.0.1:8000/api/users/' + userID + '/');
  }

  loginUser(user: any) {
    let postData = new FormData();
    postData.append("username", user.username);
    postData.append("password", user.password);

    return this.http.post('http://127.0.0.1:8000/api/login/', postData)
  }

  logoutUser() {
    return this.http.get('http://127.0.0.1:8000/api/login/');
  }

  registerUser(user: any) {
    let postData = new FormData();
    postData.append("username", user.username);
    postData.append("email", user.email);
    postData.append("password", user.password);

    return this.http.post('http://127.0.0.1:8000/api/users/', postData);
  }

  editUser(Image:any, User: any, userID: any) {
    // Put token in header of request
    this.token = this.authService.getToken();
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };

    let postData = new FormData();
    if (Image instanceof File) {
      this.img = Image;
    } else {
      this.img = "";
    }

    postData.append("username", User.username);
    postData.append("email", User.email);
    postData.append("profile_pic", this.img);
    postData.append("bio", User.bio);

    return this.http.put('http://127.0.0.1:8000/api/users/' + userID + '/', postData, requestOptions);
  }

  // URL requests for posts
  getPosts() {
    return this.http.get(
      'http://127.0.0.1:8000/api/posts/');
  }

  getPost(postID: any) {
    this.postID = postID;
    return this.http.get('http://127.0.0.1:8000/api/posts/' + postID + '/');
  }

  postPost(Image:any, Post: any) {
    // Put token in header of request
    this.token = this.authService.getToken();
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };

    let postData = new FormData();
    if (Image instanceof File) {
      this.img = Image;
    } else {
      this.img = "";
    }

    this.userID = this.authService.getUserID();
    postData.append("user", this.userID);
    postData.append("title", Post.title);
    postData.append("text", Post.text);
    postData.append("image", this.img);

    return this.http.post('http://127.0.0.1:8000/api/posts/', postData, requestOptions);
  }

  editPost(Image:any, Post: any, postID: any) {
    // Put token in header of request
    this.token = this.authService.getToken();
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };

    let postData = new FormData();
    if (Image instanceof File) {
      this.img = Image;
    } else {
      this.img = "";
    }

    this.userID = this.authService.getUserID();
    postData.append("user", this.userID);
    postData.append("title", Post.title);
    postData.append("text", Post.text);
    postData.append("image", this.img);

    return this.http.put('http://127.0.0.1:8000/api/posts/' + postID + '/', postData, requestOptions);
  }

  deletePost(postID: any) {
    // Put token in header of request
    this.token = this.authService.getToken();
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };

    return this.http.delete('http://127.0.0.1:8000/api/posts/' + postID + '/', requestOptions);
  }

  searchPosts(search: any) {
    return this.http.get('http://127.0.0.1:8000/api/posts/search/' + search  + '/');
  }

  getLikes(postID: any) {
    this.userID = this.authService.getUserID();
    this.postID = postID;
    return this.http.get('http://127.0.0.1:8000/api/posts/' + postID + '/likes/' + this.userID + '/');
  }

  likePost(postID: any) {
    // Put token in header of request
    this.token = this.authService.getToken();
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };

    this.userID = this.authService.getUserID();
    this.postID = postID;
    return this.http.post('http://127.0.0.1:8000/api/posts/' + postID + '/likes/' + this.userID + '/', requestOptions);
  }

  // URL requests for comments
  getComment(postID: any, commentID: any) {
    this.postID = postID;
    this.commentID = commentID;
    return this.http.get('http://127.0.0.1:8000/api/posts/' + postID + '/comments/' + commentID + '/');
  }

  postComment(Comment: any, postID: any) {
    this.token = this.authService.getToken();
    // Put token in header of request
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };

    let postData = new FormData();

    this.userID = this.authService.getUserID();
    postData.append("user", this.userID);
    postData.append("text", Comment.text);

    return this.http.post('http://127.0.0.1:8000/api/posts/' + postID + '/comments/', postData, requestOptions);
  }

  editComment(Comment: any, postID: any, commentID: any) {
    // Put token in header of request
    this.token = this.authService.getToken();
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };

    let postData = new FormData();

    this.userID = this.authService.getUserID();
    postData.append("user", this.userID);
    postData.append("post", postID);
    postData.append("text", Comment.text);

    return this.http.put('http://127.0.0.1:8000/api/posts/' + postID + '/comments/' + commentID  + '/', postData, requestOptions);
  }

  deleteComment(commentID: any) {
    this.postID = this.getpostID;

    // Put token in header of request
    this.token = this.authService.getToken();
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };

    return this.http.delete('http://127.0.0.1:8000/api/posts/' + this.postID + '/comments/' + commentID + '/', requestOptions);
  }
}