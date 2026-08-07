import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VoucherpaymentService {
  private uriseg = environment.baseUrl;
  public responseItem : any;
  constructor(private http: HttpClient) { }

  createVoucherPayment(data:any){
    return this.http.post(`${this.uriseg}/voucherpayment/createvoucherpayment`,data);
  
  }


  fetchPaymentsForVoucher(data:any){
    return this.http.get(`${this.uriseg}/voucherpayment/approve-voucher/${data}`,);
  }

  createMaterialVoucherPayment(data:any){
    return this.http.post(`${this.uriseg}/voucherpayment/createMaterialvoucherpayment`,data);
  
  }
}
