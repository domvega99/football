import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LeagueAddEditComponent } from './league-add-edit/league-add-edit.component';
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
import { LeagueService } from '../../../services/league.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink , CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatSnackBarModule],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.sass'
})
export class LeaguesComponent {
  displayedColumns: string[] = ['title', 'created_on', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private _dialog: MatDialog, 
    private leagueService: LeagueService,
    private _coreService: CoreService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.getLeagues();
  }
  
  openAddEditTeamForm() {
      const dialogRef = this._dialog.open(LeagueAddEditComponent);
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getLeagues();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  getLeagues() {
    this.leagueService.getLeagues().subscribe({
      next: (res) => {
        console.log(res)
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
    this.leagueService.deleteLeague(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Team deleted successfully', 'DONE')
        this.getLeagues();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(LeagueAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getLeagues();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
}
