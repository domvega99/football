import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../core/core.service';
import { CoachService } from '../coaches.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TeamService } from '../../../../services/team.service';
import { ClubService } from '../../clubs/clubs.service';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-coach-add-edit',
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
  templateUrl: './coach-add-edit.component.html',
  styleUrl: './coach-add-edit.component.sass'
})
export class CoachAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  coachForm: FormGroup;
  teamData: any[] | null = null;
  clubData: any[] | null = null;
  clubImage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private coachService: CoachService, 
    private teamService: TeamService, 
    private clubService: ClubService,
    private configService: ApiService,
    private dialogRef: MatDialogRef<CoachAddEditComponent>,
    private coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.coachForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      middleName: ['', [Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: [''],
      birthPlace: [''],
      address: [''],
      zipCode: [''],
      role: ['', [Validators.required]],
      teamId: [0],
      clubId: [0],
      phone: [''],
      email: [''],
      stat: [1, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getClubs();
    this.getTeams();
    this.clubImage =`${this.configService.URL_IMAGE}`;
    if (this.data) {
      this.coachForm.patchValue(this.data);
    } 
  }

  getTeams() {
    this.teamService.getTeams().subscribe({
      next: (res) => {
        this.teamData = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getClubs() {
    this.clubService.getClubs().subscribe({
      next: (res) => {
        this.clubData = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSubmit() {
    if (this.coachForm.valid) {
      this.coachForm.markAllAsTouched();
      if (this.data) {
        this.coachService.updateCoach(this.data.id, this.coachForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Coach updated successfully')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.coachForm.markAllAsTouched();
        this.coachService.addCoach(this.coachForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Coach added successfully')
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
