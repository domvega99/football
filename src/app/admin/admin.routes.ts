import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { NewsComponent } from './pages/news/news.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { PostsComponent } from './pages/posts/posts.component';
import { UsersComponent } from './pages/users/users.component';
import { LeaguesComponent } from './pages/leagues/leagues.component';
import { LeagueDetailsComponent } from './pages/leagues/league-details/league-details.component';
import { AddContentComponent } from './pages/news/add-content/add-content.component';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { TeamDetailsComponent } from './pages/teams/team-details/team-details.component';
import { PageComponent } from './pages/page/page.component';
import { PageAddEditComponent } from './pages/page/page-add-edit/page-add-edit.component';
import { AssociationsComponent } from './pages/associations/associations.component';
import { AssociationViewComponent } from './pages/associations/association-view/association-view.component';
import { CoachesComponent } from './pages/coaches/coaches.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { ClubFormComponent } from './pages/clubs/club-form/club-form.component';
import { PlayersComponent } from './pages/players/players.component';
import { PlayerAddEditComponent } from './pages/players/player-add-edit/player-add-edit.component';
import { CoachAddEditComponent } from './pages/coaches/coach-add-edit/coach-add-edit.component';
import { TiersComponent } from './pages/tiers/tiers.component';
import { TierAddEditComponent } from './pages/tiers/tier-add-edit/tier-add-edit.component';
import { FootballYearsComponent } from './pages/football-years/football-years.component';
import { YearAddEditComponent } from './pages/football-years/year-add-edit/year-add-edit.component';
import { TeamGroupsComponent } from './pages/team-groups/team-groups.component';
import { TeamGroupAddEditComponent } from './pages/team-groups/team-group-add-edit/team-group-add-edit.component';
import { FriendlyMatchesComponent } from './pages/friendly-matches/friendly-matches.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'leagues', component: LeaguesComponent, canActivate: [AdminGuard] },
          { path: 'leagues/:id', component: LeagueDetailsComponent, canActivate: [AdminGuard] },
          { path: 'posts', component: PostsComponent, canActivate: [AdminGuard] },
          { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
          { path: 'contents', component: NewsComponent },
          { path: 'content/create', component: AddContentComponent },
          { path: 'content/edit/:id', component: AddContentComponent },
          { path: 'pages', component: PageComponent },
          { path: 'page/create', component: PageAddEditComponent },
          { path: 'page/edit/:id', component: PageAddEditComponent },
          { path: 'associations', component: AssociationsComponent },
          { path: 'associations/:id', component: AssociationViewComponent },
          { path: 'coaches', component: CoachesComponent },
          { path: 'coaches/create', component: CoachAddEditComponent },
          { path: 'coaches/edit/:id', component: CoachAddEditComponent },
          { path: 'clubs', component: ClubsComponent },
          { path: 'clubs/create', component: ClubFormComponent },
          { path: 'clubs/edit/:id', component: ClubFormComponent },
          { path: 'players', component: PlayersComponent },
          { path: 'players/create', component: PlayerAddEditComponent },
          { path: 'players/edit/:id', component: PlayerAddEditComponent },
          { path: 'tiers', component: TiersComponent },
          { path: 'tiers/create', component: TierAddEditComponent },
          { path: 'tiers/edit/:id', component: TierAddEditComponent },
          { path: 'years', component: FootballYearsComponent },
          { path: 'years/create', component: YearAddEditComponent },
          { path: 'years/edit/:id', component: YearAddEditComponent },
          { path: 'team-groups', component: TeamGroupsComponent },
          { path: 'team-groups/create', component: TeamGroupAddEditComponent },
          { path: 'team-groups/edit/:id', component: TeamGroupAddEditComponent },
          { path: 'friendly-matches', component: FriendlyMatchesComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }