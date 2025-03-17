import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aut-profile',
  templateUrl: './aut-profile.component.html',
  styleUrls: ['./aut-profile.component.css']
})
export class AutProfileComponent implements OnInit {
  profileForm: FormGroup;
  imagePreview: string | null = null;
  userId: number | undefined;
  user: any;

  constructor(private fb: FormBuilder, private profileService: ProfileService, private location: Location) {
    this.profileForm = this.fb.group({
      nama: ['', Validators.required],
      usia: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      role: ['author', Validators.required],
      watchlist: [''],
      profile: [null]
    });
  }

  ngOnInit() {
    const storedUserId = localStorage.getItem('user_id');
    const userRole = localStorage.getItem('role');

    if (storedUserId && userRole) {
      this.userId = !isNaN(parseInt(storedUserId, 10)) ? parseInt(storedUserId, 10) : undefined;

      if (this.userId && this.isValidUserRole(userRole)) {
        this.loadUserProfile();
      } else {
        Swal.fire('Error', 'ID Pengguna tidak valid atau role tidak sesuai!', 'error');
      }
    } else {
      Swal.fire('Error', 'ID Pengguna atau Role tidak ditemukan di localStorage!', 'error');
    }
  }

  isValidUserRole(role: string): boolean {
    return role === 'author';
  }

  loadUserProfile() {
    if (!this.userId) {
      Swal.fire('Error', 'ID pengguna tidak valid!', 'error');
      return;
    }

    this.profileService.getUserById(this.userId).subscribe(
      user => {
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
        this.imagePreview = reader.result as string;
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
        Object.entries(this.profileForm.value).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'profile' && value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        if (!this.profileForm.value.profile && this.user.profile) {
          formData.append('profile', this.user.profile);
        }

        this.profileService.updateUser(this.user.id_user, formData).subscribe(
          response => {
            Swal.fire('Berhasil!', 'Profil berhasil diperbarui.', 'success');
          },
          error => {
            Swal.fire('Error!', 'Terjadi kesalahan saat memperbarui profil.', 'error');
          }
        );
      }
    });
  }

  getImagePath(imagePath: string | null): string {
    if (!imagePath) return 'assets/default-image.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return `http://localhost:3000/uploads/${imagePath}`;
  }
  goBack(): void {
    this.location.back();
  }
}