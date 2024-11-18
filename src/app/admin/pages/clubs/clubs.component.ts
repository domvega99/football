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
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ClubService } from './clubs.service';

@Component({
  selector: 'app-clubs',
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
    RouterLink,
  ],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.sass'
})
export class ClubsComponent {
  displayedColumns: string[] = ['logo', 'name', 'municipal', 'associationId', 'action'];
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clubService: ClubService,
    private configService: ApiService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/admin/clubs') {
        this.getClubs(); 
      }
    });
  }

  ngOnInit(): void {
    this.getClubs();
    this.imagePath =`${this.configService.URL_IMAGE}`;
  }

  getClubs() {
    this.clubService.getClubs().subscribe({
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

  openEditContent(data: any) {
    this.router.navigate(['/admin/clubs/edit', data.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
