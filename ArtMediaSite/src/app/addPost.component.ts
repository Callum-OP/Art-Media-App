import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'addPost',
  templateUrl: './addPost.component.html',
  styleUrls: ['./addPost.component.css']
})

// Class to add a post to the posts database
export class AddPostComponent {
  postForm: any;
  user: any;
  isLoggedIn: boolean = false;

  constructor(private webService: WebService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {}

  // On startup the add post form is set
  ngOnInit() {
    this.user = this.authService.getUserID()
    this.postForm = this.formBuilder.group( {
      title: [''],
      text: [''],
    });
    // Check if user is logged in, if not send them to posts page
    if (this.authService.loggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.router.navigate(['/posts']);
    }
  }

  // Grabs file inputted by user and stores it in imagefile
  // Also stores url so that the file can be previewed
  imageFile: File | null = null;
  imagePreview: string | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Adds the post to the database
  onSubmit() {
    this.webService.postPost(this.imageFile, this.postForm.value)
    .subscribe( (response: any) => {
      this.postForm.reset(); 
      this.imageFile = null;
      this.router.navigate(['/posts']);
    })
  }

  // Validation for the add post form
  validateForm() {
    let title = this.postForm.value.title;
    let text = this.postForm.value.text;
    if (title == "" || text == "" || this.imageFile == null) {
      alert("All fields must be filled out");
      return false;
    } else {
      return this.onSubmit();
    }
  }
}