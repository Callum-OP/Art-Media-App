import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root'
})
// Place to store functions that can be reused in multiple components
export class UtilityService {

  // Default user details if user details can not be found
  private defaultUser = { 
    username: 'Unknown User', 
    profilePic: 'media/default/DefaultProfilePicAlt.jpg' 
  };

  constructor(private webService: WebService) {}

  // Function to retrieve username and profile picture using user id
  getUserDetails(userID: any): Observable<any> {
    return this.webService.getUser(userID).pipe(
      catchError(() => [this.defaultUser])
    );
  }
}
