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

//   deleteTeam(id: number): Observable<any> {
//     return this._http.delete(environment.apiUrl+`/football/teams/${id}`)
//   }

//   uploadImage(image: File) {
//     const formData = new FormData();
//     formData.append('image', image);

//     return this._http.post<any>(environment.apiUrl+`/upload/image`, formData);
//   }
}
