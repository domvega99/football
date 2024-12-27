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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Team {
  id: number;  
  team: string; 
  stat: number;
  file_name?: string;
}

@Component({
  selector: 'app-league-team-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatSlideToggleModule, 
    FormsModule, 
    MatListModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './league-team-dialog.component.html',
  styleUrls: ['./league-team-dialog.component.sass']
})
export class LeagueTeamDialogComponent implements OnInit {

  teams: Team[] = [];
  filteredTeams: Team[] = [];
  searchTerm: string = '';
  leagueId: number | null = null;
  imagePath: string | null = null;

  constructor(
    private teamService: TeamService,
    private leagueTeamService: LeagueTeamService,
    public dialogRef: MatDialogRef<LeagueTeamDialogComponent>,
    private _configService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leagueId = data.leagueId;
  }

  ngOnInit(): void {
    this.imagePath = `${this._configService.URL_IMAGE}`;
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams().subscribe({
      next: (res: Team[]) => {
        this.teams = res.map((team: Team) => ({
          ...team,
          stat: 0
        }));
        this.filteredTeams = [...this.teams];  
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterTeams() {
    this.filteredTeams = this.teams.filter(team =>
      team.team.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onToggleChange(team: Team, event: any) {
    team.stat = event.checked ? 1 : 0;
  }

  onSubmit() {
    const selectedTeams = this.teams
      .filter(team => team.stat === 1)
      .map(team => ({ team_id: team.id, stat: team.stat, league_id: this.leagueId }));

    this.leagueTeamService.addLeagueTeam(selectedTeams).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error adding teams:', error);
      }
    });
  }
}
