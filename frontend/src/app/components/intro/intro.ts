import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main flex flex-col font-sans relative overflow-hidden transition-colors duration-300 select-none">
      <!-- Ambient Background Glows -->
      <div class="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-brand-secondary/3 dark:bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <!-- Landing Page Header -->
      <header class="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-border-main transition-colors duration-300 relative z-50">
        <div class="flex items-center gap-2.5">
          <span class="text-3xl filter drop-shadow">🎓</span>
          <div class="flex flex-col">
            <span class="text-base font-black tracking-wider bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent uppercase">
              English Ascension
            </span>
            <span class="text-[9px] text-text-muted uppercase tracking-widest font-extrabold -mt-1 hidden sm:block">RPG Learning Portal</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <ng-container *ngIf="!isLoggedIn; else loggedInMenu">
            <a
              routerLink="/login"
              class="text-xs font-bold text-text-muted hover:text-text-main px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Đăng nhập
            </a>
            <a
              routerLink="/register"
              class="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Đăng ký thành viên
            </a>
          </ng-container>
          <ng-template #loggedInMenu>
            <span class="text-xs text-text-muted font-bold hidden sm:inline">{{ userEmail }}</span>
            <a
              routerLink="/character-customization"
              class="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-center"
            >
              Thiết lập nhân vật 🧙‍♂️
            </a>
            <button
              (click)="onLogout()"
              class="border border-border-main bg-bg-card hover:bg-bg-input/60 text-text-muted hover:text-text-main text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer text-center"
            >
              Đăng xuất 🚪
            </button>
          </ng-template>
        </div>
      </header>

      <!-- Main Layout -->
      <main class="flex-1 w-full max-w-7xl mx-auto px-6 relative z-10 py-12 md:py-20 space-y-24 md:space-y-32">
        
        <!-- Hero Section -->
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-wider">
              <span>🚀</span> Kỷ nguyên học tiếng Anh mới
            </div>
            
            <h1 class="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-text-main">
              HỌC TIẾNG ANH THEO<br class="hidden sm:inline" />
              <span class="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
                PHONG CÁCH RPG
              </span> CÁ NHÂN
            </h1>
            
            <p class="text-sm md:text-base text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Chào mừng bạn đến với English Ascension! Hãy thiết kế nhân vật đại diện, tham gia bài kiểm tra năng lực và nhận lộ trình học tập CEFR & TOEIC riêng biệt được sinh ra bởi Trí tuệ nhân tạo (AI). Cày EXP, tiêu diệt quái vật từ vựng và thăng hạng học tập mỗi ngày.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                [routerLink]="isLoggedIn ? '/character-customization' : '/register'"
                class="w-full sm:w-auto bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white text-xs font-extrabold px-8 py-4 rounded-xl transition-all shadow-md text-center cursor-pointer animate-pulse-glow active:scale-98"
              >
                {{ isLoggedIn ? 'TIẾP TỤC THIẾT LẬP 🧙‍♂️' : 'BẮT ĐẦU HÀNH TRÌNH NGAY ⚔️' }}
              </a>
              <a
                href="#features"
                class="w-full sm:w-auto border border-border-main bg-bg-card hover:bg-bg-input/60 text-text-muted hover:text-text-main text-xs font-bold px-8 py-4 rounded-xl transition-all text-center cursor-pointer"
              >
                Khám phá tính năng
              </a>
            </div>

            <!-- Mini stats badges -->
            <div class="flex justify-center lg:justify-start items-center gap-8 pt-8 border-t border-border-main/50 mt-8">
              <div>
                <p class="text-2xl font-black text-text-main">99%</p>
                <p class="text-[10px] text-text-muted font-bold uppercase tracking-wider">Tự động hóa AI</p>
              </div>
              <div class="border-r border-border-main h-8"></div>
              <div>
                <p class="text-2xl font-black text-text-main">A1 - C2</p>
                <p class="text-[10px] text-text-muted font-bold uppercase tracking-wider">Chuẩn CEFR & TOEIC</p>
              </div>
              <div class="border-r border-border-main h-8"></div>
              <div>
                <p class="text-2xl font-black text-text-main">100%</p>
                <p class="text-[10px] text-text-muted font-bold uppercase tracking-wider">Gamification RPG</p>
              </div>
            </div>
          </div>

          <!-- Hero Image Mockup -->
          <div class="lg:col-span-5 relative flex justify-center items-center">
            <div class="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-brand-primary/5 to-brand-accent/5 dark:from-indigo-500/10 dark:to-pink-500/10 rounded-3xl border border-border-main p-6 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
              <div class="absolute inset-0 bg-bg-card/40 rounded-3xl -z-10"></div>
              <div class="absolute -top-6 -left-6 bg-bg-card border border-border-main p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
                <span class="text-2xl">🔥</span>
                <div>
                  <h4 class="text-xxs font-black text-text-muted uppercase">Streak Ngày học</h4>
                  <p class="text-xs font-black text-orange-500">12 Ngày liên tục</p>
                </div>
              </div>
              <div class="absolute -bottom-6 -right-6 bg-bg-card border border-border-main p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
                <span class="text-2xl">🪙</span>
                <div>
                  <h4 class="text-xxs font-black text-text-muted uppercase">Vàng Tích Lũy</h4>
                  <p class="text-xs font-black text-yellow-500">1,450 Gold</p>
                </div>
              </div>

              <!-- RPG Card Mock -->
              <div class="w-full h-full flex flex-col justify-between">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2.5 py-0.5 rounded-full">CEFR B2 Level</span>
                  <span class="text-[10px] font-black bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/25 px-2.5 py-0.5 rounded-full">Lv.12 Warrior</span>
                </div>
                
                <div class="text-center py-6">
                  <span class="text-7xl filter drop-shadow">🧙‍♂️</span>
                  <h3 class="text-lg font-black text-text-main mt-3">Archmage Nam</h3>
                  <p class="text-xxs text-brand-secondary font-bold uppercase tracking-widest mt-1">Đại pháp sư tiếng Anh</p>
                </div>

                <!-- XP Bar -->
                <div class="space-y-1">
                  <div class="flex justify-between items-center text-[9px] font-extrabold text-text-muted">
                    <span>KINH NGHIỆM (EXP)</span>
                    <span>75%</span>
                  </div>
                  <div class="w-full h-2 bg-bg-input rounded-full overflow-hidden p-0.5 border border-border-main">
                    <div class="h-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-full" style="width: 75%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Grid Section -->
        <section id="features" class="space-y-12 scroll-mt-24">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-xs font-bold text-brand-accent uppercase tracking-widest px-3 py-1 bg-brand-accent/10 rounded-full">Khám Phá Tính Năng</span>
            <h2 class="text-2xl md:text-3xl font-black text-text-main tracking-tight">HỆ THỐNG RPG KẾT HỢP AI SIÊU VIỆT</h2>
            <p class="text-xs md:text-sm text-text-muted leading-relaxed">
              Ascension tích hợp những công nghệ hiện đại hàng đầu cùng cơ chế game hóa (Gamification) giúp người học không bao giờ cảm thấy nhàm chán.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Feature 1 -->
            <div class="p-6 bg-bg-card border border-border-main rounded-2xl hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-primary group-hover:scale-105 transition-transform duration-300 mb-6">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.446 1.202-.832a2.25 2.25 0 0 0 .896-1.584V5.713a2.25 2.25 0 0 0-.896-1.583l-1.202-.833a2.25 2.25 0 0 0-2.614 0l-1.398.97a2.25 2.25 0 0 1-2.614 0l-1.398-.97a2.25 2.25 0 0 0-2.614 0L4.01 4.13a2.25 2.25 0 0 0-.895 1.583v11.088c0 .61.246 1.19.684 1.618l1.202.833a2.25 2.25 0 0 0 2.614 0l1.398-.97a2.25 2.25 0 0 1 2.614 0l1.398.97a2.25 2.25 0 0 0 2.614 0Z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-text-main mb-2">Lộ Trình AI Cá Nhân</h3>
                <p class="text-xs text-text-muted leading-relaxed">
                  Thiết lập bản đồ các hành tinh thế giới học tập phù hợp theo kết quả Placement Test, tối ưu hiệu quả học tập cá nhân.
                </p>
              </div>
              <div class="pt-6 mt-6 border-t border-border-main text-[10px] font-bold text-text-muted uppercase">CEFR & TOEIC Mapping</div>
            </div>

            <!-- Feature 2 -->
            <div class="p-6 bg-bg-card border border-border-main rounded-2xl hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/25 flex items-center justify-center text-brand-accent group-hover:scale-105 transition-transform duration-300 mb-6">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-text-main mb-2">Nhập Vai & Avatar RPG</h3>
                <p class="text-xs text-text-muted leading-relaxed">
                  Tự do thiết kế nhân vật chiến binh của mình, tích lũy điểm kinh nghiệm (EXP), thăng cấp và thu thập tiền vàng mua sắm vật phẩm.
                </p>
              </div>
              <div class="pt-6 mt-6 border-t border-border-main text-[10px] font-bold text-text-muted uppercase">RPG Character System</div>
            </div>

            <!-- Feature 3 -->
            <div class="p-6 bg-bg-card border border-border-main rounded-2xl hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:scale-105 transition-transform duration-300 mb-6">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-text-main mb-2">Đấu Từ Vựng (Minigame)</h3>
                <p class="text-xs text-text-muted leading-relaxed">
                  Rèn luyện phản xạ ghi nhớ từ vựng tiếng Anh thần tốc bằng cách trả lời nhanh các câu hỏi trắc nghiệm để tiêu diệt quái thú.
                </p>
              </div>
              <div class="pt-6 mt-6 border-t border-border-main text-[10px] font-bold text-text-muted uppercase">Minigame Word Battle</div>
            </div>

            <!-- Feature 4 -->
            <div class="p-6 bg-bg-card border border-border-main rounded-2xl hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="w-10 h-10 rounded-xl bg-brand-secondary/10 border border-brand-secondary/25 flex items-center justify-center text-brand-secondary group-hover:scale-105 transition-transform duration-300 mb-6">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-text-main mb-2">Trợ Lý AI Mentor</h3>
                <p class="text-xs text-text-muted leading-relaxed">
                  Tương tác trực quan cùng AI Mentor để học hỏi và sửa sai, tải tài liệu riêng tư lên để hệ thống phân tích từ vựng và chủ đề học tập.
                </p>
              </div>
              <div class="pt-6 mt-6 border-t border-border-main text-[10px] font-bold text-text-muted uppercase">AI Learning Assistant</div>
            </div>
          </div>
        </section>

        <!-- Workflow Section -->
        <section class="space-y-16">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-xs font-bold text-brand-primary uppercase tracking-widest px-3 py-1 bg-brand-primary/10 rounded-full">Cách Hoạt Động</span>
            <h2 class="text-2xl md:text-3xl font-black text-text-main tracking-tight">4 BƯỚC KHỞI HÀNH</h2>
            <p class="text-xs md:text-sm text-text-muted leading-relaxed">
              Bạn chỉ cần thực hiện 4 bước đơn giản dưới đây để thiết lập nhân vật và kích hoạt lộ trình học tập cá nhân hóa AI của mình.
            </p>
          </div>

          <!-- Vertical/Horizontal Connect Steps -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <!-- Step 1 -->
            <div class="text-center space-y-4 relative">
              <div class="w-12 h-12 rounded-full bg-bg-card border-2 border-brand-primary/50 flex items-center justify-center font-black text-text-main mx-auto relative z-10 shadow-lg">
                1
              </div>
              <h4 class="text-sm font-extrabold text-text-main">Đăng ký tài khoản</h4>
              <p class="text-[11px] text-text-muted leading-relaxed max-w-[200px] mx-auto">
                Tạo một tài khoản mới và đăng nhập nhanh chóng để bắt đầu hành trình.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="text-center space-y-4 relative">
              <div class="w-12 h-12 rounded-full bg-bg-card border-2 border-brand-accent/50 flex items-center justify-center font-black text-text-main mx-auto relative z-10 shadow-lg">
                2
              </div>
              <h4 class="text-sm font-extrabold text-text-main">Tạo nhân vật RPG</h4>
              <p class="text-[11px] text-text-muted leading-relaxed max-w-[200px] mx-auto">
                Thiết kế ngoại hình, diện mạo nhân vật để bắt đầu tích lũy vàng và kinh nghiệm.
              </p>
            </div>

            <!-- Step 3 -->
            <div class="text-center space-y-4 relative">
              <div class="w-12 h-12 rounded-full bg-bg-card border-2 border-yellow-500/50 flex items-center justify-center font-black text-text-main mx-auto relative z-10 shadow-lg">
                3
              </div>
              <h4 class="text-sm font-extrabold text-text-main">Placement Test</h4>
              <p class="text-[11px] text-text-muted leading-relaxed max-w-[200px] mx-auto">
                Làm bài test nhanh 12 câu để AI phân tích trình độ ngoại ngữ chính xác của bạn.
              </p>
            </div>

            <!-- Step 4 -->
            <div class="text-center space-y-4 relative">
              <div class="w-12 h-12 rounded-full bg-bg-card border-2 border-green-500/50 flex items-center justify-center font-black text-text-main mx-auto relative z-10 shadow-lg">
                4
              </div>
              <h4 class="text-sm font-extrabold text-text-main">Chinh phục lộ trình</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                Nhận sơ đồ lộ trình học tùy chỉnh do AI tạo ra và bắt đầu hành trình thăng cấp.
              </p>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center border border-brand-primary/20 bg-gradient-to-r from-bg-main via-brand-primary/5 to-bg-main">
          <div class="absolute inset-0 bg-brand-primary/5 pointer-events-none"></div>
          <div class="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 class="text-2xl md:text-4xl font-black text-text-main tracking-tight">SẴN SÀNG NÂNG TẦM TRÌNH ĐỘ TIẾNG ANH?</h2>
            <p class="text-xs md:text-sm text-text-muted leading-relaxed">
              Hàng ngàn chiến binh đã gia nhập và đạt kết quả vượt bậc. Tạo nhân vật của bạn ngay hôm nay để nhận lộ trình phân tích từ AI hoàn toàn miễn phí.
            </p>
            <div class="pt-4">
              <a
                [routerLink]="isLoggedIn ? '/character-customization' : '/register'"
                class="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-brand-secondary hover:to-brand-primary text-white text-xs font-extrabold px-10 py-4 rounded-xl transition-all shadow-xl text-center inline-block cursor-pointer active:scale-98"
              >
                {{ isLoggedIn ? 'TIẾP TỤC HÀNH TRÌNH 🧙‍♂️' : 'GIA NHẬP ASCENSION NGAY ⚔️' }}
              </a>
            </div>
          </div>
        </section>

      </main>

      <!-- Premium Footer -->
      <footer class="w-full bg-bg-card border-t border-border-main py-10 mt-12 relative z-50">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🎓</span>
            <span class="text-xs font-extrabold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent uppercase tracking-wider">
              English Ascension
            </span>
          </div>

          <p class="text-[10px] text-text-muted font-bold uppercase tracking-wider text-center md:text-right">
            © 2026 English Ascension. All Rights Reserved. Phát triển bởi VNPT.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .animate-pulse-glow {
      animation: pulseGlow 2s infinite ease-in-out;
    }
    @keyframes pulseGlow {
      0%, 100% {
        box-shadow: 0 4px 20px 0 rgba(99, 102, 241, 0.1);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 4px 30px 4px rgba(99, 102, 241, 0.25);
        transform: scale(1.02);
      }
    }
  `]
})
export class IntroComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userEmail(): string {
    return this.authService.getUser()?.email || '';
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // Check onboarding status: if they have completed it, go to world map. Otherwise stay here so they can choose to build character
      this.authService.checkOnboardingStatus().subscribe({
        next: (status) => {
          if (status.hasCharacter && status.hasRoadmap) {
            this.router.navigate(['/dashboard'], { queryParams: { tab: 'suggested' } });
          }
        }
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/intro']);
  }
}
