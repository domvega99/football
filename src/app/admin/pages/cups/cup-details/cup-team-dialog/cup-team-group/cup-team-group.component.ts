import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../../../core/core.service';
import { CupGroupService } from '../../../../../../services/cup-group.service';
import { CupTeamService } from '../../../../../../services/cup-team.service';
import { TeamService } from '../../../../../../services/team.service';

@Component({
  selector: 'app-cup-team-group',
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
  templateUrl: './cup-team-group.component.html',
  styleUrl: './cup-team-group.component.sass'
})
export class CupTeamGroupComponent {
  selectedImage: File | null = null;
  teamForm: FormGroup
  cupGroups: any[] | null = null;
  team: any | null = null;

  constructor(
    private fb: FormBuilder, 
    private cupGroupService: CupGroupService, 
    private teamService: TeamService,
    private cupTeamService: CupTeamService,
    private coreService: CoreService,
    private dialogRef: MatDialogRef<CupTeamGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.teamForm = this.fb.group({
      cup_group_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCupGroups();
    this.getTeam(this.data.teamId)
  }

  getCupGroups() {
    this.cupGroupService.getCupGroups().subscribe({
      next: (res) => {
        this.cupGroups = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getTeam(teamId: number) {
    this.teamService.getTeamById(teamId).subscribe({
      next: (res) => {
        this.team = res;
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
        cup_id: this.data.cupId,
        team_id: this.data.teamId
      };
      this.cupTeamService.addCupTeam(formData).subscribe({
        next: (res) => {
          this.dialogRef.close(true);
          this.coreService.openSnackBar('Team added successfully')
        },
        error: (error) => {
          console.error('Error adding teams:', error);
          this.coreService.openSnackBar(error.error.message)
        }
      });
    }
  }
}
