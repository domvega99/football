import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule,MatCardModule, RouterLink],
  templateUrl: './news.component.html',
  styleUrl: './news.component.sass'
})
export class NewsComponent {

  imagePath: string | null = null;
  dataSource: any[] = [];

  constructor(
    private _contentService: NewsService,
    private _configService: ApiService,
    private _titleService: Title
  ) {}

  getContent() {
    this._contentService.getContent().subscribe({
      next: (res) => {
        this.dataSource = res.sort((a: any, b: any) => {
          return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
        });
        this.imagePath =`${this._configService.URL_CONTENT_IMAGE}`;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnInit(): void {
    this.setTitle('News');
    this.getContent();
  }

  setTitle(newTitle: string) {
    this._titleService.setTitle(newTitle);
  }
  
  applyFilter(event: Event) {
  }
}
