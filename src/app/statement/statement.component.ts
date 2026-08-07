import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartofaccountService } from '../services/chartofaccount.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css'],
})
export class StatementComponent {
  filteredAccounts: any[] = [];
  searchQuery = '';
  public Accountlist: any;
  
  constructor(
    public router: Router,
    private act_route: ActivatedRoute,
    private chartOfAccountService: ChartofaccountService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.fetchBankAndCashAccounts()
  } 
  fetchBankAndCashAccounts(){
    this.chartOfAccountService.getBanksAccountAndCash().subscribe((res:any)=>{
      if(res.status==true){
        this.Accountlist = res.accounts;
        this.filteredAccounts= [...this.Accountlist]
      }else{
        this._snackBar.open('Something went wrong', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }

      
    })
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

  viewItem(id:any){
   this.router.navigate(['/view-statement', id])
    
  }
}
