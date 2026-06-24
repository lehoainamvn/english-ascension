import { Component, inject, OnInit, signal, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PresetRoadmapService, PresetRoadmap } from '../../../services/preset-roadmap.service';
import { ToastService } from '../../../services/toast.service';
import { WorldMapComponent } from '../../common/world-map/world-map';

@Component({
  selector: 'app-preset-roadmap-detail',
  standalone: true,
  imports: [CommonModule, WorldMapComponent],
  template: `
    <div [class]="id !== undefined ? '' : 'min-h-screen bg-bg-main text-text-main transition-colors duration-300'">
      <div [class]="id !== undefined ? 'w-full py-2' : 'max-w-3xl mx-auto px-4 py-6'">

        <!-- Back Button -->
        <button
          (click)="goBack()"
          class="btn-back mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Quay lại
        </button>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-24 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs text-text-muted font-bold">Đang tải lộ trình...</p>
          </div>
        } @else if (roadmap()) {
          <!-- Header Card -->
          <div class="bg-bg-card border border-border-main rounded-2xl p-6 mb-1 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 space-y-2">
                <h1 class="text-xl font-black text-text-main leading-tight flex items-center gap-2">
                  Lộ trình {{ roadmap()!.cefrLevel }} tiếng Anh
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-bg-input border border-border-main text-text-muted align-middle">
                    @switch (roadmap()?.thumbnailEmoji) {
                      @case ('flag') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
                      }
                      @case ('star') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      }
                      @case ('trophy') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6v3.58a6 6 0 0 1-1.92 4.41L12 20l-4.08-4a6 6 0 0 1-1.92-4.41V8a6 6 0 0 1 6-6z"/></svg>
                      }
                      @case ('diamond') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gem"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>
                      }
                      @case ('briefcase') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                      }
                      @default {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      }
                    }
                  </span>
                </h1>
                <p class="text-xs text-text-muted leading-relaxed max-w-xl">
                  {{ roadmap()!.overallEvaluation }}
                </p>
                <div class="flex flex-wrap items-center gap-3 pt-1">
                  <span class="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="M11 21.88a2 2 0 0 0 2 0l8.3-4.7a2 2 0 0 0 1-1.7V5.5a2 2 0 0 0-1-1.7L13 2.05a2 2 0 0 0-2 0l-8.3 4.7a2 2 0 0 0-1 1.7v9.98a2 2 0 0 0 1 1.7z"/><path d="m22 7.6-10 5.4-10-5.4"/><path d="M12 22.5V13"/></svg>
                    {{ roadmap()!.modules.length }} Bộ thẻ
                  </span>
                  <span class="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    OpenQuiz Team
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black border"
                    [class]="getDifficultyColor(roadmap()!.difficultyLabel)">
                    {{ roadmap()!.difficultyLabel }}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black text-text-main bg-bg-input border border-border-main">
                    TOEIC {{ roadmap()!.toeicEquivalent }}
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 shrink-0">
                <button
                  (click)="toggleEnroll()"
                  [disabled]="isEnrolling()"
                  class="px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border disabled:opacity-50"
                  [class]="enrolled()
                    ? 'bg-bg-input border-border-main text-text-main hover:bg-bg-card hover:border-red-500/30 hover:text-red-500'
                    : 'bg-brand-primary text-white border-transparent hover:opacity-90'"
                >
                  @if (isEnrolling()) {
                    <span class="animate-pulse">...</span>
                  } @else if (enrolled()) {
                    ✓ Đang học
                  } @else {
                    + Thêm vào đang học
                  }
                </button>
              </div>
            </div>
          </div>

          <!-- Progress Summary (nếu đã enroll) -->
          @if (enrolled()) {
            <div class="bg-bg-input/60 border border-border-main rounded-2xl px-5 py-3 mb-1 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles text-text-main"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              <div>
                <p class="text-xs font-black text-text-main">Lộ trình đang học</p>
                <p class="text-[10px] text-text-muted">Tiếp tục từ bài học tiếp theo để duy trì chuỗi streak!</p>
              </div>
              <button
                (click)="startFirstAvailableModule()"
                class="ml-auto px-3 py-1.5 bg-brand-primary text-white rounded-lg text-[10px] font-black hover:opacity-90 transition-colors cursor-pointer border-none"
              >
                Tiếp tục →
              </button>
            </div>
          }


          <!-- Modules Winding Map -->
          <div class="mt-8 mb-16">
            <app-world-map 
              [embedded]="true" 
              [isPreset]="true"
              [presetRoadmap]="roadmap()"
              [enrolled]="enrolled()"
              (enrollToggled)="enrolled.set(true)"
            ></app-world-map>
          </div>

        } @else {
          <!-- Not found -->
          <div class="text-center py-24 space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle mx-auto text-text-muted"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <p class="text-sm font-black text-text-main">Không tìm thấy lộ trình này.</p>
            <button (click)="goBack()" class="btn-back mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Quay lại trang chủ
            </button>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PresetRoadmapDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly presetService = inject(PresetRoadmapService);
  private readonly toastService = inject(ToastService);

  @Input() set id(val: number | undefined) {
    this._id = val;
    if (val !== undefined) {
      this.loadRoadmap(val);
    }
  }
  get id(): number | undefined {
    return this._id;
  }
  private _id?: number;

  @Output() back = new EventEmitter<void>();

  roadmap = signal<PresetRoadmap | null>(null);
  enrolled = signal(false);
  isLoading = signal(true);
  isEnrolling = signal(false);

  ngOnInit(): void {
    if (this._id === undefined) {
      const routeIdStr = this.route.snapshot.paramMap.get('id');
      if (routeIdStr) {
        const id = Number(routeIdStr);
        if (!isNaN(id)) {
          this.loadRoadmap(id);
        }
      }
    }
  }

  loadRoadmap(id: number): void {
    this.isLoading.set(true);
    this.presetService.getPresetById(id).subscribe({
      next: (data) => {
        this.roadmap.set(data.roadmap);
        this.enrolled.set(data.enrolled);
        this.isLoading.set(false);
      },
      error: () => {
        this.roadmap.set(null);
        this.isLoading.set(false);
      }
    });
  }

  toggleEnroll(): void {
    const rm = this.roadmap();
    if (!rm) return;
    this.isEnrolling.set(true);

    if (this.enrolled()) {
      this.presetService.unenroll(rm.id).subscribe({
        next: () => {
          this.enrolled.set(false);
          this.isEnrolling.set(false);
          this.toastService.success('Đã hủy đăng ký lộ trình học.');
        },
        error: () => {
          this.isEnrolling.set(false);
          this.toastService.error('Hủy đăng ký thất bại. Vui lòng thử lại.');
        }
      });
    } else {
      this.presetService.enroll(rm.id).subscribe({
        next: () => {
          this.enrolled.set(true);
          this.isEnrolling.set(false);
          this.toastService.success('Đã thêm lộ trình học thành công!');
        },
        error: () => {
          this.isEnrolling.set(false);
          this.toastService.error('Thêm lộ trình thất bại. Vui lòng thử lại.');
        }
      });
    }
  }

  startFirstAvailableModule(): void {
    const rm = this.roadmap();
    if (!rm) return;
    const next = rm.modules.find(m => m.status === 'IN_PROGRESS') || rm.modules[0];
    if (next) {
      const progressKey = `progress_module_${next.id}`;
      let currentProgress = 'GRAMMAR';
      if (typeof window !== 'undefined' && window.localStorage) {
        currentProgress = localStorage.getItem(progressKey) || 'GRAMMAR';
      }
      
      const queryParams: any = {};
      if (currentProgress === 'TEST') {
        queryParams.mode = 'test';
      } else {
        queryParams.tab = currentProgress.toLowerCase();
        queryParams.mode = 'study';
      }

      const order = ['GRAMMAR', 'VOCABULARY', 'LISTENING', 'PRONUNCIATION', 'TEST'];
      const idx = order.indexOf(currentProgress);
      if (idx !== -1 && idx < order.length - 1) {
        queryParams.next = order[idx + 1];
      }

      this.router.navigate(['/study', next.id], { queryParams });
    }
  }

  goBack(): void {
    if (this._id !== undefined) {
      this.back.emit();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getDifficultyColor(label: string): string {
    return this.presetService.getDifficultyColor(label);
  }
}
