import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { TeamService } from '../../../../../services/team.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { LeagueTeamService } from '../../../../../services/league-team.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

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
    MatTableModule,
    MatSlideToggleModule, 
    FormsModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './league-team-dialog.component.html',
  styleUrls: ['./league-team-dialog.component.sass']
})
export class LeagueTeamDialogComponent implements OnInit {

  displayedColumns: string[] = ['team', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTeams() {
    this.teamService.getTeams().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onToggleChange(team: Team, event: any) {
    team.stat = event.checked ? 1 : 0;
  }

  onSubmit() {
    const selectedTeams = this.dataSource.data
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
