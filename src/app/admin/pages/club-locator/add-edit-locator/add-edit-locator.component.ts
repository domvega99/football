import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../core/core.service';
import { ClubLocatorService } from '../../../../services/club-locator.service';
import { TeamService } from '../../../../services/team.service';

@Component({
  selector: 'app-add-edit-locator',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './add-edit-locator.component.html',
  styleUrl: './add-edit-locator.component.sass'
})
export class AddEditLocatorComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  teamData: any[] | null = null;
  clubForm: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private _clubLocatorService: ClubLocatorService, 
    private teamService: TeamService,
    private _dialogRef: MatDialogRef<AddEditLocatorComponent>,
    private _coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clubForm = this._fb.group({
      clubName: '',
      teamId: 0,
      municipality: '',
      categories: '',
      contact: '',
      phone: '',
      trainingGround: '',
      facebookClub: '',
      district: '',
    });
  }

  ngOnInit(): void {
    this.getTeams()
    if (this.data) {
      this.clubForm.patchValue(this.data);
    } 
  }

  getTeams() {
    this.teamService.getTeams().subscribe({
      next: (res) => {
        this.teamData = res
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSubmit() {
    if (this.clubForm.valid) {
      this.clubForm.markAllAsTouched();
      if (this.data) {
        this._clubLocatorService.updateClubLocator(this.data.id, this.clubForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Club updated successfully')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            this._coreService.openSnackBar(err.error.message)
          }
        })
      } else {
        this.clubForm.markAllAsTouched();
        this._clubLocatorService.addClubLocator(this.clubForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Club added successfully')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            this._coreService.openSnackBar(err.error.message)
          }
        })
      }
    }
  }
}
