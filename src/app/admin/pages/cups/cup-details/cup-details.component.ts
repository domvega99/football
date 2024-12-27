import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CupService } from '../../../../services/cup.service';
import { CupTeamMatchComponent } from './cup-team-match/cup-team-match.component';
import { CupTeamStandingComponent } from './cup-team-standing/cup-team-standing.component';
import { CupKnockoutsComponent } from '../cup-knockouts/cup-knockouts.component';


@Component({
  selector: 'app-cup-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatTableModule,
    CommonModule,
    MatTabsModule,
    CupTeamMatchComponent,
    CupTeamStandingComponent,
    CupKnockoutsComponent
],
  templateUrl: './cup-details.component.html',
  styleUrl: './cup-details.component.sass'
})
export class CupDetailsComponent {
  cupId: number | null = null;
  title: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private cupService: CupService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cupId = +params['id'];  
      this.getCupById(this.cupId);
    });
  }

  getCupById(cupId: number) {
    this.cupService.getCupById(cupId).subscribe({
      next: (res) => {
        this.title = res.title;
      },
      error: (err) => {
        console.error('Error fetching team:', err);
      }
    });
  }
}
