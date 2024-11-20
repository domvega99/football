import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { ClubService } from '../../../admin/pages/clubs/clubs.service';
import { ApiService } from '../../../services/api.service';
import { ContentsService } from '../../../services/contents.service';
import { GalleryService } from '../../../services/gallery.service';
import { TeamAboutService } from '../../../services/team-about.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [QuillModule, CommonModule, MatSelectModule, MatFormFieldModule, MatButtonModule, RouterLink],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.sass'
})
export class OverviewComponent {

  clubId: number | null = null;
  slug: string | null = null;
  aboutData: any | null = null;
  contentData: any[] = [];
  content: string | null = null;
  imagePath: string | null = null;
  imageGalleryPath: string | null = null;
  imageLogoPath: string | null = null;
  galleryData: any[] = [];
  clubLogo: string | null = null;

  constructor (
    private route: ActivatedRoute,
    private teamAboutService: TeamAboutService,
    private contentService: ContentsService,
    private galleryService: GalleryService,
    private clubService: ClubService,
    private _configService: ApiService,
  ) {}

ngOnInit(): void {
    this.imagePath = `${this._configService.URL_CONTENT_IMAGE}`;
    this.imageGalleryPath = `${this._configService.URL_IMAGE}`;
    this.imageLogoPath = `${this._configService.URL_IMAGE}`;
    this.route.params.subscribe(params => {
      this.slug = params['params'];
      if (this.slug) {
        this.getTeambySlug(this.slug);
      } else if (this.clubId) {
        this.loadTeamData(this.clubId);
      }
    });
  }

  getTeambySlug(slug: string) {
    this.clubService.getClubbySlug(slug).subscribe({
      next: (res) => {
        this.clubId = res.id;
        if (this.clubId) {
          this.loadTeamData(this.clubId);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadTeamData(clubId: number) {
    this.getTeamAboutByTeamId(clubId);
    this.getContentByTeamId(clubId);
    this.getClubById(clubId);
    this.getGalleryByTeamId(clubId);
  }

  getTeamAboutByTeamId(clubId: number) {
    this.teamAboutService.getTeamAboutByTeamId(clubId).subscribe({
      next: (res) => {
        this.aboutData = res;
        this.content = res.desktop_content;
      },
      error: (err) => {
        console.log(err);
        this.content = ''
      }
    })
  }

  getContentByTeamId(clubId: number) {
    this.contentService.getContentByTeamId(clubId).subscribe({
      next: (res) => {
        this.contentData = res.filter((content: any) => content.status === 'Published');
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getClubById(clubId: number) {
    this.clubService.getClubById(clubId).subscribe({
      next: (res) => {
        this.clubLogo = res.fileName
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getGalleryByTeamId(clubId: number) {
    this.galleryService.getGalleryByTeamId(clubId).subscribe({
      next: (res) => {
        this.galleryData = res
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
