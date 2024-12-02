import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TeamMatchAddEditComponent } from './team-match-add-edit/team-match-add-edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../../../../services/match.service';
import { CommonModule } from '@angular/common';
import { TeamSelectComponent } from './team-select/team-select.component';
import { ApiService } from '../../../../../services/api.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeamScoreComponent } from './team-score/team-score.component';
import { ScoreUpdateService } from '../../../../../services/score-league.service';

@Component({
  selector: 'app-league-team-match',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, MatIconModule, MatTooltipModule],
  providers: [
    DatePipe,
  ],
  templateUrl: './league-team-match.component.html',
  styleUrl: './league-team-match.component.sass'
})
export class LeagueTeamMatchComponent {

  leagueId: number | null = null;
  displayedColumns: string[] = ['match_date', 'match_time', 'location', 'for', 'result', 'against', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  constructor(
    private dialog: MatDialog, 
    private route: ActivatedRoute,
    private matchesService: MatchService,
    private scoreUpdateService: ScoreUpdateService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.leagueId = +params['id'];  
      this.getMatches(this.leagueId);
    });
    this.imagePath = `${this._configService.URL_IMAGE}`;
  }

  
  getMatches(leagueId: number) {
    this.matchesService.getMatches(leagueId).subscribe({
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

  updateScore(element: any, index: number, id: number, team_id: number, points: number, result: string) {
    const dialogRef = this.dialog.open(TeamScoreComponent, {
        disableClose: true,
        data: { 
          score_id: id,
          team_id: team_id,
          leagueId: this.leagueId, 
          matchId: element.id,
          points: points,
          result: result
        }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.leagueId) {
          this.getMatches(this.leagueId)
          this.scoreUpdateService.notifyScoreUpdated();
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  updateTeam(element: any, index: number, id: number, team_id: number) {
    const dialogRef = this.dialog.open(TeamSelectComponent, {
        data: { 
          score_id: id,
          team_id: team_id,
          leagueId: this.leagueId, 
          matchId: element.id 
        }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.leagueId) {
          this.getMatches(this.leagueId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  addTeam(element: any, index: number) {
    const dialogRef = this.dialog.open(TeamSelectComponent, {
        data: { 
          leagueId: this.leagueId, 
          matchId: element.id 
        }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.leagueId) {
          this.getMatches(this.leagueId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  

  openEditAddMatch() {
      const dialogRef = this.dialog.open(TeamMatchAddEditComponent, {
        data: { leagueId: this.leagueId }
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val && this.leagueId) {
            this.getMatches(this.leagueId)
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  openEditFormMatch(data: any) {
    const dialogRef = this.dialog.open(TeamMatchAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val && this.leagueId) {
            this.getMatches(this.leagueId)
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

}
