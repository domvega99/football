import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../core/core.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClubService } from '../clubs.service';

@Component({
  selector: 'app-club-add-edit',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './club-add-edit.component.html',
  styleUrl: './club-add-edit.component.sass'
})
export class ClubAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  clubForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private clubService: ClubService, 
    private dialogRef: MatDialogRef<ClubAddEditComponent>,
    private coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clubForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      province: [''],
      municipal: [''],
      address: [''],
      zipCode: [''],
      city: [''],
      associationId: ['', Validators.required],
      contact: [''],
      email: [''],
      website: [''],
      fbPage: [''],
      slug: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.clubForm.patchValue(this.data);
    } 
  }

  onSubmit() {
    if (this.clubForm.valid) {
      this.clubForm.markAllAsTouched();
      if (this.data) {
        this.clubService.updateClub(this.data.id, this.clubForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Club updated successfully')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.clubForm.markAllAsTouched();
        this.clubService.addClub(this.clubForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Club added successfully')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      }
    }
  }
}
