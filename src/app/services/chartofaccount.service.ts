import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ChartofaccountService {

  private uriseg = environment.baseUrl;
  public responseItem: any;

  constructor(private http: HttpClient, private cache: CacheService) { }

  addAccount(data: any) {
    this.cache.invalidatePrefix('accounts:');
    return this.http.post(`${this.uriseg}/account/addaccount`, data);
  }

  fetchAccount() {
    // All accounts rarely change — cache for 5 min
    return this.cache.get('accounts:all', () =>
      this.http.get(`${this.uriseg}/account/getaccounts`)
    );
  }

  deleteAccount(data: any) {
    this.cache.invalidatePrefix('accounts:');
    return this.http.post(`${this.uriseg}/account/deleteaccount`, data);
  }

  getExpensesAccount() {
    return this.cache.get('accounts:expenses', () =>
      this.http.get(`${this.uriseg}/account/getExpensesAccount`)
    );
  }

  getBanksAccountAndCash() {
    return this.cache.get('accounts:banks', () =>
      this.http.get(`${this.uriseg}/account/getBankAccountsAndCash`)
    );
  }

  getRawMaterialAccount() {
    return this.cache.get('accounts:rawmaterial', () =>
      this.http.get(`${this.uriseg}/account/getRawMaterialAccount`)
    );
  }

  fetchAccountStatement(data: any) {
    // Statements can change frequently — no cache
    return this.http.get(`${this.uriseg}/account/getAccountstatement/${data}`);
  }
}
