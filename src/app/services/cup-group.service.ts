import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CupGroupService {

  constructor(private _http: HttpClient) { }

  addCupGroup(data: any): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/cup-groups`, data);
  }

  updateCupGroup(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/cup-groups/${id}`, data);
  }

  getCupGroupById(id: number): Observable<any> {
    return this._http.get(environment.apiUrl + `/football/cup-groups/${id}`);
  }

  getCupGroups(): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/cup-groups`, { withCredentials: true });
  }

  deleteCupGroup(id: number): Observable<any> {
    return this._http.delete(environment.apiUrl+`/football/cup-groups/${id}`)
  }
}
