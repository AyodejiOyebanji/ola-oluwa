import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentlogsService {
  private uriseg = environment.baseUrl;
  public responseItem : any;
  constructor(private http: HttpClient) { }

  fetchPaymentLogs(){
    return this.http.get(`${this.uriseg}/paymentlogs/fetchpaymentlogs`, );
  }
  fetchSummaryforCreditAndDebit(){
    return this.http.get(`${this.uriseg}/paymentlogs/fetchSummaryforCreditAndDebit`, );
  }
  
}
