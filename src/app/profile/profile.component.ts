import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  public currentUserEmail: any;
  public currentUserDetails: any;
  public inputDisabled:boolean=true
  public editing :boolean= false
  public editfname :any
  public editlname :any
  public editemail :any
  public editphone :any
  public editpassword :any
  public editacct_name:any
  public editacct_no:any
  public editbankname:any

 
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, public _userService:UserServiceService) {
    
  }

  ngOnInit(): void {
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
    .GetCurrentUser(this.currentUserEmail)
    .subscribe((res: any) => {
      this.currentUserDetails = res.currentUser;
  
      
    });
  }

  edit(){
      this.inputDisabled= false
      this.editing=true
  }
  save(){
    this.inputDisabled= true
      this.editing=false
    let editedObject={
      fname:this.editfname||this.currentUserDetails?.fname,
      lname:this.editlname||this.currentUserDetails?.lname,
      email:this.editemail||this.currentUserDetails?.email,
      phone:this.editphone||this.currentUserDetails?.phone,
      password:this.editpassword||this.currentUserDetails?.password,
      acct_name:this.editacct_name||this.currentUserDetails?.acct_name,
      acct_no:this.editacct_no||this.currentUserDetails?.acct_no,
      bankname:this.editbankname||this.currentUserDetails?.bankname,
    }
    this._userService.editProfile(editedObject).subscribe((item:any)=>{
     
      if(item.status== true){
        this._snackBar.open(item.message,
          'OK',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          }
        );
      } else {
        this._snackBar.open(item.message,
          'OK',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          }
        );
      }
    },
    (error) => {
      this._snackBar.open(error.error.message,
          'OK',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          }
        );
    });
  }

}
