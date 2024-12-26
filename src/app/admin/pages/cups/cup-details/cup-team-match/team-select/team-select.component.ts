import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../../../core/core.service';
import { ApiService } from '../../../../../../services/api.service';
import { ScoreService } from '../../../../../../services/score.service';
import { TeamService } from '../../../../../../services/team.service';

@Component({
  selector: 'app-team-select-cup',
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
  templateUrl: './team-select.component.html',
  styleUrl: './team-select.component.sass'
})
export class TeamSelectComponent {
  teams: any[] = [];
  selectedImage: File | null = null;
  imagePath: string | null = null;
  teamForm: FormGroup;
  matchId: number | null = null;
  cupId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<TeamSelectComponent>,
    private coreService: CoreService,
    private configService: ApiService,
    private teamService: TeamService,
    private scoreService: ScoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.matchId = data.matchId;
    this.cupId = data.cupId;
    this.teamForm = this.fb.group({
      team_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.teamForm.patchValue(this.data);
    this.imagePath =`${this.configService.URL_IMAGE}`;
    this.getTeams()
  }

  getTeams() {
    this.teamService.getTeams().subscribe({
      next: (res) => {
        this.teams = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamForm.markAllAsTouched();
      const formData = {
        ...this.teamForm.value,
        cup_id: this.cupId,
        match_id: this.matchId
      };
      if (this.data.score_id) {
        this.scoreService.updateCupScore(this.data.score_id, formData, 0).subscribe({
          next: (val: any) => {
            this.coreService.openSnackBar('Team score updated successfully');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            const errorMessage = err?.error?.message || 'Error updating team score';
            this.coreService.openSnackBar(errorMessage);
          }
        });
      } else {
        this.scoreService.addCupScore(formData, formData.cup_id).subscribe({
          next: (val: any) => {
            this.coreService.openSnackBar('Team score added successfully');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            const errorMessage = err?.error?.message || 'Error adding team score';
            
            this.coreService.openSnackBar(errorMessage);
          }
        });
      }
    }
  }
}
