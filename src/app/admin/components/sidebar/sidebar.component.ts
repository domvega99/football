import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
  roles: string[];
  group: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent {

  role: string | null = null;
  isAuthenticated: boolean = false;
  user: any;
  groupedMenuItems: { [key: string]: MenuItem[] } = {};
  
  groupOrder: string[] = ['Main', 'Football', 'Content', 'Management'];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userData = this.authService.getUser();
    if (userData) {
      this.role = userData.role;
      this.user = userData;
      this.groupedMenuItems = this.getGroupedMenuItems();
    }
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }

  menuItems: MenuItem[] = [
    { 
      label: 'Dashboard', 
      icon: 'dashboard', 
      routerLink: '/admin/dashboard', 
      roles: ['Super Admin', 'Admin', 'Content Editor', 'Team'], 
      group: 'Main' 
    },
    { 
      label: 'Associations', 
      icon: 'new_releases', 
      routerLink: '/admin/associations', 
      roles: ['Super Admin', 'Admin', 'Content Editor'], 
      group: 'Management' 
    },
    { 
      label: 'Clubs', 
      icon: 'new_releases', 
      routerLink: '/admin/clubs', 
      roles: ['Super Admin', 'Admin', 'Content Editor'], 
      group: 'Football' 
    },
    { 
      label: 'Teams', 
      icon: 'flag', 
      routerLink: '/admin/teams', 
      roles: ['Super Admin', 'Admin', 'Team', 'Content Editor'], 
      group: 'Football' 
    },
    { 
      label: 'Tiers', 
      icon: 'flag', 
      routerLink: '/admin/tiers', 
      roles: ['Super Admin', 'Admin', 'Team', 'Content Editor'], 
      group: 'Football' 
    },
    { 
      label: 'Leagues', 
      icon: 'golf_course', 
      routerLink: '/admin/leagues', 
      roles: ['Super Admin', 'Admin'], 
      group: 'Football' 
    },
    { 
      label: 'Contents', 
      icon: 'new_releases', 
      routerLink: '/admin/contents', 
      roles: ['Super Admin', 'Admin', 'Content Editor'], 
      group: 'Content' 
    },
    { 
      label: 'Pages', 
      icon: 'new_releases', 
      routerLink: '/admin/pages', 
      roles: ['Super Admin', 'Admin', 'Content Editor'], 
      group: 'Content' 
    },
    { 
      label: 'Players', 
      icon: 'group', 
      routerLink: '/admin/players', 
      roles: ['Super Admin', 'Admin', 'Content Editor'], 
      group: 'Management' 
    },
    { 
      label: 'Coaches', 
      icon: 'group', 
      routerLink: '/admin/coaches', 
      roles: ['Super Admin', 'Admin', 'Content Editor'], 
      group: 'Management' 
    },
    { 
      label: 'Users', 
      icon: 'group', 
      routerLink: '/admin/users', 
      roles: ['Super Admin', 'Admin'], 
      group: 'Management' 
    },
  ];

  getGroupedMenuItems() {
    const groups = this.menuItems.reduce(
      (acc: { [key: string]: MenuItem[] }, item: MenuItem) => {
        const group = item.group || 'Others';
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
        return acc;
      },
      {}
    );

    const sortedGroups: { [key: string]: MenuItem[] } = {};
    this.groupOrder.forEach((group) => {
      if (groups[group]) {
        sortedGroups[group] = groups[group];
      }
    });

    Object.keys(groups).forEach((group) => {
      if (!sortedGroups[group]) {
        sortedGroups[group] = groups[group];
      }
    });

    return sortedGroups;
  }
}
