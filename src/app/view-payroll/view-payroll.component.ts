import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PayrollService } from '../services/payroll.service';
import * as numberToWords from 'number-to-words';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx'; 
import { CompanySettingsService } from '../services/company-settings.service';
@Component({
  selector: 'app-view-payroll',
  templateUrl: './view-payroll.component.html',
  styleUrls: ['./view-payroll.component.css'],
})
export class ViewPayrollComponent {
  public getPayrollId: any;
  public payrollData:any
  public amountToWords:any
  constructor(
    private act_route: ActivatedRoute,
    private payrollservice: PayrollService,
    private _snackBar: MatSnackBar,
    private companySettingsService: CompanySettingsService
  ) {}
  
  ngOnInit() {
    this.act_route.paramMap.subscribe((params) => {
      this.getPayrollId = params.get('id');
    });
    this. fetcheachpayroll()
  }

  fetcheachpayroll(){
    this.payrollservice.fetcheachpayroll(this.getPayrollId).subscribe((res:any)=>{
   
      this.payrollData=res.result
      this.amountToWords = numberToWords.toWords(this.payrollData?.payroll
        ?.total);
      
    })
  }


  download(data: any) {
    this.payrollservice.downloadExcel(this.getPayrollId, data).subscribe((res: any) => {
      console.log(this.payrollData);
      
      if (res.status === true) {
        // Check if the response data is an array
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Extract column headers dynamically from the first item in the response
          const formattedColumnHeaders = Object.keys(res.data[0])
            .map((header) => `'${header.charAt(0).toUpperCase() + header.slice(1)}'`)
            .join(', ');
  
          // Create worksheet using json_to_sheet
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
            { 'SMATO MANUFACTURING LTD': '' },
            {}, // Add an empty row
          ], { header: ['SMATO MANUFACTURING LTD'], skipHeader: true });
  
  
          XLSX.utils.sheet_add_json(worksheet, res.data, { header: Object.keys(res.data[0]) });
  
          // Create a workbook
          const workbook: XLSX.WorkBook = { Sheets: { 'Payroll Data': worksheet }, SheetNames: ['Payroll Data'] };
  
          // Convert the workbook to a binary Excel file and initiate download
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          const year = new Date(this.payrollData.payroll.createdAt).getFullYear();

          link.download = ` SMATO payroll_${this.payrollData.payroll.month}_${year}.xlsx`;
          link.click();
  
          this._snackBar.open(`Downloaded successfully. `, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
        } else {
          this._snackBar.open('Invalid data format ', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
        }
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
