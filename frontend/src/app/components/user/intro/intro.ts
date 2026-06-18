import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main flex flex-col font-sans relative overflow-hidden transition-colors duration-300 select-none">
      <!-- Animated Canvas Background Paths -->
      <canvas #pathsCanvas class="fixed inset-0 w-full h-full pointer-events-none z-0"></canvas>
      
      <!-- Minimalist Header -->
      <header class="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between transition-colors duration-300 relative z-10">
        <div class="flex items-center gap-2.5">
          <img src="logo.png" class="w-8 h-8 object-contain rounded-lg shadow-md" alt="Logo" />
          <span class="text-sm font-black text-text-main tracking-tight">
            English Ascension
          </span>
        </div>

        <div class="flex items-center gap-3">
          <!-- Theme Toggle -->
          <button
            (click)="toggleTheme()"
            class="w-8 h-8 rounded-lg hover:bg-bg-input/60 border border-transparent hover:border-border-main flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer transition-all"
            title="Đổi giao diện"
          >
            @if (isDark()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            }
          </button>

          <ng-container *ngIf="!isLoggedIn; else loggedInMenu">
            <a
              routerLink="/login"
              class="text-xs font-bold text-text-muted hover:text-text-main px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Đăng nhập
            </a>
            <a
              routerLink="/register"
              class="bg-text-main text-bg-main text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer border-none hover:opacity-90 flex items-center justify-center"
            >
              Đăng ký
            </a>
          </ng-container>
          <ng-template #loggedInMenu>
            <span class="text-xs text-text-muted font-bold hidden sm:inline">{{ userEmail }}</span>
            <a
              routerLink="/character-customization"
              class="bg-text-main text-bg-main text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-center hover:opacity-90 border-none"
            >
              Vào học
            </a>
            <button
              (click)="onLogout()"
              class="w-8 h-8 rounded-lg hover:bg-bg-input/60 border border-transparent hover:border-border-main flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer transition-all"
              title="Đăng xuất"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </ng-template>
        </div>
      </header>

      <!-- Scrollable Main Content -->
      <main class="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-24 md:space-y-36">
        
        <!-- Hero Section -->
        <section class="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 pb-10">
          <div class="space-y-4">
            <h1 class="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-text-main leading-none">
              English Ascension
            </h1>
            <p class="text-sm sm:text-base text-text-muted max-w-lg mx-auto font-semibold leading-relaxed">
              Chinh phục tiếng Anh theo phong cách nhập vai RPG cá nhân hóa bởi AI.
            </p>
          </div>

          <div class="pt-2">
            <a
              [routerLink]="isLoggedIn ? '/character-customization' : '/register'"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border-main hover:bg-bg-input bg-bg-card text-text-main text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md active:scale-98 cursor-pointer group"
            >
              {{ isLoggedIn ? 'Tiếp tục hành trình' : 'Bắt đầu hành trình' }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover:translate-x-1 shrink-0"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>

          <div class="flex items-center justify-center gap-6 pt-4 text-[10px] text-text-muted font-black uppercase tracking-widest">
            <span>AI Personalized</span>
            <span class="w-1.5 h-1.5 rounded-full bg-border-main"></span>
            <span>RPG Gamification</span>
            <span class="w-1.5 h-1.5 rounded-full bg-border-main"></span>
            <span>CEFR & TOEIC</span>
          </div>
        </section>

        <!-- Features Grid Section -->
        <section id="features" class="space-y-12 scroll-mt-24">
          <div class="text-center max-w-xl mx-auto space-y-3">
            <span class="text-xs font-black text-brand-primary dark:text-brand-secondary uppercase tracking-widest px-3 py-1 bg-brand-primary/10 rounded-full">Tính Năng Cốt Lõi</span>
            <h2 class="text-2xl md:text-3xl font-black text-text-main tracking-tight">HỆ THỐNG RPG KẾT HỢP AI</h2>
            <p class="text-xs text-text-muted leading-relaxed">
              Tận hưởng sự kết hợp độc đáo giữa cơ chế game nhập vai và trí tuệ nhân tạo để nâng trình tiếng Anh.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Feature 1 -->
            <div class="p-6 backdrop-blur-md bg-bg-card/45 border border-border-main/60 rounded-2xl hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-5 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                </div>
                <h3 class="text-sm font-extrabold text-text-main mb-2">Lộ Trình AI Cá Nhân</h3>
                <p class="text-xxs text-text-muted leading-relaxed">
                  Bản đồ thế giới học tập được sinh lập tùy chỉnh theo năng lực thực tế của người học.
                </p>
              </div>
              <div class="pt-4 mt-4 border-t border-border-main/30 text-[9px] font-bold text-text-muted uppercase">AI Learning Path</div>
            </div>

            <!-- Feature 2 -->
            <div class="p-6 backdrop-blur-md bg-bg-card/45 border border-border-main/60 rounded-2xl hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="w-10 h-10 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary mb-5 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h3 class="text-sm font-extrabold text-text-main mb-2">Nhập Vai & Avatar RPG</h3>
                <p class="text-xxs text-text-muted leading-relaxed">
                  Thiết kế đại diện chiến binh, tích lũy điểm kinh nghiệm (EXP), thăng cấp và mở khóa danh hiệu.
                </p>
              </div>
              <div class="pt-4 mt-4 border-t border-border-main/30 text-[9px] font-bold text-text-muted uppercase">Character Customization</div>
            </div>

            <!-- Feature 3 -->
            <div class="p-6 backdrop-blur-md bg-bg-card/45 border border-border-main/60 rounded-2xl hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-5 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-swords"><polyline points="20 4 20 4 20 4"/><path d="M14.7 9.3 17 7l4 4-2.3 2.3Z"/><path d="M11.7 12.3 3.5 20.5a1.5 1.5 0 0 0 2 2l8.2-8.2Z"/><path d="M12.5 9.5 9.7 6.7a1.5 1.5 0 0 0-2 0L6.7 7.7a1.5 1.5 0 0 0 0 2l2.8 2.8Z"/><path d="m14.3 14.3 2.3 2.3c.6.6.6 1.6 0 2.2l-1 1a1.5 1.5 0 0 1-2 0l-2.3-2.3Z"/><path d="M9.5 12.5 6.7 9.7a1.5 1.5 0 0 0 0-2l1-1a1.5 1.5 0 0 0 2 0l2.8 2.8Z"/><path d="m19 5-4.3 4.3"/><path d="m19 5-2.3 2.3"/><path d="m19 5 2.3-2.3"/></svg>
                </div>
                <h3 class="text-sm font-extrabold text-text-main mb-2">Đấu Từ Vựng Minigame</h3>
                <p class="text-xxs text-text-muted leading-relaxed">
                  Phản xạ học từ vựng tiếng Anh thông qua các màn đấu quái thú gay cấn, sinh động.
                </p>
              </div>
              <div class="pt-4 mt-4 border-t border-border-main/30 text-[9px] font-bold text-text-muted uppercase">Vocabulary Battle</div>
            </div>

            <!-- Feature 4 -->
            <div class="p-6 backdrop-blur-md bg-bg-card/45 border border-border-main/60 rounded-2xl hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5 transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 class="text-sm font-extrabold text-text-main mb-2">Trợ Lý AI Mentor</h3>
                <p class="text-xxs text-text-muted leading-relaxed">
                  Hỏi đáp từ vựng, sửa lỗi ngữ pháp trực tuyến và tự động phân tích bài học từ tài liệu.
                </p>
              </div>
              <div class="pt-4 mt-4 border-t border-border-main/30 text-[9px] font-bold text-text-muted uppercase">AI Mentor Assistant</div>
            </div>
          </div>
        </section>

        <!-- Step Workflow Section -->
        <section class="space-y-12">
          <div class="text-center max-w-xl mx-auto space-y-3">
            <span class="text-xs font-black text-brand-primary dark:text-brand-secondary uppercase tracking-widest px-3 py-1 bg-brand-primary/10 rounded-full">Hành Trình Học Tập</span>
            <h2 class="text-2xl md:text-3xl font-black text-text-main tracking-tight">4 BƯỚC BẮT ĐẦU</h2>
            <p class="text-xs text-text-muted leading-relaxed">
              Thiết lập tài khoản và lộ trình học tập của bạn vô cùng nhanh chóng.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Step 1 -->
            <div class="text-center space-y-3 p-5 backdrop-blur-md bg-bg-card/30 border border-border-main/40 rounded-2xl relative">
              <div class="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary text-brand-primary flex items-center justify-center font-extrabold text-xs mx-auto shadow-md">
                1
              </div>
              <h4 class="text-xs font-extrabold text-text-main">Tạo tài khoản</h4>
              <p class="text-[10px] text-text-muted leading-relaxed">
                Đăng ký một tài khoản mới để lưu trữ toàn bộ tiến độ của bạn.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="text-center space-y-3 p-5 backdrop-blur-md bg-bg-card/30 border border-border-main/40 rounded-2xl relative">
              <div class="w-10 h-10 rounded-full bg-brand-secondary/10 border border-brand-secondary text-brand-secondary flex items-center justify-center font-extrabold text-xs mx-auto shadow-md">
                2
              </div>
              <h4 class="text-xs font-extrabold text-text-main">Thiết kế Nhân Vật</h4>
              <p class="text-[10px] text-text-muted leading-relaxed">
                Lựa chọn ngoại hình, kiểu tóc và trang bị cho chiến binh của bạn.
              </p>
            </div>

            <!-- Step 3 -->
            <div class="text-center space-y-3 p-5 backdrop-blur-md bg-bg-card/30 border border-border-main/40 rounded-2xl relative">
              <div class="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-extrabold text-xs mx-auto shadow-md">
                3
              </div>
              <h4 class="text-xs font-extrabold text-text-main">Placement Test</h4>
              <p class="text-[10px] text-text-muted leading-relaxed">
                Hoàn thành bài kiểm tra ngắn để AI đo lường trình độ hiện tại.
              </p>
            </div>

            <!-- Step 4 -->
            <div class="text-center space-y-3 p-5 backdrop-blur-md bg-bg-card/30 border border-border-main/40 rounded-2xl relative">
              <div class="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-xs mx-auto shadow-md">
                4
              </div>
              <h4 class="text-xs font-extrabold text-text-main">Chinh Phục Bản Đồ</h4>
              <p class="text-[10px] text-text-muted leading-relaxed">
                Nhận lộ trình do AI lập ra và bắt đầu hành trình cày cấp học tập.
              </p>
            </div>
          </div>
        </section>

        <!-- CTA Action Card -->
        <section class="p-8 md:p-12 text-center backdrop-blur-md bg-bg-card/35 border border-brand-primary/20 rounded-3xl relative overflow-hidden">
          <div class="absolute inset-0 bg-brand-primary/5 pointer-events-none"></div>
          <div class="max-w-xl mx-auto space-y-5 relative z-10">
            <h3 class="text-xl md:text-2xl font-black text-text-main tracking-tight">SẴN SÀNG LÊN CẤP TIẾNG ANH?</h3>
            <p class="text-xxs sm:text-xs text-text-muted leading-relaxed">
              Bắt đầu hành trình nhập vai RPG tiếng Anh độc đáo được tối ưu riêng biệt cho bạn ngay lúc này.
            </p>
            <div class="pt-2">
              <a
                [routerLink]="isLoggedIn ? '/character-customization' : '/register'"
                class="bg-text-main text-bg-main hover:opacity-90 text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg active:scale-98 transition-all inline-block border-none cursor-pointer"
              >
                {{ isLoggedIn ? 'Vào học ngay' : 'Đăng ký ngay' }}
              </a>
            </div>
          </div>
        </section>
      </main>

      <!-- Minimalist Footer -->
      <footer class="w-full h-16 flex items-center justify-center transition-colors duration-300 relative z-10 border-t border-border-main/20">
        <p class="text-[9px] text-text-muted font-bold uppercase tracking-wider">
          © 2026 English Ascension • Phát triển bởi VNPT
        </p>
      </footer>
    </div>
  `
})
export class IntroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pathsCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private animationFrameId?: number;
  private resizeListener?: () => void;

  isDark = signal(true);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userEmail(): string {
    return this.authService.getUser()?.email || '';
  }

  ngOnInit(): void {
    this.checkCurrentTheme();
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      if (user && user.role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin-roadmap']);
        return;
      }
      this.authService.checkOnboardingStatus().subscribe({
        next: (status) => {
          if (status.hasCharacter && status.hasRoadmap) {
            this.router.navigate(['/dashboard'], { queryParams: { tab: 'suggested' } });
          }
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.initCanvasAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkCurrentTheme(): void {
    if (typeof window !== 'undefined') {
      const isDarkClass = document.documentElement.classList.contains('dark');
      this.isDark.set(isDarkClass);
    }
  }

  toggleTheme(): void {
    if (typeof window !== 'undefined') {
      const darkState = !this.isDark();
      this.isDark.set(darkState);
      if (darkState) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/intro']);
  }

  private initCanvasAnimation(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    this.resizeListener = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', this.resizeListener);

    const pathsCount = 20;
    const paths: {
      yOffset: number;
      speed: number;
      phase: number;
      amplitude: number;
      thickness: number;
    }[] = [];

    for (let i = 0; i < pathsCount; i++) {
      paths.push({
        yOffset: (i - pathsCount / 2) * 25,
        speed: 0.0004 + (i % 3) * 0.00015 + Math.random() * 0.0002,
        phase: Math.random() * Math.PI * 2,
        amplitude: 30 + Math.random() * 25,
        thickness: 0.75 + (i % 3) * 0.4
      });
    }

    const draw = () => {
      const isDarkTheme = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      // Set curve path stroke style based on theme
      // Dark mode: very light transparent white
      // Light mode: very light transparent slate/black
      ctx.strokeStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)';

      const time = Date.now();

      paths.forEach((path) => {
        ctx.beginPath();
        ctx.lineWidth = path.thickness;

        const startX = -100;
        const startY = height * 0.25 + path.yOffset + Math.sin(time * path.speed + path.phase) * path.amplitude;

        const endX = width + 100;
        const endY = height * 0.85 + path.yOffset + Math.cos(time * path.speed * 0.85 + path.phase) * path.amplitude;

        const cp1x = width * 0.35;
        const cp1y = height * 0.5 + path.yOffset + Math.cos(time * path.speed * 0.6 + path.phase) * (path.amplitude * 1.3);

        const cp2x = width * 0.7;
        const cp2y = height * 0.7 + path.yOffset + Math.sin(time * path.speed * 0.75 + path.phase) * (path.amplitude * 1.1);

        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
      });

      this.animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }
}
