import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './authservice.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// Class to login a user
export class LoginComponent {
  loginForm: any;
  user: any;

  constructor(private authService: AuthService, 
  private webService: WebService,
  private cookieService: CookieService,
  private route: ActivatedRoute,
  private formBuilder: FormBuilder,) {}

  // On startup the add user form is set
  ngOnInit() {
  this.loginForm = this.formBuilder.group( {
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  }

  // Checks if the user exists and then logs them in if they do
  onSubmit() {
    this.webService.loginUser(this.loginForm.value)
    .subscribe({
      next: (response: any) => {
        this.authService.setUserID(response.id);
        this.authService.setUsername(response.username);
        return window.location.href='http://localhost:4200/posts/';
      },
      error: (err) => console.error("Error logging in user:", err)
    });
  }

  // Validation for the login form
  validateForm() {
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;
    if (username == "" || password == "") {
      alert("All fields must be filled out");
      return false;
    } else {
      return this.onSubmit();
    }
  }
}