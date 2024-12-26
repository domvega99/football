import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiService } from '../../../../../services/api.service';
import { CupTeamService } from '../../../../../services/cup-team.service';
import { TeamService } from '../../../../../services/team.service';

interface Team {
  id: number;  
  team: string; 
  stat: number;
  file_name?: string;
}

@Component({
  selector: 'app-cup-team-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatSlideToggleModule, 
    FormsModule, 
    MatListModule, 
    MatButtonModule
  ],
  templateUrl: './cup-team-dialog.component.html',
  styleUrl: './cup-team-dialog.component.sass'
})
export class CupTeamDialogComponent {
  teams: Team[] = [];
  cupId: number | null = null;
  imagePath: string | null = null;

  constructor(
    private teamService: TeamService,
    private cupTeamService: CupTeamService,
    public dialogRef: MatDialogRef<CupTeamDialogComponent>,
    private configService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cupId = data.cupId;
  }

  ngOnInit(): void {
    this.imagePath =`${this.configService.URL_IMAGE}`;
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams().subscribe({
      next: (res: Team[]) => {
        this.teams = res.map((team: Team) => ({
          ...team,
          stat: 1
        }));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onToggleChange(team: Team, event: any) {
    team.stat = event.checked ? 1 : 0;
  }

  onSubmit() {
    const selectedTeams = this.teams
      .filter(team => team.stat === 1)
      .map(team => ({ team_id: team.id, stat: team.stat, league_id: this.cupId }));

    this.cupTeamService.addCupTeam(selectedTeams).subscribe({
      next: (response) => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error adding teams:', error);
      }
    });
  }
}
