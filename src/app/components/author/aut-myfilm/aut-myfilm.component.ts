import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilmService } from '../../../services/film.service';
import { AuthService } from '../../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-aut-myfilm',
  templateUrl: './aut-myfilm.component.html',
  styleUrls: ['./aut-myfilm.component.css'],
})
export class AutMyfilmComponent implements OnInit {
  films: any[] = [];
  userId: number = 0;
  isEdit: boolean = false;
  filmForm!: FormGroup;
  filmModal: any;
  genre: any[] = [];
  tahun: any[] = [];
  negara: any[] = [];
  selectedFilmId: number | null = null; 
  isAuthenticated: boolean = false;
  safeTrailerUrl: SafeResourceUrl = '';

  constructor(
    private fb: FormBuilder,
    private filmService: FilmService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userId = this.authService.getUserId()!;
    console.log('User ID:', this.userId); 
    this.getMyFilms();
    this.getDropdownData();
    this.filmModal = new bootstrap.Modal(document.getElementById('filmModal'));

    this.filmForm = this.fb.group({
      nama_film: ['', Validators.required],
      trailer: [''],
      gambar_film: ['', Validators.required],
      deskripsi: ['', Validators.required],
      genre: ['', Validators.required],
      tahun: ['', Validators.required],
      negara: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      durasi: ['', [Validators.required, Validators.min(1)]],
    });
  }

  getMyFilms() {
    this.filmService.getFilmsByAuthor(this.userId).subscribe((data) => {
      console.log('Data film yang diterima:', data);
      this.films = data;
    });
  }

  getDropdownData() {
    this.filmService.getGenres().subscribe((data) => (this.genre = data));
    this.filmService.getYears().subscribe((data) => (this.tahun = data));
    this.filmService.getCountries().subscribe((data) => (this.negara = data));
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg'; // Gambar default jika kosong
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return this.filmService.getFilmImagePath(imagePath);
  }
  
  openAddFilmModal() {
    this.isEdit = false;
    this.selectedFilmId = null; 
    this.filmForm.reset();
    this.filmModal.show();
  }

  openEditFilmModal(film: any) {
    this.isEdit = true;
    this.selectedFilmId = film.id_film; // Simpan ID film yang akan diedit
    this.filmForm.patchValue(film);
    this.filmModal.show();
  }

  saveFilm() {
    const filmData = {
      ...this.filmForm.value,
      id_author: this.authService.getUserId(),
    };

    if (this.isEdit && this.selectedFilmId) {
      this.filmService.updateFilm(this.selectedFilmId, filmData).subscribe(() => {
        Swal.fire('Berhasil!', 'Film berhasil diperbarui.', 'success');
        this.getMyFilms();
        this.filmModal.hide();
      });
    } else {
      this.filmService.addFilm(filmData).subscribe(() => {
        Swal.fire('Berhasil!', 'Film berhasil ditambahkan.', 'success');
        this.getMyFilms();
        this.filmModal.hide();
      });
    }
  }

  onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      this.filmService.uploadFile(formData).subscribe((response: any) => {
        if (response.url) {
          this.filmForm.patchValue({ [field]: response.url });
        }
      });
    }
  }

  getSafeUrl(trailerUrl: string): SafeResourceUrl {
    const embedUrl = this.getEmbedUrl(trailerUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getEmbedUrl(trailerUrl: string): string {
    if (!trailerUrl) return '';
    const videoIdMatch = trailerUrl.match(/(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&?]+)/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
  }

  deleteFilm(id: number) {
    Swal.fire({
      title: 'Yakin ingin menghapus film ini?',
      text: 'Data film akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.filmService.deleteFilm(id).subscribe(() => {
          this.getMyFilms();
          Swal.fire('Terhapus!', 'Film berhasil dihapus.', 'success');
        });
      }
    });
  }
}
