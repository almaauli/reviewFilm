import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-admin',
  templateUrl: './side-admin.component.html',
  styleUrl: './side-admin.component.css'
})
export class SideAdminComponent {
  loggedInUser: string | null = 'Guest'; // Default jika tidak ada user

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode payload JWT
        this.loggedInUser = decodedToken.username || 'Admin'; // Ambil username dari token
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }
}
