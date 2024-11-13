import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CoreService } from '../../../core/core.service';
import { ApiService } from '../../../services/api.service';
import { SquadService } from '../../../services/squad.service';
import { PlayerAddEditComponent } from './player-add-edit/player-add-edit.component';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    RouterLink, 
    CommonModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatIconModule, 
    MatSnackBarModule
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.sass'
})
export class PlayersComponent {
  displayedColumns: string[] = ['first_name', 'last_name', 'position', 'stat', 'action'];
  teamId: number | null = null;
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog, 
    private squadService: SquadService,
    private _coreService: CoreService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath =`${this._configService.URL_IMAGE}`;
    this.getPlayers();
  }

  getPlayers() {
    this.squadService.getSquads().subscribe({
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
  
  openAddEditTeamForm() {
    const dialogRef = this._dialog.open(PlayerAddEditComponent, {
      data: { teamId: this.teamId }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.teamId) {
          this.getPlayers();
        }
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

  deleteSquad(id: number) {
    this.squadService.deleteSquad(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Player deleted successfully')
        this.getPlayers();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(PlayerAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val && this.teamId) {
            this.getPlayers();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
}

