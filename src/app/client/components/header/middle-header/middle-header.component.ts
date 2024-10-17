import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GoogleService } from '../../../../services/google.service';
import { MatCardModule } from '@angular/material/card';
import { MatListItemIcon, MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { PageService } from '../../../../services/page.service';

@Component({
  selector: 'app-middle-header',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    RouterLink, 
    MatListModule, 
    MatCardModule, 
    MatIconModule, 
    MatListItemIcon, 
    MatMenuModule, 
    MatMenuTrigger, 
    MatButtonModule,
  ],
  templateUrl: './middle-header.component.html',
  styleUrl: './middle-header.component.sass'
})
export class MiddleHeaderComponent {
  pages: any[] = [];
  abouts: any[] = [];
  showDropdown = false;
  isSubmenuOpen: any  = {
    leagues: false,
    footballcommunity: false,
    about: false
  };
  isDashboardSelected = false;
  
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  constructor(
    private authService: AuthService,
    private googleService: GoogleService,
    private pageService: PageService
  ) {}

  toggleSubmenu(menuName: string) {
    Object.keys(this.isSubmenuOpen).forEach(key => {
      if (key !== menuName) {
        this.isSubmenuOpen[key] = false;
      }
    });
    this.isSubmenuOpen[menuName] = !this.isSubmenuOpen[menuName];
  
  }

  getPages() {
    this.pageService.getPages().subscribe({
      next: (res) => {
        this.pages = res.filter((page: any) => 
          page.name === 'Wider Football' || 
          page.name === 'Community' || 
          page.name === '1st District Football Clubs' ||
          page.name === '2nd District Football Clubs' ||
          page.name === '3rd District Football Clubs'
        );
        this.abouts = res.filter((page: any) => 
          page.name !== 'Wider Football' && 
          page.name !== 'Community' &&
          page.name !== '1st District Football Clubs' &&
          page.name !== '2nd District Football Clubs' &&
          page.name !== '3rd District Football Clubs'
        );
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  selectDashboard() {
    this.isDashboardSelected = true;
  }

  isAuthenticated: boolean = false;
  user: any;

  ngOnInit() {
    this.getPages()
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.showDropdown = false;
    });
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.showDropdown = false;
    });
    this.googleService.user$.subscribe(user => {
      this.user = user;
      this.showDropdown = false;
    });
    this.googleService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.showDropdown = false;
    });
    this.user = this.authService.getUser();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}
  




