import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TeamAddEditComponent } from './team-add-edit/team-add-edit.component';
import { TeamService } from '../../../services/team.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreService } from '../../../core/core.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatSnackBarModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.sass'
})
export class TeamsComponent implements OnInit {
  displayedColumns: string[] = ['logo', 'team', 'coach', 'place', 'action'];
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private _dialog: MatDialog, 
    private _teamService: TeamService,
    private _coreService: CoreService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.getTeams();
    this.imagePath =`${this._configService.URL_IMAGE}`;
  }
  
  openAddEditTeamForm() {
      const dialogRef = this._dialog.open(TeamAddEditComponent);
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getTeams();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  getTeams() {
    this._teamService.getTeams().subscribe({
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteTeam(id: number) {
    this._teamService.deleteTeam(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Team deleted successfully', 'DONE')
        this.getTeams();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(TeamAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getTeams();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
}
