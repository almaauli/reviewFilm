import { Component } from '@angular/core';
import { WatchlistService } from '../../../services/watchlist.service';
import { FilmService } from '../../../services/film.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subs-watchlist',
  templateUrl: './subs-watchlist.component.html',
  styleUrl: './subs-watchlist.component.css',
})
export class SubsWatchlistComponent {
  watchlist: any[] = [];

  constructor(
    private watchlistService: WatchlistService,
    private router: Router,
    private filmService: FilmService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id'); // Ambil user_id dari localStorage

    if (!userId) {
      console.error('User ID tidak ditemukan!');
      return;
    }

    this.watchlistService.getWatchlist(userId).subscribe((data) => {
      console.log('Data Watchlist:', data);
      this.watchlist = data;
    });
  }

  loadWatchlist() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.watchlistService.getWatchlist(userId).subscribe(
      (films) => {
        console.log('Data watchlist dari backend:', films); // Debugging
        this.watchlist = films.map((film) => ({
          ...film,
          gambar_film: film.gambar_film
            ? this.getImagePath(film.gambar_film)
            : 'assets/default-movie.jpg',
          durasi: this.convertToHours(film.durasi),
        }));
      },
      (error) => {
        console.error('Gagal mengambil watchlist:', error);
      }
    );
  }

  removeFromWatchlist(id_film: number) {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Film ini akan dihapus dari watchlist!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.watchlistService.removeFromWatchlist(id_film, userId).subscribe(
          () => {
            this.watchlist = this.watchlist.filter(
              (film) => film.id_film !== id_film
            );
            Swal.fire(
              'Dihapus!',
              'Film telah dihapus dari watchlist.',
              'success'
            );
          },
          (error) => {
            console.error('Gagal menghapus film dari watchlist:', error);
            Swal.fire(
              'Gagal!',
              'Terjadi kesalahan saat menghapus film.',
              'error'
            );
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
  convertToHours(minutes: any): string {
    const parsedMinutes = Number(minutes);
    if (isNaN(parsedMinutes) || parsedMinutes <= 0)
      return 'Durasi tidak tersedia';

    const hours = Math.floor(parsedMinutes / 60);
    const remainingMinutes = parsedMinutes % 60;
    return remainingMinutes > 0
      ? `${hours} jam ${remainingMinutes} menit`
      : `${hours} jam`;
  }
}
