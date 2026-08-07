import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ActtypeService {
  private uriseg = environment.baseUrl;
  public responseItem: any;

  constructor(private http: HttpClient, private cache: CacheService) { }

  addActType(data: any) {
    this.cache.invalidate('acttypes:all');
    return this.http.post(`${this.uriseg}/account_type/add_act_type`, data);
  }

  getActTypes() {
    // Account types are static reference data — cache for 10 min
    return this.cache.get('acttypes:all', () =>
      this.http.get(`${this.uriseg}/account_type/getaccounts`),
      10 * 60 * 1000
    );
  }
}
