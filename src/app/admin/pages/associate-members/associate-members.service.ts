import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AssociateMemberService {

  constructor(private http: HttpClient) { }

  addAssociateMember(data: any): Observable<any> {
    return this.http.post(environment.apiUrl+`/football/associaten-members`, data);
  }

  updateAssociateMember(id: number, data: any): Observable<any> {
    return this.http.patch(environment.apiUrl+`/football/associaten-members/${id}`, data);
  }

  getAssociateMemberById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/associaten-members/${id}`);
  }

  getAssociateMembers(): Observable<any> {
    return this.http.get(environment.apiUrl+`/football/associaten-members`);
  }

  deleteAssociateMember(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl+`/football/associaten-members/${id}`)
  }

}
