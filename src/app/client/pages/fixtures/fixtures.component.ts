import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatchService } from '../../../services/match.service';

@Component({
  selector: 'app-fixtures',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './fixtures.component.html',
  styleUrl: './fixtures.component.sass'
})
export class FixturesComponent implements OnInit{

  fixtureMatches: any[] = [];
  imagePath: string | null = null;
  constructor(
    private matchService: MatchService,
    private configService: ApiService,
    private _titleService: Title,
    private router: Router
  )
  {}
  ngOnInit(): void {
    this.setTitle('BFL - Fixtures');
    this.imagePath = `${this.configService.URL_IMAGE}`;
    this.getFixtureMatches();
  }

  getFixtureMatches() {
    this.matchService.getFixtureMatches(0).subscribe({
      next: (res: any) => {
        this.fixtureMatches = res; 
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  setTitle(newTitle: string) {
    this._titleService.setTitle(newTitle);
  }

  onFixtureClick(matches: any) {
    this.router.navigate(['/quickview'], {
      state: { matches }
    });
  }
}
