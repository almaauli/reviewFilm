import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar-subs',
  templateUrl: './navbar-subs.component.html',
  styleUrls: ['./navbar-subs.component.css']
})
export class NavbarSubsComponent implements OnInit {
  userName: string = '';
  userProfileImage: string = 'assets/default-profile.png'; // Default image

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-profile.png'; // Default image
  
    // Jika sudah berupa URL, langsung dikembalikan
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
  
    // Jika hanya nama file, tambahkan URL backend
    return `http://localhost:3000/uploads/${imagePath}`;
  }
  
  
  loadUserData(): void {
    const user = this.authService.getUser(); // Ambil data user dari AuthService
    console.log('User data:', user); // Debugging
    
    if (user) {
      this.userName = user.nama;
      this.userProfileImage = user.profile || 'assets/default-profile.png';
      console.log('User profile image:', this.userProfileImage); // Debugging
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
