import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'editPost',
  templateUrl: './editPost.component.html',
  styleUrls: ['./editPost.component.css']
})

// Class to edit a post in the posts database
export class EditPostComponent {
  post: any = [];
  postForm: any;
  user: any;
  isCorrectUser: boolean = false;

  constructor(private webService: WebService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {}

  // On startup the edit post form is set
  ngOnInit() {
    this.user = this.authService.getUserID()
    this.postForm = this.formBuilder.group( {
      title: [''],
      text: ['', Validators.required],
    });
    this.webService.getPost(this.route.snapshot.params['postID']).subscribe(response => {
      this.post = response;
      this.postForm.patchValue(this.post);
      this.imageFile = this.post.image;
      this.imagePreview = 'http://127.0.0.1:8000/' + this.post.image;
      // Check if user in post matches user editing post
      // If not, send them to posts page
      if (this.authService.checkUser(this.post.user)) {
        this.isCorrectUser = true;
      }
    });
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

  // Edit the post in the database
  onSubmit() {
    this.webService.editPost(this.imageFile, this.postForm.value, this.route.snapshot.params['postID'])
    .subscribe( (response: any) => {
      this.postForm.reset(); 
      this.imageFile = null;
      this.router.navigate(['/posts', this.route.snapshot.params['postID']]);
    })
  }

  // Validation for the edit post form
  validateForm() {
    let title = this.postForm.value.title;
    let text = this.postForm.value.text;
    if (title == "" || text == "") {
      alert("All fields must be filled out");
      return false;
    } else {
      return this.onSubmit();
    }
  }
}