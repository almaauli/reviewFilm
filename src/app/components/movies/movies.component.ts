import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilmService } from '../../services/film.service';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies: any[] = [];
  isAuthenticated: boolean = false;
  userRole: string = 'anon';

  constructor(private http: HttpClient, private filmService: FilmService,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(authStatus => {
      this.isAuthenticated = authStatus;
      this.userRole = this.authService.getUserRole();
    });
    this.getMovies();
  }

  getMovies() {
    this.http.get<any[]>('http://localhost:3000/films').subscribe(
      data => {
        this.movies = data;
      },
      error => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg'; // Gambar default jika kosong
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return this.filmService.getFilmImagePath(imagePath);
  }

  getDetailRoute(movieId: number): string[] {
    const role = this.authService.getUserRole(); // Ambil role dari localStorage
    if (role === 'user') {
      return ['/detail-filmsubs', movieId.toString()];
    } else if (role === 'author') {
      return ['/detail-filmaut', movieId.toString()];
    } else {
      return ['/detail-film', movieId.toString()]; // Untuk pengguna anonim
    }
  }  
  
  goBack() {
    console.log('Tombol kembali diklik!');
  this.location.back();
  }
}
