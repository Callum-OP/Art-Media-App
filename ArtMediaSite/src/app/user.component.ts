import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { UtilityService } from './utilityService.service';
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
  following: any = [];
  followingUsernames: { [key: string]: string } = {};
  followingProfilePics: { [key: string]: string } = {};
  followed: any;
  buttonName: any;


  constructor(public webService: WebService,
    public authService: AuthService,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private router: Router) {}

  // When the app starts user details, tokens and the userProfile is found
  ngOnInit() {
    // Current logged in user
    this.user = this.authService.getUserID();
    this.username = this.authService.getUsername();
    this.token = this.authService.getToken();
    // ID of user profile being viewed
    this.userProfile = this.route.snapshot.params['userID'];

    // Check if user is following user profile being viewed
    if (this.user != this.userProfile) {
      this.isFollowing(this.user, this.userProfile);
    }
   
    // Get user profile ID
    this.webService.getUser(this.userProfile).subscribe({
      next: (response: any) => {
        // User profile being viewed
        this.userProfile = response || {};
        // Retrieve username and the date that user account was created
        this.userProfileDate = formatDate(this.userProfile.created_at,'dd-MM-yyyy','en-GB');
        // Get all users that this user profile is following
        this.webService.getFollowedUsers(this.userProfile.id).subscribe({
          next: (response: any) => {
            // Get followed data in order of newest
            this.following = response.reverse() || [];
            // Retrieve usernames and profile pictures of each followed user
            for (let followedUser of this.following) {
              this.fetchUserDetails(followedUser.following);
            }
          },
          error: (err) => console.error("Error fetching followed users:", err)
        });
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

  // Retrieve and store username and profile picture using user id
  fetchUserDetails(userID: any): void {
    this.utilityService.getUserDetails(userID).subscribe(response => {
      this.followingUsernames[userID] = response.username;
      this.followingProfilePics[userID] = response.profile_pic;
    });
  }

  isFollowing(currentUser: any, viewedUser: any) {
    // Check if current user is following user profile being viewed
    this.webService.getFollowedUsers(currentUser).subscribe({
      next: (response: any) => {
        this.followed = false;
        this.buttonName = "Follow"
        for (let followedUser of response) {
          if (followedUser.following == viewedUser) {
            this.followed = true;
            this.buttonName = "Unfollow"
          }
        }
      },
      error: (err) => console.error("Error fetching followed users:", err)
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
    console.log(userID);
    this.webService.followUser(userID).subscribe({next: () => {}});;
    return window.location.reload();
  }
}

function includes(user: any) {
  throw new Error('Function not implemented.');
}
