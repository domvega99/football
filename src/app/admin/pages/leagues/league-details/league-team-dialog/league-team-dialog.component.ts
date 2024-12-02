import { Component, Inject, OnInit } from '@angular/core';
import { TeamService } from '../../../../../services/team.service';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { LeagueTeamService } from '../../../../../services/league-team.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../../../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { LeagueService } from '../../../../../services/league.service';

@Component({
  selector: 'app-league-team-dialog',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, FormsModule, MatListModule, MatButtonModule],
  templateUrl: './league-team-dialog.component.html',
  styleUrls: ['./league-team-dialog.component.sass']
})
export class LeagueTeamDialogComponent implements OnInit {

  teams: any[] = [];
  leagueId: number | null = null;
  imagePath: string | null = null;

  constructor(
    private teamService: TeamService,
    private leagueService: LeagueService,
    private leagueTeamService: LeagueTeamService,
    public dialogRef: MatDialogRef<LeagueTeamDialogComponent>,
    private _configService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leagueId = data.leagueId;
  }

  ngOnInit(): void {
    this.imagePath =`${this._configService.URL_IMAGE}`;
    if (this.leagueId) {
      this.getTeams(this.leagueId);
    }
  }

  getTeams(leagueId: number) {
    this.leagueService.fetchLeagueTeams(leagueId).subscribe({
      next: (res: any) => {
        this.teams = res.leagueTeams.map((team: any) => ({
          ...team,
          stat: 1
        }));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onToggleChange(team: any, event: any) {
    team.stat = event.checked ? 1 : 0;
  }

  onSubmit() {
    const selectedTeams = this.teams
      .filter(team => team.stat === 1)
      .map(team => ({ team_id: team.id, stat: team.stat, league_id: this.leagueId }));

    this.leagueTeamService.addLeagueTeam(selectedTeams).subscribe({
      next: (response) => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error adding teams:', error);
      }
    });
  }

}
