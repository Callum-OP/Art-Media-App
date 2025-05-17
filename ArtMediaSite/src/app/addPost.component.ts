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
      text: ['', Validators.required],
    });
  }

  // Grabs file inputted by user and stores it in imagefile
  imageFile: File | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  // Adds the post to the database
  onSubmit() {
    this.webService.postPost(this.imageFile, this.postForm.value)
    .subscribe( (response: any) => {
      this.postForm.reset(); 
      this.imageFile = null;
    })
  }

  // Validation for the add post form
  isInvalid(control: any) {
    return this.postForm.controls[control].invalid && this.postForm.controls[control].touched;
  }
  isUnTouched() {
    return this.postForm.controls.text.pristine;
  }
  isIncomplete(){
    return this.isInvalid('text') || this.isUnTouched();
  }
}