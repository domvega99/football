import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExhibitionService } from '../../../../services/exhibition.service';
import { ExhibitionMatchesComponent } from "./exhibition-matches/exhibition-matches.component";

@Component({
  selector: 'app-exhibition-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatTableModule,
    CommonModule,
    MatTabsModule,
    ExhibitionMatchesComponent
],
  templateUrl: './exhibition-details.component.html',
  styleUrl: './exhibition-details.component.sass'
})
export class ExhibitionDetailsComponent {
  exhibitionId: number | null = null;
  title: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private exhibitionService: ExhibitionService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.exhibitionId = +params['id'];  
      this.getExhibitionById(this.exhibitionId);
    });
  }

  getExhibitionById(exhibitionId: number) {
    this.exhibitionService.getExhibitionById(exhibitionId).subscribe({
      next: (res) => {
        this.title = res.title;
      },
      error: (err) => {
        console.error('Error fetching team:', err);
      }
    });
  }
}
