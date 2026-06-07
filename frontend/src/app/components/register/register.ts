import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-bg-main p-4 relative overflow-hidden transition-colors duration-300">
      <!-- Background glowing circles -->
      <div class="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Glassmorphic Card -->
      <div class="relative w-full max-w-md backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:border-brand-primary/30">
        
        <!-- Logo / Title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
            ENGLISH ASCENSION
          </h1>
          <p class="text-xs text-text-muted mt-2 uppercase tracking-widest font-semibold">
            Chinh phục tiếng Anh, nâng tầm sức mạnh
          </p>
        </div>

        <h2 class="text-xl font-bold text-text-main mb-6 text-center">Đăng Ký Tài Khoản</h2>

        <!-- Alert Message -->
        @if (errorMessage()) {
          <div class="mb-5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-200 text-sm p-3 rounded-lg flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        @if (successMessage()) {
          <div class="mb-5 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-200 text-sm p-3 rounded-lg flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ successMessage() }}</span>
          </div>
        }

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="space-y-5">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-text-muted mb-2">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailInput="ngModel"
              placeholder="name@example.com"
              class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
            @if (emailInput.invalid && (emailInput.dirty || emailInput.touched)) {
              <p class="text-xs text-red-500 mt-1">Vui lòng nhập email hợp lệ.</p>
            }
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-text-muted mb-2">Mật khẩu</label>
            <input
              id="password"
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              #passwordInput="ngModel"
              placeholder="Tối thiểu 6 ký tự"
              class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
            @if (passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)) {
              <p class="text-xs text-red-500 mt-1">Mật khẩu phải chứa ít nhất 6 ký tự.</p>
            }
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-text-muted mb-2">Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              #confirmPasswordInput="ngModel"
              placeholder="••••••••"
              class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
            @if (confirmPasswordInput.touched && password !== confirmPassword) {
              <p class="text-xs text-red-500 mt-1">Mật khẩu xác nhận không khớp.</p>
            }
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="registerForm.invalid || password !== confirmPassword || isLoading()"
            class="w-full relative overflow-hidden group bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none disabled:transform-none cursor-pointer"
          >
            <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            
            <div class="relative flex items-center justify-center gap-2">
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang xử lý...</span>
              } @else {
                <span>Đăng Ký</span>
              }
            </div>
          </button>
        </form>

        <!-- Redirect to Login -->
        <div class="mt-6 text-center text-sm text-text-muted">
          Đã có tài khoản?
          <a routerLink="/login" class="text-brand-primary hover:text-brand-secondary font-semibold transition-all hover:underline ml-1">
            Đăng nhập ngay
          </a>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onSubmit(): void {
    if (!this.email || !this.password || this.password !== this.confirmPassword) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Email này đã tồn tại hoặc đã xảy ra lỗi. Vui lòng kiểm tra lại.');
      }
    });
  }
}
