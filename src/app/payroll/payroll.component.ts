import { Component } from '@angular/core';
import * as numberToWords from 'number-to-words';
import { ChartofaccountService } from '../services/chartofaccount.service';
import { UserServiceService } from '../services/user-service.service';
import { VoucherService } from '../services/voucher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayrollService } from '../services/payroll.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css'],
})
export class PayrollComponent {
  public payrollDetailsArray: any[] = [];
  public totalPrice = 0;
  public costcenters: any;
  public selectedPaymentOption: any = '';
  public amountToWords: any;
  public currentUserEmail: any;
  public currentUserDetails: any;

  public months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  public selectedMonth: any = '';
  public cashandbankaccounts: any;
  public allStaffs: any;

  constructor(
    private chartOfAccountService: ChartofaccountService,
    public _userService: UserServiceService,
    private voucherService: VoucherService,
    private _snackBar: MatSnackBar,
    private payrollservice: PayrollService,
    public router: Router
  ) {}
  ngOnInit() {
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
      });
      this.createForAllStaffsFirst()
    this.fetchAllBankAndCashAccount();
  }

  createForAllStaffsFirst(){
    this._userService.getAllStaffs().subscribe((res: any) => {
      this.allStaffs=res.staffs
      this.allStaffs.forEach((item:any) => {
        this.payrollDetailsArray.push({
          name: `${item.fname} ${item.lname}`,
          wages: 0,
          bonus: 0,
          tax: 0,
          noOfDays: 0,
          monthlyDeduction: 0,
          salaryAdvance:0,
          loan: 0,
          total: 0,
          bankname:`${item.bankname} `|| '',
          acct_no:`${item.acct_no}`|| 0,
          acct_name:`${item.acct_name}`|| ''

        });
      });
      this.addItem();
    })
  }
  fetchAllBankAndCashAccount() {
    this.chartOfAccountService
      .getBanksAccountAndCash()
      .subscribe((res: any) => {
        this.cashandbankaccounts = res.accounts;
      });
  }

  addItem() {
    this.payrollDetailsArray.push({
      name: '',
      wages: 0,
      bonus: 0,
      tax: 0,
      noOfDays: 0,
      monthlyDeduction: 0,
      salaryAdvance: 0,
      loan: 0,
      total: 0,
      bankname:'',
      acct_no:0,
      acct_name:''



    });
  }

  deleteItem(index: number) {
    if (this.payrollDetailsArray.length > 1) {
      this.payrollDetailsArray.splice(index, 1);
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice() {
    this.totalPrice = 0; // Initialize total price

    this.payrollDetailsArray.forEach((voucherDetails) => {
      const totalamount =
        voucherDetails.wages * voucherDetails.noOfDays +
        voucherDetails.bonus -
        voucherDetails.tax -
        voucherDetails.monthlyDeduction -
        voucherDetails.salaryAdvance -
        voucherDetails.loan;
      voucherDetails.total = totalamount;
      this.totalPrice += totalamount;
    });

    this.amountToWords = numberToWords.toWords(this.totalPrice);
  }
  createPayroll() {
    let payrollObj = {
      account_id: this.selectedPaymentOption,
      month: this.selectedMonth,
      payrollItem: this.payrollDetailsArray,
      total: this.totalPrice,
      preparedBy:
        this.currentUserDetails?.fname + ' ' + this.currentUserDetails?.lname,
    };

    this.payrollservice.createPayroll(payrollObj).subscribe(
      (res: any) => {
        if (res.status === true) {
          this.selectedPaymentOption = '';
          (this.selectedMonth = ''), (this.payrollDetailsArray = []);
          this.payrollservice.triggerRefresh();
          this.amountToWords = '';
          this.totalPrice=0
          this.createForAllStaffsFirst()
          this._snackBar.open(res.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
        } else {
          this._snackBar.open(res.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          });
        }
      },
      (error: any) => {
        this._snackBar.open(error.error.message, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
        // Handle error here if needed
      }
    );
  }
}
