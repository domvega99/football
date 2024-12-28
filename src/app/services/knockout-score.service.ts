import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KnocoutScoreService {
  constructor(private _http: HttpClient) { }

  addKnockoutScore(data: any, cupId: number): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/knockout-scores/cup/${cupId}`, data);
  }

  updateKnockoutScore(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/knockout-scores/cup/${id}`, data);
  }
}