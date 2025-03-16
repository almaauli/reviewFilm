import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from '../model/film.model';

@Injectable({ providedIn: 'root' })
export class FilmService {
  [x: string]: any;
  private apiUrl = 'http://localhost:3000';
  private filmUrl = 'http://localhost:3000/films';
  private anonUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getFilm(): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.apiUrl}/films`, {
      headers: this.getAuthHeaders(),
    });
  }

  getTotalFilm(): Observable<{ totalFilm: number }> {
    return this.http.get<{ totalFilm: number }>(`${this.apiUrl}/total-film`, {
      headers: this.getAuthHeaders(),
    });
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.anonUrl}/genres`);
  }

  getYears() {
    return this.http.get<any[]>(`${this.anonUrl}/tahun`);
  }

  getCountries() {
    return this.http.get<any[]>(`${this.anonUrl}/negara`);
  }

  getLatestFilms(): Observable<any> {
    return this.http.get(`${this.anonUrl}/films`);
  }

  getPopularFilms(): Observable<any> {
    return this.http.get(`${this.anonUrl}/popular-films`);
  }

  getLatestComments(): Observable<any> {
    return this.http.get(`${this.anonUrl}/comments`);
  }

  getFilmImagePath(imagePath: string): string {
    return `http://localhost:3000/${imagePath}`;
  }

  getFilmById(id: string): Observable<any> {
    return this.http.get(`${this.anonUrl}/films/${id}`);
  }

  getCommentsByFilmId(id: string): Observable<any> {
    return this.http.get(`${this.anonUrl}/comments/film/${id}`);
  }

  getFilmsByGenre(idGenre: number) {
    return this.http.get<any[]>(`${this.apiUrl}/films/genre/${idGenre}`);
  }

  addFilm(film: any): Observable<any> {
    return this.http.post(this.filmUrl, film);
  }

  updateFilm(id: number, film: any): Observable<any> {
    return this.http.put(`${this.filmUrl}/${id}`, film);
  }

  deleteFilm(id: number): Observable<any> {
    return this.http.delete(`${this.filmUrl}/${id}`);
  }

  searchFilms(query?: string, genreId?: string, countryId?: string, year?: string): Observable<any[]> {
    let params: any = {};
    if (query) params.query = query;
    if (genreId) params.genreId = genreId;
    if (countryId) params.countryId = countryId;
    if (year) params.year = year;
  
    return this.http.get<any[]>(`${this.apiUrl}/films/search`, { params });
  }
  
  getFilmsByAuthor(authorId: number): Observable<Film[]> {
    return this.http.get<Film[]>(`${this.filmUrl}/author/${authorId}`, {
      headers: this.getAuthHeaders(),
    });
  }

 uploadFile(formData: FormData): Observable<any> {
  return this.http.post('http://localhost:3000/api/upload', formData, {
    reportProgress: true,
    observe: 'events'
  });
}

  
}
