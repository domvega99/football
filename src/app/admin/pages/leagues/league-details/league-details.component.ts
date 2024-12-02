import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeagueTeamDialogComponent } from './league-team-dialog/league-team-dialog.component';
import { LeagueTeamService } from '../../../../services/league-team.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { LeagueTeamUpdateComponent } from './league-team-update/league-team-update.component';
import { LeagueService } from '../../../../services/league.service';
import { MatTabsModule } from '@angular/material/tabs';
import { LeagueTeamMatchComponent } from './league-team-match/league-team-match.component';
import { ScoreUpdateService } from '../../../../services/score-league.service';
import { FriendlyMatchesComponent } from './friendly-matches/friendly-matches.component';
import { LeagueTeamsComponent } from '../league-teams/league-teams.component';

export interface PeriodicElement {
  position: number;
  team_id: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goals_difference: number;
  points: number;
  stat?: number;
  team: {
    file_name: string;
    team: string;
  }
}

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
    LeagueTeamMatchComponent,
    FriendlyMatchesComponent,
    LeagueTeamsComponent,
  ],
  templateUrl: './league-details.component.html',
  styleUrls: ['./league-details.component.sass']
})
export class LeagueDetailsComponent {

  displayedColumns: string[] = ['position', 'team_id', 'played', 'won', 'drawn', 'lost', 'goals_for', 'goals_against', 'goals_difference', 'points', 'stat'];
  leagueId: number | null = null;
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;
  title: string | null = null;
  
  constructor(
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private leagueTeamService: LeagueTeamService,
    private scoreUpdateService: ScoreUpdateService,
    private leagueService: LeagueService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this._configService.URL_IMAGE}`;
    this.route.params.subscribe(params => {
      this.leagueId = +params['id'];  
      this.getLeagueTeams(this.leagueId);
      this.getLeagueById(this.leagueId);
    });
    this.scoreUpdateService.scoreUpdated$.subscribe(() => {
      if (this.leagueId !== null) {
        this.getLeagueTeams(this.leagueId); 
      }
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
  

  getLeagueTeams(leagueId: number) {
    this.leagueTeamService.getLeagueTeams(leagueId).subscribe({
      next: (res) => {
        console.log(res)
        const activeTeams = res.filter((team: PeriodicElement) => team.stat !== 0);
        const inactiveTeams = res.filter((team: PeriodicElement) => team.stat === 0);
  
        activeTeams.sort((a: PeriodicElement, b: PeriodicElement) => {
          if (b.points !== a.points) {
            return b.points - a.points; 
          } else if (b.goals_for !== a.goals_for) {
            return b.goals_for - a.goals_for; 
          } else {
            return b.goals_difference - a.goals_difference; 
          }
        });
  
        const sortedTeams = [...activeTeams, ...inactiveTeams];
        sortedTeams.forEach((element: PeriodicElement, index: number) => {
          element.position = index + 1;
        });
  
        this.dataSource = new MatTableDataSource(sortedTeams);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  


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
