import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  newPassword = '';
  confirmPassword = '';
  token: string | null = null;
  isResetMode = false;

  constructor(private route: ActivatedRoute, private authService: AuthService,
    private location: Location
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.isResetMode = true; // Jika ada token, tampilkan form reset password
    }
  }

  sendResetLink() {
    this.authService.forgotPassword(this.email).subscribe(
      (res: any) => alert(res.message),
      (err) => alert(err.error.message || 'Failed to send reset link')
    );
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      (res: any) => alert(res.message),
      (err) => alert(err.error.message || 'Failed to reset password')
    );
  }
  goBack() {
    console.log('Tombol kembali diklik!');
    this.location.back();
  }
}
