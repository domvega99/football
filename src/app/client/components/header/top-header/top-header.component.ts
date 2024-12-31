import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TeamService } from '../../../../services/team.service';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatIcon
  ],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.sass',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TopHeaderComponent {

  dataSource: any[] = [];
  imagePath: string | null = null;

  constructor(
    private _teamService: TeamService,
    private _configService: ApiService,
  ) {}

  getTeams() {
    this._teamService.getTeams().subscribe({
      next: (res) => {
        this.dataSource = res.filter((team: any) => team.file_name && team.file_name.trim() !== '');
        this.imagePath =`${this._configService.URL_IMAGE}`;
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
