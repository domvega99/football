import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoreService } from '../../../../core/core.service';
import { TeamGroupsService } from '../../../../services/team-groups.service';

@Component({
  selector: 'app-team-group-add-edit',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule,
    MatDatepickerModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './team-group-add-edit.component.html',
  styleUrl: './team-group-add-edit.component.sass'
})
export class TeamGroupAddEditComponent {
  teamGroupForm: FormGroup;
  teamGroupId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private groupService: TeamGroupsService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.teamGroupForm = this.fb.group({
      groupName: ['', [Validators.required]],
      stat: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.teamGroupId = +params['id'];
      if (this.teamGroupId) {
        this.getGroupById(this.teamGroupId);
      }
    });
  }

  getGroupById(teamGroupId: number) {
    this.groupService.getTeamGroupById(teamGroupId).subscribe({
      next: (res: any) => {
        this.teamGroupForm.patchValue(res);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.teamGroupForm.valid) {
      this.teamGroupForm.markAllAsTouched();
      if (this.teamGroupId) {
        this.groupService.updateTeamGroup(this.teamGroupId, this.teamGroupForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Team group updated successfully')
            this.router.navigate(['/admin/team-groups'])
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      } else {
        this.groupService.addTeamGroup(this.teamGroupForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Team group added successfully')
            this.router.navigate(['/admin/team-groups'])
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      }
    }
  }
}
