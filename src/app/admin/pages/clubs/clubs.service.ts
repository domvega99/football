import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  addClub(data: any): Observable<any> {
    return this.http.post(environment.apiUrl+`/football/clubs`, data);
  }

  updateClub(id: number, data: any): Observable<any> {
    return this.http.patch(environment.apiUrl+`/football/clubs/${id}`, data);
  }

  getClubById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/clubs/${id}`);
  }

  getClubs(): Observable<any> {
    return this.http.get(environment.apiUrl+`/football/clubs`);
  }

  deleteClub(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl+`/football/clubs/${id}`)
  }

  getClubbySlug(slug: string): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/clubs/slug/${slug}`);
  }

  getSquadByClubId(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/clubs/${id}/squad`);
  }

}
