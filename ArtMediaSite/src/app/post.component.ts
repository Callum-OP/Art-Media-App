import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { UtilityService } from './utilityService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';

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
  postID: any = "";
  postUsername: any = "";
  postProfilePic: any = "";
  postDate: any = "";
  postLikes: any = "";
  liked: any = "";
  commentUsernames: { [key: string]: string } = {};
  commentProfilePics: { [key: string]: string } = {};
  commentDates: { [key: string]: string } = {};


  constructor(public webService: WebService,  
    public authService: AuthService, 
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private router: Router) {}

  // When the app starts user details, tokens and the post is found
  ngOnInit() {
    this.user = this.authService.getUserID();
    this.username = this.authService.getUsername();
    this.postID = this.route.snapshot.params['postID'];

    // Get likes of post
    this.fetchLikes(this.postID);
   
    // Get post
    this.webService.getPost(this.postID).subscribe({
      next: (response: any) => {
        this.post = response || {};
        // Retrieve username and date of post
        this.fetchUserDetails("post", this.post.user);
        this.postDate = formatDate(this.post.created_at,'dd-MM-yyyy','en-GB');
        // Retrieve usernames and date of each comment
        for (let comment of this.post.comments) {
          this.fetchUserDetails("comments", comment.user);
          this.commentDates[comment.id] = formatDate(comment.created_at,'dd-MM-yyyy','en-GB');
        }
        //Check if post has been like
        this.isLiked(this.user, this.post.likes);
      },
      error: (err) => {
        this.router.navigate(['/posts']);
        // If post is empty then send user to posts page
        console.error("Error fetching posts:", err);
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

  // Retrieve and store username and profile picture using user id
  fetchUserDetails(type: any, userID: any): void {
    this.utilityService.getUserDetails(userID).subscribe(response => {
      if (type == "post") {
        this.postUsername = response.username
        this.postProfilePic = response.profile_pic;
      } else {
        this.commentUsernames[userID] = response.username;
        this.commentProfilePics[userID] = response.profile_pic;
      }
    });
  }

  // Get number of likes of post
  fetchLikes(postID: any) {
    this.webService.getLikes(postID).subscribe({
      next: (response: any) => {
        this.postLikes = response.likes;
      }
    });
  }

  // Check if post has been liked by user or not
  isLiked(userID: any, likes: any) {
    if (likes.includes(userID)) {
      this.liked = true;
      return true;
    } else {
      this.liked = false;
      return false;
    }
  }

  // Add like to post or remove if already there
  onLike() {
    this.webService.likePost(this.postID)
    .subscribe( (response: any) => {
      window.location.reload();
    })
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
      window.location.reload();
    })
  }
}