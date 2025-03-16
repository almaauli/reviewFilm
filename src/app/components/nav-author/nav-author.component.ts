import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-nav-author',
  templateUrl: './nav-author.component.html',
  styleUrls: ['./nav-author.component.css']
})
export class NavAuthorComponent implements OnInit {
  userName: string = '';
  userProfileImage: string = 'assets/default-profile.png'; // Default image

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  getImagePath(imagePath: string): string {
    return this.userService.getFilmImagePath(imagePath);
  }
  
  loadUserData(): void {
    const user = this.authService.getUser(); // Ambil data user dari AuthService
    if (user) {
      this.userName = user.nama;
      this.userProfileImage = user.profile || 'assets/default-profile.png';
    }
  }
  logout() {
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
  
        // Hapus riwayat sebelumnya untuk mencegah kembali ke halaman sebelumnya
        window.history.pushState(null, '', '/anon');
        window.history.pushState(null, '', '/anon');
        window.addEventListener('popstate', function () {
          window.history.pushState(null, '', '/anon');
        });
  
        this.router.navigate(['/anon'], { replaceUrl: true });
  
        Swal.fire('Berhasil!', 'Anda telah logout.', 'success');
      }
    });
  }  
}
