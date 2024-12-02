import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { LeagueService } from '../../../services/league.service';

@Component({
  selector: 'app-fixtures',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './fixtures.component.html',
  styleUrl: './fixtures.component.sass'
})
export class FixturesComponent implements OnInit{

  leagueMatches: any[] = [];
  imagePath: string | null = null;
  constructor(
    private leagueService: LeagueService,
    private configService: ApiService,
    private _titleService: Title,
    private router: Router
  )
  {}
  ngOnInit(): void {
    this.setTitle('Fixtures');
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.getLeagueTeams();
  }

  getLeagueTeams() {
    this.leagueService.getLeagueMatches().subscribe({
      next: (res: any[]) => {
        this.leagueMatches = res.map((league: any) => {
          return {
            ...league,
            matches: league.matches
              .filter((matchDay: any) => 
                matchDay.matches.some((match: any) => match.status !== 'Completed' && match.status !== 'Live')
              )
              .map((matchDay: any) => {
                return {
                  ...matchDay,
                  matches: matchDay.matches
                    .filter((match: any) => match.status === 'Posted')
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

  onFixtureClick(matches: any) {
    this.router.navigate(['/quickview'], {
      state: { matches }
    });
  }
}
