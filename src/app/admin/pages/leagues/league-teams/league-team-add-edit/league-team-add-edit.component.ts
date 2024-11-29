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
import { TeamGroupsService } from '../../../../../services/team-groups.service';
import { TeamService } from '../../../../../services/team.service';
import { ClubService } from '../../../clubs/clubs.service';

@Component({
  selector: 'app-league-team-add-edit',
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
  templateUrl: './league-team-add-edit.component.html',
  styleUrl: './league-team-add-edit.component.sass'
})
export class LeagueTeamAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  clubData: any[] | null = null;
  groupData: any[] | null = null;
  clubImage: string | null = null;
  teamForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private teamService: TeamService, 
    private clubService: ClubService, 
    private groupService: TeamGroupsService, 
    private dialogRef: MatDialogRef<LeagueTeamAddEditComponent>,
    private coreService: CoreService,
    private configService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.teamForm = this.fb.group({
      clubId: ['', [Validators.required]],
      groupId: ['', [Validators.required]],
      leagueId: this.data.leagueId,
    });
  }

  ngOnInit(): void {
    this.getClubs();
    this.getGroups();
    this.clubImage =`${this.configService.URL_IMAGE}`;
    if (this.data) {
      this.teamForm.patchValue(this.data);
    } 
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

  getGroups() {
    this.groupService.getTeamGroups().subscribe({
      next: (res) => {
        this.groupData = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamForm.markAllAsTouched();
      if (this.data.id) {
        this.teamService.updateTeam(this.data.id, this.teamForm.value).subscribe({
          next: (val: any) => {
            this.coreService.openSnackBar('Team updated successfully')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      } else {
        this.teamForm.markAllAsTouched();
        this.teamService.addTeam(this.teamForm.value).subscribe({
          next: (val: any) => {
            this.coreService.openSnackBar('Team added successfully')
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      }
    }
  }
}
