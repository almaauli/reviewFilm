import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../../services/film.service';
import { WatchlistService } from '../../../services/watchlist.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-filmaut',
  templateUrl: './detail-filmaut.component.html',
  styleUrls: ['./detail-filmaut.component.css']
})
export class DetailFilmautComponent implements OnInit {
  film: any;
  comments: any[] = [];

  constructor(private route: ActivatedRoute, 
    private filmService: FilmService, 
    private watchlistService: WatchlistService,
    private sanitizer: DomSanitizer,
    private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getFilmDetail(id);
      this.getFilmComments(id);
    }
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg'; // Gambar default jika kosong
  
    // Jika path mengandung "http" atau "https", berarti ini adalah URL langsung, langsung dikembalikan
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
  
    // Jika bukan URL, anggap sebagai path file yang di-upload dari backend
    return this.filmService.getFilmImagePath(imagePath);
  }
  

  getFilmDetail(id: string) {
    this.filmService.getFilmById(id).subscribe((data) => {
      console.log("Data Film:", data); 
      this.film = {
        ...data,
        trailer: `http://localhost:3000/${data.trailer.trim()}`
      };      
      console.log("URL Trailer:", this.film.trailer); 
    });
  }  

  getFilmComments(id: string) {
    this.filmService.getCommentsByFilmId(id).subscribe((data) => {
      this.comments = data;
    });
  }

  convertToHours(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} jam ${remainingMinutes} menit` : `${hours} jam`;
  }
  
  redirectToKomen(id_film: number) {
    this.router.navigate(['/aut-komen', id_film]);
  }

  addToWatchlist(id_film: number) {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = localStorage.getItem('user_id'); // Ambil ID user dari localStorage
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.watchlistService.addToWatchlist(userId, id_film).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Film berhasil ditambahkan ke Watchlist!',
          showConfirmButton: false,
          timer: 1500
        });
        
        // Setelah sukses, arahkan ke halaman Watchlist
        this.router.navigate(['/aut-watchlist']);
      },
      (error) => {
        console.error('Gagal menambahkan ke Watchlist:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal menambahkan film ke Watchlist!'
        });
      }
    );
  }

      // Cek apakah URL adalah link YouTube
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
     
}
