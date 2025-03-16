import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../../services/film.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-film',
  templateUrl: './detail-film.component.html',
  styleUrls: ['./detail-film.component.css']
})
export class DetailFilmComponent implements OnInit {
  film: any;
  comments: any[] = [];

  constructor(private route: ActivatedRoute, 
    private filmService: FilmService, 
    private location: Location, 
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
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
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
  
  goBack() {
    console.log('Tombol kembali diklik!');
  this.location.back();
  }

  redirectToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.route.url } });
  }
  
  addToWatchlist(id_film: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    // Kalau sudah login, bisa tambahkan logika simpan ke watchlist di backend nanti
    console.log('Film ditambahkan ke watchlist:', id_film);
  }
  
     // Cek apakah URL adalah link YouTube
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
      if (!videoPath) return '';
    
      // Jika sudah merupakan URL lengkap, langsung kembalikan
      if (videoPath.startsWith('http')) {
        return videoPath;
      }
    
      // Jika hanya nama file, tambahkan path backend
      return `http://localhost:3000/videos/${videoPath}`;
    }  

}
