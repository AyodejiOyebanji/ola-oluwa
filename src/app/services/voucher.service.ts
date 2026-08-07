import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  private uriseg = environment.baseUrl;
  public responseItem : any;
  private refreshSubject = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshSubject.asObservable();
  constructor(private http: HttpClient) { }
  addVoucher(data:any){
    return this.http.post(`${this.uriseg}/voucher/addvoucher`,data);
  }
  getVouchers(){
    return this.http.get(`${this.uriseg}/voucher/getvouchers`,);
  }
  getVoucher(data:any){
   
     
    return this.http.get(`${this.uriseg}/voucher/getvoucher/${data}`,);
  }

  approveVoucher(data:any){
    return this.http.post(`${this.uriseg}/voucher/approve-voucher`,data);
  }


  triggerRefresh() {
    this.refreshSubject.next(true);
  }  
  downloadVoucher(start_date: string, end_date: string){
    return this.http.get(`${this.uriseg}/voucher/downloadvoucher/?start_date=${start_date}&end_date=${end_date} `, );
  }

}
