import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CupTeamService } from '../../../../services/cup-team.service';
import { CupService } from '../../../../services/cup.service';
import { ScoreUpdateService } from '../../../../services/score-league.service';
import { CupTeamDialogComponent } from './cup-team-dialog/cup-team-dialog.component';
import { CupTeamMatchComponent } from './cup-team-match/cup-team-match.component';
import { CupTeamUpdateComponent } from './cup-team-update/cup-team-update.component';

@Component({
  selector: 'app-cup-details',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    RouterLink, 
    MatTableModule, 
    CommonModule, 
    MatTabsModule, 
    CupTeamMatchComponent
  ],
  templateUrl: './cup-details.component.html',
  styleUrl: './cup-details.component.sass'
})
export class CupDetailsComponent {
  displayedColumns: string[] = ['position', 'team_id', 'played', 'won', 'drawn', 'lost', 'goals_for', 'goals_against', 'goals_difference', 'points', 'stat'];
  cupId: number | null = null;
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;
  title: string | null = null;
  
  constructor(
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private cupTeamService: CupTeamService,
    private scoreUpdateService: ScoreUpdateService,
    private cupService: CupService,
    private configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.route.params.subscribe(params => {
      this.cupId = +params['id'];  
      this.getCupTeams(this.cupId);
      this.getCupById(this.cupId);
    });
    this.scoreUpdateService.scoreUpdated$.subscribe(() => {
      if (this.cupId !== null) {
        this.getCupTeams(this.cupId); 
      }
    });
  }

  getCupById(cupId: number) {
    this.cupService.getCupById(cupId).subscribe({
      next: (res) => {
        this.title = res.title;
      },
      error: (err) => {
        console.error('Error fetching team:', err);
      }
    });
  }

  getCupTeams(cupId: number) {
    this.cupTeamService.getCupTeams(cupId).subscribe({
      next: (res) => {
        const activeTeams = res.filter((team: any) => team.stat !== 0);
        const inactiveTeams = res.filter((team: any) => team.stat === 0);
  
        activeTeams.sort((a: any, b: any) => {
          if (b.points !== a.points) {
            return b.points - a.points; 
          } else if (b.goals_for !== a.goals_for) {
            return b.goals_for - a.goals_for; 
          } else {
            return b.goals_difference - a.goals_difference; 
          }
        });
  
        const sortedTeams = [...activeTeams, ...inactiveTeams];
        sortedTeams.forEach((element: any, index: number) => {
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

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(CupTeamUpdateComponent, {
      data,
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
    })
  }
}
