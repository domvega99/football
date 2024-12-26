import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { ScoreUpdateService } from '../../../../../services/score-league.service';
import { CupTeamDialogComponent } from '../cup-team-dialog/cup-team-dialog.component';
import { CupTeamService } from '../../../../../services/cup-team.service';

@Component({
  selector: 'app-cup-team-standing',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatTabsModule,
  ],
  templateUrl: './cup-team-standing.component.html',
  styleUrl: './cup-team-standing.component.sass'
})
export class CupTeamStandingComponent {
  displayedColumns: string[] = ['position', 'team_id', 'played', 'won', 'drawn', 'lost', 'goals_for', 'goals_against', 'goals_difference', 'points', 'stat'];
  cupId: number | null = null;
  dataSource!: MatTableDataSource<any>;
  cupGroupData: any[] = [];
  imagePath: string | null = null;
  
  constructor(
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private cupTeamService: CupTeamService,
    private scoreUpdateService: ScoreUpdateService,
    private configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.route.params.subscribe(params => {
      this.cupId = +params['id'];  
      this.getCupTeams(this.cupId);
    });
    this.scoreUpdateService.scoreUpdated$.subscribe(() => {
      if (this.cupId !== null) {
        this.getCupTeams(this.cupId); 
      }
    });
  }

  getCupTeams(cupId: number): void {
    this.cupTeamService.getCupsByGroup(cupId).subscribe({
      next: (res) => {
        console.log(res)
        this.cupGroupData = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(CupTeamDialogComponent, {
      data: { cupId: this.cupId }
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.cupId !== null) {
          this.getCupTeams(this.cupId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
