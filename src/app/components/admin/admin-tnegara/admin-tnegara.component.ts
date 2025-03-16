import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NegaraService } from '../../../services/negara.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-tnegara',
  templateUrl: './admin-tnegara.component.html',
  styleUrls: ['./admin-tnegara.component.css'],
})
export class AdminTnegaraComponent implements OnInit {
  negaraList: any[] = [];
  negaraForm: FormGroup;
  selectedNegaraId: number | null = null;
  isEditMode: boolean = false;
  isAdmin = false;

  constructor(private negaraService: NegaraService, private fb: FormBuilder) {
    this.negaraForm = this.fb.group({
      namaNegara: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';

    this.loadNegara();
  }

  loadNegara(): void {
    this.negaraService.getNegara().subscribe(
      (data) => {
        this.negaraList = data;
      },
      (error) => {
        console.error('Gagal mengambil data negara:', error);
        Swal.fire('Error!', 'Gagal mengambil data negara.', 'error');
      }
    );
  }

  onSubmit(): void {
    if (this.negaraForm.valid) {
      this.negaraService.addNegara(this.negaraForm.value.namaNegara).subscribe(
        () => {
          this.loadNegara();
          this.negaraForm.reset();
          Swal.fire('Sukses!', 'Negara berhasil ditambahkan.', 'success');
        },
        (error) => {
          Swal.fire('Error!', 'Gagal menambahkan negara.', 'error');
        }
      );
    }
  }

  editNegara(negara: any): void {
    this.selectedNegaraId = negara.id_negara;
    this.isEditMode = true;
    this.negaraForm.patchValue({ namaNegara: negara.nama_negara });

    const modalElement = document.getElementById('addNegaraModal');
    if (modalElement) {
      import('bootstrap').then((bootstrap) => {
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
      });
    }
  }

  updateNegara(): void {
    if (this.negaraForm.valid && this.selectedNegaraId !== null) {
      this.negaraService
        .updateNegara(this.selectedNegaraId, this.negaraForm.value.namaNegara)
        .subscribe(
          () => {
            this.loadNegara();
            this.negaraForm.reset();
            this.selectedNegaraId = null;
            this.isEditMode = false;
            Swal.fire('Sukses!', 'Negara berhasil diperbarui.', 'success');
          },
          (error) => {
            Swal.fire('Error!', 'Gagal memperbarui negara.', 'error');
          }
        );
    }
  }

  deleteNegara(id: number): void {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data negara akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.negaraService.deleteNegara(id).subscribe(
          () => {
            this.loadNegara();
            Swal.fire('Terhapus!', 'Negara berhasil dihapus.', 'success');
          },
          (error) => {
            Swal.fire('Error!', 'Gagal menghapus negara.', 'error');
          }
        );
      }
    });
  }
}
