import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './authservice.component';

@Component({
  selector: 'navigation',
  templateUrl: './nav.component.html',
  styleUrls: []
})

// Class that controls the navbar for the site
export class NavComponent {
  id: any = '';
  isLoggedIn: any;
  buttonName: any;
  token: any = 'null';

  logoImagePath: String;
  profileImagePath: String;
  loggedIn: any;

  constructor(private authService: AuthService, 
    private route: ActivatedRoute, 
    public router: Router, 
    private webService: WebService) {

    this.logoImagePath = "/assets/Logo.png";
    this.profileImagePath = "";
    // Check if user is authenticated/logged in
    this.authService.isAuthenticated().subscribe( (response: any) => {this.loggedIn = response})

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

  login() {
    return this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.webService.logoutUser();
  }

    // Search bar that goes to page with all posts relating to what user searched for
    searchBar(search: any) {
      if (search != '') {
        return this.router.navigate(['/posts/search/' + search]);
      } else {
        return this.router.navigate(['/posts']);
      }
    }
}