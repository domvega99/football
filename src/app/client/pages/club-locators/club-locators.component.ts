import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClubLocatorService } from '../../../services/club-locator.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LeagueService } from '../../../services/league.service';
import { ApiService } from '../../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-club-locators',
  standalone: true,
  imports: [
    MatTableModule, 
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './club-locators.component.html',
  styleUrl: './club-locators.component.sass'
})
export class ClubLocatorsComponent {
  displayedColumns: string[] = ['clubName', 'municipality', 'categories', 'contact', 'phone', 'trainingGround', 'facebookClub', 'district'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clubLocatorService: ClubLocatorService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("BFL - Clubs");
    this.getClubLocators();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getClubLocators() {
    this.clubLocatorService.getClubLocators().subscribe({
      next: (res) => {
        res.sort((a: any, b: any) => a.municipality.localeCompare(b.municipality));
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
