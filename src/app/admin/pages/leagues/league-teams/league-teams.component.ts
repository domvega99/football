import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../../core/core.service';
import { ApiService } from '../../../../services/api.service';
import { LeagueService } from '../../../../services/league.service';
import { TeamService } from '../../../../services/team.service';
import { LeagueTeamAddEditComponent } from './league-team-add-edit/league-team-add-edit.component';

@Component({
  selector: 'app-league-teams',
  standalone: true,
  imports: [ 
    CommonModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatIconModule, 
    MatSnackBarModule
  ],
  templateUrl: './league-teams.component.html',
  styleUrl: './league-teams.component.sass'
})
export class LeagueTeamsComponent {
  displayedColumns: string[] = ['logo', 'clubId', 'groupId', 'action'];
  leagueId: number | null = null;
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog, 
    private route: ActivatedRoute,
    private teamService: TeamService,
    private leagueService: LeagueService,
    private coreService: CoreService,
    private configService: ApiService,
  ) {}

  ngOnInit(): void {
    
    this.imagePath =`${this.configService.URL_IMAGE}`;
    this.route.params.subscribe(params => {
      this.leagueId = +params['id'];  
      this.getTeams(this.leagueId);
    });
  }
  
  openAddEditTeamForm() {
    const dialogRef = this.dialog.open(LeagueTeamAddEditComponent, {
      data: { leagueId: this.leagueId }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          if (this.leagueId) {
            this.getTeams(this.leagueId);
          }
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getTeams(leagueId: number) {
    this.leagueService.fetchLeagueTeams(leagueId).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.leagueTeams);
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(LeagueTeamAddEditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          if (this.leagueId) {
            this.getTeams(this.leagueId);
          }
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
