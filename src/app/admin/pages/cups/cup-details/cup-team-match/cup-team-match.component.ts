import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { MatchService } from '../../../../../services/match.service';
import { ScoreUpdateService } from '../../../../../services/score-league.service';
import { TeamScoreComponent } from './team-score/team-score.component';
import { TeamSelectComponent } from './team-select/team-select.component';
import { CupMatchAddEditComponent } from './cup-match-add-edit/cup-match-add-edit.component';

@Component({
  selector: 'app-cup-team-match',
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
  templateUrl: './cup-team-match.component.html',
  styleUrl: './cup-team-match.component.sass'
})
export class CupTeamMatchComponent {
  cupId: number | null = null;
  displayedColumns: string[] = ['match_date', 'match_time', 'location', 'for', 'result', 'against', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  constructor(
    private dialog: MatDialog, 
    private route: ActivatedRoute,
    private matchesService: MatchService,
    private scoreUpdateService: ScoreUpdateService,
    private configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cupId = +params['id'];  
      this.getCupMatches(this.cupId);
    });
    this.imagePath = `${this.configService.URL_IMAGE}`;
  }

  getCupMatches(cupId: number) {
    this.matchesService.getCupMatches(cupId).subscribe({
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
        cupId: this.cupId, 
        matchId: element.id,
        points: points,
        result: result
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.cupId) {
          this.getCupMatches(this.cupId)
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
        cupId: this.cupId, 
        matchId: element.id 
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.cupId) {
          this.getCupMatches(this.cupId)
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
        cupId: this.cupId, 
        matchId: element.id 
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.cupId) {
          this.getCupMatches(this.cupId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditAddMatch() {
    const dialogRef = this.dialog.open(CupMatchAddEditComponent, {
      data: { cupId: this.cupId }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.cupId) {
          this.getCupMatches(this.cupId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditFormMatch(data: any) {
    const dialogRef = this.dialog.open(CupMatchAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.cupId) {
          this.getCupMatches(this.cupId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
