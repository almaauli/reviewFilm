import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  constructor(private http: HttpClient, private router: Router) {}

  register(user: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, user, { withCredentials: true })
      .pipe(catchError(this.handleError.bind(this)));
  }

  login(user: any): Observable<any> {
    return this.http
      .post<{ token: string; role: string }>(`${this.apiUrl}/login`, user, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role); // Simpan role
            console.log('Login sukses, token:', response.token, 'role:', response.role);
            this.isAuthenticatedSubject.next(true); 
          } else {
            console.error('Login gagal: token tidak diterima');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }
  
  logout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.logoutUser()),
        catchError(this.handleError.bind(this))
      );
      this.isAuthenticatedSubject.next(false); 
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
  
  handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      if (error.error.message === 'Session expired, please login again') {
        alert('Sesi kamu sudah habis, silakan login lagi.');
      } else {
        alert('Kamu tidak diizinkan mengakses data ini.');
      }
      this.logoutUser(); // Hapus token & logout otomatis
    }
    return throwError(() => new Error(error.message || 'Terjadi kesalahan'));
  }

  getUser(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      return {
        nama: payload.nama || 'User', // Ambil nama dari payload
        profile: payload.profile || 'assets/default-profile.png', // Ambil profile dari payload
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }  

  getToken(): string | null {
    return localStorage.getItem('token'); // Ambil token dari localStorage
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      return payload.userId; // Pastikan server mengembalikan id_user dalam token
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  
  getUserRole(): string {
    return localStorage.getItem('role') || 'anon'; // Default ke 'anon' jika tidak ada role
  }
  
  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }
  
  resetPassword(token: string | null, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
  

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
