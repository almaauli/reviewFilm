import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../../services/film.service';
import { UserService } from '../../../services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-film',
  templateUrl: './detail-film.component.html',
  styleUrls: ['./detail-film.component.css']
})
export class DetailFilmComponent implements OnInit {
  film: any;
  comments: any[] = [];
  userProfileImage: string = 'assets/default-profile.png'; // Default image

  constructor(private route: ActivatedRoute, 
    private filmService: FilmService, 
    private sanitizer: DomSanitizer, 
    private userService: UserService,
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

  getImagePath2(imagePath: string): string {
    if (!imagePath) {
      console.warn("Gambar profile kosong, menggunakan default.");
      return 'assets/default-profile.png'; // Gambar default jika kosong
    }
  
    if (imagePath.startsWith('http')) {
      console.log("Gambar profile sudah berupa URL:", imagePath);
      return imagePath; // Jika sudah URL lengkap
    }
  
    const fullPath =  `http://localhost:3000/uploads/${imagePath}`;
    console.log("Gambar profile diubah menjadi:", fullPath);
    return fullPath; // Sesuaikan dengan path backend
  }
  
  getFilmDetail(id: string) {
    this.filmService.getFilmById(id).subscribe((data) => {
      console.log("Data Film dari Backend:", data); // Pastikan author_name muncul
      
      this.film = {
        ...data,
        gambar_film: this.getImagePath(data.gambar_film),
        author_name: data.author_name,
        author_profile: this.getImagePath2(data.author_profile),
        aktor: data.aktor,
        updated_at: data.updated_at 
      };
      console.log("Nama Author di Frontend:", this.film.author_name);
    });
  }  

  getFilmComments(id: string) {
    this.filmService.getCommentsByFilmId(id).subscribe((data: any[]) => {
      console.log("Data Komentar dari Backend:", data); // Debugging
  
      this.comments = data.map((comment: any) => ({
        ...comment,
        updated_at: new Date(comment.updated_at),
        profile: this.getImagePath2(comment.profile) // Pastikan profile tidak undefined/null
      }));      
  
      console.log("Komentar setelah diubah:", this.comments); // Debugging
    });
  }  

  convertToHours(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} jam ${remainingMinutes} menit` : `${hours} jam`;
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
