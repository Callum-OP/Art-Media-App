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
    
    // Deletes the post currently being shown
    onDelete(id: any) {
      this.webService.deletePost(id)
      .subscribe( (response: any) => {
        this.router.navigate(['/posts']);
      } )
    }
  }