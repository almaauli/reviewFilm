import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {} 

  register() {
    const userData = { nama: this.name, email: this.email, password: this.password };

    this.http.post('http://localhost:3000/register', userData).subscribe({
      next: (response: any) => {
        alert(response.message || "Registrasi berhasil!");
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        console.error("Error saat registrasi:", error);
        alert(error.error?.error || "Terjadi kesalahan.");
      }
    });
  }
}
