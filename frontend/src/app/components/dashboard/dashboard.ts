import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 1. Imported Router for navigation

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  studentCount: number = 0; 
  
  // Updated port to 5000 and used explicit IPv4 loopback to clear ECONNREFUSED
  private apiUrl = 'http://127.0.0.1:3000/api/students/count'; 

  // 2. Injected Router into the constructor
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getLiveStudentCount();
  }

  getLiveStudentCount() {
    this.http.get<{ count: number }>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Database count received:', data.count);
        this.studentCount = data.count; 
      },
      error: (err) => {
        console.error('Could not fetch student count from database', err);
        this.studentCount = 0; 
      }
    });
  }

  // 3. Added the logout action handler
  handleLogout() {
    // Clear browser-level authentication storage states
    localStorage.removeItem('token'); 
    sessionStorage.clear();           
    
    // Redirect the application layout context back to the login page
    this.router.navigate(['/login']); 
  }
}