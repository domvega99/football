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
import { TierService } from '../../../../services/tier.service';

@Component({
  selector: 'app-tier-add-edit',
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
  templateUrl: './tier-add-edit.component.html',
  styleUrl: './tier-add-edit.component.sass'
})
export class TierAddEditComponent {
  tierForm: FormGroup;
  tierId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private tierService: TierService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.tierForm = this.fb.group({
      level: ['', [Validators.required]],
      topTier: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tierId = +params['id'];
      if (this.tierId) {
        this.getTierById(this.tierId);
      }
    });
  }

  getTierById(tierId: number) {
    this.tierService.getTierById(tierId).subscribe({
      next: (res: any) => {
        this.tierForm.patchValue(res);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.tierForm.valid) {
      this.tierForm.markAllAsTouched();
      if (this.tierId) {
        this.tierService.updateTier(this.tierId, this.tierForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Tier updated successfully')
            this.router.navigate(['/admin/tiers'])
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      } else {
        this.tierService.addTier(this.tierForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Tier added successfully')
            this.router.navigate(['/admin/tiers'])
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      }
    }
  }
}
