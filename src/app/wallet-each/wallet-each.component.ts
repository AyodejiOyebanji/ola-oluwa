import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';
import { UserServiceService } from '../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wallet-each',
  templateUrl: './wallet-each.component.html',
  styleUrls: ['./wallet-each.component.css']
})
export class WalletEachComponent {
  public getwalletId:any
  public currentUserEmail: any;
  public currentUserDetails: any;
  public amount:any=''
  public WalletObj:any
  constructor(
    public router:Router,
    private act_route: ActivatedRoute,
    private walletservice:WalletService,
    public _userService: UserServiceService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(){

    this.act_route.paramMap.subscribe(params => {
      this.getwalletId = params.get('id');
    }); 
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
   
        
      });
      this.fetchWallets()
   
  }
  fetchWallets(){
    this.walletservice.fetchEachWallet(this.getwalletId).subscribe((item:any)=>{
    
       this.WalletObj=item.currentWallet

    })
  }

  addDeduction(){
    let paymentObj={
      _id:this.getwalletId,
      amount:this.amount,
      date:new Date(),
      staff: this.currentUserDetails.fname + ' '+ this.currentUserDetails.lname
    }
    this.walletservice.addDeduction(paymentObj).subscribe((res:any)=>{
      if (res.status == true) {
        
        this.fetchWallets()
          this.amount='',
  
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
    })


  }

}
