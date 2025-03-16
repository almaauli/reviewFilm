import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { NegaraService } from '../../../services/negara.service';
import { TahunService } from '../../../services/tahun.service';
import { FilmService } from '../../../services/film.service';
import { KomentarService } from '../../../services/coment.service';
import { GenreService } from '../../../services/genre.service';
import { Negara } from '../../../model/negara.model';
import { Tahun } from '../../../model/tahun.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  isSidebarToggled = false;
  totalUsers: number = 0;
  negaraList: Negara[] = [];
  tahunList: Tahun[] = [];
  totalFilm: number = 0;
  totalComent: number = 0;
  totalGenre: number = 0;
  isAdmin = false;

  constructor(private userService: UserService, private filmService: FilmService, private komentarService: KomentarService, private genreService: GenreService,
    private negaraService: NegaraService, private tahunService: TahunService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    
    this.userService.getTotalUsers().subscribe(
      (data) => {
        this.totalUsers = data.totalUsers;
      },
      (error) => {
        console.error('Error fetching total users:', error);
      }
    );

    this.filmService.getTotalFilm().subscribe(
      (data) => {
        this.totalFilm = data.totalFilm;
      },
      (error) => {
        console.error('Error fetching total users:', error);
      }
    );

    this.komentarService.getTotalComent().subscribe(
      (data) => {
        this.totalComent = data.totalComent;
      },
      (error) => {
        console.error('Error fetching total komentar:', error);
      }
    );

    this.genreService.getTotalGenre().subscribe(
      (data) => {
        this.totalGenre = data.totalGenre;
      },
      (error) => {
        console.error('Error fetching total genre:', error);
      }
    );

    this.negaraService.getNegara().subscribe(
      (data) => {
        this.negaraList = data.slice(-10); 
      },
      (error) => {
        console.error('Error fetching negara:', error);
      }
    );
    
    this.tahunService.getTahun().subscribe(
      (data) => {
        this.tahunList = data.slice(-10);
      },
      (error) => {
        console.error('Error fetching tahun:', error);
      }
    );
  }

  toggleSidebar(): void {
    this.isSidebarToggled = !this.isSidebarToggled;
  }
}
