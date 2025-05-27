import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'signUp',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.css']
})

// Class to create a new user
export class SignUpComponent {
  signUpForm: any;
  user: any;

  constructor(private authService: AuthService, 
  private webService: WebService,
  private cookieService: CookieService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder,) {}

  // On startup the add user form is set
  ngOnInit() {
  this.signUpForm = this.formBuilder.group( {
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  }

  // Creates new user and logs them in
  onSubmit() {
    this.webService.registerUser(this.signUpForm.value)
    .subscribe({
      next: (response: any) => {
        this.authService.setUserID(response.id);
        this.authService.setUsername(response.username);
        this.authService.setToken(this.cookieService.get('csrftoken'));
        return window.location.href='http://localhost:4200/posts/';
      },
      error: (err) => console.error("Error creating user:", err)
    });
  }

  // Validation for the sign up form
  validateForm() {
    let username = this.signUpForm.value.username;
    let email = this.signUpForm.value.email;
    let password = this.signUpForm.value.password;
    if (username == "" || email == "" || password == "") {
      alert("All fields must be filled out");
      return false;
    } else {
      return this.onSubmit();
    }
  }
}