import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClubDetailsComponent } from "../club-details/club-details.component";
import { MatButtonModule } from '@angular/material/button';
import { OverviewComponent } from "../../../components/overview/overview.component";
import { GalleryComponent } from "../../../components/gallery/gallery.component";

@Component({
  selector: 'app-club-form',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    ClubDetailsComponent,
    OverviewComponent,
    GalleryComponent
],
  templateUrl: './club-form.component.html',
  styleUrl: './club-form.component.sass'
})
export class ClubFormComponent {
  clubId: number | null = null;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clubId = +params['id'];
    });
  }
}
