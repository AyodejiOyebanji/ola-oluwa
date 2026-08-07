import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private uriseg = environment.baseUrl;
  public responseItem : any;
  private refreshSubject = new BehaviorSubject<boolean>(false);

  // Observable that other components can subscribe to
  refresh$ = this.refreshSubject.asObservable();
  constructor(private http: HttpClient) { }

  createPayroll(data:any){
    return this.http.post(`${this.uriseg}/payroll/createpayroll`,data);
  }
  fetchAllPayroll(){
    return this.http.get(`${this.uriseg}/payroll/fetchallpayroll`,);
  }

  fetcheachpayroll(data:any){
    return this.http.get(`${this.uriseg}/payroll/fetcheachpayroll/${data}`,);
  }

  triggerRefresh() {
    this.refreshSubject.next(true);
  }
  downloadExcel(payroll_id:any, option:any ){
    return this.http.get(`${this.uriseg}/payroll/downloadpayroll/?payroll_id=${payroll_id}&option=${option}`,);
  }
}
