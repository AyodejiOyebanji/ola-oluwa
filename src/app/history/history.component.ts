import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../services/user-service.service';
import { HistoryService } from '../services/history.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  public allHistory: any[];
  public filteredHistory: any[];
  public filterDate: string;
  public  searchQuery = '';
  public currentUserEmail: any;
  public currentUserDetails: any;
  public loader = false;
  currentPage = 1;
  pageSize = 20;

  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    private _snackBar: MatSnackBar,
    public _userService: UserServiceService,
    public historyService: HistoryService
  ) {
    this.allHistory = [];
    this.filteredHistory = [];
    this.filterDate = '';
  }

  ngOnInit(): void {
    this.fetchHistoryService();
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
    .GetCurrentUser(this.currentUserEmail)
    .subscribe((res: any) => {
      this.currentUserDetails = res.currentUser;
  
      

      
  
      
    });
  }
  fetchHistoryService() {
    this.historyService.fetchProductHistory(this.currentPage, this.pageSize, this.searchQuery).subscribe((res: any) => {
      this.allHistory = res.history;
      // Populate hasNextPage so the Next button disables when there are no more pages
      this.hasNextPage = res.hasNextPage ?? false;
    });
  }

  formatDate(inputDate: string | Date): string {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(inputDate, 'yyyy-MM-dd');
    return formattedDate || ''; 
  } 
  fetchPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchHistoryService()
    }
  }

  fetchNextPage() {
    if (this.hasNextPage) {
      // Only fetch next page if there is a next page
      this.currentPage++;
   this.fetchHistoryService()
    }
  }
  search() {
    this.currentPage = 1; // Reset to the first page when searching
     this.fetchHistoryService()
  }
}
