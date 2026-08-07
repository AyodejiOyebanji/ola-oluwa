import { WalletService } from '../services/wallet.service';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletComponent {
  public customername: any = '';
  public outstandingAmount: any = '';
  public short_note: any = '';
  public wallets: any;
  public totalWallet:any
  public currentUserEmail: any;
  public currentUserDetails: any;
  filteredWallets: any[] = [];
  searchQuery = '';

  constructor(
    private _snackBar: MatSnackBar,
    private WalletService: WalletService,
    public router: Router,
    public _userService: UserServiceService
  ) {}

  ngOnInit(){
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
      });
    this.fetchAllWallet()
  }

  createWallet(){
    if (
      this.customername == '' &&
      this.short_note == '' &&
      this.outstandingAmount == ''
    ) {
      this._snackBar.open('Fill all the fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else if (
      this.customername == '' ||
      this.short_note == '' ||
      this.outstandingAmount == ''
    ) {
      this._snackBar.open('Fill all the missing fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else {
      let WalletObj = {
        customername: this.customername,
        outstandingAmount: this.outstandingAmount,
        short_note: this.short_note,
        dedu_outs_amount: this.outstandingAmount,
        remark: 'Unpaid',
        amountPaid: 0,
      };


      this.WalletService.addWallet (WalletObj).subscribe(
        (res: any) => {
          if (res.status == true) {
             this.fetchAllWallet()
            this.customername = '';
            this.outstandingAmount = '';
            this.short_note = '';

            this._snackBar.open(res.message, 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['green-snackbar', 'login-snackbar'],
            });
          } else {
            this._snackBar.open('Failed to add Wallet', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['red-snackbar', 'login-snackbar'],
            });
          }
        },
        (err:any) => {
          this._snackBar.open('An error occurred while adding product', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          });
        }
      );
    
    }
  }


  fetchAllWallet() {
    this.WalletService.fetchWallet().subscribe((res: any) => {
  
      this.wallets= res.wallet;
      this.filteredWallets = [...this.wallets];
       this.calculateTotalWalletAmount()

    });
  }

// Calculate the total dedu_exp_amount
calculateTotalWalletAmount() {
  this.totalWallet= this.wallets.reduce((total:any, receivable:any) => total + receivable.
  dedu_outs_amount, 0);
 
  
}

  viewItem(id: any) {
   
    this.router.navigate(['/wallet', id]);
  }
  deleteItem(id: any) {
    this.WalletService.deleteWallet({id}).subscribe((res:any)=>{
    
      
      if (res.status == true) {
        this.fetchAllWallet()
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
       
      } else {
        this._snackBar.open(
          'Something went wrong,Check your internet connection',
          'OK',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          }
        );
      }

    })

  }
  search() {
    if (this.searchQuery) {
      this.filteredWallets = this.wallets.filter((wallet: any) =>
        this.matchesSearchQuery(wallet)
      );
    } else {
      this.filteredWallets = [...this.wallets];
    }
  }
  
  matchesSearchQuery(wallet: any): boolean {
    const query = this.searchQuery.toLowerCase();
  
    return (
      wallet.customername.toLowerCase().includes(query) ||
      wallet.outstandingAmount.toString().includes(query) ||
      wallet.dedu_outs_amount.toString().includes(query) ||
      wallet.amountPaid.toString().includes(query) ||
      wallet.remark.toLowerCase().includes(query)
    );
  }
  
}
