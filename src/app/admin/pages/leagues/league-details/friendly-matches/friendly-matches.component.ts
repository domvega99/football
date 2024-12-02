import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../../../../services/match.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScoreUpdateService } from '../../../../../services/score-league.service';
import { FriendlyMatchAddEditComponent } from './friendly-match-add-edit/friendly-match-add-edit.component';
import { FriendlyMatchService } from '../../../../../services/friendly-match.service';
import { FriendlyMatchTeamAComponent } from './friendly-match-team-a/friendly-match-team-a.component';
import { FriendlyMatchTeamBComponent } from './friendly-match-team-b/friendly-match-team-b.component';
import { FriendlyMatchScoreComponent } from './friendly-match-score/friendly-match-score.component';

@Component({
  selector: 'app-friendly-matches',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatTableModule, 
    CommonModule, 
    MatIconModule, 
    MatTooltipModule
  ],
  providers: [
    DatePipe,
  ],
  templateUrl: './friendly-matches.component.html',
  styleUrl: './friendly-matches.component.sass'
})
export class FriendlyMatchesComponent {
  leagueId: number | null = null;
  displayedColumns: string[] = ['match_date', 'match_time', 'location', 'teamA', 'teamResult', 'teamB', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  constructor(
    private dialog: MatDialog, 
    private route: ActivatedRoute,
    private friendlyMatchService: FriendlyMatchService,
    private scoreUpdateService: ScoreUpdateService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.leagueId = +params['id'];  
      this.getFriendlyMatches(this.leagueId);
    });
    this.imagePath = `${this._configService.URL_IMAGE}`;
  }

  openEditAdd() {
    const dialogRef = this.dialog.open(FriendlyMatchAddEditComponent, {
      data: { leagueId: this.leagueId }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.leagueId) {
          this.getFriendlyMatches(this.leagueId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  
  getFriendlyMatches(leagueId: number) {
    this.friendlyMatchService.getFriendlyMatchesByLeague(leagueId).subscribe({
      next: (res: any[]) => {
        res.forEach(match => {
          match.matchTime = new Date(`2000-01-01T${match.match_time}`);
        });
        res.sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
        this.dataSource = new MatTableDataSource(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addTeamA(id: number, teamAId: number) {
    const dialogRef = this.dialog.open(FriendlyMatchTeamAComponent, {
      data: { friendlyMatchId: id, teamAId: teamAId}
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (this.leagueId) {
          console.log('Dialog closed, refreshing matches...');
          this.getFriendlyMatches(this.leagueId); 
        }
      },
      error: (err) => {
        console.log('Error during afterClosed:', err);
      }
    });
  }

  addTeamB(id: number, teamBId: number) {
    const dialogRef = this.dialog.open(FriendlyMatchTeamBComponent, {
      data: { friendlyMatchId: id, teamBId: teamBId}
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (this.leagueId) {
          console.log('Dialog closed, refreshing matches...');
          this.getFriendlyMatches(this.leagueId); 
        }
      },
      error: (err) => {
        console.log('Error during afterClosed:', err);
      }
    });
  }

  updateScore(id: number, scoreTeam: string, score: number, teamId: number) {
    const dialogRef = this.dialog.open(FriendlyMatchScoreComponent, {
      data: { friendlyMatchId: id, scoreTeam: scoreTeam, teamScore: score, teamId: teamId }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (this.leagueId) {
          console.log('Dialog closed, refreshing matches...');
          this.getFriendlyMatches(this.leagueId); 
        }
      },
      error: (err) => {
        console.log('Error during afterClosed:', err);
      }
    });
  }

  openEditFormFriendlyMatch(data: any) {
    const dialogRef = this.dialog.open(FriendlyMatchAddEditComponent, {
      data: { ...data, leagueId: this.leagueId }
    });

    dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (this.leagueId) {
            this.getFriendlyMatches(this.leagueId); 
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }


  // updateScore(element: any, index: number, id: number, team_id: number, points: number, result: string) {
  //   const dialogRef = this.dialog.open(TeamScoreComponent, {
  //       disableClose: true,
  //       data: { 
  //         score_id: id,
  //         team_id: team_id,
  //         leagueId: this.leagueId, 
  //         matchId: element.id,
  //         points: points,
  //         result: result
  //       }
  //   });
  //   dialogRef.afterClosed().subscribe({
  //     next: (val) => {
  //       if (val && this.leagueId) {
  //         this.getMatches(this.leagueId)
  //         this.scoreUpdateService.notifyScoreUpdated();
  //       }
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   })
  // }



  // addTeam(element: any, index: number) {
  //   const dialogRef = this.dialog.open(TeamSelectComponent, {
  //       data: { 
  //         leagueId: this.leagueId, 
  //         matchId: element.id 
  //       }
  //   });
  //   dialogRef.afterClosed().subscribe({
  //     next: (val) => {
  //       if (val && this.leagueId) {
  //         this.getMatches(this.leagueId)
  //       }
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   })
  // }
  

  

  // openEditFormMatch(data: any) {
  //   const dialogRef = this.dialog.open(TeamMatchAddEditComponent, {
  //     data,
  //   });

  //   dialogRef.afterClosed().subscribe({
  //       next: (val) => {
  //         if (val && this.leagueId) {
  //           this.getMatches(this.leagueId)
  //         }
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       }
  //     })
  // }
}
