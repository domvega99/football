import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../core/core.service';
import { AssociationService } from '../associations.service';

@Component({
  selector: 'app-association-add-edit',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule
  ],
  templateUrl: './association-add-edit.component.html',
  styleUrl: './association-add-edit.component.sass'
})
export class AssociationAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  associationForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private associationService: AssociationService, 
    private dialogRef: MatDialogRef<AssociationAddEditComponent>,
    private coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.associationForm = this.fb.group({
      orgName: ['', [Validators.required, Validators.minLength(3)]],
      headOrg: '',
      province: '',
      address: '',
      zipCode: '',
      city: '',
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.associationForm.patchValue(this.data);
    } 
  }

  onSubmit() {
    if (this.associationForm.valid) {
      this.associationForm.markAllAsTouched();
      if (this.data) {
        this.associationService.updateAssociation(this.data.id, this.associationForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Association updated successfully')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.associationForm.markAllAsTouched();
        this.associationService.addAssociation(this.associationForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Association added successfully')
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
