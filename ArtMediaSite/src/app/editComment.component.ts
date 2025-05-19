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

// Class to add a comment to a post in the posts database
export class EditCommentComponent {
  comment: any = [];
  commentForm: any;
  user: any;

  constructor(private webService: WebService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {}

  // On startup the add comment form is set
  ngOnInit() {
    this.user = this.authService.getUserID()
    this.commentForm = this.formBuilder.group( {
      text: ['', Validators.required],
    });
    this.webService.getComment(this.route.snapshot.params['postID'], this.route.snapshot.params['commentID']).subscribe(postData => {
      this.comment = postData;
      this.commentForm.patchValue(this.comment);
    })
  }

  // Adds the comment to the database
  onSubmit() {
    this.webService.editComment(this.commentForm.value, this.route.snapshot.params['postID'], this.route.snapshot.params['commentID'])
    .subscribe( (response: any) => {
      this.commentForm.reset(); 
      this.router.navigate(['/posts']);
    })
  }

  // Validation for the add comment form
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