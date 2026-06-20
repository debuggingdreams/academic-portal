import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  isSignUpMode = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  loginForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private router: Router) {
    this.updateValidators();
  }

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
    this.successMessage = '';
    this.errorMessage = '';
    this.loginForm.reset();
    this.updateValidators();
  }

  updateValidators() {
    const first = this.loginForm.get('firstName');
    const last = this.loginForm.get('lastName');
    
    if (this.isSignUpMode) {
      first?.setValidators([Validators.required]);
      last?.setValidators([Validators.required]);
    } else {
      first?.clearValidators();
      last?.clearValidators();
    }
    first?.updateValueAndValidity();
    last?.updateValueAndValidity();
  }

  handleSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const endpoint = this.isSignUpMode ? 'signup' : 'login';
    // Unified to Port 5000 to talk to your backend cleanly
    const url = `http://127.0.0.1:3000/api/auth/${endpoint}`;

    this.http.post<any>(url, this.loginForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false; 
        this.successMessage = res.message;
        
        if (!this.isSignUpMode) {
          // Store the verified session ID
          if (res.studentId) {
            localStorage.setItem('studentId', res.studentId);
          }
          // Redirect smoothly to dashboard interface
          this.router.navigate(['/dashboard']);
        } else {
          // Switch back to login layout after successful registration
          this.isSignUpMode = false;
          this.updateValidators();
          this.loginForm.reset();
        }
      },
      error: (err) => {
        this.isSubmitting = false; 
        this.errorMessage = err.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}