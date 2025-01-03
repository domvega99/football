import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatchService } from '../../../services/match.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    RouterLink
  ],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.sass'
})
export class MatchesComponent {

  fixtures: any[] = [];
  imagePath: string | null = null;

  constructor(
    private matchService: MatchService,
    private configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.getLeagueTeams();
  }

  getLeagueTeams() {
    this.matchService.getFixtureMatches(5).subscribe({
      next: (res: any) => {
        this.fixtures = res; 
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
}
