import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CupTeamService {

  constructor(private _http: HttpClient) { }

  addCupTeam(data: any): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/cup-teams`, data);
  }

  updateCupTeams(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/cup-teams/${id}`, data);
  }

  getCupTeams(cupId: number): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/cup-teams/${cupId}`);
  }

  getCupsByGroup(cupId: number): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/cup-teams/cup/${cupId}`);
  }
}
