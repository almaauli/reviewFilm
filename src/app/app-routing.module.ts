import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminTfilmComponent } from './components/admin/admin-tfilm/admin-tfilm.component';
import { AdminTcomentComponent } from './components/admin/admin-tcoment/admin-tcoment.component';
import { AdminTgenreComponent } from './components/admin/admin-tgenre/admin-tgenre.component';
import { AdminTnegaraComponent } from './components/admin/admin-tnegara/admin-tnegara.component';
import { AdminTuserComponent } from './components/admin/admin-tuser/admin-tuser.component';
import { AdminTtahunComponent } from './components/admin/admin-ttahun/admin-ttahun.component';
import { AnonLpComponent } from './components/anon/anon-lp/anon-lp.component';
import { ListFilmComponent } from './components/anon/list-film/list-film.component';
import { SubsHomeComponent } from './components/subs/subs-home/subs-home.component';
import { DetailFilmComponent } from './components/anon/detail-film/detail-film.component';
import { ListFilmsubsComponent } from './components/subs/list-filmsubs/list-filmsubs.component';
import { DetailFilmsubsComponent } from './components/subs/detail-filmsubs/detail-filmsubs.component';
import { SubsKomenComponent } from './components/subs/subs-komen/subs-komen.component';
import { SubsWatchlistComponent } from './components/subs/subs-watchlist/subs-watchlist.component';
import { SubsProfileComponent } from './components/subs/subs-profile/subs-profile.component';
import { MoviesComponent } from './components/movies/movies.component';
import { AutHomeComponent } from './components/author/aut-home/aut-home.component';
import { AutKomenComponent } from './components/author/aut-komen/aut-komen.component';
import { AutProfileComponent } from './components/author/aut-profile/aut-profile.component';
import { AutWatchlistComponent } from './components/author/aut-watchlist/aut-watchlist.component';
import { DetailFilmautComponent } from './components/author/detail-filmaut/detail-filmaut.component';
import { ListFilmautComponent } from './components/author/list-filmaut/list-filmaut.component';
import { AutMyfilmComponent } from './components/author/aut-myfilm/aut-myfilm.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin-tfilm', component: AdminTfilmComponent },
  { path: 'admin-tcoment', component: AdminTcomentComponent },
  { path: 'admin-tgenre', component: AdminTgenreComponent },
  { path: 'admin-tnegara', component: AdminTnegaraComponent },
  { path: 'admin-tuser', component: AdminTuserComponent },
  { path: 'admin-ttahun', component: AdminTtahunComponent },
  { path: 'anon', component: AnonLpComponent },
  { path: 'list-film', component: ListFilmComponent },
  { path: 'subs-home', component: SubsHomeComponent },
  { path: 'detail-film/:id', component: DetailFilmComponent },
  { path: 'list-filmsubs', component: ListFilmsubsComponent },
  { path: 'detail-filmsubs/:id', component: DetailFilmsubsComponent },
  { path: 'subs-komen/:id', component: SubsKomenComponent },
  { path: 'subs-watchlist', component: SubsWatchlistComponent },
  { path: 'subs-profile', component: SubsProfileComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'aut-home', component: AutHomeComponent },
  { path: 'aut-komen/:id', component: AutKomenComponent },
  { path: 'aut-profile', component: AutProfileComponent },
  { path: 'aut-watchlist', component: AutWatchlistComponent },
  { path: 'detail-filmaut/:id', component: DetailFilmautComponent },
  { path: 'list-filmaut', component: ListFilmautComponent },
  { path: 'myfilm', component: AutMyfilmComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', redirectTo: 'anon', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
