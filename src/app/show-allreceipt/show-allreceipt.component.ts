import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { CompanySettingsService } from '../services/company-settings.service';
@Component({
  selector: 'app-show-allreceipt',
  templateUrl: './show-allreceipt.component.html',
  styleUrls: ['./show-allreceipt.component.css'],
})
export class ShowAllreceiptComponent {
  public allReceipt: any;
  public currentUserEmail: any;
  public currentUserDetails: any;
  public loader = false;
  currentPage = 1;
  pageSize = 20;
  searchQuery = '';
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  public start_date: any = ''
  public end_date: any = ''
  public enditedDate: any
  public editedId: any

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private service: UserServiceService,
    private companySettingsService: CompanySettingsService
  ) { }
  ngOnInit(): void {
    this.loader = true;
    this.fetchAllReceipts();
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this.service
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;






      });

  }

  fetchAllReceipts() {
    this.loader = true;
    this.service
      .getAllReceipts(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe((res: any) => {


        if (res.status == true) {

          this.loader = false;
          this.allReceipt = res.receipts;
          this.hasNextPage = res.hasNextPage;
          this.hasPreviousPage = this.currentPage > 1;
        } else {
          this.loader = false;
        }
      });
  }
  fetchPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchAllReceipts();
    }
  }

  fetchNextPage() {
    if (this.hasNextPage) {
      // Only fetch next page if there is a next page
      this.currentPage++;
      this.fetchAllReceipts();
    }
  }
  search() {
    this.currentPage = 1; // Reset to the first page when searching
    this.fetchAllReceipts();
  }

  print(i: number) {

    const receiptId = this.allReceipt[i]._id;
    this.router.navigate(['previewshowall', receiptId]);
  }
  deleteReceipt(i: number): void {

    let deleteId = this.allReceipt[i]._id;

    this.service.getdeleteReceipt({ deleteId }).subscribe(
      (res: any) => {
        if (res && res.status === true) {
          this.fetchAllReceipts()
          this._snackBar.open(res.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
        } else {
          this._snackBar.open(
            res.message || 'Failed to delete receipt.',
            'OK',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['green-snackbar', 'login-snackbar'],
            }
          );
        }
      },
      (err: any) => {
        this._snackBar.open('Failed to delete receipt.', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
        });
      }
    );
  }

  download() {
    this.service.downloadSales(this.start_date, this.end_date)
      .subscribe((res: any) => {
        console.log(res);

        if (res.status === true) {
          const companyName = this.companySettingsService.getSettingsSnapshot().companyName;
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{ [companyName]: '' }], { header: [companyName], skipHeader: true });
          XLSX.utils.sheet_add_json(worksheet, res.receipts, { header: ['Customer', 'Amount', 'Day',] });

          // Create a workbook
          const workbook: XLSX.WorkBook = { Sheets: { 'Sales Data': worksheet }, SheetNames: ['Sales Data'] };

          // Convert the workbook to a binary Excel file and initiate download
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `sales_data_${this.start_date}_to_${this.end_date}.xlsx`;
          link.click();

          this._snackBar.open(`Downloaded successfully. Total Amount: ₦${res.totalAmount}`, 'OK', {
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
  convertDateFormat(date: string): string {
    const parts = date.split('/');  // Split the date string by "/"
    const day = String(parts[0]).padStart(2, '0');  // Ensure day is two digits
    const month = String(parts[1]).padStart(2, '0');  // Ensure month is two digits
    const year = parts[2];  // Year is already four digits, no padding needed

    return `${year}-${month}-${day}`;  // Return in YYYY-MM-DD format
  }




  editDate(i: number): void {
    this.enditedDate = this.convertDateFormat(this.allReceipt[i].day);  // Convert and set the selected date
    this.editedId = this.allReceipt[i]._id


  }
  convertDateToOriginalFormat(date: string): string {
    const parts = date.split('-');  // Split the date by "-"
    const day = parts[2];  // Get the day (DD)
    const month = parts[1];  // Get the month (MM)
    const year = parts[0];  // Get the year (YYYY)

    return `${day}/${month}/${year}`;  // Return in DD/MM/YYYY format
  }

  updateDate() {
    const formattedDate = this.convertDateToOriginalFormat(this.enditedDate); // Convert date to DD/MM/YYYY
    let dateObj = {
      day: formattedDate,
      _id: this.editedId  // Receipt ID to update
    };

    console.log(dateObj);

    // Make the API call to update the receipt date
    this.service.updateReceiptDate(dateObj).subscribe(
      (res: any) => {
        console.log('Update successful:', res);

        // Display a success message with the total amount (if available in the response)
       this. fetchAllReceipts()
        this._snackBar.open(
         res.message,
          'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
        }
        );
      },
      (error) => {
        console.error('Error updating receipt:', error);

        // Display an error message if something goes wrong
        this._snackBar.open(
          `Error updating receipt. Please try again.`,
          'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'error-snackbar'],
        }
        );
      }
    );
  }
}



