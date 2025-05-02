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
        this.authService.setUserID(response.body.id);
        this.authService.setUsername(response.body.username);
        this.authService.setToken(this.cookieService.get('csrftoken'));
        return window.location.href='http://localhost:4200/posts/';
      },
      error: (err) => console.error("Error fetching posts:", err)
    });
  }

  // Validation for the user form
  isInvalid(control: any) {
    return this.loginForm.controls[control].invalid && this.loginForm.controls[control].touched;
  }
  isUnTouched() {
    return this.loginForm.controls.username.pristine || this.loginForm.controls.password.pristine;
  }
  isIncomplete(){
    return this.isInvalid('username') || this.isInvalid('password') || this.isUnTouched();
  }
}