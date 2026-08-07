import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public userToken: any;
  public response: any;
  public currentUserDetails: any;
  public currentUserName: any;
  public dayReceipt: any;
  public totalsale: any;
  public allReceipt: any;
  public totalExpenses: any;
  public cumulativeRevenueForEachMonth: any;
  public loading = true;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private service: UserServiceService
  ) {}

  ngOnInit(): void {
    this.userToken = JSON.parse(localStorage['token']);

    const [month, day, year] = new Date().toLocaleDateString().split('/');
    const date = `${day}/${month}/${year}`;

    // Fire all 5 requests simultaneously instead of sequentially
    forkJoin({
      dashboard: this.service.GetDashboard(this.userToken),
      todaySale: this.service.GetTodaySale({ date }),
      expenses: this.service.getTotalExpenses(),
      lastSevenReceipts: this.service.fetchTheLastSevenReceipts(),
      monthlyRevenue: this.service.calculateTotalRevenueForEachMonth(),
    }).subscribe({
      next: (results: any) => {
        // Dashboard / auth
        this.response = results.dashboard;
        this.currentUserDetails = this.response.result;
        this.currentUserName = this.currentUserDetails?.fname;

        if (this.response.status === true) {
          // success — no snackbar needed
        } else {
          this._snackBar.open(this.response.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
          this.router.navigate(['/']);
        }

        // Today's sales
        this.dayReceipt = results.todaySale.dayReceipt;
        this.getTotalSale();

        // Expenses
        this.totalExpenses = results.expenses.totalExpenses;

        // Last 7 receipts
        this.allReceipt = results.lastSevenReceipts.receipts;

        // Monthly revenue
        this.cumulativeRevenueForEachMonth = results.monthlyRevenue;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this._snackBar.open('Internal Server Error', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
        });
        this.router.navigate(['/']);
      },
    });
  }

  getTotalSale() {
    this.totalsale = 0;
    for (let i = 0; i < this.dayReceipt?.length; i++) {
      this.totalsale += parseFloat(this.dayReceipt[i]?.totalAmount);
    }
  }
}
