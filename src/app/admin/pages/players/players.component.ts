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
import { ApiService } from '../../../services/api.service';
import { SquadService } from '../../../services/squad.service';

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
  displayedColumns: string[] = ['playerNumber', 'first_name', 'last_name', 'position', 'club', 'stat', 'action'];
  teamId: number | null = null;
  dataSource!: MatTableDataSource<any>;
  imagePath: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private squadService: SquadService,
    private coreService: CoreService,
    private configService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.imagePath =`${this.configService.URL_IMAGE}`;
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

  openEditPlayer(data: any) {
    this.router.navigate(['/admin/players/edit', data.id]);
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
        this.coreService.openSnackBar('Player deleted successfully')
        this.getPlayers();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}

