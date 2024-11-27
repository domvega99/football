import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamGroupsService {

  constructor(private http: HttpClient) { }

  addTeamGroup(data: any): Observable<any> {
    return this.http.post(environment.apiUrl+`/football/team-groups`, data);
  }

  updateTeamGroup(id: number, data: any): Observable<any> {
    return this.http.patch(environment.apiUrl+`/football/team-groups/${id}`, data);
  }

  getTeamGroupById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/team-groups/${id}`);
  }

  getTeamGroups(): Observable<any> {
    return this.http.get(environment.apiUrl+`/football/team-groups`);
  }

  deleteTeamGroup(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl+`/football/team-groups/${id}`)
  }
}
