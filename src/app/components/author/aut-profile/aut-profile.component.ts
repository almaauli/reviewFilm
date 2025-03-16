import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import Swal from 'sweetalert2';
import { SubsProfileComponent } from '../../subs/subs-profile/subs-profile.component';

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
      nama: [''],
      usia: [''],
      email: [''],
      password: [''],
      role: [''],
      watchlist: [''],
      profile: [null]
    });
  }

  ngOnInit() {
    const storedUserId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');
    
    console.log('Stored User ID:', storedUserId); // Debugging
    if (storedUserId && userRole) {
      this.userId = parseInt(storedUserId, 10);
      console.log('User ID from localStorage:', this.userId, 'Role:', userRole); // Debugging
      
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
    // Verifikasi apakah role sesuai dengan komponen ini (misalnya 'author' atau 'subscriber')
    return role === 'author';  // Karena kita hanya ingin memvalidasi role 'author' di komponen ini
  }
  
  loadUserProfile() {
    console.log('Requesting user profile for ID:', this.userId); // Debugging
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
  
          this.profileService.updateUser(this.userId!, formData).subscribe(
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

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg'; // Gambar default jika kosong
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return this.profileService.getFilmImagePath(imagePath);
  }

  goBack() {
    window.history.back();
  }
}
