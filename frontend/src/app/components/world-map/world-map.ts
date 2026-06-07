import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacementTestService, LearningRoadmap, LearningModule } from '../../services/placement-test.service';
import { CharacterService, Character } from '../../services/character.service';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar';
import { AuthService } from '../../services/auth.service';

interface MapWorld {
  num: number;
  name: string;
  label: string;
  desc: string;
  x: number;
  y: number;
  color: string;
  status: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
  moduleId?: number;
  moduleTitle?: string;
  monsterName: string;
  monsterEmoji: string;
}

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule, RouterLink, CharacterAvatarComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-6 flex flex-col relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Navigation Header -->
      <header class="max-w-6xl w-full mx-auto flex justify-between items-center pb-4 border-b border-border-main mb-6">
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
            ENGLISH ASCENSION
          </h1>
          <span class="text-xxs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            Bản Đồ 🗺️
          </span>
        </div>
        <div class="flex items-center gap-3">
          <a
            routerLink="/dashboard"
            class="bg-bg-card border border-border-main hover:bg-bg-input px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Dashboard
          </a>
          <a
            routerLink="/character-customization"
            class="bg-bg-card border border-border-main hover:bg-bg-input px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Nhân Vật
          </a>
        </div>
      </header>

      <!-- Player Stats Bar -->
      @if (playerInfo()) {
        <div class="max-w-6xl w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-bg-card border border-border-main rounded-xl p-3 text-xs backdrop-blur-md">
          <div class="flex items-center gap-2.5 pl-2">
            <div class="w-8 h-8 rounded-lg border border-border-main bg-bg-input overflow-hidden shrink-0">
              <app-character-avatar [character]="character()"></app-character-avatar>
            </div>
            <div>
              <p class="font-bold text-text-main truncate max-w-[120px]">{{ character()?.name || 'Người Hùng' }}</p>
              <p class="text-[10px] text-brand-accent font-semibold uppercase tracking-wider">{{ character()?.title || 'Novice' }}</p>
            </div>
          </div>
          <div class="flex flex-col justify-center px-2 border-l border-border-main/50">
            <div class="flex justify-between items-center font-semibold mb-1">
              <span>Cấp {{ playerInfo()?.level }}</span>
              <span class="text-text-muted text-[10px]">{{ playerInfo()?.exp }} / {{ playerInfo()?.level! * 100 }} EXP</span>
            </div>
            <div class="w-full h-1.5 bg-bg-input rounded-full overflow-hidden border border-border-main/30">
              <div
                [style.width.%]="(playerInfo()?.exp! / (playerInfo()?.level! * 100)) * 100"
                class="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
              ></div>
            </div>
          </div>
          <div class="flex items-center gap-2 px-2 border-l border-border-main/50 justify-center md:justify-start">
            <span class="text-xl">🪙</span>
            <div>
              <p class="font-bold text-text-main">{{ playerInfo()?.coins }} Xu</p>
              <p class="text-[9px] text-text-muted uppercase tracking-wider font-semibold">Tài sản</p>
            </div>
          </div>
          <div class="flex items-center gap-2 px-2 border-l border-border-main/50 justify-center md:justify-start">
            <span class="text-xl">🔥</span>
            <div>
              <p class="font-bold text-text-main">{{ playerInfo()?.streak }} Ngày</p>
              <p class="text-[9px] text-text-muted uppercase tracking-wider font-semibold">Chuỗi Streak</p>
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
          <p class="text-sm text-text-muted font-medium">Đang tải bản đồ thế giới...</p>
        </div>
      } @else if (errorState()) {
        <div class="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
          <div class="text-4xl">🎒</div>
          <h3 class="text-xl font-bold text-text-main">Chưa khởi tạo Lộ Trình</h3>
          <p class="text-text-muted text-sm leading-relaxed">
            Bạn chưa làm bài kiểm tra đánh giá trình độ đầu vào. Vui lòng làm Placement Test để AI xây dựng lộ trình học tập và mở khóa bản đồ.
          </p>
          <a
            routerLink="/placement-test"
            class="bg-brand-primary hover:bg-brand-secondary text-white font-bold px-6 py-2.5 rounded-xl transition-all inline-block shadow-md cursor-pointer"
          >
            Làm bài Placement Test ngay 🚀
          </a>
        </div>
      } @else {
        <!-- Main Map Area -->
        <div class="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          
          <!-- Column 1: SVG Map (7 cols) -->
          <div class="lg:col-span-8 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[30rem] shadow-xl overflow-hidden select-none">
            
            <div class="absolute top-4 left-4 z-10">
              <h3 class="text-sm font-bold text-text-main">BẢN ĐỒ TIẾN TRÌNH</h3>
              <p class="text-[10px] text-text-muted">Nhấp chọn vùng đất đã mở khóa để vào học hoặc chiến đấu</p>
            </div>

            <!-- SVG CANVAS MAP -->
            <svg viewBox="0 0 100 100" class="w-full h-auto max-w-[500px] drop-shadow-2xl">
              <!-- Grid background lines (subtle grid feel) -->
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--border-main)" stroke-width="0.15" opacity="0.3" />
                </pattern>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" rx="6" />

              <!-- Curved Path connecting the worlds -->
              <path
                d="M 15 75 L 35 50 L 25 20 L 55 15 L 75 40 L 85 75"
                fill="none"
                stroke="currentColor"
                stroke-dasharray="2,2"
                stroke-width="0.6"
                class="text-text-muted/40"
              />

              <!-- Highlight active path (conquered/active segments) -->
              <path
                [attr.d]="getActivePathSegment()"
                fill="none"
                stroke="var(--brand-primary)"
                stroke-dasharray="1,1"
                stroke-width="0.8"
                class="opacity-80"
              />

              <!-- Path nodes (Worlds) -->
              @for (w of mappedWorlds(); track w.num) {
                <g class="cursor-pointer group" (click)="selectWorld(w)">
                  <!-- Glow effect on active / hover -->
                  @if (w.status === 'IN_PROGRESS') {
                    <circle
                      [attr.cx]="w.x"
                      [attr.cy]="w.y"
                      r="5"
                      fill="var(--brand-primary)"
                      opacity="0.25"
                      filter="url(#glow)"
                      class="animate-pulse"
                    />
                  }
                  
                  <!-- Main Node Circle -->
                  <circle
                    [attr.cx]="w.x"
                    [attr.cy]="w.y"
                    r="3.5"
                    [attr.fill]="w.status === 'LOCKED' ? 'var(--bg-input)' : w.color"
                    [attr.stroke]="w.status === 'LOCKED' ? 'var(--border-main)' : '#ffffff'"
                    stroke-width="0.6"
                    [class.scale-110]="selectedWorld()?.num === w.num"
                    class="transition-all duration-300 hover:scale-125"
                  />

                  <!-- Node Inner Icon/Text helper -->
                  @if (w.status === 'LOCKED') {
                    <text [attr.x]="w.x" [attr.y]="w.y + 0.8" font-size="2" text-anchor="middle" fill="var(--text-muted)">🔒</text>
                  } @else if (w.status === 'COMPLETED') {
                    <text [attr.x]="w.x" [attr.y]="w.y + 0.8" font-size="2" text-anchor="middle" fill="#ffffff" font-weight="bold">✓</text>
                  } @else {
                    <text [attr.x]="w.x" [attr.y]="w.y + 0.8" font-size="2" text-anchor="middle" fill="#ffffff" font-weight="bold">▶</text>
                  }

                  <!-- Text label below node -->
                  <text
                    [attr.x]="w.x"
                    [attr.y]="w.y + 6"
                    font-size="2.2"
                    text-anchor="middle"
                    [attr.fill]="selectedWorld()?.num === w.num ? 'var(--text-main)' : 'var(--text-muted)'"
                    [attr.font-weight]="selectedWorld()?.num === w.num ? 'bold' : 'normal'"
                    class="font-sans font-semibold"
                  >
                    W{{ w.num }}
                  </text>
                </g>
              }

              <!-- Floating Avatar of character above active world -->
              @for (w of mappedWorlds(); track w.num) {
                @if (w.status === 'IN_PROGRESS' && character()) {
                  <foreignObject [attr.x]="w.x - 5" [attr.y]="w.y - 11" width="10" height="10" class="pointer-events-none">
                    <div class="w-full h-full animate-bounce duration-1000">
                      <app-character-avatar [character]="character()"></app-character-avatar>
                    </div>
                  </foreignObject>
                }
              }
            </svg>
          </div>

          <!-- Column 2: World Details Inspector (4 cols) -->
          <div class="lg:col-span-4 flex flex-col gap-4">
            <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 md:p-6 shadow-xl flex-1 flex flex-col justify-between">
              
              <!-- Top Detail Info -->
              <div class="space-y-4">
                <div class="border-b border-border-main/50 pb-3">
                  <span class="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary">Vùng Đất Chi Tiết</span>
                  <h3 class="text-xl font-black text-text-main mt-0.5">
                    {{ selectedWorld()?.label || 'Chọn một vùng đất' }}
                  </h3>
                  <p class="text-xs text-text-muted mt-1 italic font-medium">
                    {{ selectedWorld()?.name }}
                  </p>
                </div>

                @if (selectedWorld(); as w) {
                  <div class="space-y-4">
                    <div>
                      <p class="text-xxs font-bold text-text-muted uppercase tracking-wider text-[9px]">Mô tả vùng đất</p>
                      <p class="text-xs text-text-main leading-relaxed mt-1">
                        {{ w.desc }}
                      </p>
                    </div>

                    @if (w.moduleId) {
                      <div>
                        <p class="text-xxs font-bold text-text-muted uppercase tracking-wider text-[9px]">Module học tập AI</p>
                        <p class="text-xs text-brand-secondary font-bold mt-1">
                          📚 {{ w.moduleTitle }}
                        </p>
                      </div>
                    }

                    <div class="p-3 rounded-xl border border-border-main bg-bg-input flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2.5">
                        <span class="text-2xl">{{ w.monsterEmoji }}</span>
                        <div>
                          <p class="text-[10px] font-bold text-text-muted uppercase tracking-wider">Quái vật canh giữ</p>
                          <p class="text-xs font-extrabold text-text-main">{{ w.monsterName }}</p>
                        </div>
                      </div>
                      <span class="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-extrabold">HP: 100</span>
                    </div>

                    <div class="pt-2">
                      <p class="text-xxs font-bold text-text-muted uppercase tracking-wider text-[9px]">Trạng thái chinh phục</p>
                      <div class="flex items-center gap-2 mt-1.5">
                        @if (w.status === 'COMPLETED') {
                          <span class="text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                            ✓ Đã Chinh Phục
                          </span>
                        } @else if (w.status === 'IN_PROGRESS') {
                          <span class="text-xs bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            ⚔️ Đang Khám Phá
                          </span>
                        } @else {
                          <span class="text-xs bg-bg-input text-text-muted border border-border-main px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                            🔒 Đang Khóa
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="py-12 text-center text-text-muted space-y-2">
                    <span class="text-4xl">🗺️</span>
                    <p class="text-xs">Nhấp chọn các vùng đất trên bản đồ bên trái để xem nội dung.</p>
                  </div>
                }
              </div>

              <!-- Action Buttons -->
              <div class="pt-6 border-t border-border-main/50 space-y-2.5">
                @if (selectedWorld(); as w) {
                  @if (w.status !== 'LOCKED' && w.moduleId) {
                    <a
                      [routerLink]="['/study', w.moduleId]"
                      class="w-full bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      📚 Vào Học Bài (Flashcard & Quiz)
                    </a>
                    <a
                      [routerLink]="['/word-battle', w.moduleId]"
                      class="w-full bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-600 hover:to-amber-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      ⚔️ Đấu Trận Từ Vựng (Word Battle)
                    </a>
                  } @else if (w.status === 'LOCKED') {
                    <button
                      disabled
                      class="w-full bg-bg-input border border-border-main text-text-muted text-xs font-bold py-3 rounded-xl cursor-default opacity-50 flex items-center justify-center gap-1.5"
                    >
                      🔒 Vùng Đất Đang Bị Khóa
                    </button>
                  }
                }
              </div>

            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    foreignObject {
      overflow: visible;
    }
  `]
})
export class WorldMapComponent implements OnInit {
  private readonly placementService = inject(PlacementTestService);
  private readonly characterService = inject(CharacterService);
  private readonly authService = inject(AuthService);

  roadmap = signal<LearningRoadmap | null>(null);
  character = signal<Character | null>(null);
  playerInfo = signal<any>(null);

  isLoading = signal(true);
  errorState = signal(false);

  // Hardcoded world configuration
  worlds: Omit<MapWorld, 'status'>[] = [
    { num: 1, name: 'Beginner Village', label: 'Làng Tân Thủ 🏡', desc: 'Nơi bắt đầu hành trình với những từ vựng và câu hỏi căn bản nhất.', x: 15, y: 75, color: '#10b981', monsterName: 'Glitch Slime', monsterEmoji: '💧' },
    { num: 2, name: 'Vocabulary Forest', label: 'Khu Rừng Từ Vựng 🌳', desc: 'Rèn luyện và củng cố vốn từ vựng tiếng Anh công sở công việc hàng ngày.', x: 35, y: 50, color: '#3b82f6', monsterName: 'Tree Sprout', monsterEmoji: '🌱' },
    { num: 3, name: 'Grammar Castle', label: 'Lâu Đài Ngữ Pháp 🏰', desc: 'Học tập các cấu trúc ngữ pháp học thuật nâng cao, chuyên sâu.', x: 25, y: 20, color: '#8b5cf6', monsterName: 'Stone Gargoyle', monsterEmoji: '🦇' },
    { num: 4, name: 'Listening Mountain', label: 'Đỉnh Núi Nghe Hiểu 🏔️', desc: 'Chinh phục các thử thách phát âm và phản xạ nghe tiếng Anh.', x: 55, y: 15, color: '#f59e0b', monsterName: 'Ice Golem', monsterEmoji: '❄️' },
    { num: 5, name: 'Business City', label: 'Thành Phố Công Sở 🏙️', desc: 'Luyện tập tiếng Anh giao tiếp trong công việc, đàm phán thương mại.', x: 75, y: 40, color: '#ec4899', monsterName: 'Shadow Butler', monsterEmoji: '🕴️' },
    { num: 6, name: 'TOEIC Kingdom', label: 'Vương Quốc TOEIC 👑', desc: 'Vùng đất thử thách cuối cùng để kiểm tra trình độ tổng hợp đạt chuẩn.', x: 85, y: 75, color: '#ef4444', monsterName: 'Grammar Dragon', monsterEmoji: '🐉' }
  ];

  selectedWorld = signal<MapWorld | null>(null);

  // Computes the worlds mapped with user module status
  mappedWorlds = computed<MapWorld[]>(() => {
    const rm = this.roadmap();
    if (!rm || !rm.modules) return [];

    return this.worlds.map(w => {
      const mod = rm.modules[w.num - 1]; // sequentially map
      let status: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED' = 'LOCKED';
      let moduleId: number | undefined = undefined;
      let moduleTitle: string | undefined = undefined;

      if (mod) {
        status = mod.status;
        moduleId = mod.id;
        moduleTitle = mod.title;
      }

      return {
        ...w,
        status,
        moduleId,
        moduleTitle
      };
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorState.set(false);

    // Fetch user details for exp, level, coins
    this.playerInfo.set(this.authService.getUser());

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
          // Set default selected world to the active (IN_PROGRESS) world
          const activeWorld = this.mappedWorlds().find(w => w.status === 'IN_PROGRESS');
          if (activeWorld) {
            this.selectedWorld.set(activeWorld);
          } else {
            this.selectedWorld.set(this.mappedWorlds()[0]);
          }
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

  selectWorld(world: MapWorld): void {
    this.selectedWorld.set(world);
  }

  // Draw active roadmap segments
  getActivePathSegment(): string {
    const list = this.mappedWorlds();
    if (list.length === 0) return '';

    // Trace path coordinates for completed/active worlds
    const points: string[] = [];
    for (let w of list) {
      if (w.status !== 'LOCKED') {
        points.push(`${w.x} ${w.y}`);
      } else {
        // Also draw line to the first locked node if we transitioned to it
        points.push(`${w.x} ${w.y}`);
        break;
      }
    }

    if (points.length === 0) return '';
    return `M ${points.join(' L ')}`;
  }
}
