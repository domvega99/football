import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../core/core.service';
import { ExhibitionService } from '../../../../services/exhibition.service';

@Component({
  selector: 'app-exhibition-add-edit',
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
  templateUrl: './exhibition-add-edit.component.html',
  styleUrl: './exhibition-add-edit.component.sass'
})
export class ExhibitionAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  exhibitionForm: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private exhibitionService: ExhibitionService, 
    private _dialogRef: MatDialogRef<ExhibitionAddEditComponent>,
    private _coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.exhibitionForm = this._fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', [Validators.required,]],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.exhibitionForm.patchValue(this.data);
    } 
  }

  onSubmit() {
    if (this.exhibitionForm.valid) {
      this.exhibitionForm.markAllAsTouched();
      if (this.data) {
        this.exhibitionService.updateExhibition(this.data.id, this.exhibitionForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Exhibition updated successfully')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.exhibitionService.addExhibition(this.exhibitionForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Exhibition added successfully')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      }
    }
  }
}
