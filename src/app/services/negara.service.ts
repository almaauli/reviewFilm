import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NegaraService {
  private apiUrl = 'http://localhost:3000/negara';

  constructor(private http: HttpClient) {}

  getNegara(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addNegara(namaNegara: any): Observable<any> {
    return this.http.post(this.apiUrl, { nama_negara: namaNegara }, { headers: this.getAuthHeaders() });
  }

  updateNegara(id: number, namaNegara: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { nama_negara: namaNegara }, { headers: this.getAuthHeaders() });
  }

  deleteNegara(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }
}
