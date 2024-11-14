import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../../../admin/pages/clubs/clubs.service';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.sass'
})
export class TopHeaderComponent {

  dataSource: any[] = [];
  imagePath: string | null = null;

  constructor(
    private clubService: ClubService,
    private configService: ApiService,
  ) {}

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

  ngOnInit(): void {
    this.getTeams();
  }
}
