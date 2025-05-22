import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'editComment',
  templateUrl: './editComment.component.html',
  styleUrls: ['./editComment.component.css']
})

// Class to edit a comment to a post in the posts database
export class EditCommentComponent {
  comment: any = [];
  commentForm: any;
  user: any;
  isCorrectUser: boolean = false;

  constructor(private webService: WebService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {}

  // On startup the edit comment form is set
  ngOnInit() {
    this.user = this.authService.getUserID()
    this.commentForm = this.formBuilder.group( {
      text: ['', Validators.required],
    });
    this.webService.getComment(this.route.snapshot.params['postID'], this.route.snapshot.params['commentID']).subscribe(postData => {
      this.comment = postData;
      this.commentForm.patchValue(this.comment);
      // Check if user in comment matches user editing comment
      // If not, send them to posts page
      if (this.authService.checkUser(this.comment.user)) {
        this.isCorrectUser = true;
      }
    })
  } 

  // Edits the comment in the database
  onSubmit() {
    this.webService.editComment(this.commentForm.value, this.route.snapshot.params['postID'], this.route.snapshot.params['commentID'])
    .subscribe( (response: any) => {
      this.commentForm.reset(); 
      this.router.navigate(['/posts', this.route.snapshot.params['postID']]);
    })
  }

  // Validation for the edit comment form
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