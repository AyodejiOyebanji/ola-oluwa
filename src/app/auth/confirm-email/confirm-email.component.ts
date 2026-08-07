import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent {
  public userPin:any="";
  public response:any
  public userEmail:any;
  constructor(public _userservice: UserServiceService,  private _snackBar: MatSnackBar, public router:Router) { }
  ngOnInit(): void {
    this.userEmail=sessionStorage.getItem('smato-email')
  
    

  }
  verifyEmail(){
    if(this.userPin==""){
    this._snackBar.open("Kindly input your Pin ", "OK", {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['green-snackbar', 'login-snackbar'],
     });
  }else{
    this._userservice.VerifyEmail({userpin:this.userPin,email:this.userEmail}).subscribe((item:any)=>{
      this.response= item
      if(this.response.status === true){
        this._snackBar.open(this.response.message, "OK", {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
         });
         sessionStorage.removeItem('smato-email');
         this.router.navigate(['login'])
      }else{
        this._snackBar.open(this.response.message, "OK", {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
         });

      }
      
    },error=>{
      this._snackBar.open("Internal Server Error", "OK", {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
       });
      
    })


  }
}
}