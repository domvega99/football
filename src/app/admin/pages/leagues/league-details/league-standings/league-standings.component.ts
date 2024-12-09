import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { LeagueTeamService } from '../../../../../services/league-team.service';
import { ScoreUpdateService } from '../../../../../services/score-league.service';
import { LeagueTeamDialogComponent } from '../league-team-dialog/league-team-dialog.component';
import { LeagueTeamUpdateComponent } from '../league-team-update/league-team-update.component';

@Component({
  selector: 'app-league-standings',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    MatTableModule, 
    CommonModule, 
    MatTabsModule, 
  ],
  templateUrl: './league-standings.component.html',
  styleUrl: './league-standings.component.sass'
})
export class LeagueStandingsComponent {
  displayedColumns: string[] = ['position', 'team_id', 'played', 'won', 'drawn', 'lost', 'goals_for', 'goals_against', 'goals_difference', 'points', 'stat'];
  leagueId: number | null = null;
  dataSource!: MatTableDataSource<any>;
  leagueGroupData: any[] = [];
  imagePath: string | null = null;
  title: string | null = null;
  
  constructor(
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private leagueTeamService: LeagueTeamService,
    private scoreUpdateService: ScoreUpdateService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this._configService.URL_IMAGE}`;
    console.log(this.imagePath)
    this.route.params.subscribe(params => {
      this.leagueId = +params['id'];  
      this.getLeagueTeams(this.leagueId);
    });
    this.scoreUpdateService.scoreUpdated$.subscribe(() => {
      if (this.leagueId !== null) {
        this.getLeagueTeams(this.leagueId); 
      }
    });
  }

  getLeagueTeams(leagueId: number) {
    this.leagueTeamService.getLeagueTeamsbyGroup(leagueId).subscribe({
      next: (res) => {
        this.leagueGroupData = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // getLeagueTeams(leagueId: number) {
  //   this.leagueTeamService.getLeagueTeams(leagueId).subscribe({
  //     next: (res) => {
  //       const activeTeams = res.filter((team: any) => team.stat !== 0);
  //       const inactiveTeams = res.filter((team: any) => team.stat === 0);
  
  //       activeTeams.sort((a: any, b: any) => {
  //         if (b.points !== a.points) {
  //           return b.points - a.points; 
  //         } else if (b.goals_for !== a.goals_for) {
  //           return b.goals_for - a.goals_for; 
  //         } else {
  //           return b.goals_difference - a.goals_difference; 
  //         }
  //       });
  
  //       const sortedTeams = [...activeTeams, ...inactiveTeams];
  //       sortedTeams.forEach((element: any, index: number) => {
  //         element.position = index + 1;
  //       });
  
  //       this.dataSource = new MatTableDataSource(sortedTeams);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }

  openDialog(): void {
    const dialogRef = this.dialog.open(LeagueTeamDialogComponent, {
      data: { leagueId: this.leagueId }
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.leagueId !== null) {
          this.getLeagueTeams(this.leagueId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(LeagueTeamUpdateComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.leagueId !== null) {
          this.getLeagueTeams(this.leagueId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
