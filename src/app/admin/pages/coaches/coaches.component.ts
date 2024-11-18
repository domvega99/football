import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { CoreService } from '../../../core/core.service';
import { CoachService } from './coaches.service';

@Component({
  selector: 'app-coaches',
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
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.sass'
})
export class CoachesComponent {
  displayedColumns: string[] = ['firstName', 'lastName', 'role', 'club', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private coachService: CoachService,
    private coreService: CoreService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getCoaches();
  }

  openEditCoach(data: any) {
    this.router.navigate(['/admin/coaches/edit', data.id]);
  }

  getCoaches() {
    this.coachService.getCoaches().subscribe({
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

  deleteCoach(id: number) {
    this.coachService.deleteCoach(id).subscribe({
      next: (res) => {
        this.coreService.openSnackBar('Coach deleted successfully')
        this.getCoaches();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
