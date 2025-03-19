import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KomentarService } from '../../../services/coment.service';
import { UserService } from '../../../services/user.service';
import { FilmService } from '../../../services/film.service';
import Swal from 'sweetalert2';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin-tcoment',
  templateUrl: './admin-tcoment.component.html',
  styleUrls: ['./admin-tcoment.component.css'],
})
export class AdminTcomentComponent implements OnInit {
  komentarList: any[] = [];
  komentarForm: FormGroup;
  selectedKomentarId: number | null = null;
  isEditMode: boolean = false;
  userRole: string | null = '';
  filmList: any[] = []; // Untuk dropdown film
  userList: any[] = []; 
  isAdmin = false;
  currentPage = 1; // Halaman awal
  itemsPerPage = 10; // Jumlah item per halaman

  constructor(  private komentarService: KomentarService,
    private filmService: FilmService,
    private userService: UserService,
    private fb: FormBuilder) {
    this.komentarForm = this.fb.group({
      id_film: ['', [Validators.required]],
      id_user: ['', [Validators.required]],
      rating_user: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      komentar: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    
    this.loadKomentar();
    this.userRole = localStorage.getItem('role');
    console.log('User Role:', this.userRole);
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.filmService.getFilm().subscribe((data) => (this.filmList= data));
    this.userService.getUsers().subscribe((data) => (this.userList = data));
  }  
  loadKomentar(): void {
    this.komentarService.getKomentar().subscribe(
      (data) => {
        console.log('Data komentar terbaru:', data); // Debugging
        this.komentarList = data;
      },
      (error) => {
        console.error('Gagal mengambil data komentar:', error);
        Swal.fire('Error!', 'Gagal mengambil data komentar.', 'error');
      }
    );
  }  

  onSubmit(): void {
    if (this.komentarForm.valid) {
      this.komentarService.addKomentar(this.komentarForm.value).subscribe(
        (response) => {
          console.log('Komentar berhasil ditambahkan:', response);
          this.loadKomentar();
          this.komentarForm.reset();
          this.closeModal();
          Swal.fire('Sukses!', 'Komentar berhasil ditambahkan.', 'success');
        },
        (error) => {
          console.error('Gagal menambahkan komentar:', error);
          Swal.fire('Error!', 'Gagal menambahkan komentar.', 'error');
        }
      );
    }
  }

  editKomentar(komentar: any): void {
    this.selectedKomentarId = komentar.id_komentar;
    this.isEditMode = true;
  
    // Pastikan data film dan user sudah tersedia
    if (this.filmList.length === 0 || this.userList.length === 0) {
      this.loadDropdownData();
    }
  
    // Tunggu sedikit waktu agar data dropdown siap sebelum set form
    setTimeout(() => {
      this.komentarForm.patchValue({
        id_film: komentar.id_film,
        id_user: komentar.id_user,
        rating_user: komentar.rating_user,
        komentar: komentar.komentar,
      });
  
      // Buka modal setelah form terisi
      const modalElement = document.getElementById('addKomentarModal');
      if (modalElement) {
        import('bootstrap').then((bootstrap) => {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        });
      }
    }, 500); // Delay 500ms untuk menunggu data siap
  }
  
  updateKomentar(): void {
    if (this.komentarForm.valid && this.selectedKomentarId !== null) {
      this.komentarService.updateKomentar(this.selectedKomentarId, this.komentarForm.value).subscribe(
        (response) => {
          console.log('Komentar berhasil diperbarui:', response);
          this.loadKomentar();
          this.komentarForm.reset();
          this.selectedKomentarId = null;
          this.isEditMode = false;
          this.closeModal();
          Swal.fire('Sukses!', 'Komentar berhasil diperbarui.', 'success');
        },
        (error) => {
          console.error('Gagal memperbarui komentar:', error);
          Swal.fire('Error!', 'Gagal memperbarui komentar.', 'error');
        }
      );
    }
  }

  deleteKomentar(id: number): void {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Komentar akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.komentarService.deleteKomentar(id).subscribe(
          (response) => {
            console.log('Komentar berhasil dihapus:', response);
            this.loadKomentar();
            Swal.fire('Terhapus!', 'Komentar berhasil dihapus.', 'success');
          },
          (error) => {
            console.error('Gagal menghapus komentar:', error);
            Swal.fire('Error!', 'Gagal menghapus komentar.', 'error');
          }
        );
      }
    });
  }
  closeModal(): void {
    const modalElement = document.getElementById('addKomentarModal');
    if (modalElement) {
      import('bootstrap').then((bootstrap) => {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
    }
  }
  
}