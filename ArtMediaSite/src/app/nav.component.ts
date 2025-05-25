import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './authservice.component';

@Component({
  selector: 'navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

// Class that controls the navbar for the site
export class NavComponent {
  id: any = '';
  isLoggedIn: any;
  buttonName: any;
  user: any = "";
  token: any = 'null';

  logoImagePath: String;
  profileImagePath: String;
  loggedIn: any;

  constructor(private authService: AuthService, 
    private route: ActivatedRoute, 
    public router: Router, 
    private webService: WebService) {

    this.logoImagePath = "/assets/Logo.png";
    this.profileImagePath = "media/default/DefaultProfilePicAlt.jpg";
    // Check if user is authenticated/logged in
    this.authService.isAuthenticated().subscribe( (response: any) => {this.loggedIn = response})
    this.user = this.authService.getUserID();
    this.webService.getUser(this.user).subscribe({
      next: (response: any) => {
        this.profileImagePath = response.profile_pic;
      }});

    if (this.loggedIn) {
      // Logged in
      this.buttonName = "Logout";
      this.isLoggedIn = true;
    } else {
      // Logged out
      this.buttonName = "Login";
      this.isLoggedIn = false;
    }
  }

  loginLogoutButton() {
    if (this.isLoggedIn == false) {
      this.login();
    } else {
      this.logout();
    }
  }

  account() {
    return this.router.navigate(['/user/', this.user]);
  }

  register() {
    return this.router.navigate(['/register']);
  }

  login() {
    return this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.webService.logoutUser();
    return window.location.reload();
  }

    // Search bar that goes to page with all posts relating to what user searched for
    searchBar(search: any) {
      if (search != '') {
        return window.location.href='http://localhost:4200/posts/search/' + search;
      } else {
        return this.router.navigate(['/posts']);
      }
    }
}