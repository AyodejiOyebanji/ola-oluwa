import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { VoucherService } from '../services/voucher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as numberToWords from 'number-to-words';
import { ChartofaccountService } from '../services/chartofaccount.service';
import { VoucherpaymentService } from '../services/voucherpayment.service';

@Component({
  selector: 'app-view-voucher',
  templateUrl: './view-voucher.component.html',
  styleUrls: ['./view-voucher.component.css'],
})
export class ViewVoucherComponent {
  public voucherData: any;
  public getVoucherId: any;
  public amountToWords: any;
  public accounts: any;
  selectedAccount: any = 'Select Account';
  availableAmount: any;
  public amountPaid: any = '';
  pickedAccount: any;
  public currentUserEmail: any;
  public currentUserDetails: any;
  public paymentMade: any;
  public disableBtn = true;
  public totalMoneyPaid:any
  public totalMoneyPaidInword:any
  constructor(
    public _userService: UserServiceService,
    private voucherService: VoucherService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private act_route: ActivatedRoute,
    private chartOfAccountService: ChartofaccountService,
    private voucherpaymentservice: VoucherpaymentService
  ) {}
  ngOnInit() {
    this.act_route.paramMap.subscribe((params) => {
      this.getVoucherId = params.get('id');
    });
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
      });
    this.fetchAllVouchers();
    this.fetchAllBankAndCashAccount();
  }
  fetchAllVouchers() {
    let id = this.getVoucherId;

    this.voucherService.getVoucher(id).subscribe((res: any) => {
      this.voucherData = res.voucher;
      this.totalMoneyPaid=this.voucherData.totalPaid
      this.totalMoneyPaidInword=numberToWords.toWords(this.totalMoneyPaid);
     
      
      this.fetchPaymentsForVoucher();

      this.amountToWords = numberToWords.toWords(this.voucherData.total);
    });
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
    this.availableAmount = this.pickedAccount?.availableamount || 0;
  }

  approveBtn(id: any) {
    let voucherObj = {
      id: id,
      remark: 'Approved',
    };
    this.voucherService.approveVoucher(voucherObj).subscribe((res: any) => {
      if (res.status == true) {
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
        });
        this.fetchAllVouchers();
      } else {
        this._snackBar.open('Failed to Approve', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }
    });
  }

  checkAmountInputedChange() {
    if (this.amountPaid > this.pickedAccount?.availableamount) {
      this.disableBtn = true;
      this._snackBar.open(
        `Insufficient funds in ${this.pickedAccount?.title}  `,
        'OK',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        }
      );
    } else if (this.amountPaid > this.voucherData.total) {
      this.disableBtn = true;
      this._snackBar.open(`The amount  `, 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['red-snackbar', 'login-snackbar'],
      });
    } else {
      this.disableBtn = false;
    }
  }

  makePayment(id: any) {
  
    let paymentVoucherObj = {
      voucher_id: this.voucherData._id,
      amountpaid: this.amountPaid,
      approvedBy:
        this.currentUserDetails?.fname + ' ' + this.currentUserDetails?.lname,
      expecttedTotalAmount: this.voucherData.total,
      account_id: this.pickedAccount._id,
      payee: this.voucherData.Staff,
    };
   
    this.voucherpaymentservice
      .createVoucherPayment(paymentVoucherObj)
      .subscribe((res: any) => {
        this.amountPaid = '';
        this.selectedAccount = '';
        this.fetchAllVouchers();
        this.fetchAllBankAndCashAccount();
        if (res.status == true) {
          this._snackBar.open(res.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
        } else {
          this._snackBar.open('Something went wrong', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          });
        }
      });
  }

  fetchPaymentsForVoucher() {
    this.voucherpaymentservice
      .fetchPaymentsForVoucher(this.voucherData._id)
      .subscribe((res: any) => {
      
        this.paymentMade = res.payments;
      });
  }
}
