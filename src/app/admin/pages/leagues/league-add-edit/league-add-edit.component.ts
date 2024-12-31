import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeamService } from '../../../../services/team.service';
import { CoreService } from '../../../../core/core.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { LeagueService } from '../../../../services/league.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-team-add-edit',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatSelectModule],
  templateUrl: './league-add-edit.component.html',
  styleUrl: './league-add-edit.component.sass'
})
export class LeagueAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  leagueForm: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private leagueService: LeagueService, 
    private _dialogRef: MatDialogRef<LeagueAddEditComponent>,
    private _coreService: CoreService,
    private _configService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leagueForm = this._fb.group({
      title: '',
      startYear: '',
      endYear: '',
      status: '',
    })
  }

  ngOnInit(): void {
    this.leagueForm = this._fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      startYear: ['', [Validators.required,]],
      endYear: ['', [Validators.required,]],
      status: ['', [Validators.required,]],
    });
    if (this.data) {
      this.leagueForm.patchValue(this.data);
    } 
  }

  onSubmit() {
    if (this.leagueForm.valid) {
      this.leagueForm.markAllAsTouched();
      if (this.data) {
        this.leagueService.updateLeague(this.data.id, this.leagueForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('League updated successfully')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.leagueForm.markAllAsTouched();
        this.leagueService.addLeague(this.leagueForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('League added successfully')
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
