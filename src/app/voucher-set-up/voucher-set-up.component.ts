import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-voucher-set-up',
  templateUrl: './voucher-set-up.component.html',
  styleUrls: ['./voucher-set-up.component.css']
})
export class VoucherSetUpComponent {
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
