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

@Component({
  selector: 'app-player-add-edit',
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
  templateUrl: './player-add-edit.component.html',
  styleUrl: './player-add-edit.component.sass'
})
export class PlayerAddEditComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  clubImage: string | null = null;
  playerForm: FormGroup;
  teamData: any[] | null = null;
  clubData: any[] | null = null;
  playerId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private clubService: ClubService, 
    private teamService: TeamService,
    private configService: ApiService,
    private coreService: CoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private squadService: SquadService,
    private route: ActivatedRoute,
  ) {
    this.playerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      middle_name: [''],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      birth_date: [''],
      birth_place: [''],
      address: [''],
      zipCode: [''],
      phone: [''],
      email: [''],
      height: [0],
      file_name: [''],
      jersey_no: [0],
      position: ['', [Validators.required]],
      team_id: [0],
      clubId: [0],
      userId: [0],
      stat: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getClubs();
    this.getTeams();
    this.imagePath = `${this.configService.URL_IMAGE}no_image.jpg`;
    this.clubImage =`${this.configService.URL_IMAGE}`;
    this.route.params.subscribe(params => {
      this.playerId = +params['id'];
      if (this.playerId) {
        this.getPlayerById(this.playerId);
      }
    });
  }

  getPlayerById(playerId: number) {
    this.squadService.getSquadById(playerId).subscribe({
      next: (res: any) => {
        this.playerForm.patchValue(res);
        if (res.file_name) {
          this.imagePath =`${this.configService.URL_SQUAD_IMAGE}${res.file_name}`;
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
        this.playerForm.patchValue({
          file_name: randomFileName
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
      const fileName = this.playerForm.get('file_name')?.value;
      this.squadService.uploadImage(this.selectedImage, fileName).subscribe({
        next: (res) => {
          this.imagePath = `${this.configService.URL_IMAGE}${res.imagePath}`;
          this.playerForm.patchValue({
            file_name: res.imagePath 
          });
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  onSubmit() {
    if (this.playerForm.valid) {
      this.playerForm.markAllAsTouched();
      if (this.playerId) {
        this.squadService.updateSquad(this.playerId, this.playerForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Player updated successfully')
            this.router.navigate(['/admin/players'])
            this.onUpload(); 
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      } else {
        this.squadService.addSquad(this.playerForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Player added successfully')
            this.router.navigate(['/admin/players'])
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
