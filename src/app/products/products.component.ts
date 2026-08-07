import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServiceService } from '../services/user-service.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  public pName: any;
  public price: any;
  public quantity: any;
  public date: any;
  public currentUserEmail: any;
  public currentUserDetails: any;
  public allProducts: any;
  public editedIndex: any;
  public edindex: any;
 
  public filteredProduct:any
  public MoreProduct=0
  public addmoreproduct:any
  public loader = false;
  currentPage = 1;
  pageSize = 20;
  searchQuery = '';
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;
  constructor(
    private _snackBar: MatSnackBar,
    public _userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
      });
      this.fetchAllProduct()
  }






  addProduct() {
    if (
      this.pName == '' &&
      this.price == '' &&
      this.quantity == '' &&
      this.date == ''
    ) {
      this._snackBar.open('Fill all the fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else if (
      this.pName == '' ||
      this.price == '' ||
      this.quantity == '' ||
      this.date == ''
    ) {
      this._snackBar.open('Fill all the missing fields', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['green-snackbar', 'login-snackbar'],
      });
    } else {
      let productObj = {
        productName: this.pName,
        productPrice: this.price,
        productQuantity: this.quantity,
        date: this.date,
        uploadedBy: this.currentUserDetails.smato_id,
      };

      this._userService.GetAddProduct(productObj).subscribe(
        (res: any) => {
          if (res.status == true) {
           this.fetchAllProduct()
            this.pName = '';
            this.price = '';
            this.quantity = '';
            this.date = '';
            this._snackBar.open(res.message, 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['green-snackbar', 'login-snackbar'],
            });
          } else {
            this._snackBar.open('Failed to add product', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['red-snackbar', 'login-snackbar'],
            });
          }
        },
        (err) => {
          if (err.status == 409) {
            this._snackBar.open('Product already exists', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['red-snackbar', 'login-snackbar'],
            });
          } else {
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
        }
      );
    }
  }

  editItem(i: any) {
    this.edindex = i;
    this.editedIndex = this.allProducts[i];
  }
  saveProduct() {
    const editedproductObj = {
      productName: this.pName || this.editedIndex?.productName,
      productPrice: this.price || this.editedIndex?.productPrice,
      productQuantity: this.quantity || this.editedIndex?.productQuantity,
      date: this.date || this.editedIndex?.date,
      uploadedBy: this.currentUserDetails.smato_id,
    };
    const editedId = this.allProducts[this.edindex]._id;

    

    
    this._userService
      .getEditedProduct(editedId, editedproductObj)
      .subscribe((res: any) => {
        if (res.status === true) {
          this.fetchAllProduct()
          // this.allProducts[this.edindex] = editedproductObj;
          this._snackBar.open(res.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          });
          this.editedIndex = null;
          this.pName = '';
          this.price = '';
          this.quantity = '';
          this.date = '';
        } else {
          this._snackBar.open(res.message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar', 'login-snackbar'],
          });
        }
      });
  }

  deleteItem(i: any) {
    let deletedId = this.allProducts[i]._id;
    this._userService.getDeleteProduct({ deletedId }).subscribe((res: any) => {
      if (res.status == true) {
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
        this.fetchAllProduct()
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
    });
  }
  
  fetchAllProduct(){
    this.loader = true;
    this._userService.getallproducts(this.currentPage, this.pageSize, this.searchQuery).subscribe((res: any) => {
    
      
      if (res.status == true) {
        this.loader = false;
        this.allProducts = res.products;
     
        
        this.hasNextPage = res.hasNextPage;
        this.hasPreviousPage = this.currentPage > 1;
      

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

  }
  addMoreProduct(product:any){
    this.addmoreproduct= product

  }
  AddMoreToProduct() {
    
    let moreObject={
      _id:this.addmoreproduct._id,
      productName:this.addmoreproduct.productName,
      productInitialQuantity: this.addmoreproduct.productQuantity,
      productAdded:this.MoreProduct
    }
  
    
    this._userService.AddMoreToProduct(moreObject).subscribe((res:any)=>{
      if (res.status === true) {
        this.fetchAllProduct()
        this.addmoreproduct=''
        this.MoreProduct=0
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
        
      } else {
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }
      
    })
    
    
  }
  fetchPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchAllProduct()
    }
  }

  fetchNextPage() {
    if (this.hasNextPage) {
      // Only fetch next page if there is a next page
      this.currentPage++;
      this.fetchAllProduct()
    }
  }
  search() {
    this.currentPage = 1; // Reset to the first page when searching
    this.fetchAllProduct()
  }
}
