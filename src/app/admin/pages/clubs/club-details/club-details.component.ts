import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../../../core/core.service';
import { ApiService } from '../../../../services/api.service';
import { TeamService } from '../../../../services/team.service';
import { AssociationService } from '../../associations/associations.service';
import { ClubService } from '../clubs.service';

@Component({
  selector: 'app-club-details',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './club-details.component.html',
  styleUrl: './club-details.component.sass'
})
export class ClubDetailsComponent {
  selectedImage: File | null = null;
  imagePath: string | null = null;
  clubForm: FormGroup;
  associationData: any[] | null = null;
  clubId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private clubService: ClubService, 
    private teamService: TeamService,
    private associationService: AssociationService,
    private configService: ApiService,
    private coreService: CoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.clubForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      province: [''],
      fileName: [''],
      municipal: [''],
      address: [''],
      zipCode: [''],
      associationId: [0],
      contact: [''],
      email: [''],
      website: [''],
      fbPage: [''],
      metaTitle: ['', [Validators.required]],
      metaDescription: ['', [Validators.required]],
      stat: ['', [Validators.required]],
      slug: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getAssociations()
    this.clubForm.get('name')?.valueChanges.subscribe(value => {
      const slug = value?.toLowerCase().replace(/ /g, '-');
      this.clubForm.get('slug')?.setValue(slug, { emitEvent: false });
    });

    this.route.params.subscribe(params => {
      this.clubId = +params['id'];
      if (this.clubId) {
        this.getClubById(this.clubId);
      }
    });
    
    this.imagePath = `${this.configService.URL_IMAGE}no_image.jpg`;
  }

  getClubById(clubId: number) {
    this.clubService.getClubById(clubId).subscribe({
      next: (res: any) => {
        this.clubForm.patchValue(res);
        if (res.fileName) {
          this.imagePath =`${this.configService.URL_IMAGE}${res.fileName}`;
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getAssociations() {
    this.associationService.getAssociations().subscribe({
      next: (res) => {
        this.associationData = res;
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
        this.clubForm.patchValue({
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
      const fileName = this.clubForm.get('fileName')?.value;
      this.teamService.uploadImage(this.selectedImage, fileName).subscribe({
        next: (res) => {
          this.imagePath = `${this.configService.URL_IMAGE}${res.imagePath}`;
          this.clubForm.patchValue({
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
    if (this.clubForm.valid) {
      this.clubForm.markAllAsTouched();
      if (this.clubId) {
        this.clubService.updateClub(this.clubId, this.clubForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Club updated successfully')
            this.router.navigate([`/admin/clubs/edit/${this.clubId}`])
            this.onUpload(); 
          },
          error: (err: any) => {
            this.coreService.openSnackBar(err.error.message)
          }
        })
      } else {
        this.clubService.addClub(this.clubForm.value).subscribe({
          next: () => {
            this.coreService.openSnackBar('Club added successfully')
            this.router.navigate(['/admin/clubs'], { state: { reload: true } });
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
