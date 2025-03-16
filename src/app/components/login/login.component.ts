import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

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
        alert(res.message);
  
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('user_id', res.userId);
  
        if (res.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (res.role === 'author') {
          this.router.navigate(['/aut-home']);
        } else if (res.role === 'user') {
          this.router.navigate(['/subs-home']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (err) => {
        alert(err.error.message || 'Login failed');
      }
    );
  }  
  
  goBack() {
    console.log('Tombol kembali diklik!');
    this.location.back();
  }
}
