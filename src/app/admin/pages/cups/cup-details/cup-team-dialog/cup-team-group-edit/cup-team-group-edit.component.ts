import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../../../core/core.service';
import { CupGroupService } from '../../../../../../services/cup-group.service';
import { CupTeamService } from '../../../../../../services/cup-team.service';

@Component({
  selector: 'app-cup-team-group-edit',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule,
  ],
  templateUrl: './cup-team-group-edit.component.html',
  styleUrl: './cup-team-group-edit.component.sass'
})
export class CupTeamGroupEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  teamForm: FormGroup
  cupId: number | null = null;
  cupGroups: any[] | null = null;

  constructor(
    private fb: FormBuilder, 
    private cupGroupService: CupGroupService,
    private cupTeamService: CupTeamService,
    private dialogRef: MatDialogRef<CupTeamGroupEditComponent>,
    private coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cupId = data.cupId;
    this.teamForm = this.fb.group({
      cup_group_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.teamForm.patchValue(this.data);
    this.getCupGroups();
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

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamForm.markAllAsTouched();
      if (this.data.id) {
        this.cupTeamService.updateCupTeams(this.data.id, this.teamForm.value).subscribe({
          next: (val: any) => {
            this.coreService.openSnackBar('Match schedule updated successfully');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      } 
    }
  }
}
