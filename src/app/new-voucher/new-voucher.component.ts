import { Component } from '@angular/core';
import { ChartofaccountService } from '../services/chartofaccount.service';
import { UserServiceService } from '../services/user-service.service';
import * as numberToWords from 'number-to-words';
import { VoucherService } from '../services/voucher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-new-voucher',
  templateUrl: './new-voucher.component.html',
  styleUrls: ['./new-voucher.component.css']
})
export class NewVoucherComponent {
  public voucherDetailsArray: any[] = [];
  public totalPrice =0
  public costcenters:any
  public selectedCostCenter:any=''
  public currentUserEmail: any;
  public currentUserDetails: any;
  public date:any=''
  public vouchersummary:any=''
  public paymentdetails:any=''
  public amountToWords:any
  constructor(private chartOfAccountService:ChartofaccountService,  public _userService: UserServiceService, private voucherService:VoucherService,private _snackBar: MatSnackBar, ){

  }
  ngOnInit(){
    this.addItem()
    this.fetchExpensesAccount()
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;

      });
  }
  fetchExpensesAccount(){
    this.chartOfAccountService.getExpensesAccount().subscribe((res:any)=>{
      
      this.costcenters=JSON.parse(JSON.stringify(res.accounts))
      this.costcenters.map((account:any) => {
        account.label = account.acct_no + " " + account.title;
      });
     


      
    })
  }
  addItem() {
    this.voucherDetailsArray.push({
      item: '',
      description: '',
      quantity: 0,
      unit_price: 0,
      price: 0
    });
  }

  deleteItem(index: number) {
    if (this.voucherDetailsArray.length > 1) {
      this.voucherDetailsArray.splice(index, 1);
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice() {
    this.totalPrice = 0; // Initialize total price

    this.voucherDetailsArray.forEach((voucherDetails) => {
      const itemPrice = voucherDetails.quantity * voucherDetails.unit_price;
      voucherDetails.price = itemPrice;
      this.totalPrice += itemPrice;
    });
    
    this.amountToWords=numberToWords.toWords(this.totalPrice);
   

  }

  createVoucher(){
   let voucherObj={
    cost_center_id:this.selectedCostCenter,
    staff:this.currentUserDetails?.fname + ' ' + this.currentUserDetails?.lname,
    date:this.date,
    vouchersummary:this.vouchersummary,
    paymentdetails:this.paymentdetails,
    voucheritem:this.voucherDetailsArray,
    total:this.totalPrice,
    remark:"Awaiting Approval",
    totalPaid:0
   }
 
   this.voucherService.addVoucher(voucherObj).subscribe((res:any)=>{
    if (res.status == true) {
      this.selectedCostCenter=''
      this.date=''
      this.vouchersummary=''
      this.paymentdetails=''
      this.voucherDetailsArray=[]
      this.totalPrice=0
      this.amountToWords=''
      this.addItem()
      this.voucherService.triggerRefresh()
       this._snackBar.open(res.message, 'OK', {
         duration: 3000,
         horizontalPosition: 'right',
         verticalPosition: 'bottom',
         panelClass: ['green-snackbar', 'login-snackbar'],
       });
     } else {
       this._snackBar.open('Failed to add Voucher', 'OK', {
         duration: 3000,
         horizontalPosition: 'right',
         verticalPosition: 'bottom',
         panelClass: ['red-snackbar', 'login-snackbar'],
       });
     }
    
   })
   
    
  }
 

}
