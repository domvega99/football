import { Component, Inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FriendlyMatchService } from '../../../../services/friendly-match.service';
import { CoreService } from '../../../../core/core.service';

@Component({
  selector: 'app-friendly-match-score',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './friendly-match-score.component.html',
  styleUrl: './friendly-match-score.component.sass'
})
export class FriendlyMatchScoreComponent {
  imagePath: string | null = null;
  teamForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private friendlyMatchService: FriendlyMatchService,
    private coreService: CoreService,
    private dialogRef: DialogRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.teamForm = this.fb.group({
      teamScore: ['', [Validators.required]],
      teamResult: [''],
    });
  }

  ngOnInit(): void {
    console.log(this.data)
    this.teamForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamForm.markAllAsTouched();
      let formData: any = {};

      if (this.data.scoreTeam === 'scoreA') {
        formData.scoreA = this.teamForm.value.teamScore;
      } else if (this.data.scoreTeam === 'scoreB') {
        formData.scoreB = this.teamForm.value.teamScore;
      }

      if (this.teamForm.value.teamResult === 'Win') {
        formData.teamResult = this.data.teamId;
      } else if (this.teamForm.value.teamResult === 'Draw') {
        formData.teamResult = 'Draw';
      }

      console.log(formData)

      this.friendlyMatchService.updateFriendlyMatch(this.data.friendlyMatchId, formData).subscribe({
        next: (val: any) => {
          this.coreService.openSnackBar('Friendly match team added successfully');
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
          this.coreService.openSnackBar(err.error.message);
        }
      });
    }
  }

}
