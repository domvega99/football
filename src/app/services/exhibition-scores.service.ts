import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionScoreService {
  constructor(private _http: HttpClient) { }

  addExhibitionScore(data: any): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/exhibition-scores`, data);
  }

  updateExhibitionScore(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/exhibition-scores/${id}`, data);
  }

}