import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Komentar } from '../model/coment.model';

@Injectable({ providedIn: 'root' })
export class KomentarService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  getKomentar(): Observable<Komentar[]> {
    return this.http.get<Komentar[]>(`${this.apiUrl}/komentar`, { headers: this.getAuthHeaders() });
  }

  addKomentar(komentar: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/komentar`, komentar);
  }

  updateKomentar(id: number, komentar: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/komentar/${id}`, komentar);
  }

  deleteKomentar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/komentar/${id}`);
  }

  getTotalComent(): Observable<{ totalComent: number }> {
    return this.http.get<{ totalComent: number }>(`${this.apiUrl}/total-komen`, { headers: this.getAuthHeaders() });
  }
}