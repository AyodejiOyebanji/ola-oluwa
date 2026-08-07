import { Component } from '@angular/core';
import { PayrollService } from '../services/payroll.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payrolls',
  templateUrl: './payrolls.component.html',
  styleUrls: ['./payrolls.component.css'],
})
export class PayrollsComponent {
  public payrollList: any;
  filteredPayroll: any[] = [];
  searchQuery = '';

  constructor(private payrollservice: PayrollService,    private _snackBar: MatSnackBar,public route:Router) {}

  ngOnInit() {
    this.fetchAllpayroll();
    this.refreshComponent()
  }
  refreshComponent(){
    this.payrollservice.refresh$.subscribe(()=>{
     this.fetchAllpayroll()
      
    })
  } 
  fetchAllpayroll() {
    this.payrollservice.fetchAllPayroll().subscribe((res: any) => {
   
      if (res.status == true) {
        this.payrollList = res.payroll;
        this.filteredPayroll=[...this.payrollList]
      } else {
        this._snackBar.open('Failed to fetch the Payroll ', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }
    },(err) => {
      this._snackBar.open(
        'An error occurred while adding product',
        'OK',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        }
      );
    }
    
    );
  }
  viewItem(id:any){
  
    

    
this.route.navigate(['/view-payroll', id])
  }


  search() {
    if (this.searchQuery) {
      this.filteredPayroll = this.payrollList.filter((payroll: any) =>
        this.matchesSearchQuery(payroll)
      );
    } else {
      this.filteredPayroll = [...this.payrollList];
    }
  }
  
  matchesSearchQuery(voucher: any): boolean {
    const query = this.searchQuery.toLowerCase();
  
    return (
      voucher.month.toLowerCase().includes(query) ||

    
      voucher.total.toString().includes(query) ||
      
      voucher.
      preparedBy.toLowerCase().includes(query)
    );
  }

}
