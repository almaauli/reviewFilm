import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/profile';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  // Mengambil data user berdasarkan ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, userData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }) // Hanya Authorization
    });
}

  // Mendapatkan URL gambar profil dari backend
  getFilmImagePath(imagePath: string): string {
    return `http://localhost:3000/${imagePath}`;
  } 
}
