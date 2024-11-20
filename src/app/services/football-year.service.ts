import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FootballYearService {
  constructor(private http: HttpClient) { }

  addFootballYear(data: any): Observable<any> {
    return this.http.post(environment.apiUrl+`/football/football-year`, data);
  }

  updateFootballYear(id: number, data: any): Observable<any> {
    return this.http.patch(environment.apiUrl+`/football/football-year/${id}`, data);
  }

  getFootballYearById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/football-year/${id}`);
  }

  getFootballYears(): Observable<any> {
    return this.http.get(environment.apiUrl+`/football/football-year`);
  }

  deleteFootballYear(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl+`/football/football-year/${id}`)
  }
}
