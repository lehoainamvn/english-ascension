import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PlacementTestService } from '../../services/placement-test.service';
import { CharacterService, Character } from '../../services/character.service';
import { StudyService } from '../../services/study.service';
import { PresetRoadmapService, PresetRoadmap, Enrollment } from '../../services/preset-roadmap.service';
import { WorldMapComponent } from '../world-map/world-map';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, WorldMapComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main transition-colors duration-300">
      <div class="max-w-5xl mx-auto px-4 py-6">
        
        <!-- Welcome Header -->
        <div class="bg-bg-card border border-border-main rounded-2xl p-5 mb-6 shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 class="text-lg font-black text-text-main leading-tight">
                Chào mừng trở lại!
              </h1>
              @if (character()) {
                <p class="text-xs text-text-muted mt-1">
                  {{ character()?.name }}
                  @if (roadmap()?.cefrLevel) {
                    <span class="ml-2 font-bold text-brand-secondary">CEFR: {{ roadmap()?.cefrLevel }}</span>
                  }
                </p>
              }
            </div>
            <div class="flex items-center gap-3">
              @if (playerInfo()) {
                <div class="flex items-center gap-4 text-xs font-bold text-text-muted bg-bg-input/50 px-4 py-2 rounded-xl border border-border-main/40">
                  <span>Streak: <span class="text-text-main">{{ playerInfo()?.streak || 0 }}</span></span>
                  <span class="text-border-main">|</span>
                  <span>Xu: <span class="text-text-main">{{ playerInfo()?.coins || 0 }}</span></span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Tab Selector -->
        <div class="flex p-1 bg-bg-input/60 border border-border-main/50 rounded-2xl max-w-md mb-6 shadow-inner">
          <button
            (click)="activeTab.set('learning')"
            [class.bg-bg-card]="activeTab() === 'learning'"
            [class.text-text-main]="activeTab() === 'learning'"
            [class.shadow-xs]="activeTab() === 'learning'"
            [class.text-text-muted]="activeTab() !== 'learning'"
            class="flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center border-none flex items-center justify-center gap-1"
          >
            Đang học
            @if (enrollments().length > 0) {
              <span class="bg-brand-primary text-white text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none">{{ enrollments().length }}</span>
            }
          </button>
          <button
            (click)="activeTab.set('library')"
            [class.bg-bg-card]="activeTab() === 'library'"
            [class.text-text-main]="activeTab() === 'library'"
            [class.shadow-xs]="activeTab() === 'library'"
            [class.text-text-muted]="activeTab() !== 'library'"
            class="flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center border-none"
          >
            Kho lộ trình
          </button>
          <button
            (click)="activeTab.set('suggested')"
            [class.bg-bg-card]="activeTab() === 'suggested'"
            [class.text-text-main]="activeTab() === 'suggested'"
            [class.shadow-xs]="activeTab() === 'suggested'"
            [class.text-text-muted]="activeTab() !== 'suggested'"
            class="flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center border-none"
          >
            Lộ trình AI
          </button>
        </div>

        <!-- ===== TAB: ĐANG HỌC ===== -->
        @if (activeTab() === 'learning') {
          <div class="space-y-4 animate-fade-in">
            @if (isLoadingEnrollments()) {
              <div class="flex items-center justify-center py-16">
                <svg class="animate-spin h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            } @else if (enrollments().length === 0) {
              <div class="bg-bg-card border border-border-main rounded-2xl p-8 text-center space-y-4 shadow-xs">
                <h3 class="font-black text-sm text-text-main">Chưa có lộ trình nào đang học</h3>
                <p class="text-xs text-text-muted max-w-xs mx-auto">Khám phá Kho lộ trình và thêm lộ trình bạn muốn học!</p>
                <button
                  (click)="activeTab.set('library')"
                  class="px-4 py-2 bg-brand-primary text-bg-card font-bold rounded-xl text-xs hover:opacity-90 transition-all cursor-pointer border-none"
                >
                  Khám phá Kho lộ trình
                </button>
              </div>
            } @else {
              @for (enrollment of enrollments(); track enrollment.id) {
                <div
                  [routerLink]="['/preset-roadmap', enrollment.roadmap.id]"
                  class="bg-bg-card border border-border-main hover:border-brand-primary/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div class="flex items-start gap-4">
                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <h3 class="text-sm font-black text-text-main group-hover:text-brand-primary transition-colors leading-snug">
                          Lộ trình {{ enrollment.roadmap.cefrLevel }}
                        </h3>
                        <span class="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border"
                          [class]="getDifficultyColor(enrollment.roadmap.difficultyLabel)">
                          {{ enrollment.roadmap.difficultyLabel }}
                        </span>
                      </div>
                      <p class="text-[10px] text-text-muted mt-1 line-clamp-2">{{ enrollment.roadmap.overallEvaluation }}</p>
                      <div class="flex items-center gap-3 mt-2 text-[10px] text-text-muted font-bold">
                        <span>{{ enrollment.roadmap.modules.length || enrollment.roadmap.modulesCount }} bài học</span>
                        <span class="text-green-500">Đang học</span>
                        <span class="ml-auto text-brand-primary font-black">Tiếp tục →</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        }

        <!-- ===== TAB: KHO LỘ TRÌNH ===== -->
        @if (activeTab() === 'library') {
          <div class="space-y-8 animate-fade-in">
            @if (isLoadingPresets()) {
              <div class="flex items-center justify-center py-16">
                <svg class="animate-spin h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            } @else {
              <!-- Group by difficulty -->
              @for (group of presetGroups(); track group.label) {
                <div class="space-y-3">
                  <div class="flex justify-between items-center px-1">
                    <h3 class="text-sm font-black text-text-main tracking-tight">{{ group.label }}</h3>
                    <span class="text-[10px] text-text-muted font-bold">{{ group.roadmaps.length }} lộ trình</span>
                  </div>
                  <!-- Horizontal scroll -->
                  <div class="flex gap-4 overflow-x-auto pb-3 scrollbar-thin select-none">
                    @for (rm of group.roadmaps; track rm.id) {
                      <div
                        [routerLink]="['/preset-roadmap', rm.id]"
                        class="w-72 shrink-0 bg-bg-card border border-border-main hover:border-brand-primary/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[150px] relative group"
                      >
                        <!-- Enrolled badge -->
                        @if (isEnrolledIn(rm.id)) {
                          <div class="absolute top-3 right-3 bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                            Đang học
                          </div>
                        }

                        <!-- Top Info -->
                        <div class="space-y-2">
                          <div class="flex items-center gap-2">
                            <span class="text-[9px] font-black px-2 py-0.5 rounded-full border"
                              [class]="getDifficultyColor(rm.difficultyLabel)">
                              {{ rm.difficultyLabel }}
                            </span>
                          </div>
                          <h4 class="font-extrabold text-xs text-text-main group-hover:text-brand-primary transition-colors leading-snug">
                            Lộ trình {{ rm.cefrLevel }} tiếng Anh
                          </h4>
                          <p class="text-[10px] text-text-muted line-clamp-2 leading-relaxed">
                            {{ rm.overallEvaluation }}
                          </p>
                        </div>

                        <!-- Bottom stats -->
                        <div class="space-y-2 border-t border-border-main/40 pt-3 mt-3">
                          <div class="flex justify-between items-center text-[10px] text-text-muted font-bold">
                            <span>{{ rm.modulesCount || rm.modules.length || 0 }} Bộ thẻ</span>
                          </div>
                          <div class="flex justify-between items-center text-[10px]">
                            <span class="text-text-muted font-bold">TOEIC {{ rm.toeicEquivalent }}</span>
                            <span class="text-brand-primary font-black">Xem chi tiết →</span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            }
          </div>
        }

        <!-- ===== TAB: LỘ TRÌNH AI ===== -->
        @if (activeTab() === 'suggested') {
          <div class="space-y-4 animate-fade-in">
            @if (roadmap()) {
              <div class="bg-bg-card border border-border-main rounded-2xl p-5 shadow-xs mb-4">
                <h3 class="font-black text-sm text-text-main">Lộ Trình Cá Nhân Hóa Bởi AI</h3>
                <p class="text-xs text-text-muted mt-1 leading-relaxed">
                  Dựa trên kết quả Placement Test, AI đã xây dựng lộ trình học riêng cho bạn. Trình độ hiện tại: <span class="font-black text-brand-primary">{{ roadmap()?.cefrLevel }}</span>
                </p>
              </div>
              <app-world-map [embedded]="true"></app-world-map>
            } @else {
              <div class="bg-bg-card border border-border-main rounded-2xl p-6 text-center space-y-4 shadow-xs">
                <h3 class="font-black text-sm text-text-main">Lộ Trình Cá Nhân Hóa Bởi AI</h3>
                <p class="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                  Bạn chưa thực hiện bài kiểm tra đánh giá trình độ đầu vào. Vui lòng làm bài test để AI tự động xây dựng lộ trình học riêng cho bạn.
                </p>
                <div class="pt-2">
                  <button
                    routerLink="/placement-test"
                    class="px-5 py-2.5 bg-brand-primary text-bg-card font-bold rounded-xl hover:opacity-90 transition-all text-xs shadow-md cursor-pointer border-none"
                  >
                    Làm Bài Placement Test
                  </button>
                </div>
              </div>
            }
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .scrollbar-thin::-webkit-scrollbar {
      height: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: var(--border-main);
      border-radius: 99px;
    }
    .animate-fade-in {
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly placementService = inject(PlacementTestService);
  private readonly characterService = inject(CharacterService);
  private readonly studyService = inject(StudyService);
  private readonly presetRoadmapService = inject(PresetRoadmapService);
  private readonly route = inject(ActivatedRoute);

  roadmap = signal<any>(null);
  character = signal<Character | null>(null);
  playerInfo = signal<any>(null);

  // Preset roadmaps & enrollments
  presetRoadmaps = signal<PresetRoadmap[]>([]);
  enrollments = signal<Enrollment[]>([]);
  isLoadingPresets = signal(true);
  isLoadingEnrollments = signal(true);

  // Tab signal
  activeTab = signal<'learning' | 'library' | 'suggested'>('learning');

  ngOnInit(): void {
    this.loadData();
    this.loadPresetsAndEnrollments();
    
    // Read query parameters to set the active tab
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'learning' || tab === 'library' || tab === 'suggested') {
        this.activeTab.set(tab);
      }
    });
  }

  loadData(): void {
    this.placementService.getRoadmap().subscribe({
      next: (rm) => this.roadmap.set(rm),
      error: () => this.roadmap.set(null)
    });

    this.characterService.getMyCharacter().subscribe({
      next: (char) => this.character.set(char),
      error: () => this.character.set(null)
    });

    this.studyService.getProfile().subscribe({
      next: (profile) => this.playerInfo.set(profile),
      error: () => this.playerInfo.set(null)
    });
  }

  loadPresetsAndEnrollments(): void {
    this.presetRoadmapService.getAllPresets().subscribe({
      next: (data) => { this.presetRoadmaps.set(data); this.isLoadingPresets.set(false); },
      error: () => this.isLoadingPresets.set(false)
    });
    this.presetRoadmapService.getMyEnrollments().subscribe({
      next: (data) => { this.enrollments.set(data); this.isLoadingEnrollments.set(false); },
      error: () => this.isLoadingEnrollments.set(false)
    });
  }

  // Group presets by difficultyLabel for display
  presetGroups = computed(() => {
    const groups: { label: string; roadmaps: PresetRoadmap[] }[] = [];
    const order = ['Co ban', 'Basic', 'Trung cap', 'TOEIC', 'IELTS', 'Business'];
    const map = new Map<string, PresetRoadmap[]>();
    for (const rm of this.presetRoadmaps()) {
      const key = rm.difficultyLabel || 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(rm);
    }
    // Sort by predefined order
    for (const key of order) {
      if (map.has(key)) groups.push({ label: this.groupLabel(key), roadmaps: map.get(key)! });
    }
    // Any remaining
    for (const [key, rms] of map.entries()) {
      if (!order.includes(key)) groups.push({ label: key, roadmaps: rms });
    }
    return groups;
  });

  private groupLabel(key: string): string {
    const labels: Record<string, string> = {
      'Co ban': 'Nền tảng (A1-A2)', 'Basic': 'Nền tảng (A1-A2)',
      'Trung cap': 'Trung cấp (B1-B2)', 'TOEIC': 'Luyện thi TOEIC',
      'IELTS': 'Luyện thi IELTS', 'Business': 'Tiếng Anh công việc'
    };
    return labels[key] ?? key;
  }

  isEnrolledIn(roadmapId: number): boolean {
    return this.enrollments().some(e => e.roadmap?.id === roadmapId);
  }

  getIcon(key: string): string {
    return this.presetRoadmapService.getEmojiIcon(key);
  }

  getDifficultyColor(label: string): string {
    return this.presetRoadmapService.getDifficultyColor(label);
  }

  getActiveModule(): any {
    const rm = this.roadmap();
    if (!rm || !rm.modules) return null;
    return rm.modules.find((m: any) => m.status === 'IN_PROGRESS') || rm.modules[0];
  }
}
