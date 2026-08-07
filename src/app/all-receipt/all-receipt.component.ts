import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-all-receipt',
  templateUrl: './all-receipt.component.html',
  styleUrls: ['./all-receipt.component.css'],
})
export class AllReceiptComponent implements OnInit {
  public allReceipt: any[] = [];
  public loader = false;
  currentPage = 1;
  pageSize = 20;
  searchQuery = '';
  hasNextPage = false;

  constructor(private router: Router, private service: UserServiceService) {}

  ngOnInit(): void {
    this.loader = true;
    this.fetchAllReceipts();
  }

  fetchAllReceipts() {
    this.loader = true;
    this.service
      .getAllReceipts(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe((res: any) => {
        if (res.status == true) {
          this.loader = false;
          this.allReceipt = res.receipts;
          // Track whether a next page exists so the button disables correctly
          this.hasNextPage = res.hasNextPage ?? false;
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
    // Only advance if the API confirmed there is a next page
    if (this.hasNextPage) {
      this.currentPage++;
      this.fetchAllReceipts();
    }
  }

  search() {
    this.currentPage = 1;
    this.fetchAllReceipts();
  }

  print(i: any) {
    // Use the receipt's own _id — no index arithmetic needed
    const id = this.allReceipt[i]._id;
    this.router.navigate(['previewshowall', id]);
  }
}
