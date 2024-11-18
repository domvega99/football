import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoreService } from '../../../../core/core.service';
import { ApiService } from '../../../../services/api.service';
import { SquadService } from '../../../../services/squad.service';
import { TeamService } from '../../../../services/team.service';
import { ClubService } from '../../clubs/clubs.service';
import { CoachService } from '../coaches.service';

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
    MatDatepickerModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './coach-add-edit.component.html',
  styleUrl: './coach-add-edit.component.sass'
})
export class CoachAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  clubImage: string | null = null;
  coachForm: FormGroup;
  teamData: any[] | null = null;
  clubData: any[] | null = null;
  coachId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private clubService: ClubService, 
    private teamService: TeamService,
    private configService: ApiService,
    private coreService: CoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private coachService: CoachService,
    private squadService: SquadService,
    private route: ActivatedRoute,
  ) {
    this.coachForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      middleName: ['', [Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: [''],
      birthPlace: [''],
      address: [''],
      zipCode: [''],
      fileName: [''],
      role: ['', [Validators.required]],
      teamId: [0],
      clubId: ['', [Validators.required]],
      phone: [''],
      email: [''],
      stat: [1, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getClubs();
    this.getTeams();
    this.imagePath = `${this.configService.URL_IMAGE}no_image.jpg`;
    this.clubImage =`${this.configService.URL_IMAGE}`;
    this.route.params.subscribe(params => {
      this.coachId = +params['id'];
      if (this.coachId) {
        this.getCoachById(this.coachId);
      }
    });
  }

  getCoachById(coachId: number) {
    this.coachService.getCoachById(coachId).subscribe({
      next: (res: any) => {
        this.coachForm.patchValue(res);
        if (res.fileName) {
          this.imagePath =`${this.configService.URL_SQUAD_IMAGE}${res.fileName}`;
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
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

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const randomFileName = this.generateRandomString(10) + this.getFileExtension(file.name);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
        this.coachForm.patchValue({
          fileName: randomFileName
        });
        this.cdr.markForCheck(); 
      };
      reader.readAsDataURL(file);
    }
  }

  getFileExtension(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('.'));
  }

  onUpload() {
    if (this.selectedImage) {
      const fileName = this.coachForm.get('fileName')?.value;
      this.squadService.uploadImage(this.selectedImage, fileName).subscribe({
        next: (res) => {
          this.imagePath = `${this.configService.URL_IMAGE}${res.imagePath}`;
          this.coachForm.patchValue({
            fileName: res.imagePath 
          });
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  onSubmit() {
    if (this.coachForm.valid) {
      this.coachForm.markAllAsTouched();
      if (this.coachId) {
        this.coachService.updateCoach(this.coachId, this.coachForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Coach updated successfully')
            this.router.navigate(['/admin/coaches'])
            this.onUpload(); 
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      } else {
        this.coachService.addCoach(this.coachForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Coach added successfully')
            this.router.navigate(['/admin/coaches'])
            this.onUpload(); 
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      }
    }
  }
}
