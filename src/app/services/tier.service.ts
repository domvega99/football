import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TierService {
  constructor(private http: HttpClient) { }

  addTier(data: any): Observable<any> {
    return this.http.post(environment.apiUrl+`/football/tiers`, data);
  }

  updateTier(id: number, data: any): Observable<any> {
    return this.http.patch(environment.apiUrl+`/football/tiers/${id}`, data);
  }

  getTierById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/tiers/${id}`);
  }

  getTiers(): Observable<any> {
    return this.http.get(environment.apiUrl+`/football/tiers`);
  }

  deleteTier(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl+`/football/tiers/${id}`)
  }
}
