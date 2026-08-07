import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceivableService } from '../services/receivable.service';
import { UserServiceService } from '../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartofaccountService } from '../services/chartofaccount.service';

@Component({
  selector: 'app-receivable',
  templateUrl: './receivable.component.html',
  styleUrls: ['./receivable.component.css'],
})
export class ReceivableComponent {
  public getreceivableId: any;
  public receivableObj: any;
  public amount: any = '';
  public currentUserEmail: any;
  public currentUserDetails: any;
  public accounts: any;
  public pickedAccount: any;
  selectedAccount: any = 'Select Account';
  constructor(
    public router: Router,
    private act_route: ActivatedRoute,
    private receivableservice: ReceivableService,
    public _userService: UserServiceService,
    private _snackBar: MatSnackBar,
    private chartOfAccountService: ChartofaccountService
  ) {}
  ngOnInit() {
    this.act_route.paramMap.subscribe((params) => {
      this.getreceivableId = params.get('id');
    });
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
      
      });

    this.fetchReceivable();
    this.fetchAllBankAndCashAccount();
  }
  fetchAllBankAndCashAccount() {
    this.chartOfAccountService
      .getBanksAccountAndCash()
      .subscribe((res: any) => {
        
        this.accounts = res.accounts;
     
      });
  }

  onAccountChange() {
    // Find the selected account
    this.pickedAccount = this.accounts.find(
      (account: any) => account._id === this.selectedAccount
    );
  }
  addPayment() {
    let paymentObj = {
      _id: this.getreceivableId,
      amount: this.amount,
      date: new Date(),
      staff:
        this.currentUserDetails.fname + ' ' + this.currentUserDetails.lname,
        account_used_id:this.selectedAccount
        
    };




    





   
    this.receivableservice.addPayment(paymentObj).subscribe((res: any) => {
     
      if (res.status == true) {
        this.fetchReceivable();
        (this.amount = ''),
          this._snackBar.open(res.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
      } else {
        this._snackBar.open('Failed to add product', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }
    });
  }

  fetchReceivable() {
    this.receivableservice
      .fetchEachreceivable(this.getreceivableId)
      .subscribe((item: any) => {
  
        this.receivableObj = item.currentReceivable;
      });
  }

 
}
