import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private uriseg = environment.baseUrl;
  public responseItem : any;
  constructor(private http: HttpClient) { }

  // fetchProductHistory(){
  //   return this.http.get(`${this.uriseg}/history/fetchProductHistory`,);
  // }
  fetchProductHistory(page: number = 1, pageSize: number = 20, search?: string) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get(`${this.uriseg}/history/fetchProductHistory`, { params });
  }

}
