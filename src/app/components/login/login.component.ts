import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private location: Location) {}

  login() {
    const userData = { email: this.email, password: this.password };

    this.authService.login(userData).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          text: res.message,
          timer: 1500,
          showConfirmButton: false
        });

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('user_id', res.userId);

        setTimeout(() => {
          if (res.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (res.role === 'author') {
            this.router.navigate(['/aut-home']);
          } else if (res.role === 'user') {
            this.router.navigate(['/subs-home']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1500);
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal!',
          text: err.error.message || 'Terjadi kesalahan',
        });
      }
    );
  }  

  goBack() {
    console.log('Tombol kembali diklik!');
    this.location.back();
  }
}
