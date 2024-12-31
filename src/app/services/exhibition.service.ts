import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {

  constructor(private _http: HttpClient) { }
  
  addExhibition(data: any): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/exhibitions`, data);
  }

  getExhibitionById(id: number): Observable<any> {
    return this._http.get(environment.apiUrl + `/football/exhibitions/${id}`);
  }

  updateExhibition(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/exhibitions/${id}`, data);
  }

  getExhibitions(): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/exhibitions`);
  }

  getExhibitionMatches(): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/exhibitions/website/exhibition-match`);
  }

  deleteExhibition(id: number): Observable<any> {
    return this._http.delete(environment.apiUrl+`/football/exhibitions/${id}`)
  }
}
