import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendlyMatchService {

  constructor(private _http: HttpClient) { }

  addFriendlyMatch(data: any): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/friendly-matches`, data);
  }

  updateFriendlyMatch(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/friendly-matches/${id}`, data);
  }

  getFriendlyMatchById(id: number): Observable<any> {
    return this._http.get(environment.apiUrl + `/football/friendly-matches/${id}`);
  }

  getFriendlyMatches(): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/friendly-matches`);
  }

  deleteFriendlyMatch(id: number): Observable<any> {
    return this._http.delete(environment.apiUrl+`/football/friendly-matches/${id}`)
  }

  getFriendlyMatchesByLeague(leagueId: number): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/friendly-matches/league/${leagueId}`);
  }
}
