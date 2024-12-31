import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../../core/core.service';
import { ApiService } from '../../../../../services/api.service';
import { CupTeamService } from '../../../../../services/cup-team.service';
import { KnocoutScoreService } from '../../../../../services/knockout-score.service';

@Component({
  selector: 'app-knockout-team-add-edit',
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
  templateUrl: './knockout-team-add-edit.component.html',
  styleUrl: './knockout-team-add-edit.component.sass'
})
export class KnockoutTeamAddEditComponent {
  teams: any[] = [];
  selectedImage: File | null = null;
  imagePath: string | null = null;
  teamForm: FormGroup;
  matchId: number | null = null;
  cupId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<KnockoutTeamAddEditComponent>,
    private coreService: CoreService,
    private configService: ApiService,
    private cupTeamService: CupTeamService,
    private knockoutScoreService: KnocoutScoreService,
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
    if (this.cupId) {
      this.getTeams(this.cupId)
    }
  }

  getTeams(cupId: number) {
    this.cupTeamService.getCupTeams(cupId).subscribe({
      next: (res) => {
        this.teams = this.groupTeamsByGroup(res);
        console.log(this.teams);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  groupTeamsByGroup(data: any[]) {
    const grouped = data.reduce((acc, curr) => {
        const groupName = curr.cupGroup.groupName;
        if (!acc[groupName]) {
            acc[groupName] = {
                cup_group: groupName,
                teams: []
            };
        }
        acc[groupName].teams.push({
            id: curr.team.id,
            name: curr.team.team,
            coach: curr.team.coach,
            place: curr.team.place,
            file_name: curr.team.file_name
        });
        return acc;
    }, {});

    return Object.values(grouped);
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
        this.knockoutScoreService.updateKnockoutScore(this.data.score_id, formData).subscribe({
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
        this.knockoutScoreService.addKnockoutScore(formData, formData.cup_id).subscribe({
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
