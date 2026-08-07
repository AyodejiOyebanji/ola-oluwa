import { Component } from '@angular/core';
import { ChartofaccountService } from '../services/chartofaccount.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActtypeService } from '../services/acttype.service';

@Component({
  selector: 'app-chartofaccount',
  templateUrl: './chartofaccount.component.html',
  styleUrls: ['./chartofaccount.component.css'],
})
export class ChartofaccountComponent {
  public acct_no: any = '';
  public title: any = '';
  public description: any = '';
  public Accountlist: any;
  public act_type: any;
  selectedValue: string = 'Select Account ';
  filteredAccounts: any[] = [];
  searchQuery = '';

  constructor(
    private _snackBar: MatSnackBar,
    private chartaccountservice: ChartofaccountService,
    private actTypes: ActtypeService
  ) {}
  ngOnInit() {
    this.fetchAllAccount();
    this.actTypes.getActTypes().subscribe((item: any) => {
      this.act_type = JSON.parse(JSON.stringify(item.account));
      this.act_type.map((account: any) => {
        account.label = account.act_id + ' ' + account.title;
      });
    });
  }

  onSelectionChange(event: any): void {
    this.selectedValue = event.target.value;
  }
  addBank() {
    if (this.description == '' && this.title == '' && this.acct_no == '') {
      this._snackBar.open('Fill all the fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else if (
      this.description == '' ||
      this.title == '' ||
      this.acct_no == ''
    ) {
      this._snackBar.open('Fill all the missing fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else {
      let bankObj = {
        acct_no: this.acct_no,
        title: this.title,
        description: this.description,
        availableamount: 0,
        debit: 0,
        act_type: this.selectedValue,
      };

      this.chartaccountservice.addAccount(bankObj).subscribe(
        (res: any) => {
          if (res.status == true) {
            this.fetchAllAccount();
            this.title = '';
            this.description = '';
            this.acct_no = '';

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
        },
        (err) => {
          if (err.status == 409) {
            this._snackBar.open('Bank already exists', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['red-snackbar', 'login-snackbar'],
            });
          } else {
            this._snackBar.open('An error occurred', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['red-snackbar', 'login-snackbar'],
            });
          }
        }
      );
    }
  }

  fetchAllAccount() {
    this.chartaccountservice.fetchAccount().subscribe((item: any) => {
      this.Accountlist = item.account;
      this.filteredAccounts= [...this.Accountlist]

    });
  }
  editItem(i: any) {}
  deleteItem(i: any) {
    let deletedId = this.Accountlist[i]._id;
    this.chartaccountservice
      .deleteAccount({ deletedId })
      .subscribe((res: any) => {
        if (res.status == true) {
          this.fetchAllAccount();
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

  search() {
    if (this.searchQuery) {
      this.filteredAccounts = this.Accountlist.filter((account: any) =>
        this.matchesSearchQuery(account)
      );
    } else {
      this.filteredAccounts = [...this.Accountlist];
    }
  }
  
  matchesSearchQuery(account: any): boolean {
    const query = this.searchQuery.toLowerCase();
  
    return (
      account.title.toLowerCase().includes(query) ||

      account.description .toLowerCase().includes(query) ||
      account.acct_no.toString().includes(query) 
      
     
    );
  }
}
