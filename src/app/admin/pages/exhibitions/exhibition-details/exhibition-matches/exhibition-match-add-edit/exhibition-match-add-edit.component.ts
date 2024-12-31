import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../../../core/core.service';
import { MatchService } from '../../../../../../services/match.service';

@Component({
  selector: 'app-exhibition-match-add-edit',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exhibition-match-add-edit.component.html',
  styleUrl: './exhibition-match-add-edit.component.sass'
})
export class ExhibitionMatchAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  teamForm: FormGroup
  exhibitionId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private matchService: MatchService, 
    private dialogRef: MatDialogRef<ExhibitionMatchAddEditComponent>,
    private coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.exhibitionId = data.exhibitionId;
    this.teamForm = this.fb.group({
      match_date: ['', [Validators.required]],
      match_time: ['', [Validators.required]],
      location: ['', [Validators.required]],
      status: '',
    });
  }

  ngOnInit(): void {
    this.teamForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamForm.markAllAsTouched();
      const formData = {
        ...this.teamForm.value,
        exhibition_id: this.exhibitionId
      };
      if (this.data.id) {
        if (this.data.exhibitionScores.length === 2) {
          this.matchService.updateMatch(this.data.id, formData).subscribe({
            next: (val: any) => {
              this.coreService.openSnackBar('Match schedule updated successfully');
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            }
          });
        } else {
          this.coreService.openSnackBar('Add team for this match first.');
        }
      } else {
        this.teamForm.markAllAsTouched();
        this.matchService.addMatch(formData).subscribe({
          next: (val: any) => {
            this.coreService.openSnackBar('Match schedule added successfully')
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
