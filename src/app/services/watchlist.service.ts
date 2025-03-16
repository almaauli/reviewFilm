import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class WatchlistService {
    private apiUrl = 'http://localhost:3000/api/watchlist'; // Sesuaikan dengan backend
  
    constructor(private http: HttpClient) {}
  
    getWatchlist(userId: string) {
      return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
    }
  
    addToWatchlist(id_user: string, id_film: number) {
        return this.http.post('http://localhost:3000/api/watchlist', { id_user, id_film });
      }      
  
    removeFromWatchlist(id_film: number, id_user: string): Observable<void> {
        return this.http.delete<void>(`http://localhost:3000/api/watchlist/${id_film}/${id_user}`);
      }
      
  }
  