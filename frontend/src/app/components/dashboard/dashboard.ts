import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PlacementTestService } from '../../services/placement-test.service';
import { CharacterService, Character } from '../../services/character.service';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, CharacterAvatarComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-6 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Navigation Header -->
      <header class="max-w-6xl mx-auto flex justify-between items-center pb-6 border-b border-border-main mb-10">
        <h1 class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
          ENGLISH ASCENSION
        </h1>
        <div class="flex items-center gap-3">
          <!-- World Map Navigation Link -->
          <a
            routerLink="/world-map"
            class="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            🗺️ Bản Đồ
          </a>

          <!-- Theme Toggle Button -->
          <button
            (click)="toggleTheme()"
            class="bg-bg-card border border-border-main hover:bg-bg-input px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            title="Chuyển đổi giao diện sáng/tối"
          >
            @if (isDark) {
              <span>☀️ Giao diện Sáng</span>
            } @else {
              <span>🌙 Giao diện Tối</span>
            }
          </button>
          
          <span class="text-sm text-text-muted font-medium hidden md:inline ml-2">
            Tài khoản: <strong class="text-text-main">{{ userEmail }}</strong>
          </span>
          <button
            (click)="onLogout()"
            class="bg-bg-card border border-border-main hover:bg-bg-input px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <!-- Dashboard Main Area -->
      <main class="max-w-4xl mx-auto">
        <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-8 md:p-10 shadow-2xl relative transition-colors duration-300">
          <!-- Welcome Section -->
          <!-- Welcome Section -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-border-main/40">
            <div class="flex items-center gap-4">
              @if (character()) {
                <div class="w-16 h-16 rounded-xl border border-border-main bg-bg-input overflow-hidden shrink-0">
                  <app-character-avatar [character]="character()" class="w-full h-full" />
                </div>
              }
              <div>
                <p class="text-xs font-bold text-brand-primary uppercase tracking-widest">
                  @if (character()) {
                    ⚔️ {{ character()?.title }} ⚔️
                  } @else {
                    Dashboard chính
                  }
                </p>
                <h2 class="text-2xl font-extrabold text-text-main mt-0.5">
                  Chào mừng, {{ character()?.name || userEmail }}! 👋
                </h2>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-xxs text-text-muted text-[10px] font-bold uppercase tracking-wider">Tài khoản đăng nhập</span>
              <div class="bg-bg-input border border-border-main px-4 py-2 rounded-xl text-text-main text-sm font-semibold">
                {{ userEmail }}
              </div>
            </div>
          </div>

          <!-- Description Box -->
          <div class="p-6 bg-bg-input border border-border-main rounded-xl mb-8 transition-colors duration-300">
            <h3 class="text-lg font-bold text-text-main mb-2">🎉 Đăng nhập & Xác thực thành công!</h3>
            <p class="text-text-muted leading-relaxed text-sm">
              Bạn đã được bảo vệ bởi <strong>Angular Route Guard</strong> và được cấp token JWT hợp lệ từ Spring Boot backend. 
              Các tài nguyên và tính năng học tập sẽ được mở khóa dưới đây khi bạn tiến sâu hơn vào trò chơi.
            </p>
          </div>

          <!-- Feature Cards / Next Steps -->
          <h3 class="text-lg font-bold text-text-main mb-4">Các bước tiếp theo cần hoàn thành</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Card 1 -->
            <div class="p-5 border border-border-main bg-bg-card/40 rounded-xl hover:border-brand-primary/30 transition-all duration-300">
              <span class="text-xs font-bold text-brand-secondary uppercase tracking-widest">Task 1.5</span>
              <h4 class="text-md font-bold text-text-main mt-1 mb-2">Tạo Nhân Vật (RPG Character)</h4>
              <p class="text-xs text-text-muted mb-4">
                Thiết kế ngoại hình, chọn giới tính, kiểu tóc, trang phục và bắt đầu cuộc hành trình.
              </p>
              <a
                routerLink="/character-customization"
                class="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline transition-all"
              >
                Tới trang tạo nhân vật &rarr;
              </a>
            </div>

            <!-- Card 2 -->
            <div class="p-5 border border-border-main bg-bg-card/40 rounded-xl hover:border-brand-primary/30 transition-all duration-300">
              @if (roadmap()) {
                <span class="text-xs font-bold text-brand-accent uppercase tracking-widest">Đã có Lộ Trình</span>
                <h4 class="text-md font-bold text-text-main mt-1 mb-2">Xem Lộ Trình Học AI ({{ roadmap().cefrLevel }})</h4>
                <p class="text-xs text-text-muted mb-4">
                  Dựa vào kết quả test đầu vào, AI đã lập một lộ trình học chi tiết với {{ roadmap().modules?.length }} modules riêng cho bạn.
                </p>
                <a
                  routerLink="/roadmap"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline transition-all"
                >
                  Xem lộ trình của bạn &rarr;
                </a>
              } @else {
                <span class="text-xs font-bold text-brand-accent uppercase tracking-widest">Giai đoạn 2</span>
                <h4 class="text-md font-bold text-text-main mt-1 mb-2">Placement Test</h4>
                <p class="text-xs text-text-muted mb-4">
                  Làm bài kiểm tra đầu vào để AI tự động xây dựng lộ trình học tập tối ưu riêng cho bạn.
                </p>
                <a
                  routerLink="/placement-test"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline transition-all"
                >
                  Bắt đầu làm bài test &rarr;
                </a>
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly placementService = inject(PlacementTestService);
  private readonly router = inject(Router);

  private readonly characterService = inject(CharacterService);
  
  roadmap = signal<any>(null);
  character = signal<Character | null>(null);
  isDark = true;

  constructor() {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
      this.isDark = document.documentElement.classList.contains('dark');
    }
  }

  ngOnInit(): void {
    this.placementService.getRoadmap().subscribe({
      next: (rm) => this.roadmap.set(rm),
      error: () => this.roadmap.set(null)
    });

    this.characterService.getMyCharacter().subscribe({
      next: (char) => this.character.set(char),
      error: () => this.character.set(null)
    });
  }

  get userEmail(): string {
    return this.authService.getUser()?.email || 'N/A';
  }

  toggleTheme(): void {
    if (typeof window !== 'undefined') {
      this.isDark = !this.isDark;
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
