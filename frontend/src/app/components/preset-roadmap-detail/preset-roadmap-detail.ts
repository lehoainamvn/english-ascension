import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PresetRoadmapService, PresetRoadmap, PresetModule } from '../../services/preset-roadmap.service';

export interface MapItem {
  type: 'HEADER' | 'NODE';
  partNum?: number;
  title?: string;
  module?: PresetModule;
  nodeIndex?: number;
  top?: number;
  centerX?: number;
  centerY?: number;
  subType?: 'GRAMMAR' | 'VOCABULARY' | 'LISTENING' | 'PRONUNCIATION' | 'TEST';
}

@Component({
  selector: 'app-preset-roadmap-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main transition-colors duration-300">
      <div class="max-w-3xl mx-auto px-4 py-6">

        <!-- Back Button -->
        <button
          (click)="goBack()"
          class="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text-main mb-6 transition-colors cursor-pointer bg-transparent border-none"
        >
          ← Quay lại
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
            <div class="flex items-center justify-between px-1 pb-4 border-b border-border-main/40 mb-6">
              <h2 class="text-sm font-black text-text-main flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map text-text-main"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                Bản đồ học tập
              </h2>
              <span class="text-[10px] text-text-muted font-bold bg-bg-input px-2.5 py-0.5 rounded-full border border-border-main/50">
                {{ roadmap()!.modules.length }} bài học
              </span>
            </div>

            <!-- Serpentine Map Container -->
            <div 
              class="relative mx-auto w-[360px] overflow-visible" 
              [style.height.px]="totalHeight()"
            >
              <!-- Background Connection Line SVG -->
              <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 0;">
                <path
                  [attr.d]="getPathD()"
                  fill="none"
                  stroke="var(--border-main)"
                  stroke-width="3"
                  stroke-dasharray="6,6"
                  stroke-linecap="round"
                />
                <!-- Active Path Overlay (Highlighted completed and in-progress segments) -->
                <path
                  [attr.d]="getPathDActive()"
                  fill="none"
                  stroke="var(--brand-accent)"
                  stroke-width="3"
                  stroke-dasharray="6,6"
                  stroke-linecap="round"
                  class="opacity-80"
                />
              </svg>

              <!-- Render items (Headers and Nodes) -->
              @for (item of items(); track $index) {
                @if (item.type === 'HEADER') {
                  <!-- Section Part Header Divider -->
                  <div class="absolute w-full flex items-center justify-center gap-4" [style.top.px]="item.top">
                    <div class="flex-1 h-px bg-border-main/50 max-w-[70px]"></div>
                    <div class="text-center bg-bg-main px-2">
                      <span class="text-[9px] font-black text-text-muted uppercase tracking-widest block">
                        PART {{ item.partNum }}
                      </span>
                      <span class="text-xs font-black text-text-main mt-0.5 block leading-tight">
                        {{ item.title }}
                      </span>
                    </div>
                    <div class="flex-1 h-px bg-border-main/50 max-w-[70px]"></div>
                  </div>
                } @else {
                  <!-- Side Vocabulary Button (Optional Decoration matching screenshot) -->
                  @if (shouldShowSideVocab(item.nodeIndex!)) {
                    <div 
                      class="absolute flex flex-col items-center justify-center text-center animate-fade-in group cursor-pointer"
                      [style.top.px]="item.top! + 10"
                      [style.left.px]="getSideVocabLeft(item.nodeIndex!)"
                      (click)="goToVocabulary()"
                    >
                      <div class="w-11 h-11 rounded-full border-2 border-dashed border-text-muted/50 bg-bg-card hover:bg-bg-input flex items-center justify-center shadow-sm group-hover:scale-105 transition-all text-text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      </div>
                      <span class="text-[8px] font-bold text-text-muted mt-1.5 select-none leading-tight group-hover:text-text-main transition-colors">
                        Số từ vựng
                      </span>
                    </div>
                  }

                  <!-- Module Node Pill Card -->
                  <div
                    [style.top.px]="item.top"
                    [style.left.px]="60 + getDx(item.nodeIndex!)"
                    class="absolute w-[240px] h-[86px] rounded-2xl flex items-center gap-3 px-3.5 py-2.5 transition-all duration-300 select-none"
                    [class]="getSubNodeStatus(item.module!, item.subType!) === 'COMPLETED'
                      ? 'bg-bg-card border-2 border-brand-primary shadow-[0_4px_0_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(0,0,0,0.08)] cursor-pointer'
                      : getSubNodeStatus(item.module!, item.subType!) === 'IN_PROGRESS'
                      ? 'bg-bg-card border-2 border-text-main shadow-[0_4px_12px_rgba(0,0,0,0.06)] active-glow cursor-pointer'
                      : 'bg-bg-card border border-border-main opacity-50 cursor-not-allowed'"
                    (click)="getSubNodeStatus(item.module!, item.subType!) !== 'LOCKED' && startModule(item.module!, item.subType!)"
                  >
                    <!-- Node Left Icon in dashed circle -->
                    <div 
                      class="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center shrink-0 transition-colors text-text-main"
                      [class]="getSubNodeStatus(item.module!, item.subType!) === 'COMPLETED'
                        ? 'border-brand-primary bg-bg-input'
                        : getSubNodeStatus(item.module!, item.subType!) === 'IN_PROGRESS'
                        ? 'border-text-main bg-bg-input'
                        : 'border-border-main bg-bg-main'"
                    >
                      @switch (item.subType) {
                        @case ('GRAMMAR') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        }
                        @case ('VOCABULARY') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        }
                        @case ('LISTENING') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                        }
                        @case ('PRONUNCIATION') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                        }
                        @case ('TEST') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6v3.58a6 6 0 0 1-1.92 4.41L12 20l-4.08-4a6 6 0 0 1-1.92-4.41V8a6 6 0 0 1 6-6z"/></svg>
                        }
                      }
                    </div>

                    <!-- Node Info -->
                    <div class="flex-1 min-w-0 pr-1">
                      <h3 
                        class="text-[11px] font-black leading-tight truncate"
                        [class]="getSubNodeStatus(item.module!, item.subType!) === 'LOCKED' ? 'text-text-muted' : 'text-text-main'"
                      >
                        {{ item.title }}
                      </h3>
                      <p class="text-[9px] text-text-muted leading-normal mt-0.5 line-clamp-2">
                        Từ khóa: {{ item.module!.title }}
                      </p>
                    </div>

                    <!-- Node Status Indicator -->
                    <div class="shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-text-main">
                      @if (getSubNodeStatus(item.module!, item.subType!) === 'COMPLETED') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                      } @else if (getSubNodeStatus(item.module!, item.subType!) === 'IN_PROGRESS') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap text-brand-primary animate-pulse"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock text-text-muted opacity-60"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      }
                    </div>
                  </div>
                }
              }
            </div>
          </div>

        } @else {
          <!-- Not found -->
          <div class="text-center py-24 space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle mx-auto text-text-muted"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <p class="text-sm font-black text-text-main">Không tìm thấy lộ trình này.</p>
            <button (click)="goBack()" class="text-xs text-brand-primary hover:underline cursor-pointer bg-transparent border-none">
              ← Quay lại trang chủ
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
    .active-glow {
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.18), 0 0 0 2px var(--brand-accent);
      animation: activePulse 2s infinite ease-in-out;
    }
    @keyframes activePulse {
      0%, 100% {
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.18), 0 0 0 2px var(--brand-accent);
        transform: translateY(0);
      }
      50% {
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35), 0 0 0 4px var(--brand-accent);
        transform: translateY(-2px);
      }
    }
  `]
})
export class PresetRoadmapDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly presetService = inject(PresetRoadmapService);

  roadmap = signal<PresetRoadmap | null>(null);
  enrolled = signal(false);
  isLoading = signal(true);
  isEnrolling = signal(false);

  items = signal<MapItem[]>([]);
  totalHeight = signal(400);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRoadmap(id);
  }

  loadRoadmap(id: number): void {
    this.isLoading.set(true);
    this.presetService.getPresetById(id).subscribe({
      next: (data) => {
        this.roadmap.set(data.roadmap);
        this.enrolled.set(data.enrolled);
        this.buildMapItems(data.roadmap.modules);
        this.isLoading.set(false);
      },
      error: () => {
        this.roadmap.set(null);
        this.items.set([]);
        this.isLoading.set(false);
      }
    });
  }

  buildMapItems(modules: PresetModule[]): void {
    if (!modules || modules.length === 0) {
      this.items.set([]);
      return;
    }

    const mapItems: MapItem[] = [];
    let nodeCount = 0;

    for (let i = 0; i < modules.length; i++) {
      const mod = modules[i];
      const partNum = i + 1;
      
      // Tạo HEADER cho Module/Part này
      mapItems.push({
        type: 'HEADER',
        partNum,
        title: mod.title
      });

      // Sinh ra 5 sub-nodes cho module này
      const subTypes: ('GRAMMAR' | 'VOCABULARY' | 'LISTENING' | 'PRONUNCIATION' | 'TEST')[] = [
        'GRAMMAR',
        'VOCABULARY',
        'LISTENING',
        'PRONUNCIATION',
        'TEST'
      ];
      
      const subLabels = [
        'Lý thuyết ngữ pháp',
        'Học từ vựng flashcard',
        'Luyện nghe hiểu hội thoại',
        'Luyện phát âm AI',
        'Bài test qua màn'
      ];

      for (let j = 0; j < subTypes.length; j++) {
        mapItems.push({
          type: 'NODE',
          module: mod,
          nodeIndex: nodeCount++,
          subType: subTypes[j],
          title: subLabels[j]
        });
      }
    }

    let currentY = 15;
    for (const item of mapItems) {
      item.top = currentY;
      if (item.type === 'HEADER') {
        currentY += 80;
      } else {
        item.centerY = currentY + 43;
        item.centerX = 180 + this.getDx(item.nodeIndex!);
        currentY += 130;
      }
    }

    this.items.set(mapItems);
    this.totalHeight.set(currentY + 20);
  }

  getSubNodeStatus(module: PresetModule, subType: 'GRAMMAR' | 'VOCABULARY' | 'LISTENING' | 'PRONUNCIATION' | 'TEST'): 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED' {
    if (module.status === 'COMPLETED') return 'COMPLETED';
    if (module.status === 'LOCKED') return 'LOCKED';
    
    // Nếu module.status === 'IN_PROGRESS'
    const progressKey = `progress_module_${module.id}`;
    let currentProgress = 'GRAMMAR';
    if (typeof window !== 'undefined' && window.localStorage) {
      currentProgress = localStorage.getItem(progressKey) || 'GRAMMAR';
    }
    
    const order = ['GRAMMAR', 'VOCABULARY', 'LISTENING', 'PRONUNCIATION', 'TEST'];
    const currentIdx = order.indexOf(currentProgress);
    const itemIdx = order.indexOf(subType);
    
    if (itemIdx < currentIdx) {
      return 'COMPLETED';
    } else if (itemIdx === currentIdx) {
      return 'IN_PROGRESS';
    } else {
      return 'LOCKED';
    }
  }

  toggleEnroll(): void {
    const rm = this.roadmap();
    if (!rm) return;
    this.isEnrolling.set(true);

    if (this.enrolled()) {
      this.presetService.unenroll(rm.id).subscribe({
        next: () => { this.enrolled.set(false); this.isEnrolling.set(false); },
        error: () => this.isEnrolling.set(false)
      });
    } else {
      this.presetService.enroll(rm.id).subscribe({
        next: () => { this.enrolled.set(true); this.isEnrolling.set(false); },
        error: () => this.isEnrolling.set(false)
      });
    }
  }

  startModule(module: PresetModule, subType: 'GRAMMAR' | 'VOCABULARY' | 'LISTENING' | 'PRONUNCIATION' | 'TEST'): void {
    const queryParams: any = {};
    if (subType === 'TEST') {
      queryParams.mode = 'test';
    } else {
      queryParams.tab = subType.toLowerCase();
      queryParams.mode = 'study';
    }

    const order: ('GRAMMAR' | 'VOCABULARY' | 'LISTENING' | 'PRONUNCIATION' | 'TEST')[] = [
      'GRAMMAR',
      'VOCABULARY',
      'LISTENING',
      'PRONUNCIATION',
      'TEST'
    ];
    const idx = order.indexOf(subType);
    if (idx !== -1 && idx < order.length - 1) {
      queryParams.next = order[idx + 1];
    }

    const navigateAction = () => {
      this.router.navigate(['/study', module.id], { queryParams });
    };

    if (!this.enrolled() && this.roadmap()) {
      this.presetService.enroll(this.roadmap()!.id).subscribe({
        next: () => {
          this.enrolled.set(true);
          navigateAction();
        },
        error: navigateAction
      });
    } else {
      navigateAction();
    }
  }

  startFirstAvailableModule(): void {
    const rm = this.roadmap();
    if (!rm) return;
    const next = rm.modules.find(m => m.status === 'IN_PROGRESS') || rm.modules[0];
    if (next) {
      // Xác định subnode hiện tại của next module
      const progressKey = `progress_module_${next.id}`;
      let currentProgress = 'GRAMMAR';
      if (typeof window !== 'undefined' && window.localStorage) {
        currentProgress = localStorage.getItem(progressKey) || 'GRAMMAR';
      }
      this.startModule(next, currentProgress as any);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getIcon(): string {
    return this.presetService.getEmojiIcon(this.roadmap()?.thumbnailEmoji ?? 'book');
  }

  getDifficultyColor(label: string): string {
    return this.presetService.getDifficultyColor(label);
  }

  getTotalWords(): number {
    return (this.roadmap()?.modules.length ?? 0) * 30;
  }

  // Serpentine map path calculations
  getDx(i: number): number {
    return Math.sin(i * 1.5) * 50;
  }

  getPathD(): string {
    const nodes = this.items().filter(item => item.type === 'NODE');
    if (nodes.length <= 1) return '';
    let d = '';
    for (let i = 0; i < nodes.length; i++) {
      const pt = nodes[i];
      if (i === 0) {
        d += `M ${pt.centerX} ${pt.centerY}`;
      } else {
        const prev = nodes[i - 1];
        const dy = pt.centerY! - prev.centerY!;
        const controlOffset = dy * 0.45;
        d += ` C ${prev.centerX} ${prev.centerY! + controlOffset}, ${pt.centerX} ${pt.centerY! - controlOffset}, ${pt.centerX} ${pt.centerY}`;
      }
    }
    return d;
  }

  getPathDActive(): string {
    const nodes = this.items().filter(item => item.type === 'NODE');
    let lastActiveIndex = -1;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const status = this.getSubNodeStatus(node.module!, node.subType!);
      if (status !== 'LOCKED') {
        lastActiveIndex = i;
      }
    }
    if (lastActiveIndex <= 0) return '';

    let d = '';
    for (let i = 0; i <= lastActiveIndex; i++) {
      const pt = nodes[i];
      if (i === 0) {
        d += `M ${pt.centerX} ${pt.centerY}`;
      } else {
        const prev = nodes[i - 1];
        const dy = pt.centerY! - prev.centerY!;
        const controlOffset = dy * 0.45;
        d += ` C ${prev.centerX} ${prev.centerY! + controlOffset}, ${pt.centerX} ${pt.centerY! - controlOffset}, ${pt.centerX} ${pt.centerY}`;
      }
    }
    return d;
  }

  shouldShowSideVocab(i: number): boolean {
    return i % 3 === 1;
  }

  getSideVocabLeft(i: number): number {
    return this.getDx(i) >= 0 ? 12 : 304;
  }

  goToVocabulary(): void {
    this.router.navigate(['/vocabulary']);
  }

  getModuleEmoji(subTypeOrTitle: string, index: number): string {
    const s = subTypeOrTitle.toUpperCase();
    if (s === 'GRAMMAR') return '📘';
    if (s === 'VOCABULARY') return '📚';
    if (s === 'LISTENING') return '🎧';
    if (s === 'PRONUNCIATION') return '🗣️';
    if (s === 'TEST') return '🏆';

    const lower = subTypeOrTitle.toLowerCase();
    if (lower.includes('chào') || lower.includes('hello') || lower.includes('goodbye') || lower.includes('tạm biệt')) return '👋';
    if (lower.includes('tên') || lower.includes('name') || lower.includes('bản thân')) return '👤';
    if (lower.includes('đến từ') || lower.includes('from') || lower.includes('quốc gia') || lower.includes('địa lý')) return '🌍';
    if (lower.includes('số') || lower.includes('tuổi') || lower.includes('number') || lower.includes('age')) return '🔢';
    if (lower.includes('khỏe') || lower.includes('how are you')) return '😊';
    if (lower.includes('ngữ pháp') || lower.includes('grammar') || lower.includes('thì') || lower.includes('cấu trúc')) return '📝';
    if (lower.includes('nghe') || lower.includes('listening') || lower.includes('hội thoại')) return '🎧';
    if (lower.includes('đọc') || lower.includes('reading') || lower.includes('bài báo')) return '📖';
    if (lower.includes('từ vựng') || lower.includes('vocabulary') || lower.includes('thẻ')) return '📚';
    if (lower.includes('thi') || lower.includes('test') || lower.includes('exam') || lower.includes('kiểm tra')) return '🏆';
    if (lower.includes('ngày') || lower.includes('thời gian') || lower.includes('time')) return '⏰';
    if (lower.includes('nhà') || lower.includes('phòng') || lower.includes('room')) return '🏠';
    if (lower.includes('màu') || lower.includes('color')) return '🎨';
    if (lower.includes('tiền') || lower.includes('money') || lower.includes('xu')) return '💵';

    const emojis = ['👋', '👤', '🌍', '🔢', '😊', '💬', '📝', '🎧', '📖', '📚', '🏠', '⏰', '🎨', '🏆'];
    return emojis[index % emojis.length];
  }
}
