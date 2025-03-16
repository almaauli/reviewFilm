import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin-tuser',
  templateUrl: './admin-tuser.component.html',
  styleUrls: ['./admin-tuser.component.scss'],
})
export class AdminTuserComponent implements OnInit {
  userList: any[] = [];
  userForm: FormGroup;
  selectedUserId: number | null = null;
  isEditMode: boolean = false;
  isAdmin = false;
  modalInstance: any;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      nama: ['', Validators.required],
      usia: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Tidak wajib diisi saat edit
      role: ['', Validators.required],
      profile: [''],
      watchlist: ['']
    });
  }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.userList = data;
      },
      (error) => {
        console.error('Gagal mengambil data user:', error);
        Swal.fire('Error!', 'Gagal mengambil data user.', 'error');
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe(
        () => {
          this.loadUsers();
          this.userForm.reset();
          this.closeModal();
          Swal.fire('Sukses!', 'User berhasil ditambahkan.', 'success');
        },
        (error) => {
          Swal.fire('Error!', 'Gagal menambahkan user.', 'error');
        }
      );
    }
  }

  editUser(user: any): void {
    console.log("USER DIPILIH UNTUK EDIT:", user);
  
    if (!user.id_user) {
      console.error("ID user tidak ditemukan!", user);
      return;
    }
    
    this.selectedUserId = user.id_user;
    this.isEditMode = true;
    this.userForm.patchValue({
      nama: user.nama,
      usia: Number(user.usia),
      email: user.email,
      password: '',
      role: user.role,
      profile: user.profile || '',
      watchlist: user.watchlist || ''
    });

    console.log("ID User Terpilih:", this.selectedUserId);
    this.openModal();
  }  

  updateUser(): void {
    console.log("Mengirim update user:", this.userForm.value);
  
    if (this.selectedUserId !== null) {
      // Buat payload tanpa password jika kosong
      const payload: any = {
        ...this.userForm.value,
        usia: Number(this.userForm.value.usia),
        watchlist: this.userForm.value.watchlist || '' // Pastikan tidak undefined
      };
  
      if (!payload.password) {
        delete payload.password; // Hapus password jika kosong
      }
  
      console.log("Payload yang dikirim:", payload);
  
      // Debug: Cek validasi form
      if (!this.userForm.valid) {
        console.error("Form tidak valid!", this.userForm.errors);
        return;
      }
  
      this.userService.updateUser(this.selectedUserId, payload).subscribe(
        () => {
          console.log('User berhasil diperbarui');
          this.loadUsers();
          this.closeModal();
          Swal.fire('Sukses!', 'User berhasil diperbarui.', 'success');
        },
        (error) => {
          console.error('Gagal memperbarui user:', error);
          Swal.fire('Error!', 'Gagal memperbarui user.', 'error');
        }
      );
    } else {
      console.error("ID user null!");
    }
  }
  
  deleteUser(id: number): void {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data user akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(
          () => {
            this.loadUsers();
            Swal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
          },
          (error) => {
            Swal.fire('Error!', 'Gagal menghapus user.', 'error');
          }
        );
      }
    });
  }

  openModal(): void {
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      import('bootstrap').then((bootstrap) => {
        this.modalInstance = new bootstrap.Modal(modalElement);
        this.modalInstance.show();
      });
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userForm.reset();
  }

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return this.userService.getFilmImagePath(imagePath);
  }

  onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      this.userService.uploadFile(formData).subscribe((response: any) => {
        if (response.url) {
          this.userForm.patchValue({ [field]: response.url });
        }
      });
    }
  }
}
