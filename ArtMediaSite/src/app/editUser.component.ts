import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'editUser',
  templateUrl: './editUser.component.html',
  styleUrls: ['./editUser.component.css']
})

// Class to edit a user in the users database
export class EditUserComponent {
  editUser: any = [];
  userForm: any;
  user: any;
  isCorrectUser: boolean = false;

  constructor(private webService: WebService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {}

  // On startup the edit user form is set
  ngOnInit() {
    this.user = this.authService.getUserID()
    this.userForm = this.formBuilder.group( {
      username: [''],
      email: [''],
    });
    this.webService.getUser(this.route.snapshot.params['userID']).subscribe(response => {
      this.editUser = response;
      this.userForm.patchValue(this.editUser);
      this.imageFile = this.editUser.profile_pic;
      this.imagePreview = 'http://127.0.0.1:8000/' + this.editUser.profile_pic;
      // Check if user being edited matches current user
      // If not, send them to users page
      if (this.authService.checkUser(this.editUser.id)) {
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

  // Edit the user in the database
  onSubmit() {
    this.webService.editUser(this.imageFile, this.userForm.value, this.route.snapshot.params['userID'])
    .subscribe( (response: any) => {
      this.userForm.reset(); 
      this.imageFile = null;
      this.router.navigate(['/user/', this.route.snapshot.params['userID']]);
    })
  }

  // Validation for the edit user form
  validateForm() {
    let username = this.userForm.value.username;
    let email = this.userForm.value.email;
    if (username == "" || email == "") {
      alert("All fields must be filled out");
      return false;
    } else {
      return this.onSubmit();
    }
  }
}