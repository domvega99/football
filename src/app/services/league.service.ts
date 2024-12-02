import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  constructor(private _http: HttpClient) { }

  addLeague(data: any): Observable<any> {
    return this._http.post(environment.apiUrl+`/football/leagues`, data);
  }

  getLeagueById(id: number): Observable<any> {
    return this._http.get(environment.apiUrl + `/football/leagues/${id}`);
  }
  updateLeague(id: number, data: any): Observable<any> {
    return this._http.patch(environment.apiUrl+`/football/leagues/${id}`, data);
  }

  getLeagues(): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/leagues`);
  }

  getPostedLeagues(): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/leagues/website/leagues`);
  }

  getLeagueTeams(): Observable<any> {
    return this._http.get<any>(`${environment.apiUrl}/football/leagues/website/league-teams`).pipe(
      map((leagues) => {
        return leagues.map((league: any) => ({
          id: league.id,
          title: league.title,
          teams: league.teams
            .map((team: any) => ({
              team: team.team.team,
              file_name: team.team.file_name,
              played: team.played,
              won: team.won,
              drawn: team.drawn,
              lost: team.lost,
              gf: team.goals_for,
              ga: team.goals_against,
              gd: team.goals_difference,
              points: team.points,
            }))
            .sort((a: any, b: any) => {
              if (b.points !== a.points) {
                return b.points - a.points; 
              } else if (b.gd !== a.gd) {
                return b.gd - a.gd; 
              } else {
                return b.gf - a.gf;
              }
            })
            // .slice(0, 10),
        }));
      })
    );
  }

  getLeagueMatches(): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/leagues/website/league-match`);
  }

  fetchLeagueTeams(id: number): Observable<any> {
    return this._http.get(environment.apiUrl+`/football/leagues/${id}/teams`);
  }

  deleteLeague(id: number): Observable<any> {
    return this._http.delete(environment.apiUrl+`/football/leagues/${id}`)
  }
}
