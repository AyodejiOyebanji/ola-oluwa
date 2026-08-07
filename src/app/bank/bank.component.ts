import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BankService } from '../services/bank.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent {
public bank_name :any=''
public  acc_name:any =''
public acc_no:any=''
public banklist: any[] = [];
public filteredBanklist: any[] = [];
public searchQuery = '';

ngOnInit() {
  this.fetchAllBank();
}

search() {
  const term = this.searchQuery.toLowerCase().trim();
  this.filteredBanklist = term
    ? this.banklist.filter(
        (bank: any) =>
          bank.bank_name?.toLowerCase().includes(term) ||
          bank.acc_name?.toLowerCase().includes(term) ||
          bank.acc_no?.toString().includes(term)
      )
    : [...this.banklist];
}
constructor(
  private _snackBar: MatSnackBar,
  private bankserice:BankService

) {}
addBank(){
  if (
    this.bank_name == '' &&
    this.acc_name == '' &&
    this.acc_no == '' 
    
  ) {
    this._snackBar.open('Fill all the fields', 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['green-snackbar', 'login-snackbar'],
    });
  } else if (
    this.bank_name == '' ||
    this.acc_name == '' ||
    this.acc_no == '' 
  ) {
    this._snackBar.open('Fill all the missing fields', 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['green-snackbar', 'login-snackbar'],
    });
  }else{
    let bankObj = {
     bank_name :this.bank_name,
     acc_name: this.acc_name  ,
     acc_no: this.acc_no ,
     availableamount:0
    };

    this.bankserice.addBank(bankObj).subscribe((res:any)=>{
      if (res.status == true) {
         this.bank_name = '';
         this.acc_name = '';
         this.acc_no = '';
         this.fetchAllBank(); // refresh list and filtered copy
         this._snackBar.open(res.message, 'OK', {
           duration: 3000,
           horizontalPosition: 'right',
           verticalPosition: 'bottom',
           panelClass: ['green-snackbar', 'login-snackbar'],
         });
       } else {
         this._snackBar.open('Failed to add Bank', 'OK', {
           duration: 3000,
           horizontalPosition: 'right',
           verticalPosition: 'bottom',
           panelClass: ['red-snackbar', 'login-snackbar'],
         });
       }
      
    },(err)=>{
      if (err.status == 409) {
        this._snackBar.open('Bank already exists', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }else {
        this._snackBar.open(
          'An error occurred',
          'OK',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          }
        );
      }
    }
    
    )




  }

}

fetchAllBank() {
  this.bankserice.fetchBank().subscribe((item: any) => {
    this.banklist = item.bank;
    this.filteredBanklist = [...this.banklist];
  });
}

}
