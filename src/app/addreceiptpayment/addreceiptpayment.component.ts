import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { ChartofaccountService } from '../services/chartofaccount.service';

@Component({
  selector: 'app-addreceiptpayment',
  templateUrl: './addreceiptpayment.component.html',
  styleUrls: ['./addreceiptpayment.component.css']
})
export class AddreceiptpaymentComponent {
  public receiptId:any
  public searchedResult:any
  public accounts: any;
  public selectedAccount:any=''

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private service: UserServiceService,
    private chartOfAccountService: ChartofaccountService,
  ) {}
  ngOnInit(){
    this.fetchAllBankAndCashAccount() 
  }

  search(){
    this.service.getSearchedReceipt(this.receiptId).subscribe((res:any)=>{
     this.searchedResult=res.searchedReceipt
     console.log(this.searchedResult);
     
      
    })

  }
  fetchAllBankAndCashAccount() {
    this.chartOfAccountService
      .getBanksAccountAndCash()
      .subscribe((res: any) => {
     
        this.accounts = res.accounts;
      });
  }
  addPayment(amount:any, name:any, receiptId:any){
    
    let paymentObj={
      selectedaccount_id:this.selectedAccount,
      amount:amount,
      nameOfCustomer:name, 
      receiptId:receiptId
    }
    this.service.addPaymentForExitingReceipt(paymentObj).subscribe((res:any)=>{
      if (res.status == true) {
      
        (this.selectedAccount = ''),
        this.search()
          this._snackBar.open(res.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
      } else {
        this._snackBar.open('Unable to add payment', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }
      
    })
    
  }
 
}
