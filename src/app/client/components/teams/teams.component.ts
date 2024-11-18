import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../../admin/pages/clubs/clubs.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatCardModule, 
    CommonModule, 
    RouterLink
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.sass'
})
export class TeamsComponent {
  dataSource: any[] = [];
  imagePath: string | null = null;

  constructor(
    private clubService: ClubService,
    private configService: ApiService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.setTitle('Clubs');
    this.getTeams();
  }
  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  
  getTeams() {
    this.clubService.getClubs().subscribe({
      next: (res) => {
        this.dataSource = res;
        this.imagePath =`${this.configService.URL_IMAGE}`;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
