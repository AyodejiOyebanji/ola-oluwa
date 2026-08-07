import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-new-staff',
  templateUrl: './new-staff.component.html',
  styleUrls: ['./new-staff.component.css']
})
export class NewStaffComponent {
  public myForm!: FormGroup;
  public response:any
  loading = false;
  errorResp?: any;
  errorMessage?: any;
  status ?: boolean;
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, public _userService:UserServiceService) {
    this.myForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['', Validators.required],
      bankname: ['', Validators.required],
      acct_no: ['', Validators.required],
      acct_name: ['', Validators.required],
      isAdmin: [false],
      isCashier: [false],
      isStaff: [false]
    });
  }

  public onSubmit() {
    if (this.myForm.valid) {
      
      
      this._userService.Register(this.myForm.value).subscribe((item:any) => {
          this.response=item
  
          this._snackBar.open(`New Staff added! The ID is ${this.response.user.smato_id}`, "OK", {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
           })
           this.myForm.reset();

       
      },
      (errorResponse:any) => {
        this.loading = false;
        this.errorMessage = errorResponse.error.message;
        this.status = errorResponse.error.status;
       
        this.errorMessage ? this._snackBar.open(this.errorMessage, "OK", {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
         }) : this._snackBar.open("Pls check your internet connection","OK", {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
         });
        })
     
    } else {
      this._snackBar.open("Kindly fill the missing detail", "OK", {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
       });
    }
  }

  onRoleChange() {
    const roleControl = this.myForm.get('role');
  
    if (roleControl) {
      const role = roleControl.value;
      const isAdmin = role === 'Admin';
      const isCashier = role === 'Cashier';
       const isStaff = role === 'Staff';
  
      this.myForm.patchValue({
        isAdmin,
        isCashier,
         isStaff
      });
    }
  }
  
  
  
}
