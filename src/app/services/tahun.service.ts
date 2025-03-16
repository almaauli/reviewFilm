import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TahunService {
  private apiUrl = 'http://localhost:3000/tahun';

  constructor(private http: HttpClient) {}

  getTahun(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addTahun(tahun: any): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { tahun_rilis: tahun },
      { headers: this.getAuthHeaders() }
    );
  }

  updateTahun(id: number, tahun: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      { tahun_rilis: tahun },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteTahun(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }
}
