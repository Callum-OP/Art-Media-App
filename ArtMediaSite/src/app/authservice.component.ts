import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    token: string = 'null';

    userID: any = 'null';

  constructor(private router: Router) { }

  public setToken(token: string): void {
    this.token = token
    localStorage.setItem("token", token);
  }

  public setUser(userID: any): void {
    this.userID = userID
    localStorage.setItem("user", userID);
  }

  public getToken(): string {
    this.token = localStorage.getItem('token') || this.token;
    return this.token
  }

  public getUser(): string {
    this.userID = localStorage.getItem('user') || this.userID;
    return this.userID
  }

  public logout(): string {
    this.token = 'null'
    this.userID = 'null'
    localStorage.setItem("token", 'null');
    localStorage.setItem("userID", 'null');
    return window.location.href='http://localhost:4200';
  }
}