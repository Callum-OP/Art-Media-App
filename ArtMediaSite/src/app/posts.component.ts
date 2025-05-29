import { Component, NgModule } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from './utilityService.service';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
  
// Class for showing all posts
export class PostsComponent {

  posts: any = [];
  newestPosts: any = [];
  popularPosts: any = [];
  sortOption: string = 'Newest';
  comments: any = [];
  user: any = "";
  username: any = "";
  token: any = "";
  postUsernames: { [key: string]: string } = {};
  postProfilePics: { [key: string]: string } = {};

  constructor(public webService: WebService,  
    public authService: AuthService, 
    private utilityService: UtilityService,
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
          // Sort posts by either newest or most popular
          if (localStorage.getItem("sort") === 'Popular') {
            this.posts = response.reverse().sort((a: any, b: any) => b.likes.length-a.likes.length) || [];
            this.sortOption = 'Popular';
          } else {
            this.posts = response.reverse() || [];
            this.sortOption = 'Newest';
          }
          // Retrieve usernames and profile pictures of each post
          for (let post of this.posts) {
            this.fetchUserDetails(post.user);
          }
        },
        error: (err) => console.error("Error fetching posts:", err)
      });
  }

  // Retrieve and store username and profile picture using user id
  fetchUserDetails(userID: any): void {
    this.utilityService.getUserDetails(userID).subscribe(response => {
      this.postUsernames[userID] = response.username;
      this.postProfilePics[userID] = response.profile_pic;
    });
  }

  // Set if posts should be sorted by newest or most popular
  onSortChange() {
    if (this.sortOption === 'Newest') {
      localStorage.setItem("sort", 'Newest');
      window.location.reload();
    } else if (this.sortOption === 'Popular') {
      localStorage.setItem("sort", 'Popular');
      window.location.reload();
    }
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