import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GoogleService } from '../../../../services/google.service';
import { MatCardModule } from '@angular/material/card';
import { MatListItemIcon, MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-middle-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink, MatListModule, MatCardModule, MatIconModule, MatListItemIcon],
  templateUrl: './middle-header.component.html',
  styleUrl: './middle-header.component.sass'
})
export class MiddleHeaderComponent {
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  constructor(
    private authService: AuthService,
    private googleService: GoogleService
  ) {}

  isMenuOpen: boolean[] = [false, false, false, false]; 
  isAuthenticated: boolean = false;
  user: any;

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.googleService.user$.subscribe(user => {
      this.user = user;
    });
    this.googleService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.user = this.authService.getUser();
  }

  toggleMenu(index: number) {
    this.isMenuOpen[index] = true;
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}
