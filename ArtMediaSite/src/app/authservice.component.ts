import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    token: string = 'null';
    user: any = 'null';
    username: any = 'null';

  constructor(private router: Router) { }

  // Store token in local storage
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
  }

  // Store user id in local storage
  public setUserID(user: string): void {
    this.user = user;
    localStorage.setItem("user", user);
  }

  // Store username in local storage
  public setUsername(username: string): void {
    this.username = username;
    localStorage.setItem("username", username);
  }

  // Get token from local storage
  public getToken(): string {
    this.token = localStorage.getItem('token') || this.token;
    return this.token;
  }

  // Get user id from local storage
  public getUserID(): string {
    this.user = localStorage.getItem('user') || this.user;
    return this.user;
  }

  // Get username from local storage
  public getUsername(): string {
    this.username = localStorage.getItem('username') || this.username;
    return this.username;
  }

  // Check if user has user id and token stored in local storage
  public isAuthenticated(): Observable<boolean> {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      return of(true);
    }
    else {
      return of(false);
    }
  }

  // Check if user is logged in
  loggedIn() {
    let result = "";
    this.isAuthenticated().subscribe({next: (response: any) => {result = response;}});
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  // Check if user matches expected user, if not send them to posts page
  checkUser(userID: any) {
    if (localStorage.getItem('user') == userID) {
      return true;
    } else {
      return this.router.navigate(['/posts']);
    }
  }

  // Clear all user details from local storage
  public logout(): string {
    this.token = '';
    this.user = '';
    this.username = '';
    localStorage.setItem("token", '');
    localStorage.setItem("user", '');
    localStorage.setItem("username", '');
    localStorage.setItem("sort", 'Newest');
    return "Logged out";
  }
}