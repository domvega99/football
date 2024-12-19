import { Component } from '@angular/core';
import { LeagueService } from '../../../services/league.service';
import { ApiService } from '../../../services/api.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatIconModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.sass'
})
export class TablesComponent {

  leagues: any[] = [];
  imagePath: string | null = null;
  displayedColumns: string[] = ['position', 'team', 'played', 'won', 'drawn', 'lost', 'goals_for', 'goals_against', 'goals_difference', 'points'];

  constructor(
    private leagueService: LeagueService,
    private _configService: ApiService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("BFL - Standings");
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
