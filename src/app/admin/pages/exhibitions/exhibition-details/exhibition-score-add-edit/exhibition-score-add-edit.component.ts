import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../../core/core.service';
import { ApiService } from '../../../../../services/api.service';
import { ExhibitionScoreService } from '../../../../../services/exhibition-scores.service';
import { TeamService } from '../../../../../services/team.service';

@Component({
  selector: 'app-exhibition-score-add-edit',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './exhibition-score-add-edit.component.html',
  styleUrl: './exhibition-score-add-edit.component.sass'
})
export class ExhibitionScoreAddEditComponent {
  teams: any[] = [];
  playerScores: any[] = [];
  selectedImage: File | null = null;
  imagePath: string | null = null;
  imagePathSquad: string | null = null;
  teamForm: FormGroup;
  cupId: number | null = null;
  matchId: number | null = null;
  teamName: string | null = null;
  teamId: any;
  players: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<ExhibitionScoreAddEditComponent>,
    private coreService: CoreService,
    private configService: ApiService,
    private teamService: TeamService,
    private exhibitionScoreService: ExhibitionScoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.matchId = data.matchId;
    this.cupId = data.cupId;
    this.teamForm = this.fb.group({
      points: 0,
      result: ''
    })
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
        match_id: this.matchId
      };
      if (this.data.score_id) {
        this.exhibitionScoreService.updateExhibitionScore(this.data.score_id, formData).subscribe({
          next: (val: any) => {
            this.coreService.openSnackBar('Team score updated successfully');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            const errorMessage = err?.error?.message || 'Error updating team score';
            this.coreService.openSnackBar(errorMessage);
          }
        });
      } 
    }
  }
}
