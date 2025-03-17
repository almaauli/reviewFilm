import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminTfilmComponent } from './components/admin/admin-tfilm/admin-tfilm.component';
import { AdminTgenreComponent } from './components/admin/admin-tgenre/admin-tgenre.component';
import { AdminTcomentComponent } from './components/admin/admin-tcoment/admin-tcoment.component';
import { AdminTnegaraComponent } from './components/admin/admin-tnegara/admin-tnegara.component';
import { AdminTuserComponent } from './components/admin/admin-tuser/admin-tuser.component';
import { AdminTtahunComponent } from './components/admin/admin-ttahun/admin-ttahun.component';
import { AnonLpComponent } from './components/anon/anon-lp/anon-lp.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListFilmComponent } from './components/anon/list-film/list-film.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { NavAdminComponent } from './components/nav-admin/nav-admin.component';
import { SideAdminComponent } from './components/side-admin/side-admin.component';
import { SubsHomeComponent } from './components/subs/subs-home/subs-home.component';
import { DetailFilmComponent } from './components/anon/detail-film/detail-film.component';
import { NavbarSubsComponent } from './components/navbar-subs/navbar-subs.component';
import { ListFilmsubsComponent } from './components/subs/list-filmsubs/list-filmsubs.component';
import { DetailFilmsubsComponent } from './components/subs/detail-filmsubs/detail-filmsubs.component';
import { SubsKomenComponent } from './components/subs/subs-komen/subs-komen.component';
import { SubsWatchlistComponent } from './components/subs/subs-watchlist/subs-watchlist.component';
import { SubsProfileComponent } from './components/subs/subs-profile/subs-profile.component';
import { MoviesComponent } from './components/movies/movies.component';
import { NavAuthorComponent } from './components/nav-author/nav-author.component';
import { AutHomeComponent } from './components/author/aut-home/aut-home.component';
import { ListFilmautComponent } from './components/author/list-filmaut/list-filmaut.component';
import { DetailFilmautComponent } from './components/author/detail-filmaut/detail-filmaut.component';
import { AutKomenComponent } from './components/author/aut-komen/aut-komen.component';
import { AutProfileComponent } from './components/author/aut-profile/aut-profile.component';
import { AutWatchlistComponent } from './components/author/aut-watchlist/aut-watchlist.component';
import { AutMyfilmComponent } from './components/author/aut-myfilm/aut-myfilm.component';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent,
    AdminTfilmComponent,
    AdminTgenreComponent,
    AdminTcomentComponent,
    AdminTnegaraComponent,
    AdminTuserComponent,
    AdminTtahunComponent,
    AnonLpComponent,
    NavbarComponent,
    ListFilmComponent,
    NavAdminComponent,
    SideAdminComponent,
    SubsHomeComponent,
    DetailFilmComponent,
    NavbarSubsComponent,
    ListFilmsubsComponent,
    DetailFilmsubsComponent,
    SubsKomenComponent,
    SubsWatchlistComponent,
    SubsProfileComponent,
    MoviesComponent,
    NavAuthorComponent,
    AutHomeComponent,
    ListFilmautComponent,
    DetailFilmautComponent,
    AutKomenComponent,
    AutProfileComponent,
    AutWatchlistComponent,
    AutMyfilmComponent,
    SafeUrlPipe,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  providers: [
    AuthService,
    provideHttpClient(withFetch()),
    provideClientHydration(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
