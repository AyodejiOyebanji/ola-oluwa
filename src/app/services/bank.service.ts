import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private uriseg = environment.baseUrl;
  public responseItem : any;
  constructor(private http: HttpClient) { }


  addBank(data:any){
    return this.http.post(`${this.uriseg}/bank/addbank`, data);
  }

  fetchBank(){
    return this.http.get(`${this.uriseg}/bank/getbanks`, );
  }
}
