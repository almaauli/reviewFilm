import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:3000/api'; // Sesuaikan dengan backend-mu

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }

  getTopReviewers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-reviewers`);
  }
}
