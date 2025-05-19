import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private webService: WebService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {}

  // On startup the add comment form is set
  ngOnInit() {
    this.user = this.authService.getUserID()
    this.commentForm = this.formBuilder.group( {
      text: ['', Validators.required],
    });
  }

  // Adds the comment to the database
  onSubmit() {
    this.webService.postComment(this.commentForm.value, this.route.snapshot.params['id'])
    .subscribe( (response: any) => {
      this.commentForm.reset(); 
    })
  }

  // Validation for the add post form
  isInvalid(control: any) {
    return this.commentForm.controls[control].invalid && this.commentForm.controls[control].touched;
  }
  isUnTouched() {
    return this.commentForm.controls.text.pristine;
  }
  isIncomplete(){
    return this.isInvalid('text') || this.isUnTouched();
  }
}