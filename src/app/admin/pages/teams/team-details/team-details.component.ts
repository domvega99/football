import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { TeamService } from '../../../../services/team.service';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { SquadsComponent } from '../../../components/squads/squads.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OverviewComponent } from '../../../components/overview/overview.component';
import { GalleryComponent } from '../../../components/gallery/gallery.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [
    MatTableModule, 
    MatTabsModule, 
    CommonModule, 
    SquadsComponent, 
    MatIconModule, 
    RouterLink, 
    MatButtonModule, 
    OverviewComponent, 
    GalleryComponent,
    MatCardModule
  ],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.sass'
})
export class TeamDetailsComponent {

  teamId: number | null = null;
  imagePath: string | null = null;
  teamData: any | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private _configService: ApiService,
  ) {}

  ngOnInit(): void {
    this.imagePath = `${this._configService.URL_IMAGE}`;
    this.route.params.subscribe(params => {
      this.teamId = +params['id'];  
      this.getTeamById(this.teamId);
    });
  }

  getTeamById(teamId: number) {
    this.teamService.getTeamById(teamId).subscribe({
      next: (res) => {
        if (res) {
          this.teamData = res
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
