import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
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

          <!-- Illustrated Stacked Cards SVGs -->
          <div class="my-6 flex justify-center items-center relative h-28 md:h-40 shrink-0 select-none">
            <div class="absolute w-24 h-32 md:w-28 md:h-38 bg-emerald-500 rounded-2xl rotate-[15deg] translate-x-12 translate-y-2 border border-white/20 shadow-md"></div>
            <div class="absolute w-24 h-32 md:w-28 md:h-38 bg-yellow-500 dark:bg-yellow-600 rounded-2xl rotate-[-5deg] translate-x-2 border border-white/20 shadow-md"></div>
            <div class="absolute w-24 h-32 md:w-28 md:h-38 bg-pink-500 rounded-2xl rotate-[-20deg] -translate-x-10 border border-white/20 shadow-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-white select-none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <!-- Headphones SVG over them -->
            <div class="absolute filter drop-shadow-xl select-none text-white/95">
              <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-16 h-16 md:w-20 md:h-20"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            </div>
          </div>

          <div class="flex items-center gap-2 relative z-10">
            <img src="logo.png" class="w-5 h-5 object-contain rounded" alt="Logo" />
            <span class="text-xs font-black tracking-wider text-white uppercase">ENGLISH ASCENSION</span>
          </div>
        </div>

        <!-- Right Side: Register Form (58% width) -->
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
              class="text-text-main border-b-2 border-brand-accent pb-3.5 -mb-4 transition-colors cursor-pointer"
            >
              Đăng ký
            </a>
            <a
              routerLink="/login"
              class="text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              Đăng nhập
            </a>
          </div>

          <!-- Alert Messages -->
          @if (errorMessage()) {
            <div class="mb-5 bg-rose-500/10 border border-border-main border-l-4 border-l-rose-500 text-rose-600 dark:text-rose-200 text-xs p-3.5 rounded-xl flex items-center gap-2.5 font-bold animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-rose-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }
          @if (successMessage()) {
            <div class="mb-5 bg-emerald-500/10 border border-border-main border-l-4 border-l-emerald-500 text-emerald-600 dark:text-emerald-200 text-xs p-3.5 rounded-xl flex items-center gap-2.5 font-bold animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-500 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 15.01 9 12.01"/></svg>
              <span>{{ successMessage() }}</span>
            </div>
          }

          <!-- Social Logins (Google only) -->
          <div class="space-y-2.5">
            <!-- Google Login Button Container -->
            <div id="googleBtn" class="w-full flex justify-center py-1 select-none"></div>
          </div>

          <!-- Divider -->
          <div class="relative flex py-4 items-center">
            <div class="flex-grow border-t border-border-main/50"></div>
            <span class="flex-shrink mx-4 text-[10px] text-text-muted font-bold uppercase tracking-wider">hoặc email</span>
            <div class="flex-grow border-t border-border-main/50"></div>
          </div>

          <!-- Register Form -->
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="space-y-3">
            <!-- Email -->
            <div>
              <label for="email" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Email</label>
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
                <p class="text-[10px] text-red-500 mt-0.5">Vui lòng nhập email hợp lệ.</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Mật khẩu</label>
              <input
                id="password"
                type="password"
                name="password"
                [(ngModel)]="password"
                required
                minlength="6"
                #passwordInput="ngModel"
                placeholder="Tối thiểu 6 ký tự"
                class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
              />
              @if (passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)) {
                <p class="text-[10px] text-red-500 mt-0.5">Mật khẩu phải chứa ít nhất 6 ký tự.</p>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Xác nhận mật khẩu</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                required
                #confirmPasswordInput="ngModel"
                placeholder="••••••••"
                class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
              />
              @if (confirmPasswordInput.touched && password !== confirmPassword) {
                <p class="text-[10px] text-red-500 mt-0.5">Mật khẩu xác nhận không khớp.</p>
              }
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button
                type="submit"
                [disabled]="registerForm.invalid || password !== confirmPassword || isLoading()"
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
                    <span>Đăng Ký</span>
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
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.checkAndInitGoogle();
  }

  private checkAndInitGoogle(): void {
    if (typeof window === 'undefined') return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      // @ts-ignore
      const googleDefined = typeof google !== 'undefined' && google.accounts && google.accounts.id;
      const elementExists = document.getElementById('googleBtn') !== null;

      if (googleDefined && elementExists) {
        clearInterval(interval);
        this.initGoogleSignIn();
      } else if (attempts > 30) { // Stop after 15 seconds
        clearInterval(interval);
        console.warn('Google Sign-In API or button container not found after 15 seconds.');
      }
    }, 500);
  }

  private initGoogleSignIn(): void {
    try {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '685073393507-kd768suv87jepg4b37bmlaf4j7lf7bav.apps.googleusercontent.com',
        callback: this.handleGoogleCredentialResponse.bind(this)
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large', width: '280px', shape: 'pill' }
      );
    } catch (e) {
      console.error('Error rendering Google Sign-In button', e);
    }
  }

  handleGoogleCredentialResponse(response: any): void {
    if (response && response.credential) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.authService.googleLogin(response.credential).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.toastService.success('Đăng nhập thành công! Chào mừng quay trở lại.');
          if (res && !res.hasCharacter) {
            this.router.navigate(['/character-customization']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password || this.password !== this.confirmPassword) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Đăng ký tài khoản thành công! Đang chuyển hướng...');
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
