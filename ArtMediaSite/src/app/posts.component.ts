import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
  })
  
  // Class for showing all posts
  export class PostsComponent {
  
    posts: any = [];
    user: any = "";
    username: any = "";
    token: any = "";
  
    constructor(public webService: WebService,  
      public authService: AuthService, 
      private route: ActivatedRoute) {}
  
    // When the app starts the page number is set and all properties are gathered
    ngOnInit() {
      this.user = this.authService.getUserID();
      this.username = this.authService.getUsername();
      this.token = this.authService.getToken();
      this.webService.getPosts().subscribe({
          next: (response: any) => {
            this.posts = response || [];
          },
          error: (err) => console.error("Error fetching posts:", err)
        });
    }
  }