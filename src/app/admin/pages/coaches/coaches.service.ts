import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CoachService {

  constructor(private http: HttpClient) { }

  addCoach(data: any): Observable<any> {
    return this.http.post(environment.apiUrl+`/football/coaches`, data);
  }

  updateCoach(id: number, data: any): Observable<any> {
    return this.http.patch(environment.apiUrl+`/football/coaches/${id}`, data);
  }

  getCoachById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/coaches/${id}`);
  }

  getCoaches(): Observable<any> {
    return this.http.get(environment.apiUrl+`/football/coaches`);
  }

  deleteCoach(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl+`/football/coaches/${id}`)
  }

}
