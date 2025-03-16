import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../model/genre.model';

@Injectable({ providedIn: 'root' })
export class GenreService {
  private apiUrl = 'http://localhost:3000';
  private genreUrl = 'http://localhost:3000/genre';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  getGenre(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.genreUrl, { headers: this.getAuthHeaders() });
  }

  addGenre(nama_genre: string): Observable<any> {
    return this.http.post(
      this.genreUrl,
      { nama_genre },
      { headers: this.getAuthHeaders() }
    );
  }

  updateGenre(id: number, nama_genre: string): Observable<any> {
    return this.http.put(
      `${this.genreUrl}/${id}`,
      { nama_genre },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteGenre(id: number): Observable<any> {
    return this.http.delete(`${this.genreUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getTotalGenre(): Observable<{ totalGenre: number }> {
    return this.http.get<{ totalGenre: number }>(`${this.apiUrl}/total-genre`, { headers: this.getAuthHeaders() });
  }
}