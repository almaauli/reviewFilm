import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aut-profile',
  templateUrl: './aut-profile.component.html',
  styleUrls: ['./aut-profile.component.css']
})
export class AutProfileComponent implements OnInit {
  profileForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  userId: number | undefined = undefined; // Menghindari nilai default salah
  user: any;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      nama: ['', Validators.required],
      usia: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Validasi usia hanya angka
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      role: ['author', Validators.required],
      watchlist: [''],
      profile: [null]
    });
  }

  ngOnInit() {
    const storedUserId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
  
    console.log('Stored User ID:', storedUserId, 'Role:', userRole); // Debugging
  
    if (storedUserId && userRole) {
      this.userId = storedUserId && !isNaN(parseInt(storedUserId, 10)) ? parseInt(storedUserId, 10) : undefined;
      console.log('User ID parsed:', this.userId); // Debugging
  
      if (this.userId! > 0 && this.isValidUserRole(userRole)) {
        this.loadUserProfile();
      } else {
        Swal.fire('Error', 'ID Pengguna tidak valid atau role tidak sesuai!', 'error');
      }
    } else {
      Swal.fire('Error', 'ID Pengguna atau Role tidak ditemukan di localStorage!', 'error');
    }
  }
  

  isValidUserRole(role: string): boolean {
    return role === 'author'; // Pastikan role yang login sesuai
  }

  loadUserProfile() {
    if (!this.userId) {
      Swal.fire('Error', 'ID pengguna tidak valid!', 'error');
      return;
    }

    console.log('Requesting user profile for ID:', this.userId);
    this.profileService.getUserById(this.userId).subscribe(
      user => {
        console.log('Fetched user data:', user); // Debugging
        if (user) {
          this.user = user;
          this.profileForm.patchValue({
            nama: user.nama,
            usia: user.usia,
            email: user.email,
            role: user.role,
            watchlist: user.watchlist || ''
          });
          this.imagePreview = this.getImagePath(user.profile);
        }
      },
      error => {
        console.error('Error fetching user data:', error);
        Swal.fire('Error', 'Gagal mengambil data profil!', 'error');
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.profileForm.patchValue({ profile: file });
    }
  }

  onSubmit() {
    if (!this.userId) {
      Swal.fire('Error!', 'ID pengguna tidak valid!', 'error');
      return;
    }

    if (this.profileForm.invalid) {
      Swal.fire('Error!', 'Pastikan semua data telah diisi dengan benar.', 'error');
      return;
    }

    console.log('Form Data sebelum submit:', this.profileForm.value);
    console.log('Updating profile for ID:', this.userId); // Debugging sebelum update

    Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin memperbarui profil?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Update!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();

        // Loop untuk menambahkan data yang diperlukan ke formData
        Object.entries(this.profileForm.value).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'profile' && value instanceof File) {
              formData.append(key, value); // Menambahkan file jika ada
            } else {
              formData.append(key, value.toString()); // Menambahkan field lainnya
            }
          }
        });

        // Kirim data ke backend untuk update profil
        console.log('Updating profile for ID:', this.user.id_user);
        this.profileService.updateUser(this.user.id_user, formData).subscribe(
          response => {
            console.log('Server Response:', response);
            Swal.fire('Berhasil!', 'Profil berhasil diperbarui.', 'success');
          },
          error => {
            console.error('Error:', error);
            Swal.fire('Error!', 'Terjadi kesalahan saat memperbarui profil.', 'error');
          }
        );
      }
    });
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg'; // Gambar default jika path kosong
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath; // Jika path sudah berupa URL
    }
    return this.profileService.getFilmImagePath(imagePath); // Menggunakan service untuk path
  }

  goBack() {
    window.history.back();
  }
}
