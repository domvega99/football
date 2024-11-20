import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoreService } from '../../../../core/core.service';
import { FootballYearService } from '../../../../services/football-year.service';

@Component({
  selector: 'app-year-add-edit',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule,
    MatDatepickerModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './year-add-edit.component.html',
  styleUrl: './year-add-edit.component.sass'
})
export class YearAddEditComponent {
  yearForm: FormGroup;
  yearId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private yearService: FootballYearService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.yearForm = this.fb.group({
      year: ['', [Validators.required]],
      stat: [1, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.yearId = +params['id'];
      if (this.yearId) {
        this.getYearById(this.yearId);
      }
    });
  }

  getYearById(yearId: number) {
    this.yearService.getFootballYearById(yearId).subscribe({
      next: (res: any) => {
        this.yearForm.patchValue(res);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.yearForm.valid) {
      this.yearForm.markAllAsTouched();
      if (this.yearId) {
        this.yearService.updateFootballYear(this.yearId, this.yearForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Year updated successfully')
            this.router.navigate(['/admin/years'])
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      } else {
        this.yearService.addFootballYear(this.yearForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Year added successfully')
            this.router.navigate(['/admin/years'])
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      }
    }
  }
}
