import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aut-profile',
  templateUrl: './aut-profile.component.html',
  styleUrls: ['./aut-profile.component.css']
})
export class AutProfileComponent implements OnInit {
  profileForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  userId: number | null = null;
  user: any;

  constructor(
    private fb: FormBuilder, 
    private profileService: ProfileService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nama: [''],
      usia: [''],
      email: [''],
      password: [''],
      profile: [null],
      role: [''],
      watchlist: ['']
    });
  }

  ngOnInit() {
    this.getUserIdFromToken();
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken && decodedToken.id_user) {
        this.userId = decodedToken.id_user;
        this.loadUserProfile();
      } else {
        console.error("Token tidak valid atau tidak berisi id_user!");
        this.router.navigate(['/login']); // Redirect ke login jika token tidak valid
      }
    } else {
      console.error("Token tidak ditemukan!");
      this.router.navigate(['/login']); // Redirect ke login jika tidak ada token
    }
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decode payload token
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  }

  loadUserProfile() {
    if (!this.userId) return;

    this.profileService.getUserById(this.userId).subscribe(user => {
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
    }, error => {
      console.error("Error fetching user data:", error);
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
    if (!this.profileForm.value.nama || !this.profileForm.value.email || !this.profileForm.value.role) {
      console.error("Nama, email, dan role tidak boleh kosong!");
      return;
    }

    if (!this.userId) {
      console.error("User ID tidak ditemukan!");
      return;
    }

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

    console.log("Mengirim FormData:", formData);

    this.profileService.updateUser(this.userId, formData).subscribe(response => {
      console.log('Profile updated', response);
    }, error => {
      console.error('Error updating profile', error);
    });
  }

  getImagePath(imagePath: string): string {
    return imagePath ? `http://localhost:3000/uploads/profiles/${imagePath}` : 'assets/default-profile.png';
  }

  goBack() {
    window.history.back();
  }
}
