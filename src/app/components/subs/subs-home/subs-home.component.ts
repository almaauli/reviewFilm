import { Component,OnInit } from '@angular/core';
import { FilmService } from '../../../services/film.service';
import { StatisticsService } from '../../../services/statistic.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-subs-home',
  templateUrl: './subs-home.component.html',
  styleUrl: './subs-home.component.css'
})
export class SubsHomeComponent  implements OnInit {
  genres: any[] = [];
  years: any[] = [];
  countries: any[] = [];
  selectedGenre: string = '';
  selectedYear: string = '';
  selectedCountry: string = '';
  latestFilms: any[] = [];
  popularFilms: any[] = [];
  groupedLatestFilms: any[][] = [];
  groupedPopularFilms: any[][] = [];
  latestComments: any[] = [];
  totalMovies: number = 0;
  totalReviews: number = 0;
  totalUsers: number = 0;
  topReviewers: any[] = [];
  searchForm: FormGroup;

  constructor(private filmService: FilmService, 
    private statisticsService: StatisticsService, 
    private router: Router,
    private fb: FormBuilder, ) { 
      this.searchForm = this.fb.group({
      query: ['']
    });}

  ngOnInit() {
    this.filmService.getGenres().subscribe((data) => this.genres = data);
    this.filmService.getYears().subscribe((data) => this.years = data);
    this.filmService.getCountries().subscribe((data) => this.countries = data);
    this.filmService.getGenres().subscribe((data) => {
      this.genres = data;
    });

    this.filmService.getLatestFilms().subscribe((data) => {
      this.latestFilms = data;
      this.groupedLatestFilms = this.chunkArray(data, 3); // Kelompokkan 3 film per slide
    });

    this.filmService.getPopularFilms().subscribe((data) => {
      this.popularFilms = data;
      this.groupedPopularFilms = this.chunkArray(data, 3); // Kelompokkan 3 film per slide
    });

    this.filmService.getLatestComments().subscribe((data) => {
      this.latestComments = data;
    });
    this.loadStatistics();
    this.loadTopReviewers();
  }
  
  searchFilms() {
    const searchQuery = this.searchForm.value.query.trim();
  
    if (!searchQuery) return;
  
    this.router.navigate(['/list-filmsubs'], { 
      queryParams: { search: searchQuery },
      fragment: 'filmList' // Menyertakan fragment untuk scroll ke daftar film
    });
  
    console.log('Navigating with query:', searchQuery);
  }  
  

  loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe(data => {
      this.totalMovies = data.totalMovies || 0;
      this.totalReviews = data.totalReviews || 0;
      this.totalUsers = data.totalUsers || 0;
    });
  }

  loadTopReviewers(): void {
    this.statisticsService.getTopReviewers().subscribe(data => {
      this.topReviewers = data; // Langsung pakai data dari backend
    });
  }  

  chunkArray(arr: any[], size: number): any[][] {
    return arr.reduce((acc, _, i) => 
      i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc, []
    );
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg'; // Gambar default jika kosong
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return this.filmService.getFilmImagePath(imagePath);
  }
  
convertToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} jam ${remainingMinutes} menit` : `${hours} jam`;
}

}
