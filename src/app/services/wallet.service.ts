import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private uriseg = environment.baseUrl;
  public responseItem : any;
  constructor(private http: HttpClient) { }

  addWallet(data:any){
    return this.http.post(`${this.uriseg}/wallet/add-wallet`,data);
  }

  fetchWallet(){
    return this.http.get(`${this.uriseg}/wallet/get-wallets`,);
  }

  fetchEachWallet(data:any){
    return this.http.get(`${this.uriseg}/wallet/get-wallet/${data}`,);
  }
  addDeduction(data:any){
    return this.http.post(`${this.uriseg}/wallet/add-deduction`,data);
  }
  deleteWallet(data:any){
    return this.http.post(`${this.uriseg}/wallet/delete-wallet`,data);

  }
}
