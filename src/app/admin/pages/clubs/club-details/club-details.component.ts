import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../../../core/core.service';
import { AssociationService } from '../../associations/associations.service';
import { ClubService } from '../clubs.service';
import { TeamService } from '../../../../services/team.service';
import { ApiService } from '../../../../services/api.service';

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

  constructor(
    private fb: FormBuilder, 
    private clubService: ClubService, 
    private teamService: TeamService,
    private associationService: AssociationService,
    private configService: ApiService,
    private coreService: CoreService,
    private cdr: ChangeDetectorRef,
  ) {
    this.clubForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      province: [''],
      municipal: [''],
      address: [''],
      zipCode: [''],
      city: [''],
      associationId: ['', Validators.required],
      contact: [''],
      email: [''],
      website: [''],
      fbPage: [''],
      slug: [{ value: '', disabled: true }, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.clubForm.get('name')?.valueChanges.subscribe(value => {
      const slug = value?.toLowerCase().replace(/ /g, '-');
      this.clubForm.get('slug')?.setValue(slug, { emitEvent: false });
    });
    
    this.imagePath = `${this.configService.URL_IMAGE}no_image.jpg`;
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
      const fileName = this.clubForm.get('file_name')?.value;
      this.teamService.uploadImage(this.selectedImage, fileName).subscribe({
        next: (res) => {
          this.imagePath = `${this.configService.URL_IMAGE}${res.imagePath}`;
          this.clubForm.patchValue({
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
    // if (this.clubForm.valid) {
    //   this.clubForm.markAllAsTouched();
    //   if (this.data) {
    //     this.clubService.updateClub(this.data.id, this.clubForm.value).subscribe({
    //       next: () => {
    //         this.coreService.openSnackBar('Club updated successfully')
    //         this.dialogRef.close(true);
    //       },
    //       error: (err: any) => {
    //         console.error(err);
    //       }
    //     })
    //   } else {
    //     this.clubForm.markAllAsTouched();
    //     this.clubService.addClub(this.clubForm.value).subscribe({
    //       next: () => {
    //         this.coreService.openSnackBar('Club added successfully')
    //         this.dialogRef.close(true);
    //       },
    //       error: (err: any) => {
    //         console.error(err);
    //       }
    //     })
    //   }
    // }
  }
}
