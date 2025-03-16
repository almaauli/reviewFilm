import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenreService } from '../../../services/genre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-tgenre',
  templateUrl: './admin-tgenre.component.html',
  styleUrls: ['./admin-tgenre.component.css'],
})
export class AdminTgenreComponent implements OnInit {
  genreList: any[] = [];
  genreForm: FormGroup;
  selectedGenreId: number | null = null;
  isEditMode: boolean = false;
  isAdmin = false;

  constructor(private genreService: GenreService, private fb: FormBuilder) {
    this.genreForm = this.fb.group({
      namaGenre: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';

    this.loadGenres();
  }

  loadGenres(): void {
    this.genreService.getGenre().subscribe(
      (data) => {
        this.genreList = data;
      },
      (error) => {
        console.error('Gagal mengambil data genre:', error);
        Swal.fire('Error!', 'Gagal mengambil data genre.', 'error');
      }
    );
  }

  onSubmit(): void {
    if (this.genreForm.valid) {
      this.genreService.addGenre(this.genreForm.value.namaGenre).subscribe(
        () => {
          this.loadGenres();
          this.genreForm.reset();
          Swal.fire('Sukses!', 'Genre berhasil ditambahkan.', 'success');
        },
        (error) => {
          Swal.fire('Error!', 'Gagal menambahkan genre.', 'error');
        }
      );
    }
  }

  editGenre(genre: any): void {
    this.selectedGenreId = genre.id_genre;
    this.isEditMode = true;
    this.genreForm.patchValue({ namaGenre: genre.nama_genre });
  }

  updateGenre(): void {
    if (this.genreForm.valid && this.selectedGenreId !== null) {
      this.genreService
        .updateGenre(this.selectedGenreId, this.genreForm.value.namaGenre)
        .subscribe(
          () => {
            this.loadGenres();
            this.genreForm.reset();
            this.selectedGenreId = null;
            this.isEditMode = false;
            Swal.fire('Sukses!', 'Genre berhasil diperbarui.', 'success');
          },
          (error) => {
            Swal.fire('Error!', 'Gagal memperbarui genre.', 'error');
          }
        );
    }
  }

  deleteGenre(id: number): void {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data genre akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.genreService.deleteGenre(id).subscribe(
          () => {
            this.loadGenres();
            Swal.fire('Terhapus!', 'Genre berhasil dihapus.', 'success');
          },
          (error) => {
            Swal.fire('Error!', 'Gagal menghapus genre.', 'error');
          }
        );
      }
    });
  }
}
