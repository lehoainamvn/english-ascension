import { Component, inject, OnInit, signal, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PlacementTestService } from '../../services/placement-test.service';
import { StudyService } from '../../services/study.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <!-- TOP HORIZONTAL NAVIGATION BAR -->
    <nav class="sticky top-0 z-50 w-full bg-bg-card border-b border-border-main transition-colors duration-300 select-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          
          <!-- Left: Logo -->
          <div class="flex items-center gap-2.5 shrink-0">
            <div class="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-md">
              <span class="text-white font-black text-sm">EA</span>
            </div>
            <span class="text-sm font-black text-text-main tracking-tight">
              English Ascension
            </span>
          </div>

          <!-- Middle: Navigation Tabs -->
          <div class="hidden md:flex items-center space-x-1 font-bold">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-bg-input text-text-main"
              [routerLinkActiveOptions]="{exact: true}"
              class="px-3 py-1.5 rounded-lg text-xs transition-all text-text-muted hover:text-text-main cursor-pointer"
            >
              Trang chủ
            </a>
            
            <!-- Resource Library Dropdown -->
            <div class="relative">
              <button
                (click)="toggleResourceDropdown($event)"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-text-muted hover:text-text-main flex items-center gap-1.5 cursor-pointer focus:outline-none bg-transparent border-none"
                [class.bg-bg-input]="isResourceDropdownOpen() || isResourceActive()"
                [class.text-text-main]="isResourceDropdownOpen() || isResourceActive()"
              >
                Kho tài nguyên
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down transition-transform duration-200 shrink-0" [class.rotate-180]="isResourceDropdownOpen()"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              @if (isResourceDropdownOpen()) {
                <div class="absolute left-0 mt-2 w-44 rounded-xl border border-border-main bg-bg-card backdrop-blur-xl shadow-xl z-50 p-1.5 space-y-0.5">
                  <a
                    routerLink="/vocabulary"
                    (click)="isResourceDropdownOpen.set(false)"
                    class="flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-text-main hover:bg-bg-input/60 transition-colors cursor-pointer"
                  >
                    Kho từ vựng
                  </a>
                  <a
                    routerLink="/grammar-topics"
                    (click)="isResourceDropdownOpen.set(false)"
                    class="flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-text-main hover:bg-bg-input/60 transition-colors cursor-pointer"
                  >
                    Kho ngữ pháp
                  </a>
                  <a
                    routerLink="/listening"
                    (click)="isResourceDropdownOpen.set(false)"
                    class="flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-text-main hover:bg-bg-input/60 transition-colors cursor-pointer"
                  >
                    Kho luyện nghe
                  </a>
                  <a
                    routerLink="/reading"
                    (click)="isResourceDropdownOpen.set(false)"
                    class="flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-text-main hover:bg-bg-input/60 transition-colors cursor-pointer"
                  >
                    Kho luyện đọc
                  </a>
                </div>
              }
            </div>
            <a
              routerLink="/document-learning"
              routerLinkActive="bg-bg-input text-text-main"
              class="px-3 py-1.5 rounded-lg text-xs transition-all text-text-muted hover:text-text-main cursor-pointer"
            >
              Tài liệu học AI
            </a>
            <a
              routerLink="/my-vocabulary"
              routerLinkActive="bg-bg-input text-text-main"
              class="px-3 py-1.5 rounded-lg text-xs transition-all text-text-muted hover:text-text-main cursor-pointer flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Sổ tay từ vựng
            </a>

            <a
              routerLink="/shop"
              routerLinkActive="bg-bg-input text-text-main"
              class="px-3 py-1.5 rounded-lg text-xs transition-all text-text-muted hover:text-text-main cursor-pointer"
            >
              Cửa hàng
            </a>

            <a
              routerLink="/community"
              routerLinkActive="bg-bg-input text-text-main"
              class="px-3 py-1.5 rounded-lg text-xs transition-all text-text-muted hover:text-text-main cursor-pointer"
            >
              Cộng đồng
            </a>
            <a
              routerLink="/classroom"
              routerLinkActive="bg-bg-input text-text-main"
              class="px-3 py-1.5 rounded-lg text-xs transition-all text-text-muted hover:text-text-main cursor-pointer flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Lớp Học
            </a>
          </div>

          <!-- Right: Actions & Profile -->
          <div class="flex items-center gap-2.5">
            <!-- Stats -->
            @if (profile()) {
              <div class="hidden lg:flex items-center gap-2 text-[10px] font-bold text-text-muted bg-bg-input/50 px-2.5 py-1 rounded-lg border border-border-main/40">
                <span>Streak: {{ profile()?.streak || 0 }}</span>
                <span class="text-text-muted/30">|</span>
                <span>Xu: {{ profile()?.coins || 0 }}</span>
              </div>
            }

            <button
              (click)="toggleTheme()"
              class="px-2.5 py-1.5 text-xs font-bold text-text-muted hover:text-text-main bg-bg-card hover:bg-bg-input/60 border border-border-main rounded-lg transition-all cursor-pointer"
              title="Chuyển chế độ sáng/tối"
            >
              {{ isDark() ? 'Sáng' : 'Tối' }}
            </button>

            <!-- User profile dropdown trigger -->
            <div class="relative">
              <button
                (click)="toggleDropdown($event)"
                class="flex items-center gap-1.5 bg-bg-input hover:bg-bg-input/80 border border-border-main text-text-main px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user shrink-0"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span class="max-w-[100px] truncate">{{ userEmail }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down transition-transform duration-200 shrink-0" [class.rotate-180]="isDropdownOpen()"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              @if (isDropdownOpen()) {
                <div class="absolute right-0 mt-2 w-48 rounded-xl border border-border-main bg-bg-card backdrop-blur-xl shadow-xl z-50 p-1.5 space-y-0.5">
                  <div class="px-3 py-2 text-[10px] text-text-muted border-b border-border-main/50 font-medium truncate">
                    Tài khoản: {{ userEmail }}
                  </div>
                  <button
                    (click)="openPasswordModal($event)"
                    class="w-full text-left flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-text-main hover:bg-bg-input/60 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    Đổi mật khẩu
                  </button>
                  <button
                    (click)="onLogout()"
                    class="w-full text-left flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    Đăng xuất
                  </button>
                </div>
              }
            </div>

            <!-- Mobile menu button -->
            <button
              (click)="isMobileMenuOpen.set(true)"
              class="md:hidden p-1.5 rounded-lg border border-border-main text-text-muted hover:text-text-main cursor-pointer bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- MOBILE DRAWER OVERLAY & MENU -->
    @if (isMobileMenuOpen()) {
      <div class="fixed inset-0 z-[100] flex md:hidden">
        <!-- Backdrop -->
        <div
          (click)="isMobileMenuOpen.set(false)"
          class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        ></div>

        <!-- Drawer Content -->
        <div class="relative w-64 max-w-xs bg-bg-card border-r border-border-main h-full flex flex-col p-4 shadow-2xl z-50 overflow-y-auto animate-slide-in">
          
          <!-- Close Button & Brand Header -->
          <div class="flex items-center justify-between pb-4 border-b border-border-main/50 shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-brand-primary rounded flex items-center justify-center">
                <span class="text-white font-black text-[10px]">EA</span>
              </div>
              <span class="text-xs font-black text-text-main">English Ascension</span>
            </div>
            <button
              (click)="isMobileMenuOpen.set(false)"
              class="p-1.5 rounded-lg border border-border-main/60 text-text-muted hover:text-text-main cursor-pointer bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <!-- Drawer Navigation Menu Links -->
          <div class="flex-1 overflow-y-auto my-4 space-y-1">
            <a
              routerLink="/dashboard"
              (click)="isMobileMenuOpen.set(false)"
              class="flex items-center px-3 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/40 transition-all cursor-pointer"
            >
              Trang chủ
            </a>
            
            <!-- Mobile Resource Dropdown -->
            <div>
              <button
                (click)="isMobileResourceOpen.set(!isMobileResourceOpen())"
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/40 transition-all cursor-pointer focus:outline-none bg-transparent border-none text-left"
                [class.bg-bg-input]="isMobileResourceOpen() || isResourceActive()"
                [class.text-text-main]="isMobileResourceOpen() || isResourceActive()"
              >
                <span>Kho tài nguyên</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down transition-transform duration-200 shrink-0" [class.rotate-180]="isMobileResourceOpen()"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              @if (isMobileResourceOpen()) {
                <div class="mt-1 ml-4 pl-2.5 border-l border-border-main/50 space-y-0.5">
                  <a
                    routerLink="/vocabulary"
                    (click)="isMobileMenuOpen.set(false); isMobileResourceOpen.set(false)"
                    class="flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/20 transition-all cursor-pointer"
                  >
                    Kho từ vựng
                  </a>
                  <a
                    routerLink="/grammar-topics"
                    (click)="isMobileMenuOpen.set(false); isMobileResourceOpen.set(false)"
                    class="flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/20 transition-all cursor-pointer"
                  >
                    Kho ngữ pháp
                  </a>
                  <a
                    routerLink="/listening"
                    (click)="isMobileMenuOpen.set(false); isMobileResourceOpen.set(false)"
                    class="flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/20 transition-all cursor-pointer"
                  >
                    Kho luyện nghe
                  </a>
                  <a
                    routerLink="/reading"
                    (click)="isMobileMenuOpen.set(false); isMobileResourceOpen.set(false)"
                    class="flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/20 transition-all cursor-pointer"
                  >
                    Kho luyện đọc
                  </a>
                </div>
              }
            </div>

            <a
              routerLink="/document-learning"
              (click)="isMobileMenuOpen.set(false)"
              class="flex items-center px-3 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/40 transition-all cursor-pointer"
            >
              Tài liệu học AI
            </a>

            <a
              routerLink="/my-vocabulary"
              (click)="isMobileMenuOpen.set(false)"
              class="flex items-center px-3 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/40 transition-all cursor-pointer gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Sổ tay từ vựng
            </a>

            <a
              routerLink="/shop"
              (click)="isMobileMenuOpen.set(false)"
              class="flex items-center px-3 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/40 transition-all cursor-pointer"
            >
              Cửa hàng
            </a>

            <a
              routerLink="/community"
              (click)="isMobileMenuOpen.set(false)"
              class="flex items-center px-3 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/40 transition-all cursor-pointer"
            >
              Cộng đồng
            </a>
            <a
              routerLink="/classroom"
              (click)="isMobileMenuOpen.set(false)"
              class="flex items-center px-3 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-bg-input/40 transition-all cursor-pointer gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Lớp Học
            </a>
          </div>

          <!-- Drawer Profile Actions at bottom -->
          <div class="pt-4 border-t border-border-main/50 space-y-2 mt-auto shrink-0 bg-bg-input/10 p-2 rounded-xl">
            <button
              (click)="toggleTheme()"
              class="w-full bg-bg-input hover:bg-bg-card border border-border-main py-2 rounded-lg text-xs font-bold transition-all text-text-main cursor-pointer"
            >
              {{ isDark() ? 'Chế độ sáng' : 'Chế độ tối' }}
            </button>
            <button
              (click)="onLogout()"
              class="w-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>

        </div>
      </div>
    }

    <!-- CHANGE PASSWORD MODAL -->
    @if (isChangePasswordModalOpen()) {
      <div class="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
        <div class="bg-bg-card border border-border-main p-6 rounded-2xl w-full max-w-sm shadow-2xl relative transition-all duration-300">
          <h3 class="text-sm font-black text-text-main mb-4 uppercase tracking-wider">
            Đổi Mật Khẩu
          </h3>
          
          <div class="space-y-3">
            <div>
              <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                [(ngModel)]="oldPassword"
                placeholder="••••••••"
                class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Mật khẩu mới</label>
              <input
                type="password"
                [(ngModel)]="newPassword"
                placeholder="••••••••"
                class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                [(ngModel)]="confirmPassword"
                placeholder="••••••••"
                class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          @if (passwordError()) {
            <p class="text-red-500 text-[10px] font-semibold mt-2">{{ passwordError() }}</p>
          }
          @if (passwordSuccess()) {
            <p class="text-green-500 text-[10px] font-semibold mt-2">{{ passwordSuccess() }}</p>
          }

          <div class="flex gap-3 mt-5 pt-3 border-t border-border-main/50 text-xs font-bold">
            <button
              (click)="changePassword()"
              [disabled]="isChangingPassword()"
              class="flex-1 bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] py-2 rounded-xl active:scale-98 transition-all disabled:opacity-50 cursor-pointer border-none"
            >
              Lưu mật khẩu
            </button>
            <button
              (click)="closePasswordModal()"
              [disabled]="isChangingPassword()"
              class="flex-1 bg-bg-input border border-border-main text-text-muted py-2 rounded-xl hover:bg-bg-card transition-all cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    }
  `,

  styles: [`
    .animate-slide-in {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly placementService = inject(PlacementTestService);
  private readonly studyService = inject(StudyService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  profile = signal<any>(null);
  activeModuleId = signal<number | null>(null);
  isDark = signal(true);
  isMobileMenuOpen = signal(false);

  // Dropdown & Modal States
  isDropdownOpen = signal(false);
  isChangePasswordModalOpen = signal(false);
  isChangingPassword = signal(false);
  isResourceDropdownOpen = signal(false);
  isMobileResourceOpen = signal(false);

  // Change Password Form
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = signal('');
  passwordSuccess = signal('');

  ngOnInit(): void {
    this.checkCurrentTheme();
    this.loadStats();
  }

  checkCurrentTheme(): void {
    if (typeof window !== 'undefined') {
      const isDarkClass = document.documentElement.classList.contains('dark');
      this.isDark.set(isDarkClass);
    }
  }

  loadStats(): void {
    if (this.authService.currentUser()) {
      this.studyService.getProfile().subscribe({
        next: (prof) => this.profile.set(prof),
        error: () => this.profile.set(null)
      });

      this.placementService.getRoadmap().subscribe({
        next: (rm) => {
          if (rm && rm.modules) {
            const activeMod = rm.modules.find(m => m.status === 'IN_PROGRESS') || rm.modules[0];
            if (activeMod) {
              this.activeModuleId.set(activeMod.id);
            }
          }
        },
        error: () => this.activeModuleId.set(1)
      });
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isResourceDropdownOpen.set(false);
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  toggleResourceDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen.set(false);
    this.isResourceDropdownOpen.set(!this.isResourceDropdownOpen());
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
      this.isResourceDropdownOpen.set(false);
    }
  }

  isResourceActive(): boolean {
    if (typeof window === 'undefined') return false;
    const url = this.router.url;
    return url.startsWith('/vocabulary') ||
           url.startsWith('/grammar-topics') ||
           url.startsWith('/grammar-study') ||
           url.startsWith('/listening') ||
           url.startsWith('/reading');
  }

  isAiActive(): boolean {
    if (typeof window === 'undefined') return false;
    return this.router.url.startsWith('/document-learning');
  }

  openPasswordModal(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen.set(false);
    this.isChangePasswordModalOpen.set(true);
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError.set('');
    this.passwordSuccess.set('');
  }

  closePasswordModal(): void {
    this.isChangePasswordModalOpen.set(false);
  }

  changePassword(): void {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError.set('Vui lòng điền đầy đủ các thông tin.');
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError.set('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    this.passwordError.set('');
    this.isChangingPassword.set(true);

    // Simulate API request to update password
    setTimeout(() => {
      this.isChangingPassword.set(false);
      this.passwordSuccess.set('Đổi mật khẩu thành công! Cửa sổ sẽ đóng sau giây lát.');
      
      setTimeout(() => {
        this.closePasswordModal();
      }, 1500);
    }, 1200);
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
    this.isDropdownOpen.set(false);
    this.isResourceDropdownOpen.set(false);
    this.isMobileMenuOpen.set(false);
    this.isMobileResourceOpen.set(false);
    this.router.navigate(['/intro']);
  }

  get userEmail(): string {
    return this.authService.getUser()?.email || 'Học viên';
  }
}
