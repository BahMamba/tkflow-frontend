import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertModalService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.isSubmitting = true;
    const { email, password } = this.registerForm.value;

    this.authService.register(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertService.showAlert('Inscription réussie. Veuillez vous connecter.', 'success');
        this.router.navigate(['/login']);
      },
      error: () => (this.isSubmitting = false),
    });
  }
}
