import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeamService } from '../../../../../../services/team.service';
import { CoreService } from '../../../../../../core/core.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../../services/api.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatchService } from '../../../../../../services/match.service';
import { MatSelectModule } from '@angular/material/select';
import { FriendlyMatchService } from '../../../../../../services/friendly-match.service';

@Component({
  selector: 'app-friendly-match-add-edit',
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
  templateUrl: './friendly-match-add-edit.component.html',
  styleUrl: './friendly-match-add-edit.component.sass'
})
export class FriendlyMatchAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  teamForm: FormGroup
  leagueId: number | null = null;

  constructor(
    private _fb: FormBuilder, 
    private friendlyMatchService: FriendlyMatchService, 
    private _dialogRef: MatDialogRef<FriendlyMatchAddEditComponent>,
    private _coreService: CoreService,
    private _configService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leagueId = data.leagueId;
    this.teamForm = this._fb.group({
      match_date: '',
      match_time: '',
      location: '',
      status: '',
    })
  }

  ngOnInit(): void {
    this.teamForm = this._fb.group({
      match_date: ['', [Validators.required]],
      match_time: ['', [Validators.required]],
      location: ['', [Validators.required]],
      status: '',
    });
    this.teamForm.patchValue(this.data);
    console.log(this.data)
  }

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamForm.markAllAsTouched();
      const formData = {
        ...this.teamForm.value,
        league_id: this.leagueId
      };
      if (this.data.id) {
        if (this.data.scores.length === 2) {
          this.friendlyMatchService.updateFriendlyMatch(this.data.id, formData).subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Match schedule updated successfully');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            }
          });
        } else {
          this._coreService.openSnackBar('Add team for this match first.');
        }
      } else {
        this.teamForm.markAllAsTouched();
        this.friendlyMatchService.addFriendlyMatch(formData).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Match schedule added successfully')
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
