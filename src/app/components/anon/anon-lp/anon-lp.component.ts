import { Component,OnInit } from '@angular/core';
import { FilmService } from '../../../services/film.service';
import { UserService } from '../../../services/user.service';
import { StatisticsService } from '../../../services/statistic.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-anon-lp',
  templateUrl: './anon-lp.component.html',
  styleUrl: './anon-lp.component.css'
})
export class AnonLpComponent  implements OnInit {
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
  userProfileImage: string = 'assets/default-profile.png';
  selectedFilters: any = {};

  constructor(private filmService: FilmService, 
    private statisticsService: StatisticsService, 
    private userService: UserService,
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
      this.groupedLatestFilms = this.chunkArray(data, 3); 
    });

    this.filmService.getPopularFilms().subscribe((data) => {
      this.popularFilms = data;
      this.groupedPopularFilms = this.chunkArray(data, 3);
    });

    this.filmService.getLatestComments().subscribe((data) => {
      this.latestComments = data;
    });
    this.loadStatistics();
    this.loadTopReviewers();
  }

    // Simpan filter yang dipilih
    selectFilter(type: string, name: string, id?: number) {
      this.selectedFilters[type] = name;
      if (id !== undefined) {
        this.selectedFilters[type + 'Id'] = id;
      }
    }
  
    applyFilter() {
      const queryParams: any = {};
      if (this.selectedFilters.year) queryParams.year = this.selectedFilters.year;
      if (this.selectedFilters.genreId) queryParams.genreId = this.selectedFilters.genreId;
      if (this.selectedFilters.countryId) queryParams.countryId = this.selectedFilters.countryId;
  
      this.router.navigate(['/list-film'], { queryParams });
    }
  
  searchFilms() {
    const searchQuery = this.searchForm.value.query.trim();
  
    if (!searchQuery) return;
  
    this.router.navigate(['/list-film'], { 
      queryParams: { search: searchQuery },
      fragment: 'filmList' 
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
      this.topReviewers = data;
      this.userProfileImage =  'assets/default-profile.png';
    });
  }  

  chunkArray(arr: any[], size: number): any[][] {
    return arr.reduce((acc, _, i) => 
      i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc, []
    );
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return this.filmService.getFilmImagePath(imagePath);
  }
  
  getImagePath2(imagePath: string): string {
    return this.userService.getFilmImagePath(imagePath);
  }
  
convertToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} jam ${remainingMinutes} menit` : `${hours} jam`;
}

}
