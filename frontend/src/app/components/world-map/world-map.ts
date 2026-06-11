import { Component, inject, OnInit, signal, computed, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacementTestService, LearningRoadmap, LearningModule } from '../../services/placement-test.service';
import { CharacterService, Character } from '../../services/character.service';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar';
import { AuthService } from '../../services/auth.service';
import { StudyService } from '../../services/study.service';

export interface WorldMapItem {
  type: 'HEADER' | 'NODE';
  chapterNum?: number;
  title?: string;
  description?: string;
  module?: any;
  nodeType?: 'THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ';
  nodeIndex?: number;
  top?: number;
  centerX?: number;
  centerY?: number;
}

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule, RouterLink, CharacterAvatarComponent],
  template: `
    <div [class]="embedded ? 'w-full flex flex-col relative py-2' : 'min-h-screen bg-bg-main text-text-main p-4 md:p-6 flex flex-col relative overflow-hidden transition-colors duration-300'">
      <!-- Decorative Glows -->
      @if (!embedded) {
        <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>
      }

      <!-- Player Stats Bar -->
      @if (playerInfo() && !embedded) {
        <div class="max-w-2xl w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-bg-card border border-border-main rounded-xl p-3 text-xs backdrop-blur-md transition-colors duration-300">
          <div class="flex items-center gap-2.5 pl-2">
            <div class="w-8 h-8 rounded-lg border border-border-main bg-bg-input overflow-hidden shrink-0">
              <app-character-avatar [character]="character()"></app-character-avatar>
            </div>
            <div>
              <p class="font-bold text-text-main truncate max-w-[100px]">{{ character()?.name || 'Người Hùng' }}</p>
              <p class="text-[9px] text-brand-accent font-semibold uppercase tracking-wider">{{ character()?.title || 'Novice' }}</p>
            </div>
          </div>
          <div class="flex flex-col justify-center px-2 border-l border-border-main/50">
            <div class="flex justify-between items-center font-semibold mb-1">
              <span>Cấp {{ playerInfo()?.level }}</span>
              <span class="text-text-muted text-[9px]">{{ playerInfo()?.exp }} / {{ playerInfo()?.level! * 100 }} EXP</span>
            </div>
            <div class="w-full h-1 bg-bg-input rounded-full overflow-hidden border border-border-main/30">
              <div
                [style.width.%]="(playerInfo()?.exp! / (playerInfo()?.level! * 100)) * 100"
                class="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
              ></div>
            </div>
          </div>
          <div class="flex items-center gap-2 px-2 border-l border-border-main/50 justify-center md:justify-start">
            <span class="text-base">🪙</span>
            <div>
              <p class="font-bold text-text-main">{{ playerInfo()?.coins }} Xu</p>
              <p class="text-[8px] text-text-muted uppercase tracking-wider font-semibold">Tài sản</p>
            </div>
          </div>
          <div class="flex items-center gap-2 px-2 border-l border-border-main/50 justify-center md:justify-start">
            <span class="text-base">🔥</span>
            <div>
              <p class="font-bold text-text-main">{{ playerInfo()?.streak }} Ngày</p>
              <p class="text-[8px] text-text-muted uppercase tracking-wider font-semibold">Streak</p>
            </div>
          </div>
        </div>
      }

      @if (isLoading()) {
        <div class="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
          <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-sm text-text-muted font-medium">Đang tải bản đồ tiến trình...</p>
        </div>
      } @else if (errorState()) {
        <div class="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 py-10">
          <div class="text-4xl">🎒</div>
          <h3 class="text-lg font-bold text-text-main">Chưa khởi tạo Lộ Trình</h3>
          <p class="text-text-muted text-xs leading-relaxed">
            Bạn chưa làm bài kiểm tra đánh giá trình độ đầu vào. Vui lòng làm Placement Test để AI xây dựng lộ trình học tập và mở khóa bản đồ.
          </p>
          <a
            routerLink="/placement-test"
            class="bg-brand-primary hover:bg-brand-secondary text-white font-bold px-5 py-2 rounded-xl transition-all inline-block shadow-md cursor-pointer text-xs"
          >
            Làm bài Placement Test ngay 🚀
          </a>
        </div>
      } @else {
        <!-- Control Header for Drawer Toggle -->
        <div class="flex justify-between items-center max-w-md w-full mx-auto mb-4 shrink-0 px-2">
          <span class="text-xs text-text-muted font-black tracking-wider uppercase">BẢN ĐỒ TIẾN TRÌNH AI (TOEIC)</span>
          <button
            (click)="isRoadmapDrawerOpen.set(true)"
            class="px-3 py-1.5 bg-brand-primary hover:bg-brand-secondary text-white text-[11px] font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 active:scale-98 border-none"
          >
            📋 Xem Tóm Tắt Lộ Trình
          </button>
        </div>

        <!-- Serpentine Map Container -->
        <div class="mt-4 mb-12">
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
                <!-- Chapter Header Divider -->
                <div class="absolute w-full flex items-center justify-center gap-4 px-2" [style.top.px]="item.top">
                  <div class="flex-1 h-px bg-border-main/50 max-w-[50px]"></div>
                  <div class="text-center bg-bg-main px-2">
                    <span class="text-[9px] font-black text-brand-primary uppercase tracking-widest block">
                      Chặng {{ item.chapterNum }}
                    </span>
                    <span class="text-xs font-black text-text-main mt-0.5 block leading-tight">
                      {{ item.title }}
                    </span>
                    @if (item.description) {
                      <span class="text-[9px] text-text-muted mt-1 block font-medium max-w-[200px] mx-auto leading-normal">
                        {{ item.description }}
                      </span>
                    }
                  </div>
                  <div class="flex-1 h-px bg-border-main/50 max-w-[50px]"></div>
                </div>
              } @else {
                <!-- Character Avatar bouncing above active module's active node -->
                @if (character() && getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS') {
                  <div 
                    class="absolute pointer-events-none w-8 h-8 animate-bounce z-10"
                    [style.top.px]="item.top! - 26"
                    [style.left.px]="164 + getDx(item.nodeIndex!)"
                  >
                    <app-character-avatar [character]="character()"></app-character-avatar>
                  </div>
                }

                <!-- Module Node Pill Card -->
                <div
                  [style.top.px]="item.top"
                  [style.left.px]="60 + getDx(item.nodeIndex!)"
                  class="absolute w-[240px] h-[86px] rounded-2xl flex items-center gap-3 px-3.5 py-2.5 transition-all duration-300 select-none"
                  [class]="getSubNodeStatus(item.module, item.nodeType!) === 'COMPLETED'
                    ? 'bg-bg-card border-2 border-green-500 shadow-[0_4px_0_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(34,197,94,0.25)] cursor-pointer'
                    : getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS'
                    ? 'bg-bg-card border-2 border-brand-accent shadow-[0_4px_12px_rgba(59,130,246,0.18)] active-glow cursor-pointer'
                    : 'bg-bg-card border-2 border-border-main/80 opacity-65 cursor-not-allowed'"
                  (click)="getSubNodeStatus(item.module, item.nodeType!) !== 'LOCKED' && clickNode(item.module, item.nodeType!, item.centerX!, item.top!, $event)"
                >
                  <!-- Node Left Icon in dashed circle -->
                  <div 
                    class="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-xl shrink-0 transition-colors"
                    [class]="getSubNodeStatus(item.module, item.nodeType!) === 'COMPLETED'
                      ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
                      : getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS'
                      ? 'border-brand-accent/50 bg-brand-accent/5 dark:bg-brand-accent/15'
                      : 'border-border-main bg-bg-main'"
                  >
                    {{ getNodeEmoji(item.nodeType!) }}
                  </div>

                  <!-- Node Info -->
                  <div class="flex-1 min-w-0 pr-1">
                    <h3 
                      class="text-[11px] font-black leading-tight truncate"
                      [class]="getSubNodeStatus(item.module, item.nodeType!) === 'LOCKED' ? 'text-text-muted' : 'text-text-main'"
                    >
                      {{ getNodeTitle(item.nodeType!) }}
                    </h3>
                    <p class="text-[9px] text-text-muted leading-normal mt-0.5 line-clamp-2">
                      {{ getNodeDesc(item.nodeType!) }}
                    </p>
                  </div>

                  <!-- Node Status Indicator -->
                  <div class="shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black">
                    @if (getSubNodeStatus(item.module, item.nodeType!) === 'COMPLETED') {
                      <span class="text-green-500 text-xs">✓</span>
                    } @else if (getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS') {
                      <span class="text-brand-accent animate-pulse">🎯</span>
                    } @else {
                      <span class="text-text-muted text-[10px]">🔒</span>
                    }
                  </div>
                </div>

                <!-- Floating Popover bubble inside chapter box (centered relative to the clicked node) -->
                @if (activePopover(); as pop) {
                  @if (pop.moduleId === item.module.id && pop.type === item.nodeType) {
                    <div
                      [style.top.px]="pop.y + 92"
                      class="absolute left-1/2 -translate-x-1/2 z-30 bg-bg-card border border-border-main rounded-2xl p-4 shadow-xl w-60 text-left animate-fade-in flex flex-col space-y-3"
                    >
                      <!-- Title & Description -->
                      <div>
                        <span class="text-[9px] font-black text-brand-primary uppercase tracking-wider">Chi Tiết Bài Học</span>
                        <h4 class="text-xs font-black text-text-main mt-0.5 leading-snug">{{ pop.title }}</h4>
                        <p class="text-[10px] text-text-muted mt-1 leading-normal font-medium">{{ pop.description }}</p>
                      </div>
                      
                      <!-- Estimated TOEIC -->
                      <div class="p-2 bg-bg-input rounded-xl border border-border-main/40 text-[10px] flex items-center justify-between font-bold">
                        <span class="text-text-muted">TOEIC tương đương:</span>
                        <span class="text-brand-secondary font-black">{{ pop.estimatedToeic }}</span>
                      </div>

                      <!-- Status -->
                      <div class="flex items-center justify-between text-[10px] font-bold">
                        <span class="text-text-muted">Trạng thái:</span>
                        @if (pop.status === 'COMPLETED') {
                          <span class="text-green-500 font-extrabold">✓ Đã Hoàn Thành</span>
                        } @else if (pop.status === 'IN_PROGRESS') {
                          <span class="text-brand-primary font-extrabold animate-pulse">⚔️ Đang Học</span>
                        } @else {
                          <span class="text-text-muted font-extrabold">🔒 Đang Khóa</span>
                        }
                      </div>
                      
                      <!-- Actions -->
                      <div class="flex gap-2 pt-1">
                        @if (pop.status !== 'LOCKED') {
                          <a
                            [routerLink]="pop.link"
                            [queryParams]="pop.queryParams"
                            class="flex-1 text-center bg-brand-primary hover:bg-brand-secondary text-white text-[10px] font-black py-2 rounded-xl transition-all cursor-pointer shadow-md decoration-none"
                          >
                            Học Ngay 🚀
                          </a>
                        } @else {
                          <button
                            disabled
                            class="flex-1 bg-bg-input text-text-muted text-[10px] font-bold py-2 rounded-xl cursor-default border border-border-main opacity-50"
                          >
                            Bị Khóa
                          </button>
                        }
                        <button
                          (click)="activePopover.set(null)"
                          class="px-2.5 bg-bg-input border border-border-main hover:bg-bg-card text-text-muted hover:text-text-main rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  }
                }
              }
            }
          </div>
        </div>
      }

      <!-- ========================================== -->
      <!-- SLIDE-OUT PANEL: DETAILED AI ROADMAP LIST  -->
      <!-- ========================================== -->
      @if (isRoadmapDrawerOpen()) {
        <!-- Drawer Backdrop -->
        <div 
          (click)="isRoadmapDrawerOpen.set(false)"
          class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300"
        ></div>

        <!-- Drawer Body -->
        <div class="fixed top-0 right-0 w-full max-w-md h-full bg-bg-card border-l border-border-main shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-slide-in-right transition-colors duration-300">
          <div class="space-y-6">
            
            <!-- Drawer Header -->
            <div class="flex items-center justify-between border-b border-border-main/50 pb-4">
              <div>
                <span class="bg-brand-primary/10 text-brand-primary text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border border-brand-primary/15">
                  Lộ Trình Học AI
                </span>
                <h3 class="text-lg font-black text-text-main mt-1.5">CHI TIẾT LỘ TRÌNH</h3>
              </div>
              <button
                (click)="isRoadmapDrawerOpen.set(false)"
                class="w-8 h-8 rounded-lg border border-border-main/60 flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer"
              >
                ✕
              </button>
            </div>

            <!-- CEFR & TOEIC Summary Badge -->
            <div class="bg-bg-input/60 border border-border-main/50 p-4 rounded-xl space-y-2.5 transition-colors duration-300">
              <div class="flex justify-between items-center font-bold">
                <div>
                  <p class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold">CEFR Level</p>
                  <p class="text-sm font-black text-brand-primary">{{ roadmap()?.cefrLevel || 'N/A' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold">Tương đương TOEIC</p>
                  <p class="text-sm font-black text-brand-secondary">{{ roadmap()?.toeicEquivalent || 'N/A' }}</p>
                </div>
              </div>
              <div class="h-px bg-border-main/50"></div>
              <div>
                <p class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold mb-1">Đánh giá của AI</p>
                <p class="text-[11px] text-text-main leading-relaxed italic font-medium">
                  "{{ roadmap()?.overallEvaluation || 'Đang lập lộ trình...' }}"
                </p>
              </div>
            </div>

            <!-- Module Steps Timeline -->
            <div class="space-y-4">
              <p class="text-[10px] font-black text-text-muted uppercase tracking-wider">Các Chương Học Tập (Modules):</p>
              
              <div class="space-y-3.5 relative pl-4 border-l border-border-main/80 ml-2">
                @for (mod of roadmap()?.modules; track mod.id) {
                  <div class="relative group">
                    <!-- Timeline Dot -->
                    <div 
                      [class.bg-green-500]="mod.status === 'COMPLETED'"
                      [class.bg-brand-primary]="mod.status === 'IN_PROGRESS'"
                      [class.bg-bg-input]="mod.status === 'LOCKED'"
                      [class.border-brand-primary]="mod.status === 'IN_PROGRESS'"
                      class="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-bg-card transition-all"
                    ></div>

                    <!-- Module Info Card -->
                    <div 
                      [class.border-brand-primary/20]="mod.status === 'IN_PROGRESS'"
                      [class.bg-brand-primary/5]="mod.status === 'IN_PROGRESS'"
                      class="bg-bg-input/20 border border-border-main/50 rounded-xl p-3.5 space-y-2 transition-all hover:border-border-main"
                    >
                      <div class="flex justify-between items-start gap-2">
                        <h4 class="font-extrabold text-[11px] text-text-main group-hover:text-brand-primary transition-colors uppercase leading-tight">
                          Bài {{ mod.orderIndex }}: {{ mod.title }}
                        </h4>
                        
                        <!-- Status tag -->
                        @if (mod.status === 'COMPLETED') {
                          <span class="text-[8px] bg-green-500/10 text-green-500 border border-green-500/20 px-1.5 py-0.5 rounded font-black uppercase shrink-0">Đã xong</span>
                        } @else if (mod.status === 'IN_PROGRESS') {
                          <span class="text-[8px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-1.5 py-0.5 rounded font-black uppercase shrink-0 animate-pulse">Học tiếp</span>
                        } @else {
                          <span class="text-[8px] bg-bg-input text-text-muted border border-border-main px-1.5 py-0.5 rounded font-black uppercase shrink-0">Khóa</span>
                        }
                      </div>

                      <p class="text-[10px] text-text-muted leading-relaxed font-normal">
                        {{ mod.description || 'Chương học tập số ' + mod.orderIndex + ' theo tiến trình AI.' }}
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .animate-slide-in-right {
      animation: slideInRight 0.28s ease-out forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95) translateY(4px); left: 50%; }
      to { opacity: 1; transform: scale(1) translateY(0); left: 50%; }
    }
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
export class WorldMapComponent implements OnInit {
  private readonly placementService = inject(PlacementTestService);
  private readonly characterService = inject(CharacterService);
  private readonly authService = inject(AuthService);
  private readonly studyService = inject(StudyService);

  roadmap = signal<LearningRoadmap | null>(null);
  @Input() embedded = false;
  character = signal<Character | null>(null);
  playerInfo = signal<any>(null);

  isLoading = signal(true);
  errorState = signal(false);

  // Roadmap list drawer state toggle
  isRoadmapDrawerOpen = signal<boolean>(false);

  // Active popover details card
  activePopover = signal<any>(null);

  // Flat serpentine list items
  items = signal<WorldMapItem[]>([]);
  totalHeight = signal(400);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorState.set(false);

    // Fetch user details for exp, level, coins dynamically
    this.studyService.getProfile().subscribe({
      next: (profile) => this.playerInfo.set(profile),
      error: () => this.playerInfo.set(this.authService.getUser())
    });

    // Fetch character
    this.characterService.getMyCharacter().subscribe({
      next: (char) => this.character.set(char),
      error: () => this.character.set(null)
    });

    // Fetch roadmap
    this.placementService.getRoadmap().subscribe({
      next: (rm) => {
        this.isLoading.set(false);
        if (rm) {
          this.roadmap.set(rm);
          this.buildMapItems(rm);
        } else {
          this.errorState.set(true);
        }
      },
      error: (err) => {
        console.error('Error loading roadmap in map', err);
        this.isLoading.set(false);
        this.errorState.set(true);
      }
    });
  }

  buildMapItems(roadmap: LearningRoadmap): void {
    if (!roadmap || !roadmap.modules || roadmap.modules.length === 0) {
      this.items.set([]);
      return;
    }

    const mapItems: WorldMapItem[] = [];
    let nodeCount = 0;

    for (let idx = 0; idx < roadmap.modules.length; idx++) {
      const mod = roadmap.modules[idx];

      // Header for this Chapter
      mapItems.push({
        type: 'HEADER',
        chapterNum: idx + 1,
        title: mod.title,
        description: mod.description
      });

      // 6 Node nhỏ cho mỗi Module AI
      const nodeTypes: ('THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ')[] = [
        'THEORY_GRAMMAR',
        'THEORY_VOCABULARY',
        'THEORY_LISTENING',
        'THEORY_PRONUNCIATION',
        'BATTLE',
        'QUIZ'
      ];

      for (let j = 0; j < nodeTypes.length; j++) {
        mapItems.push({
          type: 'NODE',
          module: mod,
          nodeType: nodeTypes[j],
          nodeIndex: nodeCount++
        });
      }
    }

    // Compute Y positions and centers
    let currentY = 15;
    for (const item of mapItems) {
      item.top = currentY;
      if (item.type === 'HEADER') {
        item.top = currentY + 10;
        currentY += item.description ? 95 : 75;
      } else {
        item.centerY = currentY + 43;
        item.centerX = 180 + this.getDx(item.nodeIndex!);
        currentY += 130;
      }
    }

    this.items.set(mapItems);
    this.totalHeight.set(currentY + 20);
  }

  getSubNodeStatus(module: any, nodeType: 'THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ'): 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED' {
    if (module.status === 'COMPLETED') return 'COMPLETED';
    if (module.status === 'LOCKED') return 'LOCKED';
    
    // Nếu module.status === 'IN_PROGRESS'
    const progressKey = `progress_module_${module.id}`;
    let currentProgress = 'THEORY_GRAMMAR';
    if (typeof window !== 'undefined' && window.localStorage) {
      const rawProgress = localStorage.getItem(progressKey) || 'GRAMMAR';
      if (rawProgress === 'GRAMMAR') currentProgress = 'THEORY_GRAMMAR';
      else if (rawProgress === 'VOCABULARY') currentProgress = 'THEORY_VOCABULARY';
      else if (rawProgress === 'LISTENING') currentProgress = 'THEORY_LISTENING';
      else if (rawProgress === 'PRONUNCIATION') currentProgress = 'THEORY_PRONUNCIATION';
      else if (rawProgress === 'BATTLE') currentProgress = 'BATTLE';
      else if (rawProgress === 'TEST') currentProgress = 'QUIZ';
      else currentProgress = rawProgress;
    }
    
    const order = ['THEORY_GRAMMAR', 'THEORY_VOCABULARY', 'THEORY_LISTENING', 'THEORY_PRONUNCIATION', 'BATTLE', 'QUIZ'];
    const currentIdx = order.indexOf(currentProgress);
    const itemIdx = order.indexOf(nodeType);
    
    if (itemIdx < currentIdx) {
      return 'COMPLETED';
    } else if (itemIdx === currentIdx) {
      return 'IN_PROGRESS';
    } else {
      return 'LOCKED';
    }
  }

  // Draw background serpentine path segments
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
      const status = this.getSubNodeStatus(node.module!, node.nodeType!);
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

  getNodeEmoji(type: 'THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ'): string {
    const map = { 
      THEORY_GRAMMAR: '📘', 
      THEORY_VOCABULARY: '📚', 
      THEORY_LISTENING: '🎧', 
      THEORY_PRONUNCIATION: '🗣️', 
      BATTLE: '⚔️', 
      QUIZ: '🏆' 
    };
    return map[type] ?? '📘';
  }

  getNodeTitle(type: 'THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ'): string {
    const map = { 
      THEORY_GRAMMAR: 'Lý thuyết ngữ pháp', 
      THEORY_VOCABULARY: 'Từ vựng flashcard', 
      THEORY_LISTENING: 'Luyện nghe hiểu', 
      THEORY_PRONUNCIATION: 'Luyện phát âm AI', 
      BATTLE: 'Quyết đấu Từ vựng', 
      QUIZ: 'Bài Kiểm Tra Chặng' 
    };
    return map[type] ?? '';
  }

  getNodeDesc(type: 'THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ'): string {
    const map = {
      THEORY_GRAMMAR: 'Học lý thuyết cấu trúc và mẫu câu.',
      THEORY_VOCABULARY: 'Ghi nhớ từ mới qua thẻ thông minh.',
      THEORY_LISTENING: 'Luyện nghe audio hội thoại thực tế.',
      THEORY_PRONUNCIATION: 'Luyện phát âm chuẩn xác với AI.',
      BATTLE: 'Quyết đấu từ vựng phản xạ thời gian thực.',
      QUIZ: 'Bài kiểm tra tổng hợp để qua chặng.'
    };
    return map[type] ?? '';
  }

  clickNode(mod: any, type: 'THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ', x: number, y: number, event: MouseEvent): void {
    event.stopPropagation();
    
    // Extract TOEIC range from module title or default based on orderIndex
    let estimatedToeic = 'Nền tảng';
    if (mod.title.includes('TOEIC')) {
      const match = mod.title.match(/(\d+\+?\s*TOEIC|TOEIC\s*\d+\+?)/i);
      if (match) {
        estimatedToeic = match[0];
      }
    } else {
      const scores = ['100-200', '200-300', '350-400', '400-500', '500-600', '600+'];
      estimatedToeic = 'TOEIC ' + (scores[mod.orderIndex - 1] || '600+');
    }

    let title = this.getNodeTitle(type) + ' ' + this.getNodeEmoji(type);
    let description = this.getNodeDesc(type);
    let link: any[] = [];
    let queryParams: any = null;

    if (type.startsWith('THEORY_')) {
      link = ['/study', mod.id];
      const sub = type.replace('THEORY_', '').toLowerCase();
      queryParams = { mode: 'study', tab: sub };
      if (type === 'THEORY_GRAMMAR') queryParams.next = 'VOCABULARY';
      else if (type === 'THEORY_VOCABULARY') queryParams.next = 'LISTENING';
      else if (type === 'THEORY_LISTENING') queryParams.next = 'PRONUNCIATION';
      else if (type === 'THEORY_PRONUNCIATION') queryParams.next = 'BATTLE';
    } else if (type === 'BATTLE') {
      link = ['/word-battle', mod.id];
    } else {
      link = ['/study', mod.id];
      queryParams = { mode: 'test' };
    }

    const subNodeStatus = this.getSubNodeStatus(mod, type);

    this.activePopover.set({
      moduleId: mod.id,
      type,
      title,
      description,
      estimatedToeic,
      status: subNodeStatus, // LOCKED, IN_PROGRESS, COMPLETED
      link,
      queryParams,
      x,
      y
    });
  }
}
