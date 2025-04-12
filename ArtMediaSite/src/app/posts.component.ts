import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
  })
  
  // Class for showing all posts
  export class PostsComponent {
  
    posts: any = [];
    username: any = "";
  
    constructor(public webService: WebService, private route: ActivatedRoute) {}
  
    // When the app starts the page number is set and all properties are gathered
    ngOnInit() {
      this.webService.getPosts().subscribe({
          next: (response: any) => {
            this.posts = response || [];
          },
          error: (err) => console.error("Error fetching posts:", err)
        });
    }

    findUsername(userid: any) {
      this.webService.getUser(userid).subscribe({
        next: (response: any) => {
          this.username = response.username || [];
        },
        error: (err) => console.error("Error getting username", err)
      });
    }
  }