import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ClubService } from '../../../admin/pages/clubs/clubs.service';
import { ApiService } from '../../../services/api.service';
import { FixuresComponent } from '../../components/fixures/fixures.component';
import { OverviewComponent } from '../../components/overview/overview.component';
import { SquadsComponent } from '../../components/squads/squads.component';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatTabsModule, 
    SquadsComponent, 
    FixuresComponent, 
    OverviewComponent
  ],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.sass'
})
export class ClubsComponent {

  data: any | null = null;
  imagePath: string | null = null;
  slug: string | null = null;

  constructor(
    private clubService: ClubService,
    private _configService: ApiService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.slug = params['params'];  
      if (this.slug) {
        this.getTeamBySlug(this.slug);
      }
    });
  }

  setTitleAndMeta(title: string, description: string): void {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
  }

  getTeamBySlug(slug: string) {
    this.clubService.getClubbySlug(slug).subscribe({
      next: (res) => {
        this.data = res;
        this.imagePath =`${this._configService.URL_IMAGE}`;
        this.setTitleAndMeta(res.metaTitle, res.metaDescription);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
