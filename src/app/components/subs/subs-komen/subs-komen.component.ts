import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KomentarService } from '../../../services/coment.service';
import { AuthService } from '../../../services/auth.service'; // Tambahkan ini
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-subs-komen',
  templateUrl: './subs-komen.component.html',
  styleUrls: ['./subs-komen.component.css'],
})
export class SubsKomenComponent implements OnInit {
  commentForm!: FormGroup;
  id_film!: number;
  id_user: number | null = null; // Inisialisasi id_user

  constructor(
    private fb: FormBuilder,
    private komentarService: KomentarService,
    private authService: AuthService, // Tambahkan ini
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id_film = Number(this.route.snapshot.paramMap.get('id'));
    this.id_user = this.authService.getUserId(); // Ambil id_user dari token

    this.commentForm = this.fb.group({
      rating_user: [null, Validators.required],
      komentar: ['', Validators.required],
    });
  }

  submitComment(): void {
    if (!this.id_user) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Anda harus login untuk memberikan komentar!',
      });
      return;
    }

    const komentarData = {
      id_film: this.id_film,
      id_user: this.id_user, // Kirim id_user
      ...this.commentForm.value,
    };

    if (this.commentForm.valid) {
      this.komentarService.addKomentar(komentarData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Komentar berhasil ditambahkan!',
            confirmButtonText: 'OK',
          }).then(() => {
            this.location.back();
          });
        },
        error: (error) => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menambahkan komentar.',
          });
        },
      });
    }
  }

  cancel(): void {
    this.location.back();
  }
}
