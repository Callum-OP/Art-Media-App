import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
          },
          error: (err) => console.error("Error fetching posts:", err)
        });
    }

    // Take user to add post page
    onAddPost() {
      this.router.navigate(['/addPost']);
    }

    // Take user to edit post page
    onEditPost(postID: any) {
      this.router.navigate(['/posts/' + postID + '/edit']);
    }
    
    // Deletes the post currently being shown
    onDeletePost(postID: any) {
      this.webService.deletePost(postID)
      .subscribe( (response: any) => {
        this.router.navigate(['/posts']);
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
  }