import { Component, OnInit } from '@angular/core';
import { TeamsComponent } from '../../components/teams/teams.component';
import { MatButton } from '@angular/material/button';
import { LeftContentComponent } from './left-content/left-content.component';
import { RightContentComponent } from './right-content/right-content.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
  imports: [TeamsComponent, MatButton, LeftContentComponent, RightContentComponent, MatTableModule, MatIconModule, MatCardModule, MatTabsModule,]
})
export class HomeComponent implements OnInit{
  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("BFL - the Philippine's first grassroots and amateur football league.");
    this.metaService.addTag({ name: 'description', content: "Bohol Football League representing the finest football clubs in the Philippine's for grassroots and amateur football. Keeping you up to date with match scores and club info." });
  }
}
