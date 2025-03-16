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
  userId: number | undefined = undefined; // Initialized with undefined
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
    const userRole = localStorage.getItem('role'); // Get role for validation
    
    if (storedUserId && userRole) {
      this.userId = parseInt(storedUserId, 10);
      console.log('User ID from localStorage:', this.userId, 'Role:', userRole); // Debugging

      // Verifikasi jika user yang login sesuai dengan role yang diharapkan untuk komponen ini
      if (this.isValidUserRole(userRole)) {
        this.loadUserProfile();
      } else {
        Swal.fire('Error', 'Role pengguna tidak sesuai!', 'error');
      }
    } else {
      Swal.fire('Error', 'ID Pengguna atau Role tidak ditemukan di localStorage!', 'error');
    }
  }

  isValidUserRole(role: string): boolean {
    // Verifikasi jika role sesuai (misalnya 'author' untuk komponen ini)
    return role === 'author'; // Asumsikan komponen ini untuk role 'author'
  }

  loadUserProfile() {
    console.log('Requesting user profile for ID:', this.userId);
    this.profileService.getUserById(this.userId!).subscribe(user => {
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
    });
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
    if (this.profileForm.invalid) {
      Swal.fire('Error!', 'Please fill in all the fields correctly.', 'error');
      return;
    }

    // Debugging: Cek nilai form sebelum dikirimkan
    console.log('Form Data:', this.profileForm.value);

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

        // Pastikan hanya mengirim field yang diperlukan
        const { watchlist, ...otherFields } = this.profileForm.value;

        // Loop untuk menambahkan data yang diperlukan ke formData
        Object.entries(otherFields).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'profile' && value instanceof File) {
              formData.append(key, value); // Menambahkan file jika ada
            } else {
              formData.append(key, value.toString()); // Menambahkan field lainnya
            }
          }
        });

        // Kirim data ke backend untuk update profil
        this.profileService.updateUser(this.userId!, formData).subscribe(
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
      return imagePath; // Jika path sudah URL, kembalikan URL tersebut
    }
    return this.profileService.getFilmImagePath(imagePath); // Menggunakan path dari service
  }

  goBack() {
    window.history.back();
  }
}
