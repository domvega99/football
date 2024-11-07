import { Component } from '@angular/core';
import { GalleryService } from '../../../services/gallery.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { CoreService } from '../../../core/core.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']  
})
export class GalleryComponent {
  selectedFiles: File[] = [];
  teamId: number | null = null;
  imagePath: string | null = null;
  galleryTeamData: any[] | null = null;
  isLoading: boolean = false;

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute,
    private _coreService: CoreService,
    private _configService: ApiService,
  ) {}

  onFilesSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  ngOnInit(): void {
    this.imagePath = `${this._configService.URL_IMAGE}gallery/`;
    this.route.params.subscribe(params => {
      this.teamId = +params['id'];  
      this.getTeamGallery(this.teamId);
    });
  }

  getTeamGallery(teamId: number){
    this.galleryService.getGalleryByTeamId(teamId).subscribe({
      next:(res) => {
        this.galleryTeamData = res
      },
      error: console.log,
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

  uploadFiles(): void {
    if (!this.teamId) {
      console.error('Team ID is required');
      return;
    }

    this.isLoading = true; 
    
    const formData = new FormData();  

    for (const file of this.selectedFiles) {
      const newFileName = `${this.generateRandomString(10)}_${file.name}`;
      formData.append('images', new File([file], newFileName, { type: file.type }));  
    }

    this.galleryService.uploadImages(formData, this.teamId).subscribe({
      next: (res) => {
        if (this.teamId) {
          this.getTeamGallery(this.teamId);
        }
        this._coreService.openSnackBar('Images added successfully')
        this.isLoading = false;  
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;  
      }
    });
  }

  deleteContent(id: number) {
    this.galleryService.deleteGallery(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Image deleted successfully')
        if (this.teamId) {
          this.getTeamGallery(this.teamId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
