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
import { CoreService } from '../../../core/core.service';
import { ClubLocatorService } from '../../../services/club-locator.service';
import { AddEditLocatorComponent } from './add-edit-locator/add-edit-locator.component';

@Component({
  selector: 'app-club-locator',
  standalone: true,
  imports: [
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
  templateUrl: './club-locator.component.html',
  styleUrl: './club-locator.component.sass'
})
export class ClubLocatorComponent {
  displayedColumns: string[] = ['clubName', 'team', 'municipality', 'categories', 'contact', 'phone', 'trainingGround', 'facebookClub', 'district', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog, 
    private _clubLocatorService: ClubLocatorService,
    private _coreService: CoreService,
  ) {}

  ngOnInit(): void {
    this.getClubLocators();
  }
  
  openAddEditTeamForm() {
      const dialogRef = this._dialog.open(AddEditLocatorComponent);
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getClubLocators();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  getClubLocators() {
    this._clubLocatorService.getClubLocators().subscribe({
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
    this._clubLocatorService.deleteClubLocator(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Club deleted successfully', 'DONE')
        this.getClubLocators();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditLocatorComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getClubLocators();
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
  }
}
