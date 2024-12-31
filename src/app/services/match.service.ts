import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private _http: HttpClient) { }

  addMatch(data: any): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/matches`, data);
  }

  updateMatch(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/matches/${id}`, data);
  }

  getMatches(id: number): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/matches/${id}`);
  }

  getCupMatches(id: number): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/matches/cup/${id}`);
  }

  getExhibitionMatches(id: number): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/matches/exhibition/${id}`);
  }

  getKnockoutCupMatches(id: number): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/matches/knockout-cup/${id}`);
  }
}
