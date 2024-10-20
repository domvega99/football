import { Component, Inject } from '@angular/core';
import { FriendlyMatchService } from '../../../../../../services/friendly-match.service';
import { TeamService } from '../../../../../../services/team.service';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CoreService } from '../../../../../../core/core.service';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-friendly-match-team-a',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './friendly-match-team-a.component.html',
  styleUrl: './friendly-match-team-a.component.sass'
})
export class FriendlyMatchTeamAComponent {
  teamData: any[] | null = null;
  imagePath: string | null = null;
  teamForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private teamService: TeamService,
    private friendlyMatchService: FriendlyMatchService,
    private coreService: CoreService,
    private dialogRef: DialogRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.teamForm = this.fb.group({
      teamAId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getTeams()
    this.teamForm.patchValue(this.data);
    console.log(this.data)
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

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamForm.markAllAsTouched();
      this.friendlyMatchService.updateFriendlyMatch(this.data.friendlyMatchId, this.teamForm.value).subscribe({
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
