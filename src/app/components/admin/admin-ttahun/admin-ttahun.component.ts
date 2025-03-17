import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TahunService } from '../../../services/tahun.service';
import Swal from 'sweetalert2';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin-ttahun',
  templateUrl: './admin-ttahun.component.html',
  styleUrls: ['./admin-ttahun.component.css'],
})
export class AdminTtahunComponent implements OnInit {
  tahunList: any[] = [];
  tahunForm: FormGroup;
  selectedTahunId: number | null = null;
  isEditMode: boolean = false;
  userRole: string | null = '';
  isAdmin = false;
  currentPage = 1; // Halaman awal
  itemsPerPage = 10; // Jumlah item per halaman

  constructor(private tahunService: TahunService, private fb: FormBuilder) {
    this.tahunForm = this.fb.group({
      tahunRilis: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });
  }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    
    this.loadTahun();

    this.userRole = localStorage.getItem('role'); 
    console.log('User Role:', this.userRole);
  }

  loadTahun(): void {
    this.tahunService.getTahun().subscribe(
      (data) => {
        this.tahunList = data;
      },
      (error) => {
        console.error('Gagal mengambil data tahun:', error);
        Swal.fire(
          'Error!',
          'Gagal mengambil data tahun. Silakan login ulang.',
          'error'
        );
      }
    );
  }

  onSubmit(): void {
    if (this.tahunForm.valid) {
      this.tahunService.addTahun(this.tahunForm.value.tahunRilis).subscribe(
        (response) => {
          console.log('Tahun berhasil ditambahkan:', response);
          this.loadTahun();
          this.tahunForm.reset();
          this.closeModal();
          Swal.fire('Sukses!', 'Tahun berhasil ditambahkan.', 'success');
        },
        (error) => {
          console.error('Gagal menambahkan tahun:', error);
          Swal.fire('Error!', 'Gagal menambahkan tahun.', 'error');
        }
      );
    }
  }
  editTahun(tahun: any): void {
    this.selectedTahunId = tahun.id_tahun;
    this.isEditMode = true;
    this.tahunForm.patchValue({ tahunRilis: tahun.tahun_rilis });

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const modalElement = document.getElementById('addTahunModal');
      if (modalElement) {
        import('bootstrap').then((bootstrap) => {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        });
      }
    }
  }

  updateTahun(): void {
    if (this.tahunForm.valid && this.selectedTahunId !== null) {
      this.tahunService
        .updateTahun(this.selectedTahunId, this.tahunForm.value.tahunRilis)
        .subscribe(
          (response) => {
            console.log('Tahun berhasil diperbarui:', response);
            this.loadTahun(); 
            this.tahunForm.reset();
            this.selectedTahunId = null;
            this.isEditMode = false;
            this.closeModal();
            Swal.fire('Sukses!', 'Tahun berhasil diperbarui.', 'success');
          },
          (error) => {
            console.error('Gagal memperbarui tahun:', error);
            Swal.fire('Error!', 'Gagal memperbarui tahun.', 'error');
          }
        );
    }
  }

  deleteTahun(id: number): void {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data tahun akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tahunService.deleteTahun(id).subscribe(
          (response) => {
            console.log('Tahun berhasil dihapus:', response);
            this.loadTahun(); 
            Swal.fire('Terhapus!', 'Tahun berhasil dihapus.', 'success');
          },
          (error) => {
            console.error('Gagal menghapus tahun:', error);
            Swal.fire('Error!', 'Gagal menghapus tahun.', 'error');
          }
        );
      }
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('addTahunModal');
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
