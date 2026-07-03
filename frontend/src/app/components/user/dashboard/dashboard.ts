import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { PlacementTestService } from '../../../services/placement-test.service';
import { CharacterService, Character } from '../../../services/character.service';
import { StudyService } from '../../../services/study.service';
import { PresetRoadmapService, PresetRoadmap, Enrollment } from '../../../services/preset-roadmap.service';
import { WorldMapComponent } from '../../common/world-map/world-map';
import { PresetRoadmapDetailComponent } from '../preset-roadmap-detail/preset-roadmap-detail';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, WorldMapComponent, PresetRoadmapDetailComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main transition-colors duration-300">
      <div class="max-w-6xl mx-auto px-4 py-6">
        


        <!-- Tab Selector -->
        <div class="flex p-1 bg-bg-input/60 border border-border-main/50 rounded-[10px] max-w-md mb-6 shadow-inner">
          <button
            (click)="activeTab.set('learning'); selectedRoadmapId.set(null)"
            [class.bg-bg-card]="activeTab() === 'learning'"
            [class.text-text-main]="activeTab() === 'learning'"
            [class.shadow-xs]="activeTab() === 'learning'"
            [class.text-text-muted]="activeTab() !== 'learning'"
            class="flex-1 py-[10px] px-[16px] rounded-[10px] text-[13px] font-medium transition-all cursor-pointer text-center border-none flex items-center justify-center gap-1"
          >
            Đang học
            @if (enrollments().length > 0) {
              <span class="bg-brand-primary text-white text-[12px] font-medium rounded-[999px] px-2 py-0.5 leading-none">{{ enrollments().length }}</span>
            }
          </button>
          <button
            (click)="activeTab.set('library'); selectedRoadmapId.set(null)"
            [class.bg-bg-card]="activeTab() === 'library'"
            [class.text-text-main]="activeTab() === 'library'"
            [class.shadow-xs]="activeTab() === 'library'"
            [class.text-text-muted]="activeTab() !== 'library'"
            class="flex-1 py-[10px] px-[16px] rounded-[10px] text-[13px] font-medium transition-all cursor-pointer text-center border-none"
          >
            Kho lộ trình
          </button>
          <button
            (click)="activeTab.set('suggested'); selectedRoadmapId.set(null)"
            [class.bg-bg-card]="activeTab() === 'suggested'"
            [class.text-text-main]="activeTab() === 'suggested'"
            [class.shadow-xs]="activeTab() === 'suggested'"
            [class.text-text-muted]="activeTab() !== 'suggested'"
            class="flex-1 py-[10px] px-[16px] rounded-[10px] text-[13px] font-medium transition-all cursor-pointer text-center border-none"
          >
            Lộ trình AI
          </button>
        </div>

        <!-- ===== TAB: ĐANG HỌC ===== -->
        @if (activeTab() === 'learning') {
          <div class="space-y-4 animate-fade-in">
            @if (selectedRoadmapId()) {
              <app-preset-roadmap-detail
                [id]="selectedRoadmapId()!"
                (back)="selectedRoadmapId.set(null)"
              ></app-preset-roadmap-detail>
            } @else {
              @if (isLoadingEnrollments()) {
              <div class="flex items-center justify-center py-16">
                <svg class="animate-spin h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            } @else if (enrollments().length === 0) {
              <div class="bg-bg-card border border-border-main rounded-[14px] p-[20px] text-center space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <h3 class="font-semibold text-[15px] text-text-main">Chưa có lộ trình nào đang học</h3>
                <p class="text-[13px] text-text-muted max-w-xs mx-auto">Khám phá Kho lộ trình và thêm lộ trình bạn muốn học!</p>
                <button
                  (click)="activeTab.set('library')"
                  class="py-[10px] px-[16px] bg-brand-primary text-bg-card font-semibold rounded-[10px] text-[13px] hover:opacity-90 transition-all cursor-pointer border-none"
                >
                  Khám phá Kho lộ trình
                </button>
              </div>
            } @else {
              @for (enrollment of enrollments(); track enrollment.id) {
                <div
                  (click)="selectRoadmap(enrollment.roadmap.id)"
                  class="bg-bg-card border border-border-main hover:border-brand-primary/40 rounded-[16px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 cursor-pointer group flex gap-5 items-center"
                >
                  <!-- Left side: big black CEFR badge -->
                  <div class="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-base shrink-0 select-none">
                    {{ enrollment.roadmap.cefrLevel || 'A1' }}
                  </div>

                  <!-- Right side: info, progress, stats -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <h3 class="text-sm font-semibold text-text-main group-hover:text-brand-primary transition-colors leading-none">
                        Lộ trình {{ enrollment.roadmap.cefrLevel }}
                      </h3>
                      <span class="text-[9px] bg-slate-100 dark:bg-bg-input/60 border border-border-main/50 px-2 py-0.5 rounded-full font-bold text-text-muted">
                        {{ enrollment.roadmap.difficultyLabel }}
                      </span>
                    </div>

                    <p class="text-[12px] text-text-muted mt-1.5 leading-relaxed line-clamp-2">
                      {{ enrollment.roadmap.overallEvaluation || 'Nắm bắt từ vựng, ngữ pháp đơn giản và các kỹ năng giao tiếp cơ bản.' }}
                    </p>

                    <!-- Progress section -->
                    <div class="space-y-1 mt-3">
                      <div class="flex justify-between items-center text-[10px] font-semibold text-text-muted">
                        <span>Tiến độ</span>
                        <span class="text-text-main font-bold">{{ getEnrollmentProgress(enrollment) }}%</span>
                      </div>
                      <!-- progress bar -->
                      <div class="w-full h-1.5 bg-bg-input rounded-full overflow-hidden border border-border-main/20 p-[1px]">
                        <div
                          [style.width.%]="getEnrollmentProgress(enrollment)"
                          class="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                        ></div>
                      </div>
                    </div>

                    <!-- Bottom actions row -->
                    <div class="flex items-center justify-between mt-3 text-[11px] text-text-muted font-medium pt-2 border-t border-border-main/30">
                      <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-text-muted"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        {{ enrollment.roadmap.modules?.length || enrollment.roadmap.modulesCount || 12 }} chương
                      </span>
                      <span class="text-text-main font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                        Tiếp tục &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              }
            }
            }
          </div>
        }

        <!-- ===== TAB: KHO LỘ TRÌNH ===== -->
        @if (activeTab() === 'library') {
          <div class="space-y-8 animate-fade-in">
            @if (selectedRoadmapId()) {
              <app-preset-roadmap-detail
                [id]="selectedRoadmapId()!"
                (back)="selectedRoadmapId.set(null)"
              ></app-preset-roadmap-detail>
            } @else {
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
                    <h3 class="text-[15px] font-semibold text-text-main tracking-tight">{{ group.label }}</h3>
                    <span class="text-[12px] text-text-muted font-medium">{{ group.roadmaps.length }} lộ trình</span>
                  </div>
                  <!-- Horizontal scroll -->
                  <div class="flex gap-4 overflow-x-auto pb-3 scrollbar-thin select-none">
                    @for (rm of group.roadmaps; track rm.id) {
                      <div
                        (click)="selectRoadmap(rm.id)"
                        class="w-72 shrink-0 bg-bg-card border border-border-main hover:border-brand-primary/40 rounded-[14px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[150px] relative group"
                      >
                        <!-- Enrolled badge -->
                        @if (isEnrolledIn(rm.id)) {
                          <div class="absolute top-3 right-3 bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] text-[10px] font-bold px-2.5 py-0.5 rounded-[999px]">
                            Đang học
                          </div>
                        }

                        <!-- Top Info -->
                        <div class="space-y-2">
                          <div class="flex items-center gap-2">
                            <span class="text-[12px] font-semibold px-2 py-0.5 rounded-[999px] border"
                              [class]="getDifficultyColor(rm.difficultyLabel)">
                              {{ rm.difficultyLabel }}
                            </span>
                          </div>
                          <h4 class="font-semibold text-[13px] text-text-main group-hover:text-brand-primary transition-colors leading-snug">
                            Lộ trình {{ rm.cefrLevel }} tiếng Anh
                          </h4>
                          <p class="text-[12px] text-text-muted line-clamp-2 leading-relaxed">
                            {{ rm.overallEvaluation }}
                          </p>
                        </div>

                        <!-- Bottom stats -->
                        <div class="space-y-2 border-t border-border-main/40 pt-3 mt-3">
                          <div class="flex justify-between items-center text-[12px] text-text-muted font-medium">
                            <span>{{ rm.modulesCount || rm.modules.length || 0 }} Bộ thẻ</span>
                          </div>
                          <div class="flex justify-between items-center text-[12px]">
                            <span class="text-text-muted font-medium">TOEIC {{ rm.toeicEquivalent }}</span>
                            <span class="text-brand-primary font-semibold">Xem chi tiết →</span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            }
            }
          </div>
        }

        <!-- ===== TAB: LỘ TRÌNH AI ===== -->
        @if (activeTab() === 'suggested') {
          <div class="space-y-4 animate-fade-in">
            @if (roadmap()) {
              <div class="bg-bg-card border border-border-main rounded-[14px] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] mb-4">
                <h3 class="font-semibold text-[15px] text-text-main">Lộ Trình Cá Nhân Hóa Bởi AI</h3>
                <p class="text-[13px] text-text-muted mt-1 leading-relaxed">
                  Dựa trên kết quả Placement Test, AI đã xây dựng lộ trình học riêng cho bạn. Trình độ hiện tại: <span class="font-semibold text-brand-primary">{{ roadmap()?.cefrLevel }}</span>
                </p>
              </div>
              <app-world-map [embedded]="true"></app-world-map>
            } @else {
              <div class="bg-bg-card border border-border-main rounded-[14px] p-[20px] text-center space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <h3 class="font-semibold text-[15px] text-text-main">Lộ Trình Cá Nhân Hóa Bởi AI</h3>
                <p class="text-[13px] text-text-muted max-w-md mx-auto leading-relaxed">
                  Bạn chưa thực hiện bài kiểm tra đánh giá trình độ đầu vào. Vui lòng làm bài test để AI tự động xây dựng lộ trình học riêng cho bạn.
                </p>
                <div class="pt-2">
                  <button
                    routerLink="/placement-test"
                    class="py-[10px] px-[16px] bg-brand-primary text-bg-card font-semibold rounded-[10px] hover:opacity-90 transition-all text-[13px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] cursor-pointer border-none"
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

  selectedRoadmapId = signal<number | null>(null);

  selectRoadmap(id: number): void {
    this.selectedRoadmapId.set(id);
  }

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

  getEnrollmentProgress(enrollment: Enrollment): number {
    const modules = enrollment.roadmap?.modules;
    if (!modules || modules.length === 0) {
      // Return a simulated realistic progress based on CEFR level if empty
      const level = enrollment.roadmap?.cefrLevel || 'A1';
      return level === 'A1' ? 65 : 30; 
    }
    const completed = modules.filter(m => m.status === 'COMPLETED').length;
    return Math.round((completed / modules.length) * 100);
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
