import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { VoucherService } from '../services/voucher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RawMaterialVoucherService } from '../services/raw-material-voucher.service';
import * as XLSX from 'xlsx'; 
import { CompanySettingsService } from '../services/company-settings.service';

@Component({
  selector: 'app-rawmateriallists',
  templateUrl: './rawmateriallists.component.html',
  styleUrls: ['./rawmateriallists.component.css'],
})
export class RawmateriallistsComponent {
  public voucherList: any;
  filteredVouchers: any[] = [];
  searchQuery = '';
  public start_date:any=''
  public end_date:any=''
  constructor(
    public _userService: UserServiceService,
    private RawMaterialvoucherService: RawMaterialVoucherService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private companySettingsService: CompanySettingsService
  ) {}
  ngOnInit() {
    this.fetchAllVouchers();
    this. refreshComponent()
  }


  refreshComponent(){
    this.RawMaterialvoucherService.refresh$.subscribe(()=>{
      this.fetchAllVouchers();
    })
  }
  fetchAllVouchers() {
    this.RawMaterialvoucherService.getVouchers().subscribe((res: any) => {
      this.voucherList = res.vouchers;
      this.voucherList = res.vouchers;
      this.filteredVouchers=[...this.voucherList]
    });
  }
  viewItem(id: any) {
    this.router.navigate(['/view-material', id]);
  }
  deleteItem(id: any) {}
  search() {
    if (this.searchQuery) {
      this.filteredVouchers = this.voucherList.filter((voucher: any) =>
        this.matchesSearchQuery(voucher)
      );
    } else {
      this.filteredVouchers = [...this.voucherList];
    }
  }
  
  matchesSearchQuery(voucher: any): boolean {
    const query = this.searchQuery.toLowerCase();
  
    return (
      voucher.Staff.toLowerCase().includes(query) ||

      voucher.vouchersummary .toLowerCase().includes(query) ||
      voucher.total.toString().includes(query) ||
      
      voucher.remark.toLowerCase().includes(query)
    );
  }
  download() {
    this.RawMaterialvoucherService.downloadVoucher(this.start_date, this.end_date)
      .subscribe((res: any) => {
        console.log(res);
        
        if (res.status === true) {
          const companyName = this.companySettingsService.getSettingsSnapshot().companyName;
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ [companyName]: '' }], { header: [companyName], skipHeader: true });
          XLSX.utils.sheet_add_json(worksheet, res.voucher, { header: ['VoucherSummary', 'PaymentDetails', 'Date', 'Total', 'Staff', "Remark"  ] });
  
          // Create a workbook
          const workbook: XLSX.WorkBook = { Sheets: { 'Vouchers Data': worksheet }, SheetNames: ['Vouchers Data'] };
  
          // Convert the workbook to a binary Excel file and initiate download
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `voucher_data_${this.start_date}_to_${this.end_date}.xlsx`;
          link.click();
  
          this._snackBar.open(`Downloaded successfully. `, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
        } else {
          this._snackBar.open('Internal Server Error ', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
        }
      });
  }
}
