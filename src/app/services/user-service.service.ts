import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private uriseg = environment.baseUrl;
  public responseItem: any;
  constructor(private http: HttpClient, private cache: CacheService) { }

  Register(inputdata: any) {
    const URI = this.uriseg + '/auth/register';

    return this.http.post(URI, inputdata);
  }
  VerifyEmail(inputdata: any) {
    const URI = this.uriseg + '/auth/verifyemail';
    return this.http.post(`${URI}`, inputdata);
  }

  Login(inputdata: any) {
    const URI = this.uriseg + '/auth/login';

    return this.http.post(URI, inputdata).pipe(
      map((response: any) => {
        this.responseItem = response;
        localStorage.setItem('token', JSON.stringify(this.responseItem.token));
        if (this.responseItem.refreshToken) {
          localStorage.setItem('refreshToken', JSON.stringify(this.responseItem.refreshToken));
        }
      })
    );
  }
  IsLoggedIn() {
    return localStorage.getItem('token') != null;
  }

  GetDashboard(token: any) {
    return this.http.get(`${this.uriseg}/user/dashboard`);
  }
  GetCurrentUser(currentUser: any) {
    return this.http.get(`${this.uriseg}/user/currentuser/${currentUser}`);
  }

  GetAddProduct(productDetails: any) {
    return this.http.post(`${this.uriseg}/product/addProduct`, productDetails);
  }
  getAllProducts() {
    // fetchallProducts is a full list used for receipt item selection — cache for 2 min
    return this.cache.get('products:all', () =>
      this.http.get(`${this.uriseg}/product/fetchallProducts`),
      2 * 60 * 1000
    );
  }

  getallproducts(page: number = 1, pageSize: number = 20, search?: string) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get(`${this.uriseg}/product/allProducts`, { params });
  }

  getDeleteProduct(deletedId: any) {
    return this.http.post(`${this.uriseg}/product/deleteproduct`, deletedId);
  }

  getEditedProduct(editedId: any, editedData: any) {
    return this.http.post(
      `${this.uriseg}/product/deleteproduct/${editedId}`,
      editedData
    );
  }
  AddMoreToProduct(productDetails: any) {
    return this.http.post(`${this.uriseg}/product/addMoreToProduct`, productDetails);
  }

  getProcessReceipt(receiptDetails: any) {
    return this.http.post(`${this.uriseg}/receipt/addReceipt`, receiptDetails);
  }

  getPrintDetails(receiptId: any) {
    return this.http.get(`${this.uriseg}/receipt/getReceipt/${receiptId}`);
  }

  GetTodaySale(date: any) {
    return this.http.post(`${this.uriseg}/receipt/getTodaysale`, date);
  }
  getAllReceipt() {
    return this.http.get(`${this.uriseg}/receipt/allReceipt`);
  }
  getAllReceipts(page: number = 1, pageSize: number = 20, search?: string) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get(`${this.uriseg}/receipt/allReceipt`, { params });
  }
  editProfile(data: any) {
    return this.http.post(`${this.uriseg}/user/updateProfile`, data);
  }
  getaddHistory(data: any) {
    return this.http.post(`${this.uriseg}/history/addHistory`, data);
  }
  getHistory() {
    return this.http.get(`${this.uriseg}/history/allHistory`);
  }

  getdeleteReceipt(data: any) {
    return this.http.post(`${this.uriseg}/receipt/deleteReceipt`, data);
  }
  getTodaysStats(data: any) {
    return this.http.post(`${this.uriseg}/receipt/getTodaystats`, data);
  }

  getTotalExpenses() {
    return this.http.get(`${this.uriseg}/user/getTotalExpenses`,);
  }

  downloadSales(start_date: string, end_date: string) {
    return this.http.get(`${this.uriseg}/receipt/downloadsales/?start_date=${start_date}&end_date=${end_date} `,);
  }
  fetchTheLastSevenReceipts() {
    return this.http.get(`${this.uriseg}/receipt/fetchTheLastSevenReceipts`,);
  }

  calculateTotalRevenueForEachMonth() {
    return this.http.get(`${this.uriseg}/receipt/calculateTotalRevenueForEachMonth`,);
  }

  getAllStaffs() {
    // Staffs rarely change — cache for 5 min
    return this.cache.get('staffs:all', () =>
      this.http.get(`${this.uriseg}/user/getallStaffs`)
    );
  }
  getSearchedReceipt(data: any) {
    return this.http.get(`${this.uriseg}/receipt/searchReceipt/${data}`);

  }

  addPaymentForExitingReceipt(data: any) {
    return this.http.post(`${this.uriseg}/receipt/addpaymentforexistingreceipt`, data);
  }
  updateReceiptDate(data: any) {
    return this.http.post(`${this.uriseg}/receipt/updateReciptDate`, data);
  }
  getRangeofSales(data:any){
    return this.http.post(`${this.uriseg}/receipt/getRangeSales`, data);
  }
}
