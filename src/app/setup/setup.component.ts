import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent {
  public currentUserEmail: any;
  public currentUserDetails: any;
  constructor(
 
    public _userService: UserServiceService,

  ) {}
  ngOnInit(){
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
    .GetCurrentUser(this.currentUserEmail)
    .subscribe((res: any) => {
      this.currentUserDetails = res.currentUser;
  
      

      
  
      
    });
  }
}
