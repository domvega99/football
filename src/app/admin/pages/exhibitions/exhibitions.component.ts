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
import { CupService } from '../../../services/cup.service';
import { ExhibitionAddEditComponent } from './exhibition-add-edit/exhibition-add-edit.component';

@Component({
  selector: 'app-exhibitions',
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
  templateUrl: './exhibitions.component.html',
  styleUrl: './exhibitions.component.sass'
})
export class ExhibitionsComponent {
  displayedColumns: string[] = ['title', 'created_on', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog, 
    private cupService: CupService,
  ) {}

  ngOnInit(): void {
    this.getCups();
  }
  
  openAddExhibition() {
    const dialogRef = this._dialog.open(ExhibitionAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCups();
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getCups() {
    this.cupService.getCups().subscribe({
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

  openEditExhibition(data: any) {
    const dialogRef = this._dialog.open(ExhibitionAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCups();
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
