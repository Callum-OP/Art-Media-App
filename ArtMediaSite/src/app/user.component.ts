import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
  
// Class for showing a specific user
export class UserComponent {

  user: any = "";
  username: any = "";
  token: any = "";
  userProfile: any = "";
  userProfileUsername: any = "";
  userProfileDate: any = "";
  posts: any = [];
  postUsernames: { [key: string]: string } = {};
  postProfilePics: { [key: string]: string } = {};


  constructor(public webService: WebService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {}

  // When the app starts user details, tokens and the userProfile is found
  ngOnInit() {
    // Current logged in user
    this.user = this.authService.getUserID();
    this.username = this.authService.getUsername();
    this.token = this.authService.getToken();
    // User profile being viewed
    this.userProfile = this.route.snapshot.params['userID'];
   
    // Get user profile ID
    this.webService.getUser(this.userProfile).subscribe({
      next: (response: any) => {
        this.userProfile = response || {};
        // Retrieve username and the date that user account was created
        this.userProfileDate = formatDate(this.userProfile.created_at,'dd-MM-yyyy','en-GB');
        // Get all posts by user
        this.webService.searchPosts(this.userProfile.id).subscribe({
          next: (response: any) => {
            // Get posts in order of newest
            this.posts = response.reverse() || [];
          },
          error: (err) => console.error("Error fetching posts:", err)
        });
      },
      error: (err) => {
        console.error("Error fetching user profile:", err);
      }
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

  // Take user to edit user page
  onEditUser(userID: any) {
    this.router.navigate(['/user/' + userID + '/edit']);
  }

  // Add user to following
  onFollowUser(userID: any) {
    return userID;
  }
}