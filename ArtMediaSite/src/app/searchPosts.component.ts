import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { UtilityService } from './utilityService.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'searchPosts',
  templateUrl: './searchPosts.component.html',
  styleUrls: ['./searchPosts.component.css']
})
  
// Class for showing posts matching search results
export class SearchPostsComponent {

  posts: any = [];
  comments: any = [];
  search: any = "";
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

  // When the app starts user details, tokens and posts matching search results are gathered
  ngOnInit() {
    this.user = this.authService.getUserID();
    this.username = this.authService.getUsername();
    this.token = this.authService.getToken();
    // Get all posts
    this.search = this.route.snapshot.params['search'];
    this.webService.searchPosts(this.search).subscribe({
        next: (response: any) => {
          // Get posts in order of newest
          this.posts = response.reverse() || [];
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