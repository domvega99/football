import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { LoginGuard } from '../guards/login.guard';
import { AuthGuard } from '../guards/auth.guard';
import { RegisterComponent } from '../components/register/register.component';
import { TeamComponent } from './pages/team/team.component';
import { NewsComponent } from './pages/news/news.component';
import { NewsDetailsComponent } from './pages/contents/news-details/news-details.component';
import { FeatureDetailsComponent } from './pages/contents/feature-details/feature-details.component';
import { TeamsComponent } from './components/teams/teams.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { FixturesComponent } from './pages/fixtures/fixtures.component';
import { TablesComponent } from './pages/tables/tables.component';
import { PageComponent } from './pages/page/page.component';
import { QuickviewComponent } from './pages/fixtures/quickview/quickview.component';
import { ResultsComponent } from './pages/results/results.component';
import { ClubLocatorsComponent } from './pages/club-locators/club-locators.component';


export const routes: Routes = [
    {
        path: '',
        component: ClientComponent,
        children: [
          // { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: '', component: HomeComponent },
          {
            path: 'login',
            component: LoginComponent,
            canActivate: [LoginGuard]
          },
          // {
          //   path: 'register',
          //   component: RegisterComponent,
          // },
          {
            path: 'profile',
            component: ProfileComponent,
          },
          {
            path: 'team',
            component: TeamComponent,
          },
          {
            path:'news',
            component: NewsComponent,
          },
          {
            path:'news/:id',
            component: NewsDetailsComponent
          },
          // {
          //   path: 'clubs',
          //   component: TeamsComponent
          // },
          {
            path: 'clubs/:params',
            component: ClubsComponent
          },
          {
            path: 'fixtures',
            component: FixturesComponent
          },
          {
            path: 'results',
            component: ResultsComponent
          },
          // {
          //   path: 'quickview',
          //   component: QuickviewComponent
          // },
          {
            path: 'tables',
            component: TablesComponent
          },
          {
            path: 'clubs',
            component: ClubLocatorsComponent
          },
          {
            path: ':params',
            component: PageComponent
          },
        ]
    },
   
    

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ClientRoutingModule { }