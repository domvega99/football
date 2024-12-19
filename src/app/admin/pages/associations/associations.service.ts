import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  constructor(private http: HttpClient) { }

  addAssociation(data: any): Observable<any> {
    return this.http.post(environment.apiUrl+`/football/associations`, data);
  }

  updateAssociation(id: number, data: any): Observable<any> {
    return this.http.patch(environment.apiUrl+`/football/associations/${id}`, data);
  }

  getAssociationById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `/football/associations/${id}`);
  }

  getAssociations(): Observable<any> {
    return this.http.get(environment.apiUrl+`/football/associations`);
  }

  deleteAssociation(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl+`/football/associations/${id}`)
  }

}
