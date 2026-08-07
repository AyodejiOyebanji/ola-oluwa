import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialVoucherService {

  private uriseg = environment.baseUrl;
  public responseItem : any;
  private refreshSubject = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshSubject.asObservable ();
  constructor(private http: HttpClient) { }
  addMaterialVoucher(data:any){
    return this.http.post(`${this.uriseg}/rawmaterialvoucher/addMaterialVoucher`,data);
  }

  getVouchers(){
    return this.http.get(`${this.uriseg}/rawmaterialvoucher/getrawmaterialvouchers`,);
  }
  getMaterialVoucher(data:any){
    return this.http.get(`${this.uriseg}/rawmaterialvoucher/getrawmaterialvoucher/${data}`,);
  }

  approveVoucherMaterial(data:any) {
    return this.http.post(`${this.uriseg}/rawmaterialvoucher/approvevouchermaterial`,data);
  }
  triggerRefresh() {
    this.refreshSubject.next(true);
  }

  downloadVoucher(start_date: string, end_date: string){
    return this.http.get(`${this.uriseg}/rawmaterialvoucher/downloadvoucher/?start_date=${start_date}&end_date=${end_date} `, );
  }

}
