import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../core/core.service';
import { AssociateMemberService } from '../associate-members.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AssociationService } from '../../associations/associations.service';

@Component({
  selector: 'app-associate-member-add-edit',
  standalone: true,
  providers: [provideNativeDateAdapter()],
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
  templateUrl: './associate-member-add-edit.component.html',
  styleUrl: './associate-member-add-edit.component.sass'
})
export class AssociateMemberAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  associations: any[] | null = null;
  associateMemberForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private associateMemberService: AssociateMemberService, 
    private associationService: AssociationService,
    private dialogRef: MatDialogRef<AssociateMemberAddEditComponent>,
    private coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.associateMemberForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      middleName: '',
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: '',
      birthPlace: '',
      address: '',
      zipcode: '',
      phone: '',
      mail: '',
      associationId: this.data.paramsId,
    })
  }

  ngOnInit(): void {
    this.getAssociations();
    if (this.data) {
      this.associateMemberForm.patchValue(this.data);
    } 
  }

  getAssociations() {
    this.associationService.getAssociations().subscribe({
      next: (res) => {
        this.associations = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSubmit() {
    if (this.associateMemberForm.valid) {
      this.associateMemberForm.markAllAsTouched();
      if (this.data.id) {
        this.associateMemberService.updateAssociateMember(this.data.id, this.associateMemberForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Associate member updated successfully')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.associateMemberForm.markAllAsTouched();
        this.associateMemberService.addAssociateMember(this.associateMemberForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Associate member added successfully')
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
