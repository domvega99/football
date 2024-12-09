import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeagueService } from '../../../../services/league.service';
import { LeagueTeamsComponent } from '../league-teams/league-teams.component';
import { LeagueStandingsComponent } from './league-standings/league-standings.component';
import { LeagueTeamMatchComponent } from './league-team-match/league-team-match.component';

@Component({
  selector: 'app-league-details',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    RouterLink, 
    MatTableModule, 
    CommonModule, 
    MatTabsModule, 
    LeagueStandingsComponent,
    LeagueTeamsComponent,
    LeagueTeamMatchComponent
  ],
  templateUrl: './league-details.component.html',
  styleUrls: ['./league-details.component.sass']
})
export class LeagueDetailsComponent {
  leagueId: number | null = null;
  title: string | null = null;
  
  constructor(
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private leagueService: LeagueService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.leagueId = +params['id'];  
      this.getLeagueById(this.leagueId);
    });
  }

  getLeagueById(leagueId: number) {
    this.leagueService.getLeagueById(leagueId).subscribe({
      next: (res) => {
        this.title = res.title;
      },
      error: (err) => {
        console.error('Error fetching team:', err);
      }
    });
  }
}
