import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ RouterModule, MatListModule, MatIconModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.sass'
})
export class SidebarComponent {

  role: string | null = null
  isAuthenticated: boolean = false;
  user: any;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}



  ngOnInit(): void {
    const userData = this.authService.getUser()
    if (userData) {
      this.role = userData.role;
      this.user = userData
    }
  }

  menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    routerLink: '/admin/dashboard',
    roles: ['Super Admin', 'Admin', 'Content Editor']
  },
  {
    label: 'Post',
    icon: 'store',
    routerLink: '/admin/posts',
    roles: ['Super Admin', 'Admin', 'Content Editor']
  },
  {
    label: 'Teams',
    icon: 'store',
    routerLink: '/admin/teams',
    roles: ['Super Admin', 'Admin']
  },
  {
    label: 'Leagues',
    icon: 'store',
    routerLink: '/admin/leagues',
    roles: ['Super Admin', 'Admin']
  },
  {
    label: 'Contents',
    icon: 'store',
    routerLink: '/admin/contents',
    roles: ['Super Admin', 'Admin', 'Content Editor']
  },
  {
    label: 'Users',
    icon: 'group',
    routerLink: '/admin/users',
    roles: ['Super Admin', 'Admin']
  }
  ];
}
