import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private totalUrl = 'http://localhost:3000';
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  }

  getTotalUsers(): Observable<{ totalUsers: number }> {
    return this.http.get<{ totalUsers: number }>(`${this.totalUrl}/total-users`, { headers: this.getAuthHeaders() });
  }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    return this.http.put(`${this.apiUrl}/${id}`, user, { headers });
  }
  

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getFilmImagePath(imagePath: string): string {
    return `http://localhost:3000/${imagePath}`;
  } 

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:3000/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}