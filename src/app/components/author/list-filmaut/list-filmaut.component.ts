import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../../services/film.service';

@Component({
  selector: 'app-list-filmaut',
  templateUrl: './list-filmaut.component.html',
  styleUrls: ['./list-filmaut.component.css'],
})
export class ListFilmautComponent implements OnInit {
  latestFilms: any[] = [];
  popularFilms: any[] = [];
  filmsByGenre: any[] = [];
  currentSection: string = 'latest'; // Default tampilan
  selectedGenreId: number | null = null;
  films: any[] = [];

  constructor(
    private filmService: FilmService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.loadFilms();
    this.route.queryParams.subscribe(params => {
      console.log("Query Params:", params); // Debugging
    
      const searchQuery = params['search'] ? params['search'].toString() : undefined;
      const genreId = params['genreId'] && params['genreId'] !== 'null' && params['genreId'] !== '' ? params['genreId'] : undefined;
      const countryId = params['countryId'] && params['countryId'] !== 'null' && params['countryId'] !== '' ? params['countryId'] : undefined;
      const year = params['year'] && params['year'] !== 'null' && params['year'] !== '' ? params['year'] : undefined;
      const rating = params['rating'] && params['rating'] !== 'null' && params['rating'] !== '' ? params['rating'] : undefined;
      const section = params['section'] || undefined;
    
      console.log("Processed Query Params:", { searchQuery, genreId, countryId, year, rating, section });
    
      if (searchQuery) {
        console.log("Performing search:", searchQuery);
        this.currentSection = 'list';
        this.fetchFilmsBySearch(searchQuery);
        return;
      } 
    
      if (genreId || countryId || year || rating) {
        console.log("Fetching films by genre/country/year");
        this.currentSection = 'list';
        this.fetchFilms(genreId, countryId, year, rating);
      } else if (section === 'popular') {
        console.log("Setting section to popular");
        this.currentSection = 'popular';
      } else if (section === 'latest') {
        console.log("Setting section to latest");
        this.currentSection = 'latest';
      } else {
        console.log("Setting section to latest (default)");
        this.currentSection = 'latest';
      }
    
      console.log("Current Section:", this.currentSection);
    });    
  }
  
  fetchFilms(genreId?: string, countryId?: string, year?: string, rating?: string) {
    this.films = [];
    this.currentSection = 'list';
  
    const params: any = {};
    if (genreId) params.genreId = genreId;
    if (countryId) params.countryId = countryId;
    if (year) params.year = year;
    if (rating) params.rating = rating;
  
    console.log("Fetching films with params:", params); // Debugging
  
    this.filmService.searchFilms(undefined, params.genreId, params.countryId, params.year, params.rating).subscribe(
      (data) => {
        console.log('Hasil Pencarian dari Backend:', data);
        this.films = data.length > 0 ? data : []; // Kosongkan list film jika tidak ada hasil
      },
      (error) => {
        console.error('Error fetching films:', error);
      }
    );
  }

fetchFilmsBySearch(query: string) {
  console.log("Searching films with query:", query); // Debugging
  this.filmService.searchFilms(query, undefined, undefined, undefined).subscribe(
    (data) => {
      console.log("Search results:", data);
      this.films = data;
    },
    (error) => console.error("Error fetching search results:", error)
  );
}

  loadFilms() {
    this.filmService.getLatestFilms().subscribe(
      (data) => (this.latestFilms = data),
      (error) => console.error('Error fetching latest films:', error)
    );

    this.filmService.getPopularFilms().subscribe(
      (data) => (this.popularFilms = data),
      (error) => console.error('Error fetching popular films:', error)
    );
  }

  loadFilmsByGenre(idGenre: number) {
    if (!idGenre) return; // Cegah request jika ID tidak valid

    this.filmService.getFilmsByGenre(idGenre).subscribe(
      (data) => (this.filmsByGenre = data),
      (error) =>
        console.error(`Error fetching films for genre ID ${idGenre}:`, error)
    );
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg'; // Gambar default jika kosong
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return this.filmService.getFilmImagePath(imagePath);
  }
}
