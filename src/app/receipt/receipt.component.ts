import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ChartofaccountService } from '../services/chartofaccount.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  // Products
  public allProducts: any[] = [];
  public filteredProducts: any[] = [];
  public productSearch = '';
  public selectedProduct: any;
  public selectedPrice: any;
  public quantity: any;
  public matchingProduct: any;

  // Cart
  public getAllReceipt: any[] = localStorage['smatorec']
    ? JSON.parse(localStorage['smatorec'])
    : [];
  public totalAmount: any;

  // Customer
  public nameOfCustomer: any = '';
  public address: any = '';

  // Accounts
  public accounts: any[] = [];
  public filteredAccounts: any[] = [];
  public accountSearch = '';
  public selectedAccount: any = '';

  // UI state
  public disableProcess: boolean = true;
  public disableadd: boolean = true;

  constructor(
    private _snackBar: MatSnackBar,
    public _userService: UserServiceService,
    public router: Router,
    private datePipe: DatePipe,
    private chartOfAccountService: ChartofaccountService
  ) {}

  ngOnInit(): void {
    this.getTotalAmount();

    this._userService.getAllProducts().subscribe((res: any) => {
      if (res.status == true) {
        this.allProducts = res.products;
        this.filteredProducts = [...this.allProducts];
      } else {
        this._snackBar.open(
          'Unable to fetch products, Kindly check your internet connection',
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

    this.fetchAllBankAndCashAccount();
  }

  fetchAllBankAndCashAccount() {
    this.chartOfAccountService
      .getBanksAccountAndCash()
      .subscribe((res: any) => {
        this.accounts = res.accounts;
        this.filteredAccounts = [...this.accounts];
      });
  }

  /** Filter products list based on search input */
  filterProducts(): void {
    const term = this.productSearch?.toLowerCase().trim() ?? '';
    this.filteredProducts = term
      ? this.allProducts.filter((p) =>
          p.productName?.toLowerCase().includes(term)
        )
      : [...this.allProducts];
  }

  /** Filter accounts list based on search input */
  filterAccounts(): void {
    const term = this.accountSearch?.toLowerCase().trim() ?? '';
    this.filteredAccounts = term
      ? this.accounts.filter((a) =>
          a.title?.toLowerCase().includes(term)
        )
      : [...this.accounts];
  }

  onProductSelectionChange() {
    // Reset search so next open shows all
    this.productSearch = '';
    this.filteredProducts = [...this.allProducts];

    this.matchingProduct = this.allProducts.find(
      (product: any) => product._id === this.selectedProduct
    );
    this.selectedPrice = this.matchingProduct.productPrice;
  }

  quantityCheck() {
    if (this.matchingProduct.productQuantity < this.quantity) {
      this.disableadd = true;
      this._snackBar.open(
        'The quantity you picked is more than available stock',
        'OK',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
        }
      );
    } else {
      this.disableadd = false;
    }
  }

  add() {
    let receiptObj = {
      productName: this.matchingProduct.productName,
      productId: this.matchingProduct._id,
      productQuantity: this.quantity,
      productPrice: this.matchingProduct.productPrice,
      totalPrice: this.quantity * this.matchingProduct.productPrice,
    };

    const getExistingId = this.getAllReceipt.find(
      (item: any) => item.productId == this.matchingProduct._id
    );

    if (getExistingId) {
      this._snackBar.open('This product is already in the list', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else {
      this.getAllReceipt.push(receiptObj);
      this.getTotalAmount();
      localStorage.setItem('smatorec', JSON.stringify(this.getAllReceipt));
      this.quantity = '';
      this.selectedProduct = '';
      this.selectedPrice = false;
      this.checkInputs();
    }
  }

  deleteItem(i: any) {
    this.getAllReceipt.splice(i, 1);
    this.getTotalAmount();
    localStorage.setItem('smatorec', JSON.stringify(this.getAllReceipt));
    this.checkInputs();
  }

  getTotalAmount() {
    this.totalAmount = 0;
    for (let i = 0; i < this.getAllReceipt.length; i++) {
      this.totalAmount += parseFloat(this.getAllReceipt[i].totalPrice);
    }
  }

  checkInputs() {
    if (
      this.nameOfCustomer &&
      this.address &&
      this.selectedAccount &&
      this.getAllReceipt?.length
    ) {
      this.disableProcess = false;
    } else {
      this.disableProcess = true;
    }
  }

  process() {
    const [month, day, year] = new Date().toLocaleDateString().split('/');

    let printObj = {
      nameOfCustomer: this.nameOfCustomer,
      address: this.address,
      date: this.datePipe.transform(
        new Date(),
        "EEE MMM dd yyyy HH:mm:ss 'GMT'Z (zzzz)"
      ),
      items: this.getAllReceipt,
      totalAmount: this.totalAmount,
      day: `${day}/${month}/${year}`,
      accountPaidInto_id: this.selectedAccount,
    };

    this._userService.getProcessReceipt(printObj).subscribe((res: any) => {
      if (res.status === true) {
        localStorage.removeItem('smatorec');
        this.nameOfCustomer = '';
        this.address = '';
        this.getAllReceipt = [];
        this.totalAmount = 0;
        this.selectedAccount = '';
        // Reset searches
        this.productSearch = '';
        this.accountSearch = '';
        this.filteredProducts = [...this.allProducts];
        this.filteredAccounts = [...this.accounts];
      }

      this.router.navigate(['preview', res.savedReceipt._id]);
    });
  }
}
