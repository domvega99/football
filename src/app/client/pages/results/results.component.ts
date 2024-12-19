import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../../services/api.service';
import { LeagueService } from '../../../services/league.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
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
    this.setTitle('BFL - Results');
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.getLeagueTeams();
  }

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
