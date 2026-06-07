import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacementTestService, LearningRoadmap } from '../../services/placement-test.service';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 flex flex-col items-center relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main card -->
      <div class="relative w-full max-w-3xl backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-2xl p-6 md:p-8 transition-colors duration-300">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-8 pb-4 border-b border-border-main">
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
              ENGLISH ASCENSION
            </h2>
            <span class="text-xs bg-brand-secondary/10 text-brand-secondary px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Lộ Trình AI
            </span>
          </div>
          <div class="flex gap-2">
            <a
              routerLink="/world-map"
              class="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
            >
              🗺️ Bản Đồ
            </a>
            <a
              routerLink="/dashboard"
              class="bg-bg-input hover:bg-bg-card border border-border-main px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer"
            >
              Dashboard
            </a>
          </div>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-24 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-text-muted font-medium">Đang tải lộ trình học cá nhân hóa...</p>
          </div>
        } @else if (errorState()) {
          <div class="text-center py-14 space-y-4">
            <div class="text-4xl">🎒</div>
            <h3 class="text-xl font-bold text-text-main">Chưa có lộ trình học</h3>
            <p class="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
              Bạn chưa làm bài Placement Test đánh giá đầu vào. Hãy làm bài test ngay để AI phân tích trình độ và kiến tạo lộ trình học riêng cho bạn!
            </p>
            <div class="pt-4">
              <a
                routerLink="/placement-test"
                class="bg-brand-primary hover:bg-brand-secondary text-white font-bold px-6 py-3 rounded-xl transition-all inline-block shadow-md cursor-pointer"
              >
                Làm bài Placement Test ngay 🚀
              </a>
            </div>
          </div>
        } @else if (roadmap(); as rm) {
          <div class="space-y-8">
            
            <!-- Level Assessment Card -->
            <div class="p-6 bg-bg-input border border-border-main rounded-2xl relative overflow-hidden transition-colors duration-300">
              <div class="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-secondary/5 to-transparent pointer-events-none"></div>
              
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <span class="text-xxs font-bold text-brand-primary uppercase tracking-widest text-[10px]">
                    Kết quả đánh giá
                  </span>
                  <h3 class="text-2xl font-black text-text-main mt-0.5">
                    Trình độ hiện tại
                  </h3>
                </div>
                
                <div class="flex items-center gap-3">
                  <div class="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-center">
                    <p class="text-xxs text-brand-primary font-bold uppercase tracking-wider text-[9px]">CEFR</p>
                    <p class="text-xl font-black text-brand-primary">{{ rm.cefrLevel }}</p>
                  </div>
                  <div class="px-4 py-2 bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl text-center">
                    <p class="text-xxs text-brand-secondary font-bold uppercase tracking-wider text-[9px]">TOEIC EST.</p>
                    <p class="text-xl font-black text-brand-secondary">{{ rm.toeicEquivalent }}</p>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-border-main/50">
                <h4 class="text-sm font-bold text-text-main mb-1.5">📝 Đánh giá tổng quan từ AI Mentor:</h4>
                <p class="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                  {{ rm.overallEvaluation }}
                </p>
              </div>
            </div>

            <!-- Modules Timeline Title -->
            <div class="pt-4">
              <h3 class="text-lg font-extrabold text-text-main tracking-tight mb-1">
                Lộ Trình Học Chi Tiết
              </h3>
              <p class="text-xs text-text-muted">
                Hoàn thành tuần tự các module bên dưới để tăng cấp nhân vật và cải thiện trình độ.
              </p>
            </div>

            <!-- Vertical Timeline -->
            <div class="relative pl-8 space-y-8 before:absolute before:left-[1.2rem] before:top-4 before:bottom-4 before:w-0.5 before:bg-border-main before:content-['']">
              
              @for (mod of rm.modules; track mod.id) {
                <div class="relative group">
                  
                  <!-- Timeline Node Badge -->
                  <div class="absolute -left-[2.1rem] top-1">
                    @if (mod.status === 'COMPLETED') {
                      <div class="w-6 h-6 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center text-white text-xs shadow-md">
                        ✓
                      </div>
                    } @else if (mod.status === 'IN_PROGRESS') {
                      <div class="w-6 h-6 rounded-full bg-brand-primary border-2 border-brand-primary flex items-center justify-center text-white text-xs animate-pulse shadow-md ring-4 ring-brand-primary/10">
                        ▶
                      </div>
                    } @else {
                      <div class="w-6 h-6 rounded-full bg-bg-input border-2 border-border-main flex items-center justify-center text-text-muted text-[10px] shadow-sm font-bold">
                        🔒
                      </div>
                    }
                  </div>

                  <!-- Module Detail Card -->
                  <div
                    [ngClass]="{
                      'border-brand-primary/30 bg-brand-primary/5': mod.status === 'IN_PROGRESS',
                      'border-border-main/60 bg-bg-card/45': mod.status !== 'IN_PROGRESS'
                    }"
                    class="p-5 border rounded-xl hover:border-brand-primary/20 transition-all duration-300 shadow-sm"
                  >
                    <div class="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <span class="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                          Module {{ mod.orderIndex }}
                        </span>
                        <h4 class="text-base font-bold text-text-main mt-0.5">
                          {{ mod.title }}
                        </h4>
                      </div>

                      <span
                        [ngClass]="{
                          'bg-green-500/10 text-green-500 border border-green-500/20': mod.status === 'COMPLETED',
                          'bg-brand-primary/10 text-brand-primary border border-brand-primary/20': mod.status === 'IN_PROGRESS',
                          'bg-bg-input text-text-muted border border-border-main': mod.status === 'LOCKED'
                        }"
                        class="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
                      >
                        {{ 
                          mod.status === 'COMPLETED' ? 'Đã học xong' : 
                          mod.status === 'IN_PROGRESS' ? 'Đang học' : 'Khóa' 
                        }}
                      </span>
                    </div>

                    <p class="text-sm text-text-muted leading-relaxed">
                      {{ mod.description }}
                    </p>

                    @if (mod.status === 'IN_PROGRESS') {
                      <div class="flex gap-2 mt-4 pt-3 border-t border-border-main/50">
                        <a
                          [routerLink]="['/study', mod.id]"
                          class="bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer flex items-center"
                        >
                          Học Ngay 📚
                        </a>
                        <span class="text-xxs text-text-muted flex items-center italic text-[11px]">
                          *Bạn sẽ bắt đầu lộ trình từ chương này
                        </span>
                      </div>
                    }
                  </div>

                </div>
              }

            </div>

            <!-- Footer Action -->
            <div class="text-center pt-4 border-t border-border-main">
              <a
                routerLink="/dashboard"
                class="bg-brand-primary hover:bg-brand-secondary text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all inline-block cursor-pointer"
              >
                Về Dashboard Chính
              </a>
            </div>

          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class RoadmapComponent implements OnInit {
  private readonly placementService = inject(PlacementTestService);

  roadmap = signal<LearningRoadmap | null>(null);
  isLoading = signal(true);
  errorState = signal(false);

  ngOnInit(): void {
    this.loadRoadmap();
  }

  loadRoadmap(): void {
    this.isLoading.set(true);
    this.errorState.set(false);

    this.placementService.getRoadmap().subscribe({
      next: (rm) => {
        this.isLoading.set(false);
        if (rm) {
          this.roadmap.set(rm);
        } else {
          this.errorState.set(true);
        }
      },
      error: (err) => {
        console.error('Error loading roadmap', err);
        this.isLoading.set(false);
        this.errorState.set(true);
      }
    });
  }
}
