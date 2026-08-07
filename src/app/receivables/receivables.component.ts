import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReceivableService } from '../services/receivable.service';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-receivables',
  templateUrl: './receivables.component.html',
  styleUrls: ['./receivables.component.css'],
})
export class ReceivablesComponent {
  public customername: any = '';
  public expectedAmount: any = '';
  public short_note: any = '';
  public receivables: any;
  public expandedId: any;
  public totalReceivable: any = 0;
  public currentUserEmail: any;
  public currentUserDetails: any;
  public loader = false;
  currentPage = 1;
  pageSize = 20;
  searchQuery = '';
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  constructor(
    private _snackBar: MatSnackBar,
    private receivableservice: ReceivableService,
    public router: Router,
    public _userService: UserServiceService
  ) {}
  ngOnInit() {
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
      });
    this.fetchAllReceivables();
  }
  createReceivable() {
    if (
      this.customername == '' &&
      this.short_note == '' &&
      this.expectedAmount == ''
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
      this.expectedAmount == ''
    ) {
      this._snackBar.open('Fill all the missing fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else {
      let receivableObj = {
        customername: this.customername,
        expectedAmount: this.expectedAmount,
        short_note: this.short_note,
        dedu_exp_amount: this.expectedAmount,
        remark: 'Unpaid',
        amountPaid: 0,
      };
      this.receivableservice.addReceivable(receivableObj).subscribe(
        (res: any) => {
    
          
          if (res.status == true) {
            this.fetchAllReceivables();
            this.customername = '';
            this.expectedAmount = '';
            this.short_note = '';

            this._snackBar.open(res.message, 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['green-snackbar', 'login-snackbar'],
            });
          } else {
            this._snackBar.open('Failed to add Receivables', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['red-snackbar', 'login-snackbar'],
            });
          }
        },
        (err) => {
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

  fetchAllReceivables() {
    this.receivableservice
      .fetchReceivables(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe((res: any) => {
        if (res.status == true) {
          this.loader = false;
          this.receivables = res.receivables;
          this.hasNextPage = res.hasNextPage;
          this.hasPreviousPage = this.currentPage > 1;
          this.calculateTotalDeduExpAmount();
        } else {
          this._snackBar.open(
            'Unable to fetch products, Kindly check your internet connection',
            'OK',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['green-snackbar', 'login-snackbar'],
            }
          );
        }
      });
  }
  // Calculate the total dedu_exp_amount
  calculateTotalDeduExpAmount() {
    this.receivableservice.fetchTotalReceivables().subscribe((res: any) => {
      this.totalReceivable = res.totalAmount;
    });
  }
  viewItem(id: any) {
  
    this.router.navigate(['/receivable', id]);
  }
  deleteItem(id: any) {
    this.receivableservice.deleteReceivable({ id }).subscribe((res: any) => {
      if (res.status == true) {
        this.fetchAllReceivables();
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
    });
  }
  fetchPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchAllReceivables();
    }
  }

  fetchNextPage() {
    if (this.hasNextPage) {
      // Only fetch next page if there is a next page
      this.currentPage++;
      this.fetchAllReceivables();
    }
  }
  search() {
    this.currentPage = 1; // Reset to the first page when searching
    this.fetchAllReceivables();
  }
}
