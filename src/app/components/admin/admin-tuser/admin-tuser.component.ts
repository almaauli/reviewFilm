import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  safeTrailerUrl: SafeResourceUrl = '';
  currentPage = 1; // Halaman awal
  itemsPerPage = 10; // Jumlah item per halaman
  imagePreview: string | null = null;

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private fb: FormBuilder) {
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
        this.userList = [...data]; // Pakai spread agar Angular mendeteksi perubahan
        console.log("User list setelah load:", this.userList);
         // Debugging
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
          console.log("User list setelah tambah:", this.userList); // Debugging
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
    console.log("Data sebelum update:", this.userForm.value); // Debugging
  
    if (this.selectedUserId !== null) {
      const payload: any = { ...this.userForm.value };
  
      if (!payload.password) {
        delete payload.password;
      }
  
      console.log("Payload yang dikirim:", payload); // Pastikan profile ada di payload
  
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

  getImagePath(imagePath: string): string {
    if (!imagePath) return 'assets/default-image.jpg'; 
    return `http://localhost:3000/uploads/${imagePath}`;
  }
  
  
  onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Set preview image
      };
  
      reader.readAsDataURL(file); // Convert file ke Base64 untuk preview
  
      const formData = new FormData();
      formData.append('file', file);
  
      this.userService.uploadFile(formData).subscribe((response: any) => {
        console.log("Response upload file:", response); // Debugging
        
        if (response.fileName) { 
          this.userForm.patchValue({ [field]: response.fileName });
          this.userForm.get(field)?.updateValueAndValidity();
          console.log("Profile setelah upload:", this.userForm.value.profile);
        }
      });
    }
  }  
  
closeModal(): void {
  const modalElement = document.getElementById('userModal');
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
