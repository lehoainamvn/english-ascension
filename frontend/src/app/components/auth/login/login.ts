import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

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

        <!-- Right Side: Forms (58% width) -->
        <div class="w-full md:w-[58%] p-6 md:p-10 flex flex-col justify-center bg-white dark:bg-bg-input relative transition-colors duration-300">
          
          <!-- Close button (goes to /intro) -->
          <a
            routerLink="/intro"
            class="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main hover:bg-bg-main/80 rounded-full cursor-pointer transition-all flex items-center justify-center w-8 h-8 font-bold"
            title="Đóng"
          >
            <span>✕</span>
          </a>

          @if (viewMode === 'login') {
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


            <!-- Social Logins (Google only) -->
            <div class="space-y-2.5">
              <!-- Google Login Button Container -->
              <div id="googleBtn" class="w-full flex justify-center py-1 select-none"></div>
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
                <div class="flex justify-between items-center mb-1.5">
                  <label for="password" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Mật khẩu</label>
                  <a (click)="viewMode = 'forgot'" class="text-[10px] font-bold text-brand-primary hover:text-brand-secondary cursor-pointer transition-colors no-underline">Quên mật khẩu?</a>
                </div>
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
                  class="w-full relative overflow-hidden group bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-xs border-none"
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
          } @else if (viewMode === 'forgot') {
            <!-- FORGOT PASSWORD VIEW -->
            <div class="space-y-5">
              <div>
                <h2 class="text-xl font-black text-text-main">Khôi phục mật khẩu</h2>
                <p class="text-xxs text-text-muted mt-1 leading-relaxed">Nhập địa chỉ email của bạn. Chúng tôi sẽ gửi mã xác nhận OTP gồm 6 chữ số để đặt lại mật khẩu mới.</p>
              </div>


              <form (ngSubmit)="onForgotPasswordSubmit()" #forgotForm="ngForm" class="space-y-4">
                <div>
                  <label for="forgotEmail" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Email liên kết</label>
                  <input
                    id="forgotEmail"
                    type="email"
                    name="forgotEmail"
                    [(ngModel)]="forgotEmail"
                    required
                    email
                    #forgotEmailInput="ngModel"
                    placeholder="name@example.com"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                  />
                  @if (forgotEmailInput.invalid && (forgotEmailInput.dirty || forgotEmailInput.touched)) {
                    <p class="text-[10px] text-red-500 mt-1">Vui lòng nhập email hợp lệ.</p>
                  }
                </div>

                <div class="flex flex-col gap-2.5 pt-2 font-bold text-xs">
                  <button
                    type="submit"
                    [disabled]="forgotForm.invalid || isSendingOtp()"
                    class="w-full bg-brand-primary hover:bg-brand-secondary text-white py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 border-none"
                  >
                    @if (isSendingOtp()) {
                      Đang gửi mã...
                    } @else {
                      Gửi mã xác nhận (OTP)
                    }
                  </button>
                  <button
                    type="button"
                    (click)="viewMode = 'login'"
                    class="w-full bg-bg-input border border-border-main text-text-muted py-3 rounded-xl hover:bg-bg-card transition-all cursor-pointer"
                  >
                    Quay lại đăng nhập
                  </button>
                </div>
              </form>
            </div>
          } @else if (viewMode === 'reset') {
            <!-- RESET PASSWORD VIEW -->
            <div class="space-y-5">
              <div>
                <h2 class="text-xl font-black text-text-main">Đặt lại mật khẩu</h2>
                <p class="text-xxs text-text-muted mt-1 leading-relaxed">Mã xác nhận đã được gửi đến: <span class="font-bold text-text-main">{{ forgotEmail }}</span>. Vui lòng nhập mã và điền mật khẩu mới của bạn.</p>
              </div>


              <form (ngSubmit)="onResetPasswordSubmit()" #resetForm="ngForm" class="space-y-4">
                <!-- OTP Code -->
                <div>
                  <label for="resetOtp" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Mã OTP (6 chữ số)</label>
                  <input
                    id="resetOtp"
                    type="text"
                    name="resetOtp"
                    [(ngModel)]="resetOtp"
                    required
                    maxlength="6"
                    minlength="6"
                    #resetOtpInput="ngModel"
                    placeholder="Nhập 6 số..."
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-mono tracking-widest text-center"
                  />
                  @if (resetOtpInput.invalid && (resetOtpInput.dirty || resetOtpInput.touched)) {
                    <p class="text-[10px] text-red-500 mt-1">Mã xác nhận phải đủ 6 ký tự.</p>
                  }
                </div>

                <!-- New Password -->
                <div>
                  <label for="resetNewPassword" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Mật khẩu mới</label>
                  <input
                    id="resetNewPassword"
                    type="password"
                    name="resetNewPassword"
                    [(ngModel)]="resetNewPassword"
                    required
                    minlength="6"
                    #resetNewPasswordInput="ngModel"
                    placeholder="Tối thiểu 6 ký tự"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                  />
                  @if (resetNewPasswordInput.invalid && (resetNewPasswordInput.dirty || resetNewPasswordInput.touched)) {
                    <p class="text-[10px] text-red-500 mt-1">Mật khẩu mới tối thiểu phải có 6 ký tự.</p>
                  }
                </div>

                <!-- Confirm Password -->
                <div>
                  <label for="resetConfirmPassword" class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Xác nhận mật khẩu mới</label>
                  <input
                    id="resetConfirmPassword"
                    type="password"
                    name="resetConfirmPassword"
                    [(ngModel)]="resetConfirmPassword"
                    required
                    #resetConfirmPasswordInput="ngModel"
                    placeholder="••••••••"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                  />
                  @if (resetConfirmPasswordInput.touched && resetNewPassword !== resetConfirmPassword) {
                    <p class="text-[10px] text-red-500 mt-1">Mật khẩu xác nhận không khớp.</p>
                  }
                </div>

                <div class="flex flex-col gap-2.5 pt-2 font-bold text-xs">
                  <button
                    type="submit"
                    [disabled]="resetForm.invalid || resetNewPassword !== resetConfirmPassword || isResettingPassword()"
                    class="w-full bg-brand-primary hover:bg-brand-secondary text-white py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 border-none"
                  >
                    @if (isResettingPassword()) {
                      Đang đặt lại...
                    } @else {
                      Đặt lại mật khẩu
                    }
                  </button>
                  <button
                    type="button"
                    (click)="viewMode = 'forgot'"
                    class="w-full bg-bg-input border border-border-main text-text-muted py-3 rounded-xl hover:bg-bg-card transition-all cursor-pointer"
                  >
                    Quay lại nhập email
                  </button>
                </div>
              </form>
            </div>
          }
        </div>

      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  // Prevent Google Sign-In from being initialized multiple times
  private static googleInitialized = false;
  private googleInitInterval: any = null;

  email = '';
  password = '';
  
  isLoading = signal(false);

  // Forgot / Reset Password properties
  viewMode: 'login' | 'forgot' | 'reset' = 'login';
  forgotEmail = '';
  resetOtp = '';
  resetNewPassword = '';
  resetConfirmPassword = '';

  isSendingOtp = signal(false);
  isResettingPassword = signal(false);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      if (user && user.role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin-roadmap']);
      } else {
        this.router.navigate(['/dashboard']);
      }
      return;
    }
    this.checkAndInitGoogle();
  }

  private checkAndInitGoogle(): void {
    if (typeof window === 'undefined') return;
    // If already initialized once in this session, just re-render the button
    if (LoginComponent.googleInitialized) {
      setTimeout(() => this.initGoogleSignIn(), 100);
      return;
    }

    let attempts = 0;
    this.googleInitInterval = setInterval(() => {
      attempts++;
      // @ts-ignore
      const googleDefined = typeof google !== 'undefined' && google.accounts && google.accounts.id;
      const elementExists = document.getElementById('googleBtn') !== null;

      if (googleDefined && elementExists) {
        clearInterval(this.googleInitInterval);
        this.googleInitInterval = null;
        LoginComponent.googleInitialized = true;
        this.initGoogleSignIn();
      } else if (attempts > 30) { // Stop after 15 seconds
        clearInterval(this.googleInitInterval);
        this.googleInitInterval = null;
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
      this.authService.googleLogin(response.credential).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.toastService.success('Đăng nhập thành công! Chào mừng quay trở lại.');
          if (res && res.role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin-roadmap']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toastService.error(err.error?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastService.success('Đăng nhập thành công! Chào mừng quay trở lại.');
        if (res && res.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-roadmap']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401 || err.status === 403) {
          this.toastService.error('Email hoặc mật khẩu không chính xác.');
        } else {
          this.toastService.error(err.error?.message || 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.');
        }
      }
    });
  }

  onForgotPasswordSubmit(): void {
    if (!this.forgotEmail) return;

    this.isSendingOtp.set(true);

    this.authService.forgotPassword(this.forgotEmail).subscribe({
      next: () => {
        this.isSendingOtp.set(false);
        this.toastService.success('Mã OTP khôi phục đã được gửi đến email của bạn.');
        this.viewMode = 'reset';
      },
      error: (err) => {
        this.isSendingOtp.set(false);
        this.toastService.error(err.error?.message || 'Không thể gửi yêu cầu khôi phục. Vui lòng thử lại.');
      }
    });
  }

  onResetPasswordSubmit(): void {
    if (!this.resetOtp || !this.resetNewPassword || this.resetNewPassword !== this.resetConfirmPassword) {
      this.toastService.error('Vui lòng điền đúng thông tin và khớp mật khẩu mới.');
      return;
    }

    if (this.resetNewPassword.length < 6) {
      this.toastService.error('Mật khẩu mới phải dài ít nhất 6 ký tự.');
      return;
    }

    this.isResettingPassword.set(true);

    this.authService.resetPassword(this.resetOtp, this.resetNewPassword).subscribe({
      next: () => {
        this.isResettingPassword.set(false);
        this.toastService.success('Khôi phục mật khẩu thành công! Hãy đăng nhập lại.');
        this.viewMode = 'login';
        this.password = '';
        this.resetOtp = '';
        this.resetNewPassword = '';
        this.resetConfirmPassword = '';
      },
      error: (err) => {
        this.isResettingPassword.set(false);
        this.toastService.error(err.error?.message || 'Khôi phục mật khẩu thất bại. Vui lòng thử lại.');
      }
    });
  }
}
