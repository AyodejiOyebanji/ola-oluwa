import { Component } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { CompanySettingsService } from '../services/company-settings.service';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  public currentUserEmail: any;
  public currentUserDetails: any;
  public todayStats!: any[];
  public filterDate!: string;
  public isNoDataAvailable: boolean = false;
  startDate: string | null = '';
  endDate: string | null = '';
  
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private service: UserServiceService,
    private companySettingsService: CompanySettingsService
  ) {}
  
  ngOnInit(): void {
    const [month, day, year] = new Date().toLocaleDateString().split('/');
    let date = `${day}/${month}/${year}`;
    this.filterDate = `${year}-${month}-${day}`;
  
    this.service.getTodaysStats({ date }).subscribe((res: any) => {
      this.todayStats = res.summary;
      this.isNoDataAvailable = this.todayStats.length === 0;
    });
  
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this.service.GetCurrentUser(this.currentUserEmail).subscribe((res: any) => {
      this.currentUserDetails = res.currentUser;
    });
  }
  
  // applyFilter() {
  //   this.service.getTodaysStats({ date: this.filterDate }).subscribe((res: any) => {
  //     this.todayStats = res.summary;

 
      
  //     this.isNoDataAvailable = this.todayStats.length === 0;
  //   });
  // }  

  applyFilter(): void {
    console.log('Start Date:', this.startDate);
    console.log('End Date:', this.endDate);
    let obj={
      start_date:this.startDate,
      end_date:this.endDate
    }

    if (this.startDate && this.endDate) {
      this.service.getRangeofSales(obj).subscribe((res: any) => {
        this.todayStats = res.summary;
        console.log(this.todayStats)
        this.isNoDataAvailable = this.todayStats.length === 0;
        
      })
      console.log('Date range:', this.startDate, 'to', this.endDate);
    } else {
      console.log('Please select both start and end dates.');
    }
  }
  download() {
    if (this.todayStats && this.todayStats.length > 0) {
      // Create a worksheet from the JSON data
      const companyName = this.companySettingsService.getSettingsSnapshot().companyName;
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ [companyName]: '' }], { header: [companyName], skipHeader: true });
  
      XLSX.utils.sheet_add_aoa(worksheet, [[companyName]], { origin: "A1" });
  
      // Add column headers
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [["Product Name", "Quantity Sold", "Transaction Date"]],
        { origin: "A2" }
      );
  
      // Prepare data to be added after the headers
      const jsonData = this.todayStats.map((data: any) => ({
        "Product Name": data.productName,
        "Quantity Sold": data.productQuantity,
        "Transaction Date": data.transactionDate,
      }));
  
      // Add the data rows starting from A3
      XLSX.utils.sheet_add_json(worksheet, jsonData, { origin: "A3", skipHeader: true });
  
      // Create a new workbook and append the worksheet
      const workbook: XLSX.WorkBook = { Sheets: { 'Today Stats': worksheet }, SheetNames: ['Today Stats'] };
  
      // Convert the workbook to a binary Excel file and initiate download
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Today_Stats_SMATO.xlsx`;
      link.click();
  
      this._snackBar.open('Downloaded successfully!', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else {
      alert('No data available to download!');
    }
  }
  
}
