import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../../services/film.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-filmsubs',
  templateUrl: './list-filmsubs.component.html',
  styleUrls: ['./list-filmsubs.component.css'],
})
export class ListFilmsubsComponent implements OnInit {
  latestFilms: any[] = [];
  popularFilms: any[] = [];
  filmsByGenre: any[] = [];
  currentSection: string = 'latest'; // Default tampilan
  selectedGenreId: number | null = null;
  films: any[] = [];

  constructor(
    private filmService: FilmService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadFilms();
  
    this.route.queryParams.subscribe(params => {
      console.log("Query Params:", params); // Debugging
  
      const searchQuery = params['search'] ? params['search'].toString() : undefined;
      const genreId = params['genreId'] ? params['genreId'].toString() : undefined;
      const countryId = params['countryId'] ? params['countryId'].toString() : undefined;
      const year = params['year'] ? params['year'].toString() : undefined;
      const section = params['section'] || undefined; // Tangkap 'section' langsung
  
      console.log("Processed Query Params:", { searchQuery, genreId, countryId, year, section });
  
      if (searchQuery) {
        console.log("Performing search:", searchQuery);
        this.currentSection = 'list';
        this.fetchFilmsBySearch(searchQuery);
        return; // Hentikan eksekusi agar tidak memanggil `fetchFilms()`
      } 
  
      if (section === 'popular') {
        console.log("Setting section to popular");
        this.currentSection = 'popular';
      } else if (section === 'latest') {
        console.log("Setting section to latest");
        this.currentSection = 'latest';
      } else if (genreId || countryId || year) {
        console.log("Fetching films by genre/country/year");
        this.currentSection = 'list';
        this.fetchFilms(genreId, countryId, year);
      } else {
        console.log("Setting section to latest (default)");
        this.currentSection = 'latest';
      }
  
      console.log("Current Section:", this.currentSection);
    });
  }
  
  fetchFilms(genreId?: string, countryId?: string, year?: string) {
    this.films = []; // Reset data sebelum mengambil yang baru
    this.currentSection = 'list'; // Set current section agar hanya filmList yang muncul

    const params: any = {};
    if (genreId && genreId !== 'null' && genreId !== '') params.genreId = genreId;
    if (countryId && countryId !== 'null' && countryId !== '') params.countryId = countryId;
    if (year && year !== 'null' && year !== '') params.year = year;

    console.log("Fetching films with params:", params); // Debugging

    this.filmService.searchFilms(undefined, params.genreId, params.countryId, params.year).subscribe(
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

  goBack() {
    console.log('Tombol kembali diklik!');
    this.location.back();
  }
}
