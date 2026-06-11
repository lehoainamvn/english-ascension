import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-bg-main p-0 sm:p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Background Glows -->
      <div class="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Container Card (Split pane) -->
      <div class="relative w-full max-w-4xl min-h-[600px] backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden transition-all duration-300">
        
        <!-- Left Side: Cover / Graphics (42% width) -->
        <div class="w-full md:w-[42%] bg-gradient-to-br from-brand-secondary via-brand-primary to-indigo-700 p-8 flex flex-col justify-between text-white shrink-0 relative min-h-[260px] md:min-h-auto">
          <!-- Background decoration -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none"></div>
          
          <div class="space-y-4 relative z-10">
            <span class="text-[9px] font-black tracking-widest text-indigo-200 bg-white/10 px-2.5 py-1 rounded-full uppercase">RPG Learning</span>
            <h2 class="text-2xl md:text-3xl font-black leading-tight tracking-tight text-white mt-4">
              Học hiệu quả<br />mà thật thoải mái.
            </h2>
            <p class="text-xs text-indigo-100/80 leading-relaxed max-w-xs font-medium">
              English Ascension mang lại lộ trình học tập cá nhân hóa bằng trí tuệ nhân tạo (AI), giúp bạn cày cấp thăng tiến như chơi game RPG thực thụ.
            </p>
          </div>

          <!-- Illustrated Stacked Cards Emojis (similar to screenshot's books/headphone style) -->
          <div class="my-6 flex justify-center items-center relative h-28 md:h-40 shrink-0 select-none">
            <div class="absolute w-24 h-32 md:w-28 md:h-38 bg-emerald-500 rounded-2xl rotate-[15deg] translate-x-12 translate-y-2 border border-white/20 shadow-md"></div>
            <div class="absolute w-24 h-32 md:w-28 md:h-38 bg-yellow-500 dark:bg-yellow-600 rounded-2xl rotate-[-5deg] translate-x-2 border border-white/20 shadow-md"></div>
            <div class="absolute w-24 h-32 md:w-28 md:h-38 bg-pink-500 rounded-2xl rotate-[-20deg] -translate-x-10 border border-white/20 shadow-md flex items-center justify-center">
              <span class="text-3xl">🎯</span>
            </div>
            <!-- Headphones emoji over them -->
            <div class="absolute text-7xl md:text-8xl filter drop-shadow-lg select-none">
              🎧
            </div>
          </div>

          <div class="flex items-center gap-2 relative z-10">
            <span class="text-xl">🎓</span>
            <span class="text-xs font-black tracking-wider text-white uppercase">ENGLISH ASCENSION</span>
          </div>
        </div>

        <!-- Right Side: Login Form (58% width) -->
        <div class="w-full md:w-[58%] p-6 md:p-10 flex flex-col justify-center bg-white dark:bg-bg-input relative transition-colors duration-300">
          
          <!-- Close button (goes to /intro) -->
          <a
            routerLink="/intro"
            class="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main hover:bg-bg-main/80 rounded-full cursor-pointer transition-all flex items-center justify-center w-8 h-8 font-bold"
            title="Đóng"
          >
            <span>✕</span>
          </a>

          <!-- Form Tabs -->
          <div class="flex gap-6 border-b border-border-main/50 pb-3.5 mb-6 text-sm font-bold justify-start">
            <a
              routerLink="/register"
              class="text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              Đăng ký
            </a>
            <a
              routerLink="/login"
              class="text-text-main border-b-2 border-brand-accent pb-3.5 -mb-4 transition-colors cursor-pointer"
            >
              Đăng nhập
            </a>
          </div>

          <!-- Alert Message -->
          @if (errorMessage()) {
            <div class="mb-5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
              <span class="shrink-0 text-sm">⚠️</span>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Social Logins (Google, Facebook, Apple) -->
          <div class="space-y-2.5">
            <!-- Google -->
            <button
              type="button"
              class="w-full flex items-center justify-center gap-3 bg-slate-50 dark:bg-bg-main hover:bg-slate-100 dark:hover:bg-bg-card border border-border-main text-text-main font-bold py-2.5 px-4 rounded-full text-xs transition-colors cursor-pointer shadow-sm"
            >
              <!-- Google icon SVG -->
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.45 1.84 14.94 1 12 1 7.35 1 3.39 3.67 1.48 7.56l3.75 2.91C6.12 7.02 8.84 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.11 2.73-2.36 3.57l3.66 2.84c2.14-1.97 3.37-4.87 3.37-8.56z" />
                <path fill="#FBBC05" d="M5.23 14.43c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3L1.48 6.92C.54 8.75 0 10.81 0 13s.54 4.25 1.48 6.08l3.75-2.65z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.16 0-5.88-1.98-6.84-4.96l-3.75 2.91C3.39 20.33 7.35 23 12 23z" />
              </svg>
              Đăng nhập bằng Google
            </button>

            <!-- Facebook -->
            <button
              type="button"
              class="w-full flex items-center justify-center gap-3 bg-slate-50 dark:bg-bg-main hover:bg-slate-100 dark:hover:bg-bg-card border border-border-main text-text-main font-bold py-2.5 px-4 rounded-full text-xs transition-colors cursor-pointer shadow-sm"
            >
              <!-- Facebook icon SVG -->
              <svg class="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
              Đăng nhập bằng Facebook
            </button>

            <!-- Apple -->
            <button
              type="button"
              class="w-full flex items-center justify-center gap-3 bg-slate-50 dark:bg-bg-main hover:bg-slate-100 dark:hover:bg-bg-card border border-border-main text-text-main font-bold py-2.5 px-4 rounded-full text-xs transition-colors cursor-pointer shadow-sm"
            >
              <!-- Apple icon SVG -->
              <svg class="w-4.5 h-4.5 text-text-main shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
              </svg>
              Đăng nhập bằng Apple
            </button>
          </div>

          <!-- Divider -->
          <div class="relative flex py-5 items-center">
            <div class="flex-grow border-t border-border-main/50"></div>
            <span class="flex-shrink mx-4 text-[10px] text-text-muted font-bold uppercase tracking-wider">hoặc email</span>
            <div class="flex-grow border-t border-border-main/50"></div>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-4">
            <!-- Email -->
            <div>
              <label for="email" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                [(ngModel)]="email"
                required
                email
                #emailInput="ngModel"
                placeholder="name@example.com"
                class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
              />
              @if (emailInput.invalid && (emailInput.dirty || emailInput.touched)) {
                <p class="text-[10px] text-red-500 mt-1">Vui lòng nhập email hợp lệ.</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Mật khẩu</label>
              <input
                id="password"
                type="password"
                name="password"
                [(ngModel)]="password"
                required
                #passwordInput="ngModel"
                placeholder="••••••••"
                class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
              />
              @if (passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)) {
                <p class="text-[10px] text-red-500 mt-1">Mật khẩu không được để trống.</p>
              }
            </div>

            <!-- Submit Button -->
            <div class="pt-3">
              <button
                type="submit"
                [disabled]="loginForm.invalid || isLoading()"
                class="w-full relative overflow-hidden group bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-xs"
              >
                <div class="relative flex items-center justify-center gap-2">
                  @if (isLoading()) {
                    <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  } @else {
                    <span>Đăng Nhập</span>
                  }
                </div>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  
  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res && !res.hasCharacter) {
          this.router.navigate(['/character-customization']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set('Email hoặc mật khẩu không chính xác.');
        } else {
          this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.');
        }
      }
    });
  }
}
