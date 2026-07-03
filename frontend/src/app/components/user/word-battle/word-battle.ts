import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudyService, BattleWord, CompletionResult } from '../../../services/study.service';
import { CharacterService, Character } from '../../../services/character.service';
import { CharacterAvatarComponent } from '../../common/character-avatar/character-avatar';

interface BattleQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctLetter: 'A' | 'B' | 'C' | 'D';
  correctWord: string;
  definition: string;
}

@Component({
  selector: 'app-word-battle',
  standalone: true,
  imports: [CommonModule, RouterLink, CharacterAvatarComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-6 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main card container -->
      <div class="relative w-full max-w-4xl backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-2xl p-5 md:p-6 transition-colors duration-300 flex flex-col">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 pb-3 border-b border-border-main">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-extrabold tracking-tight text-red-500">
              WORD BATTLE
            </h2>
            <span class="text-xxs bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              Minigame ⚔️
            </span>
          </div>
          <a
            [routerLink]="['/dashboard']"
            [queryParams]="{tab: 'suggested'}"
            class="btn-back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Bản Đồ
          </a>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-24 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-text-muted font-medium">Đang hiệu triệu quái vật...</p>
          </div>
        } @else if (errorState()) {
          <div class="text-center py-12 space-y-4">
            <div class="text-4xl">⚠️</div>
            <h3 class="text-lg font-bold text-text-main">Không có học liệu từ vựng</h3>
            <p class="text-text-muted text-sm max-w-sm mx-auto">
              Không thể tải học liệu từ vựng của chương học này. Hãy thử quay lại bản đồ học tập.
            </p>
            <a
              [routerLink]="['/dashboard']"
              [queryParams]="{tab: 'suggested'}"
              class="btn-back mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Về Bản Đồ
            </a>
          </div>
        } @else {
          
          <!-- BATTLE Arena -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            <!-- Combat Field (8 cols) -->
            <div class="md:col-span-8 flex flex-col gap-4">
              <!-- Battlefield Visual Panel -->
              <div class="relative h-64 md:h-72 rounded-2xl border border-border-main bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 overflow-hidden flex items-center justify-between p-6 shadow-inner select-none">
                
                <!-- Floating Damage Numbers -->
                @if (floatingText()) {
                  <div
                    [ngClass]="{
                      'left-1/4': floatingTarget() === 'player',
                      'right-1/4': floatingTarget() === 'monster'
                    }"
                    class="absolute bottom-1/2 -translate-y-1/2 text-2xl font-black text-red-500 animate-float-damage z-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    {{ floatingText() }}
                  </div>
                }

                <!-- Character Unit (Left) -->
                <div
                  [class.animate-player-attack]="playerAttacking()"
                  [class.animate-hurt]="playerHurt()"
                  class="flex flex-col items-center w-28 md:w-32 transition-transform duration-300 relative"
                >
                  <!-- HP Bar -->
                  <div class="w-full space-y-1 mb-2">
                    <div class="flex justify-between items-center text-[10px] font-bold">
                      <span class="text-text-main">{{ character()?.name || 'Người Hùng' }}</span>
                      <span class="text-red-400">{{ playerHp() }} / 100 HP</span>
                    </div>
                    <div class="w-full h-2 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                      <div
                        [style.width.%]="playerHp()"
                        class="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                  <!-- Avatar Container -->
                  <div class="w-20 h-20 md:w-24 md:h-24 bg-slate-900/50 rounded-2xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center shadow-lg relative">
                    @if (playerHurt()) {
                      <div class="absolute inset-0 bg-red-600/40 z-10 rounded-2xl"></div>
                    }
                    <app-character-avatar [character]="character()"></app-character-avatar>
                  </div>
                  <span class="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-2">
                    ⚔️ {{ character()?.title || 'Novice' }} ⚔️
                  </span>
                </div>

                <!-- VS text separator -->
                <div class="text-slate-700 font-black tracking-widest text-2xl animate-pulse">
                  VS
                </div>

                <!-- Monster Unit (Right) -->
                <div
                  [class.animate-monster-attack]="monsterAttacking()"
                  [class.animate-hurt]="monsterHurt()"
                  class="flex flex-col items-center w-28 md:w-32 transition-transform duration-300 relative"
                >
                  <!-- HP Bar -->
                  <div class="w-full space-y-1 mb-2">
                    <div class="flex justify-between items-center text-[10px] font-bold">
                      <span class="text-text-main">{{ monsterName }}</span>
                      <span class="text-red-400">{{ monsterHp() }} / 100 HP</span>
                    </div>
                    <div class="w-full h-2 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                      <div
                        [style.width.%]="monsterHp()"
                        class="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                  <!-- Avatar Container -->
                  <div class="w-20 h-20 md:w-24 md:h-24 bg-slate-900/50 rounded-2xl border border-slate-800 p-1.5 overflow-hidden flex items-center justify-center shadow-lg relative">
                    @if (monsterHurt()) {
                      <div class="absolute inset-0 bg-red-600/40 z-10 rounded-2xl"></div>
                    }
                    <!-- Inline Animated Monster SVG -->
                    <svg viewBox="0 0 100 100" class="w-full h-full">
                      <!-- Slime shadow -->
                      <ellipse cx="50" cy="80" rx="35" ry="8" fill="rgba(0,0,0,0.3)" />
                      
                      <!-- Monster Core Body -->
                      <path
                        d="M 15 70 Q 15 35 50 35 Q 85 35 85 70 Q 85 85 50 85 Q 15 85 15 70 Z"
                        [attr.fill]="monsterColor"
                        [attr.stroke]="monsterStroke"
                        stroke-width="2"
                      />

                      <!-- World-specific customizations -->
                      @if (worldNum === 2) {
                        <!-- Sprout top leaf -->
                        <path d="M 50 35 Q 40 20 50 15 Q 60 20 50 35" fill="#22c55e" stroke="#16a34a" stroke-width="1" />
                      } @else if (worldNum === 3) {
                        <!-- Gargoyle demon wings -->
                        <path d="M 15 50 Q -5 30 10 30 Z" fill="#4b5563" />
                        <path d="M 85 50 Q 105 30 90 30 Z" fill="#4b5563" />
                      } @else if (worldNum === 4) {
                        <!-- Crystal ice spikes -->
                        <polygon points="50,18 45,30 55,30" fill="#38bdf8" />
                        <polygon points="40,24 38,34 46,34" fill="#38bdf8" />
                        <polygon points="60,24 54,34 62,34" fill="#38bdf8" />
                      } @else if (worldNum === 6) {
                        <!-- Dragon horns -->
                        <polygon points="25,32 18,20 30,28" fill="#ef4444" />
                        <polygon points="75,32 82,20 70,28" fill="#ef4444" />
                      }

                      <!-- Eyes depending on expression -->
                      @if (monsterHp() > 50) {
                        <circle cx="38" cy="58" r="3.5" fill="#1e1b4b" />
                        <circle cx="38" cy="57" r="1.2" fill="#ffffff" />
                        <circle cx="62" cy="58" r="3.5" fill="#1e1b4b" />
                        <circle cx="62" cy="57" r="1.2" fill="#ffffff" />
                        <path d="M 45 68 Q 50 72 55 68" stroke="#1e1b4b" stroke-width="1.5" fill="none" stroke-linecap="round" />
                      } @else if (monsterHp() > 0) {
                        <!-- Angry/Dizzy eyes -->
                        <line x1="33" y1="54" x2="43" y2="60" stroke="#1e1b4b" stroke-width="2.5" stroke-linecap="round" />
                        <line x1="43" y1="54" x2="33" y2="60" stroke="#1e1b4b" stroke-width="2.5" stroke-linecap="round" />
                        <line x1="57" y1="54" x2="67" y2="60" stroke="#1e1b4b" stroke-width="2.5" stroke-linecap="round" />
                        <line x1="67" y1="54" x2="57" y2="60" stroke="#1e1b4b" stroke-width="2.5" stroke-linecap="round" />
                        <path d="M 46 72 Q 50 67 54 72" stroke="#1e1b4b" stroke-width="1.5" fill="none" stroke-linecap="round" />
                      } @else {
                        <!-- Dead eyes -->
                        <text x="38" y="62" font-size="8" text-anchor="middle" fill="#1e1b4b">×</text>
                        <text x="62" y="62" font-size="8" text-anchor="middle" fill="#1e1b4b">×</text>
                        <line x1="45" y1="71" x2="55" y2="71" stroke="#1e1b4b" stroke-width="2" />
                      }
                    </svg>
                  </div>
                  <span class="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2">
                    👹 {{ monsterName }} 👹
                  </span>
                </div>

              </div>

              <!-- Question Panel -->
              @if (battleState() === 'playing' && currentQuestion()) {
                <div class="p-5 bg-bg-input/60 border border-border-main rounded-2xl space-y-4">
                  <div class="text-center pb-2 border-b border-border-main/50">
                    <span class="text-xxs font-extrabold uppercase tracking-widest text-brand-secondary">Thử Thách Từ Vựng</span>
                    <h3 class="text-sm font-extrabold text-text-main mt-1">
                      {{ currentQuestion()?.questionText }}
                    </h3>
                  </div>

                  <!-- A, B, C, D Options -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      (click)="answerQuestion('A')"
                      [disabled]="isAnimating()"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/40 rounded-xl p-3 text-left text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                    >
                      <strong>A.</strong> {{ currentQuestion()?.optionA }}
                    </button>
                    <button
                      (click)="answerQuestion('B')"
                      [disabled]="isAnimating()"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/40 rounded-xl p-3 text-left text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                    >
                      <strong>B.</strong> {{ currentQuestion()?.optionB }}
                    </button>
                    <button
                      (click)="answerQuestion('C')"
                      [disabled]="isAnimating()"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/40 rounded-xl p-3 text-left text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                    >
                      <strong>C.</strong> {{ currentQuestion()?.optionC }}
                    </button>
                    <button
                      (click)="answerQuestion('D')"
                      [disabled]="isAnimating()"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/40 rounded-xl p-3 text-left text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                    >
                      <strong>D.</strong> {{ currentQuestion()?.optionD }}
                    </button>
                  </div>

                  <!-- Feedback Notification -->
                  @if (feedback()) {
                    <div
                      [ngClass]="{
                        'bg-green-500/10 border-green-500/20 text-green-400': feedbackType() === 'correct',
                        'bg-red-500/10 border-red-500/20 text-red-400': feedbackType() === 'incorrect'
                      }"
                      class="p-3 border rounded-xl text-center text-xs font-semibold"
                    >
                      {{ feedback() }}
                    </div>
                  }
                </div>
              }

              <!-- VICTORY / DEFEAT SCREENS -->
              @if (battleState() === 'victory') {
                <div class="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl text-center space-y-5 animate-bounce-short">
                  <div class="space-y-1">
                    <span class="text-5xl">🏆</span>
                    <h3 class="text-2xl font-black text-green-500">CHIẾN THẮNG!</h3>
                    <p class="text-xs text-text-muted">Quái vật đã bị tiêu diệt hoàn toàn</p>
                  </div>

                  <!-- Rewards display -->
                  <div class="flex justify-center gap-4 max-w-xs mx-auto">
                    <div class="flex-1 p-3 bg-yellow-500/10 border border-yellow-500/25 rounded-xl">
                      <p class="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Nhận được</p>
                      <p class="text-base font-black text-yellow-500 mt-0.5">+50 EXP</p>
                    </div>
                    <div class="flex-1 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                      <p class="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Nhận được</p>
                      <p class="text-base font-black text-amber-600 mt-0.5">+15 XU</p>
                    </div>
                  </div>

                  <!-- Level promotion popup trigger -->
                  @if (rewards()?.leveledUp) {
                    <div class="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl max-w-sm mx-auto text-xs space-y-1">
                      <p class="font-extrabold text-yellow-500">👑 THĂNG CẤP LÊN CẤP {{ rewards()?.newLevel }}! 👑</p>
                      <p class="text-xxs text-[10px] text-text-muted">Danh hiệu mới: ⚔️ {{ rewards()?.newTitle }} ⚔️</p>
                    </div>
                  }

                  <div class="pt-2">
                    <button
                      (click)="saveBattleResult()"
                      [disabled]="isSubmittingRewards()"
                      class="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      Nhận Thưởng & Quay Lại Bản Đồ 🗺️
                    </button>
                  </div>
                </div>
              }

              @if (battleState() === 'defeat') {
                <div class="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-center space-y-5">
                  <div class="space-y-1">
                    <span class="text-5xl">💀</span>
                    <h3 class="text-2xl font-black text-red-500">BẠI TRẬN!</h3>
                    <p class="text-xs text-text-muted">Bạn đã cạn kiệt sinh lực HP</p>
                  </div>

                  <p class="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                    Đừng nản lòng! Ôn tập lại Flashcard từ vựng của vùng đất để ghi nhớ sâu hơn, sau đó thử thách lại quái vật.
                  </p>

                  <div class="flex gap-3 justify-center pt-2">
                    <button
                      (click)="restartBattle()"
                      class="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Thách Đấu Lại ↺
                    </button>
                    <a
                      [routerLink]="['/dashboard']"
                      [queryParams]="{tab: 'suggested'}"
                      class="bg-bg-input border border-border-main text-text-muted hover:text-text-main font-bold px-6 py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                    >
                      Rút Lui Về Bản Đồ
                    </a>
                  </div>
                </div>
              }

            </div>

            <!-- Combat Logs Panel (4 cols in layout, 12 cols in responsive mobile) -->
            <div class="md:col-span-4 flex flex-col gap-4">
              <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-4 flex flex-col h-full shadow-xl">
                <div class="border-b border-border-main/50 pb-2 mb-3">
                  <h4 class="text-xs font-bold text-text-muted uppercase tracking-widest">Nhật Ký Trận Đấu 📜</h4>
                </div>
                
                <!-- Logs list -->
                <div class="flex-1 overflow-y-auto space-y-2 text-[11px] leading-relaxed max-h-56 md:max-h-none pr-1">
                  @for (log of combatLogs; track log) {
                    <div
                      [ngClass]="{
                        'text-green-500 font-medium': log.includes('ĐÚNG') || log.includes('thắng'),
                        'text-red-500 font-medium': log.includes('Sai') || log.includes('bại'),
                        'text-yellow-500 font-semibold': log.includes('bắt đầu') || log.includes('thưởng')
                      }"
                      class="border-b border-border-main/30 pb-1.5"
                    >
                      {{ log }}
                    </div>
                  }
                </div>
              </div>
            </div>

          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    @keyframes floatDamage {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-20px); opacity: 0; }
    }
    .animate-float-damage {
      animation: floatDamage 1.2s forwards ease-out;
    }

    @keyframes playerAttack {
      0%, 100% { transform: translateX(0); }
      30% { transform: translateX(-8px); }
      50% { transform: translateX(25px) scale(1.05); }
    }
    .animate-player-attack {
      animation: playerAttack 0.5s ease-in-out;
    }

    @keyframes monsterAttack {
      0%, 100% { transform: translateX(0); }
      30% { transform: translateX(8px); }
      50% { transform: translateX(-25px) scale(1.05); }
    }
    .animate-monster-attack {
      animation: monsterAttack 0.5s ease-in-out;
    }

    @keyframes hurtEffect {
      0%, 100% { transform: scale(1); }
      20%, 60% { transform: translateX(-4px) rotate(-2deg); }
      40%, 80% { transform: translateX(4px) rotate(2deg); }
    }
    .animate-hurt {
      animation: hurtEffect 0.4s ease-in-out;
    }

    @keyframes bounceShort {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .animate-bounce-short {
      animation: bounceShort 2s infinite ease-in-out;
    }
  `]
})
export class WordBattleComponent implements OnInit, OnDestroy {
  private readonly studyService = inject(StudyService);
  private readonly characterService = inject(CharacterService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  moduleId = 0;
  worldNum = 1;

  flashcards: BattleWord[] = [];
  character = signal<Character | null>(null);

  isLoading = signal(true);
  errorState = signal(false);

  // Battle HP State
  playerHp = signal(100);
  monsterHp = signal(100);

  // states: 'playing' | 'victory' | 'defeat'
  battleState = signal<'playing' | 'victory' | 'defeat'>('playing');
  combatLogs: string[] = [];

  // Question State
  questionsList: BattleQuestion[] = [];
  currentQuestionIndex = 0;
  currentQuestion = signal<BattleQuestion | null>(null);

  feedback = signal<string>('');
  feedbackType = signal<'correct' | 'incorrect' | null>(null);

  // Animation Triggers
  playerAttacking = signal(false);
  monsterAttacking = signal(false);
  playerHurt = signal(false);
  monsterHurt = signal(false);
  isAnimating = signal(false);

  floatingText = signal<string>('');
  floatingTarget = signal<'player' | 'monster' | null>(null);

  // Rewards Complete
  rewards = signal<CompletionResult | null>(null);
  isSubmittingRewards = signal(false);

  // Monster Profile Settings
  monsterName = 'Glitch Slime';
  monsterEmoji = '💧';
  monsterColor = '#a78bfa';
  monsterStroke = '#8b5cf6';

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('moduleId'));
    if (!this.moduleId) {
      this.errorState.set(true);
      this.isLoading.set(false);
    } else {
      this.loadCombatants();
    }
  }

  ngOnDestroy(): void {
    // Clean up
  }

  loadCombatants(): void {
    this.isLoading.set(true);
    this.errorState.set(false);

    // Fetch character
    this.characterService.getMyCharacter().subscribe({
      next: (char) => this.character.set(char),
      error: () => this.character.set(null)
    });

    // Fetch vocabulary words specific to this module's CEFR level
    // This ensures Word Battle always uses real vocab, not grammar/reading content
    this.studyService.getBattleWords(this.moduleId).subscribe({
      next: (words) => {
        this.isLoading.set(false);
        if (words && words.length > 0) {
          this.flashcards = words;
          this.determineMonsterSettings();
          this.initializeBattle();
        } else {
          this.errorState.set(true);
        }
      },
      error: (err) => {
        console.error('Error loading battle vocabulary', err);
        this.isLoading.set(false);
        this.errorState.set(true);
      }
    });
  }

  determineMonsterSettings(): void {
    // Map order index using simple ID patterns or defaults
    // Since we don't have orderIndex explicitly here, we can infer it
    // Module ID 1 maps to W1, 2 maps to W2, etc.
    this.worldNum = this.moduleId;
    if (this.worldNum > 6) this.worldNum = 6;

    const monsters = [
      { name: 'Glitch Slime', emoji: '💧', color: '#60a5fa', stroke: '#2563eb' }, // W1
      { name: 'Tree Sprout', emoji: '🌱', color: '#4ade80', stroke: '#16a34a' },  // W2
      { name: 'Stone Gargoyle', emoji: '🦇', color: '#9ca3af', stroke: '#4b5563' }, // W3
      { name: 'Ice Golem', emoji: '❄️', color: '#a5f3fc', stroke: '#0891b2' },  // W4
      { name: 'Shadow Butler', emoji: '🕴️', color: '#4b5563', stroke: '#1f2937' }, // W5
      { name: 'Grammar Dragon', emoji: '🐉', color: '#f87171', stroke: '#dc2626' } // W6
    ];

    const idx = (this.worldNum - 1) % monsters.length;
    const settings = monsters[idx];
    this.monsterName = settings.name;
    this.monsterEmoji = settings.emoji;
    this.monsterColor = settings.color;
    this.monsterStroke = settings.stroke;
  }

  initializeBattle(): void {
    this.playerHp.set(100);
    this.monsterHp.set(100);
    this.battleState.set('playing');
    this.combatLogs = ['⚔️ Trận chiến từ vựng bắt đầu! Hãy trả lời các từ vựng để tấn công quái vật.'];
    this.currentQuestionIndex = 0;
    this.generateQuestions();
    this.setNextQuestion();
  }

  generateQuestions(): void {
    this.questionsList = [];
    
    // We generate 15 vocabulary questions dynamically from the flashcard definitions
    for (let i = 0; i < 15; i++) {
      const targetCard = this.flashcards[i % this.flashcards.length];
      const formatType = i % 2 === 0; // Alternate question styles

      let questionText = '';
      if (formatType) {
        questionText = `Từ nào có nghĩa là: "${targetCard.definition}"?`;
      } else {
        questionText = `Nghĩa tiếng Việt của từ "${targetCard.word}" là gì?`;
      }

      // Generate options
      const distractors: string[] = [];
      const answersPool = this.flashcards.filter(fc => fc.id !== targetCard.id);

      while (distractors.length < 3 && answersPool.length > 0) {
        const idx = Math.floor(Math.random() * answersPool.length);
        const choice = formatType ? answersPool[idx].word : answersPool[idx].definition;
        if (!distractors.includes(choice)) {
          distractors.push(choice);
        }
        answersPool.splice(idx, 1);
      }

      // If pool is empty, fill with fallbacks
      while (distractors.length < 3) {
        distractors.push('N/A');
      }

      const correctOption = formatType ? targetCard.word : targetCard.definition;
      const allOptions = [correctOption, ...distractors].sort(() => Math.random() - 0.5);

      const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
      const correctIdx = allOptions.indexOf(correctOption);
      const correctLetter = letters[correctIdx];

      this.questionsList.push({
        questionText,
        optionA: allOptions[0],
        optionB: allOptions[1],
        optionC: allOptions[2],
        optionD: allOptions[3],
        correctLetter,
        correctWord: targetCard.word,
        definition: targetCard.definition
      });
    }
  }

  setNextQuestion(): void {
    if (this.currentQuestionIndex >= this.questionsList.length) {
      // Re-generate if we run out of questions
      this.generateQuestions();
      this.currentQuestionIndex = 0;
    }
    this.currentQuestion.set(this.questionsList[this.currentQuestionIndex]);
    this.feedback.set('');
    this.feedbackType.set(null);
  }

  answerQuestion(letter: 'A' | 'B' | 'C' | 'D'): void {
    if (this.isAnimating() || this.battleState() !== 'playing') return;

    const q = this.currentQuestion();
    if (!q) return;

    this.isAnimating.set(true);

    if (letter === q.correctLetter) {
      // Correct! Player attacks
      this.feedback.set('ĐÚNG CHÍNH XÁC! Tấn công quái vật.');
      this.feedbackType.set('correct');

      this.playerAttacking.set(true);
      
      setTimeout(() => {
        // Monster takes hit
        this.monsterHurt.set(true);
        this.floatingText.set('-25 HP');
        this.floatingTarget.set('monster');

        // Subtract HP
        const nextHp = Math.max(0, this.monsterHp() - 25);
        this.monsterHp.set(nextHp);

        this.combatLogs.unshift(`🗡️ Bạn trả lời ĐÚNG từ "${q.correctWord}": Tấn công gây 25 sát thương lên ${this.monsterName}!`);

        setTimeout(() => {
          this.playerAttacking.set(false);
          this.monsterHurt.set(false);
          this.floatingText.set('');
          this.floatingTarget.set(null);
          this.isAnimating.set(false);

          if (nextHp <= 0) {
            this.battleState.set('victory');
            this.combatLogs.unshift(`🏆 Chúc mừng! Bạn đã tiêu diệt ${this.monsterName}.`);
            this.triggerVictoryAPI();
          } else {
            this.currentQuestionIndex++;
            this.setNextQuestion();
          }
        }, 800);
      }, 500);

    } else {
      // Incorrect! Monster attacks
      const correctMeaning = q.correctWord === q.optionA || q.correctWord === q.optionB || q.correctWord === q.optionC || q.correctWord === q.optionD 
        ? q.definition : q.correctWord;

      this.feedback.set(`SAI RỒI! Từ đúng là: "${q.correctWord}" (${q.definition})`);
      this.feedbackType.set('incorrect');

      this.monsterAttacking.set(true);

      setTimeout(() => {
        // Player takes hit
        this.playerHurt.set(true);
        this.floatingText.set('-20 HP');
        this.floatingTarget.set('player');

        // Subtract HP
        const nextHp = Math.max(0, this.playerHp() - 20);
        this.playerHp.set(nextHp);

        this.combatLogs.unshift(`👹 ${this.monsterName} phản công gây 20 sát thương lên bạn do trả lời sai!`);

        setTimeout(() => {
          this.monsterAttacking.set(false);
          this.playerHurt.set(false);
          this.floatingText.set('');
          this.floatingTarget.set(null);
          this.isAnimating.set(false);

          if (nextHp <= 0) {
            this.battleState.set('defeat');
            this.combatLogs.unshift(`💀 Bạn đã bị hạ gục bởi ${this.monsterName}. Hãy thử lại.`);
          } else {
            this.currentQuestionIndex++;
            this.setNextQuestion();
          }
        }, 800);
      }, 500);
    }
  }

  triggerVictoryAPI(): void {
    this.isSubmittingRewards.set(true);
    this.studyService.completeBattle(this.moduleId).subscribe({
      next: (res) => {
        this.isSubmittingRewards.set(false);
        this.rewards.set(res);
        this.combatLogs.unshift(`✨ Nhận thưởng từ hệ thống: +${res.xpGained} EXP và +${res.coinsGained} xu!`);
      },
      error: (err) => {
        console.error('Error claiming battle victory rewards', err);
        this.isSubmittingRewards.set(false);
        alert('Lỗi lưu phần thưởng lên máy chủ. Bạn vẫn sẽ quay về bản đồ.');
      }
    });
  }

  saveBattleResult(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`progress_module_${this.moduleId}`, 'TEST');
    }
    this.router.navigate(['/dashboard'], { queryParams: { tab: 'suggested' } });
  }

  restartBattle(): void {
    this.initializeBattle();
  }
}
