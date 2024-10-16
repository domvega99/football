import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssociationService } from '../associations.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssociateMemberService } from '../../associate-members/associate-members.service';
import { CoreService } from '../../../../core/core.service';
import { AssociateMemberAddEditComponent } from '../../associate-members/associate-member-add-edit/associate-member-add-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AssociationAddEditComponent } from '../association-add-edit/association-add-edit.component';

@Component({
  selector: 'app-association-view',
  standalone: true,
  imports: [ 
    MatCardModule, 
    MatButtonModule,
    CommonModule,
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
  templateUrl: './association-view.component.html',
  styleUrl: './association-view.component.sass'
})
export class AssociationViewComponent {
  paramsId: number | null = null;
  associationData: any | null = null
  displayedColumns: string[] = ['firstName', 'lastName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private associationService: AssociationService,
    private dialog: MatDialog, 
    private associateMemberService: AssociateMemberService,
    private coreService: CoreService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.paramsId = +params['id'];
    });
    if (this.paramsId) {
      this.getAssociationById(this.paramsId);
    }
  }

  openEditAssociationForm(data: any) {
    const dialogRef = this.dialog.open(AssociationAddEditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.paramsId) {
          this.getAssociationById(this.paramsId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getAssociationById(associationId: number) {
    this.associationService.getAssociationById(associationId).subscribe({
      next: (res: any) => {
        this.associationData = res;
        this.dataSource = new MatTableDataSource(res.members);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  openAddForm() {
    const dialogRef = this.dialog.open(AssociateMemberAddEditComponent, {
      data: {
        paramsId: this.paramsId 
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.paramsId) {
          this.getAssociationById(this.paramsId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(AssociateMemberAddEditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val && this.paramsId) {
          this.getAssociationById(this.paramsId);
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

  deleteAssociateMember(id: number) {
    this.associateMemberService.deleteAssociateMember(id).subscribe({
      next: (res) => {
        this.coreService.openSnackBar('Associate member deleted successfully', 'DONE')
        if (this.paramsId) {
          this.getAssociationById(this.paramsId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
