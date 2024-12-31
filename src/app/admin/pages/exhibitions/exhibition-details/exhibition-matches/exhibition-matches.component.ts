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
import { TeamScoreComponent } from '../../../cups/cup-details/cup-team-match/team-score/team-score.component';
import { TeamSelectComponent } from '../../../cups/cup-details/cup-team-match/team-select/team-select.component';
import { CupMatchAddEditComponent } from '../../../cups/cup-details/cup-team-match/cup-match-add-edit/cup-match-add-edit.component';
import { ExhibitionMatchAddEditComponent } from './exhibition-match-add-edit/exhibition-match-add-edit.component';
import { ExhibitionTeamAddEditComponent } from '../exhibition-team-add-edit/exhibition-team-add-edit.component';
import { ExhibitionScoreAddEditComponent } from '../exhibition-score-add-edit/exhibition-score-add-edit.component';

@Component({
  selector: 'app-exhibition-matches',
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
  templateUrl: './exhibition-matches.component.html',
  styleUrl: './exhibition-matches.component.sass'
})
export class ExhibitionMatchesComponent {
  exhibitionId: number | null = null;
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
      this.exhibitionId = +params['id'];  
      this.getExhibitionMatches(this.exhibitionId);
    });
    this.imagePath = `${this.configService.URL_IMAGE}`;
  }

  getExhibitionMatches(exhibitionId: number) {
    this.matchesService.getExhibitionMatches(exhibitionId).subscribe({
      next: (res: any[]) => {
        res = res.filter(match => !match.knockout);
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
    const dialogRef = this.dialog.open(ExhibitionScoreAddEditComponent, {
      disableClose: true,
      data: { 
        score_id: id,
        team_id: team_id,
        exhibitionId: this.exhibitionId, 
        matchId: element.id,
        points: points,
        result: result
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.exhibitionId) {
          this.getExhibitionMatches(this.exhibitionId)
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
        exhibitionId: this.exhibitionId, 
        matchId: element.id 
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.exhibitionId) {
          this.getExhibitionMatches(this.exhibitionId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  addTeam(element: any, index: number) {
    const dialogRef = this.dialog.open(ExhibitionTeamAddEditComponent, {
      data: { 
        exhibitionId: this.exhibitionId, 
        matchId: element.id 
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.exhibitionId) {
          this.getExhibitionMatches(this.exhibitionId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditAddMatch() {
    const dialogRef = this.dialog.open(ExhibitionMatchAddEditComponent, {
      data: { exhibitionId: this.exhibitionId }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.exhibitionId) {
          this.getExhibitionMatches(this.exhibitionId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditFormMatch(data: any) {
    const dialogRef = this.dialog.open(ExhibitionMatchAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.exhibitionId) {
          this.getExhibitionMatches(this.exhibitionId)
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
