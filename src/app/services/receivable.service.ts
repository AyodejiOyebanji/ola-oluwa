import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReceivableService {
  private uriseg = environment.baseUrl;
  public responseItem : any;
  constructor(private http: HttpClient) { }

  addReceivable(data:any){
    return this.http.post(`${this.uriseg}/receivables/add-receivable`,data);
  }

  fetchTotalReceivables(){
    return this.http.get(`${this.uriseg}/receivables/get-total-receivables`,);
  }


  fetchReceivables(page: number = 1, pageSize: number = 20, search?: string) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get(`${this.uriseg}/receivables/get-receivables`, { params });
  }
  fetchEachreceivable(data:any){
    return this.http.get(`${this.uriseg}/receivables/get-receivable/${data}`,);
  }
  addPayment(data:any){
    return this.http.post(`${this.uriseg}/receivables/add-payment`,data);
  }
  deleteReceivable(data:any){
    return this.http.post(`${this.uriseg}/receivables/delete-receivables`,data);
  }

}
