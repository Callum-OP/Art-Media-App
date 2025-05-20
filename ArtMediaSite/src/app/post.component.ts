import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
  
// Class for showing a specific post
export class PostComponent {

  post: any = [];
  comments: any = [];
  user: any = "";
  username: any = "";
  token: any = "";
  postID: any = "";

  constructor(public webService: WebService,  
    public authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router) {}

  // When the app starts user details, tokens and the post is found
  ngOnInit() {
    this.user = this.authService.getUserID();
    this.username = this.authService.getUsername();
    this.token = this.authService.getToken();
    this.postID = this.route.snapshot.params['postID'];
   
    // Get post
    this.webService.getPost(this.postID).subscribe({
        next: (response: any) => {
          this.post = response || {};
        },
        error: (err) => console.error("Error fetching posts:", err)
      });
  }

    // Check if user is logged in
    loggedIn() {
      let result = "";
      this.authService.isAuthenticated().subscribe({next: (response: any) => {result = response;}});
      if (result) {
        return true;
      } else {
        return false;
      }
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