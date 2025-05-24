import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
  
// Class for showing all posts
export class PostsComponent {

  posts: any = [];
  comments: any = [];
  user: any = "";
  username: any = "";
  token: any = "";
  postUsernames: { [key: string]: string } = {};

  constructor(public webService: WebService,  
    public authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router) {}

  // When the app starts user details, tokens and all posts are gathered
  ngOnInit() {
    this.user = this.authService.getUserID();
    this.username = this.authService.getUsername();
    this.token = this.authService.getToken();
    // Get all posts
    this.webService.getPosts().subscribe({
        next: (response: any) => {
          this.posts = response || [];
          // Retrieve usernames of each post
          for (let post of this.posts) {
            this.getUsername(post.user);
          }
        },
        error: (err) => console.error("Error fetching posts:", err)
      });
  }

  // Retrieve username using user id
  getUsername(userID: any) {
    this.webService.getUser(userID).subscribe({
      next: (response: any) => {
        this.postUsernames[userID] = response.username;
        return this.postUsernames[userID];
      },
      error: () => {
        this.postUsernames[userID] = "Unknown User";
        return this.postUsernames[userID];
      }
    });
  }
  

  // Check if user is logged in
  isloggedIn() {
    return this.authService.loggedIn();
  }  

  // Take user to add post page
  onAddPost() {
    this.router.navigate(['/addPost']);
  }

  // Take user to edit post page
  onEditPost(postID: any) {
    this.router.navigate(['/posts/' + postID + '/edit']);
  }
  
  // Deletes the selected post
  onDeletePost(postID: any) {
    this.webService.deletePost(postID)
    .subscribe( (response: any) => {
      this.router.navigate(['/posts']);
      window.location.reload();
    })
  }

  // Take user to add comment page
  onAddComment(postID: any) {
    this.router.navigate(['/posts/' + postID + '/addComment']);
  }

  // Take user to edit comment page
  onEditComment(postID: any, commentID: any) {
    this.router.navigate(['/posts/' + postID + '/comments/' + commentID + '/editComment']);
  }

  // Deletes the selected comment
  onDeleteComment(commentID: any) {
    this.webService.deleteComment(commentID)
    .subscribe( (response: any) => {
      this.router.navigate(['/posts']);
      window.location.reload();
    })
  }
}