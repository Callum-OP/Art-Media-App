import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'addPost',
  templateUrl: './addPost.component.html',
  styleUrls: ['./addPost.component.css']
})

// Class to add a post to the posts collection
export class AddPostComponent {
  posts: any = [];
  postForm: any;
  user: any;

  constructor(private webService: WebService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {}

  // On startup the add post form is set
  ngOnInit() {
    this.user = this.authService.getUserID()
    this.postForm = this.formBuilder.group( {
      image: ['', Validators.required],
      text: ['', Validators.required],
      user: ['', Validators.required],
    });
    this.posts = this.webService.getPost(
    this.route.snapshot.params['id']);
  }

  // Adds the post to the database
  onSubmit() {
    this.webService.postPost(this.postForm.value)
    .subscribe( (response: any) => {
      this.postForm.reset();
    })
  }

  // Validation for the add post form
  isInvalid(control: any) {
    return this.postForm.controls[control].invalid && this.postForm.controls[control].touched;
  }
  isUnTouched() {
    return this.postForm.controls.user.pristine || this.postForm.controls.text.pristine;
  }
  isIncomplete(){
    return this.isInvalid('user') || this.isInvalid('text') || this.isUnTouched();
  }
}