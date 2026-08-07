import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../services/user-service.service';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent {
  public myForm!: FormGroup;
  public response: any;
  loading = false;
  errorResp?: any;
  errorMessage?: any;
  status?: boolean;
  public currentUserEmail: any;
  public currentUserDetails: any;
  public item: any = '';
  public description: any = '';
  public amount: any = '';
  public quantity: any = '';
  public date: any = '';
  public total: any = '';
  public inventoryList: any;
  
  public loader = false;
  currentPage = 1;
  pageSize = 20;
  searchQuery = '';
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public _userService: UserServiceService,
    private inventoryservice: InventoryService
  ) {}

  ngOnInit(): void {
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
      });
    this.fetchAllInventory();
  }
  createInvt() {
    if (
      this.item == '' &&
      this.description == '' &&
      this.quantity == '' &&
      this.date == '' &&
      this.amount == ''
    ) {
      this._snackBar.open('Fill all the fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else if (
      this.item == '' ||
      this.description == '' ||
      this.quantity == '' ||
      this.amount == '' ||
      this.date == ''
    ) {
      this._snackBar.open('Fill all the missing fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else {
      let inventoryObj = {
        item: this.item,
        description: this.description,
        quantity: this.quantity,
        amount: this.amount,
        date: this.date,
        uploadedBy: this.currentUserDetails.smato_id,
        total: this.quantity * this.amount,
      };
      this.inventoryservice.addInventory(inventoryObj).subscribe(
        (res: any) => {
          if (res.status == true) {
            this.fetchAllInventory();
            this.item = '';
            this.description = '';
            this.quantity = '';
            this.date = '';
            this.amount = '';
            this._snackBar.open(res.message, 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['green-snackbar', 'login-snackbar'],
            });
          } else {
            this._snackBar.open('Failed to add Inventory', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['red-snackbar', 'login-snackbar'],
            });
          }
        },
        (err) => {
          if (err) {
            this._snackBar.open(
              'An error occurred while adding Inventory',
              'OK',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
                panelClass: ['red-snackbar', 'login-snackbar'],
              }
            );
          }
        }
      );
    }
  }

  deleteItem(i: any) {
    let deletedId = this.inventoryList[i]._id;
    this.inventoryservice.deleteInventory({deletedId}).subscribe((res:any)=>{

      if (res.status == true) {
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
        this.fetchAllInventory()
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
    })
    
  }
  fetchAllInventory() {
    this.inventoryservice.fetchAllInventory(this.currentPage, this.pageSize, this.searchQuery).subscribe((res: any) => {
      if (res.status == true) {
       

        this.loader = false;
      
        this.inventoryList = res.inventory;
        this.hasNextPage = res.hasNextPage;
        this.hasPreviousPage = this.currentPage > 1;
      } else {
        this._snackBar.open(
          'Unable to fetch inventory, Kindly check your internet connection',
          'OK',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['green-snackbar', 'login-snackbar'],
          }
        );
      }
    });
  }
  fetchPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchAllInventory()
    }
  }

  fetchNextPage() {
    if (this.hasNextPage) {
      // Only fetch next page if there is a next page
      this.currentPage++;
     this.fetchAllInventory()
    }
  }
  search() {
    this.currentPage = 1; // Reset to the first page when searching
    this.fetchAllInventory()
  }
}
