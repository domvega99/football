import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TeamService } from '../../../../../services/team.service';
import { CupTeamGroupComponent } from './cup-team-group/cup-team-group.component';

@Component({
  selector: 'app-cup-team-dialog',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule, 
    MatSlideToggleModule, 
    FormsModule, 
    MatListModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './cup-team-dialog.component.html',
  styleUrl: './cup-team-dialog.component.sass'
})
export class CupTeamDialogComponent {
  displayedColumns: string[] = ['team', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teamService: TeamService,
    public dialogRef: MatDialogRef<CupTeamDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
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
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openCupGroup(teamId: number) {
    const dialogRef = this.dialog.open(CupTeamGroupComponent, {
      data: { teamId: teamId, cupId: this.data.cupId }
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTeams();
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
