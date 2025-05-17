import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
// Class for calling the api for the app
export class WebService {

  private postid: any;
  private token: any
  private userid: any
  img: any;

  constructor(private authService: AuthService, 
    private http: HttpClient, 
    private route: ActivatedRoute) {
  }

  post_list: any;

  getPostID() {
    this.postid = this.route.snapshot.params['id'];
    return this.postid;
  }

  getUser(userid: any) {
    return this.http.get(
      'http://127.0.0.1:8000/api/users/' + userid + '/');
  }

  loginUser(user: any) {
    let postData = new FormData();
    postData.append("username", user.username);
    postData.append("password", user.password);

    return this.http.post('http://127.0.0.1:8000/api/login/', postData, { withCredentials: true, observe: 'response' as 'response' })
  }

  logoutUser(user: any) {
    return this.http.get('http://127.0.0.1:8000/api/login/');
  }

  registerUser(user: any) {
    let postData = new FormData();
    postData.append("username", user.username);
    postData.append("email", user.email);
    postData.append("password", user.password);

    return this.http.post('http://127.0.0.1:8000/api/users/', postData);
  }

  getPosts() {
    return this.http.get(
      'http://127.0.0.1:8000/api/posts/');
  }

  getPost(id: any) {
    this.postid = id;
    return this.http.get('http://127.0.0.1:8000/api/posts/' + id + '/');
  }

  postPost(Image:any, Post: any) {
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

    this.userid = this.authService.getUserID();
    postData.append("user", this.userid);
    postData.append("text", Post.text);
    postData.append("image", this.img);

    return this.http.post('http://127.0.0.1:8000/api/posts/', postData, requestOptions);
  }

  editPost(Post: any, id: any) {
    let postData = new FormData();
    postData.append("user", Post.user_id);
    postData.append("text", Post.text);
    postData.append("image", Post.image);

    return this.http.put('http://127.0.0.1:8000/api/posts/' + id + '/', postData);
  }

  deletePost(id: any) {
    this.token = this.authService.getToken();
    if (!this.token) {
      throw new Error('Unauthenticated, CSRF token missing');
    }
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'X-CSRFToken': this.token,
      }), 
    };
    
    return this.http.delete('http://127.0.0.1:8000/api/posts/' + id + '/', {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }
}