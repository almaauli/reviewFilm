import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilmService } from '../../../services/film.service';
import { GenreService } from '../../../services/genre.service';
import { TahunService } from '../../../services/tahun.service';
import { NegaraService } from '../../../services/negara.service';
import { AuthService } from '../../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-tfilm',
  templateUrl: './admin-tfilm.component.html',
  styleUrls: ['./admin-tfilm.component.css'],
})
export class AdminTfilmComponent implements OnInit {
  filmList: any[] = [];
  filmForm: FormGroup;
  selectedFilmId: number | null = null;
  isEditMode: boolean = false;
  userRole: string | null = '';
  genre: any[] = [];
  tahun: any[] = [];
  negara: any[] = [];
  isAdmin = false;
  userId: number | null = null; // ✅ Perbaikan tipe data
    safeTrailerUrl: SafeResourceUrl = '';

  constructor(
    private fb: FormBuilder,
    private filmService: FilmService,
    private genreService: GenreService,
    private tahunService: TahunService,
    private negaraService: NegaraService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.filmForm = this.fb.group({
      nama_film: ['', Validators.required],
      trailer: ['', Validators.required],
      gambar_film: ['', Validators.required],
      deskripsi: ['', Validators.required],
      genre: ['', Validators.required],
      tahun: ['', Validators.required],
      negara: ['', Validators.required],
      rating: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1})?$/)],
      ],
      durasi: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.userId = this.authService.getUserId(); // ✅ Gunakan number | null
    console.log('User ID dari AuthService:', this.userId);
    this.isAdmin = this.userRole === 'admin';

    this.loadFilm();
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.genreService.getGenre().subscribe((data) => (this.genre = data));
    this.tahunService.getTahun().subscribe((data) => (this.tahun = data));
    this.negaraService.getNegara().subscribe((data) => (this.negara = data));
  }

  loadFilm(): void {
    this.filmService.getFilm().subscribe(
      (data) => {
        this.filmList = data;
      },
      (error) => {
        console.error('Gagal mengambil data film:', error);
        Swal.fire(
          'Error!',
          'Gagal mengambil data film. Silakan login ulang.',
          'error'
        );
      }
    );
  }

  onSubmit(): void {
    if (this.filmForm.valid) {
      if (this.userId === null) {
        Swal.fire('Error!', 'User ID tidak ditemukan. Silakan login ulang.', 'error');
        return;
      }

      const filmData = {
        ...this.filmForm.value,
        id_author: this.userId, // ✅ Pastikan ID yang dikirim bertipe number
      };

      console.log('Data yang dikirim ke backend:', filmData); // Debugging

      this.filmService.addFilm(filmData).subscribe(
        () => {
          Swal.fire('Berhasil!', 'Film berhasil ditambahkan.', 'success');
          this.loadFilm();
          this.filmForm.reset();
        },
        (error) => {
          console.error('Gagal menambahkan film:', error.error);
          Swal.fire('Error!', `Gagal menambahkan film: ${error.error.error}`, 'error');
        }
      );
    }
  }

  editFilm(film: any): void {
    this.selectedFilmId = film.id_film;
    this.isEditMode = true;
    this.filmForm.patchValue(film);

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const modalElement = document.getElementById('addFilmModal');
      if (modalElement) {
        import('bootstrap').then((bootstrap) => {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        });
      }
    }
  }

  updateFilm(): void {
    if (this.filmForm.valid && this.selectedFilmId !== null) {
      this.filmService
        .updateFilm(this.selectedFilmId, this.filmForm.value)
        .subscribe(
          (response) => {
            console.log('Film berhasil diperbarui:', response);
            this.loadFilm();
            this.filmForm.reset();
            this.selectedFilmId = null;
            this.isEditMode = false;
            Swal.fire('Sukses!', 'Film berhasil diperbarui.', 'success');
          },
          (error) => {
            console.error('Gagal memperbarui film:', error);
            Swal.fire('Error!', 'Gagal memperbarui film.', 'error');
          }
        );
    }
  }

  deleteFilm(id: number): void {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data film akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.filmService.deleteFilm(id).subscribe(
          (response) => {
            console.log('Film berhasil dihapus:', response);
            this.loadFilm();
            Swal.fire('Terhapus!', 'Film berhasil dihapus.', 'success');
          },
          (error) => {
            console.error('Gagal menghapus film:', error);
            Swal.fire('Error!', 'Gagal menghapus film.', 'error');
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
    return this.filmService.getFilmImagePath(imagePath);
  }
  
  getSafeUrl(trailerUrl: string): SafeResourceUrl {
      const embedUrl = this.getEmbedUrl(trailerUrl);
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  
    isYouTubeVideo(trailerUrl: string): boolean {
      return trailerUrl.includes('youtube.com') || trailerUrl.includes('youtu.be');
    }
  
      // Konversi URL YouTube menjadi embeddable link
    getEmbedUrl(trailerUrl: string): string {
      if (!trailerUrl) return '';
  
      const videoIdMatch = trailerUrl.match(/(?:youtube\.com\/(?:.*v=|embed\/|v\/)|youtu\.be\/)([^&?]+)/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : trailerUrl;
    }
  
    getVideoPath(videoPath: string): string {
      console.log("Mendapatkan path video:", videoPath); // Log untuk memastikan path video
      if (!videoPath) return '';
      if (videoPath.startsWith('http')) {
        return videoPath;
      }
      return `http://localhost:3000/videos/${videoPath}`;
    }
    
    onFileSelected(event: any, field: string) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
      
        this.filmService.uploadFile(formData).subscribe((response: any) => {
          console.log("Response dari upload:", response); // Cek respons backend
          if (response.url) {
            this.filmForm.patchValue({ gambar_film: response.url });
            console.log("URL diset ke form:", this.filmForm.value.gambar_film); // Debugging
          }
        });
      }
    }
    
}
