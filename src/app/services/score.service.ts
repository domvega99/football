import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private _http: HttpClient) { }

  addScore(data: any): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/scores`, data);
  }

  updateScore(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/scores/${id}`, data);
  }

//   getTeams(): Observable<any> {
//     return this._http.get(environment.apiUrl+`/football/teams`);
//   }

//   deleteTeam(id: number): Observable<any> {
//     return this._http.delete(environment.apiUrl+`/football/teams/${id}`)
//   }

//   uploadImage(image: File) {
//     const formData = new FormData();
//     formData.append('image', image);

//     return this._http.post<any>(environment.apiUrl+`/upload/image`, formData);
//   }
}