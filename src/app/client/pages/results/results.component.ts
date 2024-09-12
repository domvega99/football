import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../../../services/league.service';
import { ApiService } from '../../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog} from '@angular/material/dialog';
import { Title } from '@angular/platform-browser'
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.sass'
})
export class ResultsComponent {
  leagueMatches: any[] = [];
  imagePath: string | null = null;
  constructor(
    private leagueService: LeagueService,
    private configService: ApiService,
    private _titleService: Title,
  )
  {}
  ngOnInit(): void {
    this.setTitle('Results');
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.getLeagueTeams();
  }

  // getLeagueTeams() {
  //   this.leagueService.getLeagueMatches().subscribe({
  //     next: (res) => {
  //       this.leagueMatches = res;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   })
  // }

  getLeagueTeams() {
    this.leagueService.getLeagueMatches().subscribe({
      next: (res: any[]) => {
        this.leagueMatches = res.map((league: any) => {
          return {
            ...league,
            matches: league.matches.map((matchDay: any) => {
              return {
                ...matchDay,
                matches: matchDay.matches.filter((match: any) =>
                  match.status === 'Posted' || match.status === 'Completed' || match.status === 'Live'
                )
              };
            })
          };
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  setTitle(newTitle: string) {
    this._titleService.setTitle(newTitle);
  }
}
