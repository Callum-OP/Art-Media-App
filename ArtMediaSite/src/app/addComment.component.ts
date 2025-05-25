import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'addComment',
  templateUrl: './addComment.component.html',
  styleUrls: ['./addComment.component.css']
})

// Class to add a comment to a post in the posts database
export class AddCommentComponent {
  commentForm: any;
  user: any;
  isLoggedIn: boolean = false;

  constructor(private webService: WebService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {}

  // On startup the add comment form is set
  ngOnInit() {
    this.user = this.authService.getUserID()
    this.commentForm = this.formBuilder.group( {
      text: [''],
    });
    // Check if user is logged in, if not send them to posts page
    if (this.authService.loggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.router.navigate(['/posts']);
    }
  }

  // Adds the comment to the database
  onSubmit() {
    this.webService.postComment(this.commentForm.value, this.route.snapshot.params['postID'])
    .subscribe( (response: any) => {
      this.commentForm.reset(); 
      this.router.navigate(['/posts']);
    })
  }

  // Validation for the add comment form
  validateForm() {
    let text = this.commentForm.value.text;
    if (text == "") {
      alert("All fields must be filled out");
      return false;
    } else {
      return this.onSubmit();
    }
  }
}