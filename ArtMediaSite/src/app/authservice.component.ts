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

  public setToken(token: string): void {
    this.token = token
    localStorage.setItem("token", token);
  }

  public setUserID(user: string): void {
    this.user = user
    localStorage.setItem("user", user);
  }

  public setUsername(username: string): void {
    this.username = username
    localStorage.setItem("username", username);
  }

  public getToken(): string {
    this.token = localStorage.getItem('token') || this.token;
    return this.token
  }

  public getUserID(): string {
    this.user = localStorage.getItem('user') || this.user;
    return this.user
  }

  public getUsername(): string {
    this.username = localStorage.getItem('username') || this.username;
    return this.username
  }

  public isAuthenticated(): Observable<boolean> {
    if (localStorage.getItem('user') != null && localStorage.getItem('token ') != null) {
      return of(true)
    }
    else {
      return of(false)
    }
  }

  public logout(): string {
    this.token = 'null'
    this.user = 'null'
    localStorage.setItem("token", 'null');
    localStorage.setItem("user", 'null');
    return window.location.href='http://localhost:4200';
  }
}