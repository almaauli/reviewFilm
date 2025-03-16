import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-subs-profile',
  templateUrl: './subs-profile.component.html',
  styleUrls: ['./subs-profile.component.css']
})
export class SubsProfileComponent implements OnInit {
  profileForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  userId = 1; // Ganti dengan ID user yang sesuai
  user: any;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      nama: [''],
      usia: [''],
      email: [''],
      password: [''],
      profile: [null],
      role: [''], // Tambahkan role untuk update
      watchlist: [''] // Tambahkan jika diperlukan
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
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

    const formData = new FormData();
    Object.entries(this.profileForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'profile' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString()); // Konversi ke string
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
    return `http://localhost:3000/uploads/profiles/${imagePath}`;
  }

  goBack() {
    window.history.back();
  }
}
