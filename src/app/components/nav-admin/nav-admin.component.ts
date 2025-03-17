import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-admin',
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.css'],
})
export class NavAdminComponent implements OnInit {
  user: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
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
        localStorage.removeItem('admin');
  
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
