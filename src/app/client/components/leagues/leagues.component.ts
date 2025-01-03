import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { LeagueService } from '../../../services/league.service';

@Component({
  selector: 'app-leagues',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatIconModule, RouterLink],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.sass'
})
export class LeaguesComponent {
  leagues: any[] = [];
  imagePath: string | null = null;
  displayedColumns: string[] = ['position', 'team', 'played', 'gd', 'points'];

  constructor(
    private leagueService: LeagueService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this._configService.URL_IMAGE}`;
    this.getLeagueTeams();
  }

  getLeagueTeams() {
    this.leagueService.getLeagueTeams().subscribe({
      next: (res) => {
        this.leagues = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
