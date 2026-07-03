import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlacementTestService, Question } from '../../../services/placement-test.service';
import { AuthService } from '../../../services/auth.service';
import { TtsService } from '../../../services/tts.service';
import { retry, delay } from 'rxjs/operators';

interface UserAnswer {
  questionId: number;
  selectedOption: string; // A, B, C, D
}

@Component({
  selector: 'app-placement-test',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">

      <!-- Main container -->
      <div class="relative w-full max-w-2xl bg-bg-card border border-border-main shadow-sm rounded-2xl p-6 md:p-8 transition-colors duration-300">
        
        <!-- Welcome Screen -->
        @if (testState() === 'welcome') {
          <div class="text-center py-6 space-y-6">
            <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest">ĐÁNH GIÁ ĐẦU VÀO</p>
            <h2 class="text-2xl font-extrabold text-text-main tracking-tight">
              Placement Test &amp; AI Roadmap
            </h2>
            <p class="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
              Chào mừng bạn đến với bài kiểm tra năng lực tiếng Anh. Hệ thống sẽ cung cấp <strong>12 câu hỏi</strong> bao gồm 4 kỹ năng chính:
            </p>
            
            <div class="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
              <div class="p-3 bg-bg-input border border-border-main rounded-xl">
                <span class="text-xs font-bold text-text-main">Vocabulary</span>
              </div>
              <div class="p-3 bg-bg-input border border-border-main rounded-xl">
                <span class="text-xs font-bold text-text-main">Grammar</span>
              </div>
              <div class="p-3 bg-bg-input border border-border-main rounded-xl">
                <span class="text-xs font-bold text-text-main">Listening</span>
              </div>
              <div class="p-3 bg-bg-input border border-border-main rounded-xl">
                <span class="text-xs font-bold text-text-main">Reading</span>
              </div>
            </div>

            <!-- Target Goal Selection -->
            <div class="max-w-sm mx-auto text-left space-y-1.5 pt-2">
              <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Mục tiêu điểm số TOEIC của bạn:</label>
              <select
                [(ngModel)]="selectedGoal"
                class="w-full bg-bg-input border border-border-main rounded-xl px-3.5 py-3 text-xs text-text-main font-semibold focus:outline-none focus:ring-1 focus:ring-text-muted cursor-pointer"
              >
                <option value="TOEIC 450">Mục tiêu: TOEIC 450+ (Cơ bản)</option>
                <option value="TOEIC 550">Mục tiêu: TOEIC 550+ (Tốt nghiệp / Đi làm)</option>
                <option value="TOEIC 650">Mục tiêu: TOEIC 650+ (Khá)</option>
                <option value="TOEIC 750">Mục tiêu: TOEIC 750+ (Trung cao cấp)</option>
                <option value="TOEIC 850">Mục tiêu: TOEIC 850+ (Cao cấp)</option>
                <option value="TOEIC 990">Mục tiêu: TOEIC 990+ (Xuất sắc)</option>
              </select>
            </div>

            <p class="text-text-muted text-xs leading-relaxed max-w-md mx-auto italic">
              *Lưu ý: Kỹ năng Listening sẽ cần phát âm thanh. Vui lòng bật âm lượng thiết bị của bạn trước khi làm bài.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                (click)="startTest()"
                class="bg-text-main text-bg-main font-bold px-8 py-3.5 rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border-none hover:opacity-90"
              >
                Bắt Đầu Làm Bài →
              </button>
              <button
                (click)="cancelAndLogout()"
                class="bg-bg-input border border-border-main hover:bg-bg-card px-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        }

        <!-- Loading/Cold-start Screen -->
        @if (testState() === 'loading') {
          <div class="text-center py-10 space-y-5">
            <div class="w-16 h-16 border-4 border-border-main border-t-text-main rounded-full animate-spin mx-auto"></div>
            <h3 class="text-lg font-bold text-text-main">Đang khởi động máy chủ...</h3>
            <p class="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
              Backend đang được khởi động lại (Free tier).<br/>
              Vui lòng chờ khoảng <strong class="text-text-main">30–60 giây</strong>, hệ thống sẽ tự động tải đề thi.
            </p>
            <p class="text-text-muted text-xs">Đang thử lại lần {{ retryCount() }}/3...</p>
          </div>
        }

        <!-- Error Screen -->
        @if (testState() === 'error') {
          <div class="text-center py-10 space-y-4">
            <div class="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            </div>
            <h3 class="text-xl font-bold text-text-main">Không thể tải đề thi</h3>
            <p class="text-text-muted text-sm max-w-sm mx-auto">
              Máy chủ không phản hồi sau nhiều lần thử. Vui lòng đợi thêm rồi thử lại.
            </p>
            <div class="pt-4">
              <button
                (click)="loadQuestions()"
                class="bg-brand-primary hover:bg-brand-secondary text-white font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto border-none"
              >
                <span>Thử Lại</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw shrink-0"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
              </button>
            </div>
          </div>
        }

        <!-- Test Running Screen -->
        @if (testState() === 'running') {
          <div>
            <!-- Question Header -->
            <div class="flex justify-between items-center mb-6 pb-4 border-b border-border-main">
              <span class="text-xs font-bold text-text-muted uppercase tracking-wider">
                Câu hỏi {{ currentQuestionIndex + 1 }} / {{ questions.length }}
              </span>
              <span
                [ngClass]="{
                  'bg-green-500/10 text-green-500 border border-green-500/20': currentQuestion().type === 'VOCABULARY',
                  'bg-purple-500/10 text-purple-500 border border-purple-500/20': currentQuestion().type === 'GRAMMAR',
                  'bg-blue-500/10 text-blue-500 border border-blue-500/20': currentQuestion().type === 'LISTENING',
                  'bg-orange-500/10 text-orange-500 border border-orange-500/20': currentQuestion().type === 'READING'
                }"
                class="text-xxs px-2.5 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]"
              >
                {{ currentQuestion().type }} ({{ currentQuestion().difficulty }})
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-1.5 bg-bg-input rounded-full overflow-hidden mb-6 border border-border-main">
              <div
                [style.width.%]="((currentQuestionIndex + 1) / questions.length) * 100"
                class="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-300"
              ></div>
            </div>

            <!-- Question Area -->
            <div class="space-y-6 min-h-[14rem]">
              
              <!-- Listening Audio Trigger -->
              @if (currentQuestion().type === 'LISTENING') {
                <div class="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <button
                      (click)="toggleAudio(currentQuestion().questionText)"
                      [class.bg-brand-primary]="!isAudioPlaying"
                      [class.bg-red-500]="isAudioPlaying"
                      class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer border-none"
                    >
                      @if (isAudioPlaying) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause fill-current"><rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/></svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play fill-current"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                      }
                    </button>
                    <div>
                      <p class="text-sm font-bold text-text-main">Phát âm thanh câu hỏi</p>
                      <p class="text-xs text-text-muted mt-0.5">
                        {{ isAudioPlaying ? 'Đang phát âm thanh...' : 'Nhấp nút để nghe đoạn đối thoại/bài nói' }}
                      </p>
                    </div>
                  </div>
                  
                  @if (isAudioPlaying) {
                    <!-- Waveform Animation -->
                    <div class="flex items-end gap-1 h-5">
                      <div class="w-0.5 bg-brand-primary rounded-full animate-bounce h-3"></div>
                      <div class="w-0.5 bg-brand-primary rounded-full animate-bounce h-5" style="animation-delay: 0.15s"></div>
                      <div class="w-0.5 bg-brand-primary rounded-full animate-bounce h-4" style="animation-delay: 0.3s"></div>
                      <div class="w-0.5 bg-brand-primary rounded-full animate-bounce h-2" style="animation-delay: 0.45s"></div>
                    </div>
                  }
                </div>
              }

              <!-- Reading Passage View -->
              @if (currentQuestion().type === 'READING') {
                <div class="p-5 bg-bg-input border border-border-main rounded-xl text-sm text-text-muted leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto italic border-l-4 border-l-brand-primary">
                  {{ getReadingPassage(currentQuestion().questionText) }}
                </div>
                <h4 class="text-base font-bold text-text-main leading-relaxed mt-4">
                  {{ getReadingQuestion(currentQuestion().questionText) }}
                </h4>
              } @else if (currentQuestion().type !== 'LISTENING') {
                <!-- For GRAMMAR, VOCABULARY: show question text normally -->
                <h4 class="text-lg font-bold text-text-main leading-relaxed">
                  {{ currentQuestion().questionText }}
                </h4>
              } @else {
                <!-- For LISTENING: show a hint to listen and choose -->
                <p class="text-sm text-blue-400/80 italic font-medium text-center py-2">
                  🎧 Nhấn nút phát phía trên để nghe, sau đó chọn đáp án phù hợp.
                </p>
              }

              <!-- Options Selection -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <button
                  (click)="selectOption('A')"
                  [class.border-brand-primary]="getSelectedOption() === 'A'"
                  [class.bg-brand-primary/5]="getSelectedOption() === 'A'"
                  class="bg-bg-input border border-border-main hover:border-brand-primary/40 rounded-xl p-4 text-left text-sm font-semibold transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>A. {{ currentQuestion().optionA }}</span>
                  @if (getSelectedOption() === 'A') {
                    <span class="text-brand-primary font-bold">✓</span>
                  }
                </button>
                <button
                  (click)="selectOption('B')"
                  [class.border-brand-primary]="getSelectedOption() === 'B'"
                  [class.bg-brand-primary/5]="getSelectedOption() === 'B'"
                  class="bg-bg-input border border-border-main hover:border-brand-primary/40 rounded-xl p-4 text-left text-sm font-semibold transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>B. {{ currentQuestion().optionB }}</span>
                  @if (getSelectedOption() === 'B') {
                    <span class="text-brand-primary font-bold">✓</span>
                  }
                </button>
                <button
                  (click)="selectOption('C')"
                  [class.border-brand-primary]="getSelectedOption() === 'C'"
                  [class.bg-brand-primary/5]="getSelectedOption() === 'C'"
                  class="bg-bg-input border border-border-main hover:border-brand-primary/40 rounded-xl p-4 text-left text-sm font-semibold transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>C. {{ currentQuestion().optionC }}</span>
                  @if (getSelectedOption() === 'C') {
                    <span class="text-brand-primary font-bold">✓</span>
                  }
                </button>
                <button
                  (click)="selectOption('D')"
                  [class.border-brand-primary]="getSelectedOption() === 'D'"
                  [class.bg-brand-primary/5]="getSelectedOption() === 'D'"
                  class="bg-bg-input border border-border-main hover:border-brand-primary/40 rounded-xl p-4 text-left text-sm font-semibold transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>D. {{ currentQuestion().optionD }}</span>
                  @if (getSelectedOption() === 'D') {
                    <span class="text-brand-primary font-bold">✓</span>
                  }
                </button>
              </div>

            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center pt-6 mt-6 border-t border-border-main">
              <button
                (click)="prevQuestion()"
                [disabled]="currentQuestionIndex === 0"
                class="bg-bg-input hover:bg-bg-card border border-border-main px-4 py-2.5 rounded-xl font-bold text-sm text-text-muted hover:text-text-main transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                &larr; Câu trước
              </button>

              @if (currentQuestionIndex < questions.length - 1) {
                <button
                  (click)="nextQuestion()"
                  [disabled]="!getSelectedOption()"
                  class="bg-text-main text-bg-main px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer border-none hover:opacity-90"
                >
                  Tiếp theo →
                </button>
              } @else {
                <button
                  (click)="submitTest()"
                  [disabled]="!allQuestionsAnswered()"
                  class="bg-text-main text-bg-main px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer border-none hover:opacity-90"
                >
                  Nộp bài
                </button>
              }
            </div>
          </div>
        }

        <!-- Evaluating State -->
        @if (testState() === 'evaluating') {
          <div class="text-center py-16 space-y-6">
            <div class="relative w-20 h-20 mx-auto">
              <!-- Double ring spinner -->
              <div class="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-t-brand-primary border-r-brand-secondary rounded-full animate-spin"></div>
            </div>
            
            <div class="space-y-2">
              <h3 class="text-xl font-extrabold text-text-main">Trí tuệ nhân tạo đang đánh giá...</h3>
              <p class="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
                Groq AI đang phân tích chi tiết kết quả câu trả lời, thiết lập trình độ CEFR/TOEIC và kiến tạo lộ trình học tập tối ưu riêng cho bạn.
              </p>
            </div>

            <!-- Fake processing details to make user experience interesting -->
            <div class="max-w-xs mx-auto p-3.5 bg-bg-input border border-border-main rounded-xl text-xxs text-text-muted text-left font-mono space-y-2 text-[11px]">
              <div class="flex items-center gap-1.5 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 15.01 9 12.01"/></svg>
                <span>Checking answers correctness...</span>
              </div>
              <div class="flex items-center gap-1.5 animate-pulse text-brand-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Generating personalized learning modules...</span>
              </div>
              <div class="flex items-center gap-1.5 opacity-55">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader shrink-0"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>
                <span>Structuring timeline layout...</span>
              </div>
            </div>
          </div>
        }

        <!-- Results Screen -->
        @if (testState() === 'results' && roadmapResult()) {
          <div class="text-center py-6 space-y-6">

            <!-- Completion badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-input border border-border-main text-text-muted text-xs font-bold uppercase tracking-wider">
              Chúc mừng bạn đã hoàn thành bài thi!
            </div>

            <!-- Rewards -->
            <div class="flex justify-center gap-3 text-xs font-bold">
              <span class="bg-bg-input border border-border-main text-text-muted px-3 py-1.5 rounded-full">+100 EXP</span>
              <span class="bg-bg-input border border-border-main text-text-muted px-3 py-1.5 rounded-full">+50 Xu</span>
            </div>
            
            <h2 class="text-2xl font-extrabold text-text-main tracking-tight">
              KẾT QUẢ KIỂM TRA ĐẦU VÀO
            </h2>

            <!-- Score Summary Cards -->
            <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <!-- CEFR Card -->
              <div class="p-5 bg-bg-input border border-border-main rounded-2xl text-left">
                <h4 class="text-[10px] font-black text-text-muted uppercase tracking-widest">Trình độ CEFR</h4>
                <p class="text-4xl font-black text-text-main mt-1.5">{{ roadmapResult().cefrLevel }}</p>
                <span class="text-[10px] text-text-muted font-semibold block mt-1">Lộ trình học tập đề xuất</span>
              </div>
              
              <!-- TOEIC Card -->
              <div class="p-5 bg-bg-input border border-border-main rounded-2xl text-left">
                <h4 class="text-[10px] font-black text-text-muted uppercase tracking-widest">TOEIC Ước Lượng</h4>
                <p class="text-4xl font-black text-text-main mt-1.5">{{ roadmapResult().toeicEquivalent }}</p>
                <span class="text-[10px] text-text-muted font-semibold block mt-1">Điểm số quy đổi</span>
              </div>
            </div>

            <!-- AI Evaluation Box -->
            <div class="bg-bg-input border border-border-main rounded-xl p-5 text-left space-y-2">
              <h4 class="text-[10px] font-black text-text-muted uppercase tracking-wider">Đánh giá tổng quan từ AI Mentor</h4>
              <p class="text-xs text-text-muted leading-relaxed">
                {{ roadmapResult().overallEvaluation }}
              </p>
            </div>

            <!-- Generated Modules list -->
            <div class="text-left space-y-3">
              <h4 class="text-[10px] font-black text-text-muted uppercase tracking-wider mb-2">Lộ trình học AI được thiết lập:</h4>
              <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
                @for (mod of roadmapResult().modules; track mod.id; let idx = $index) {
                  <div class="p-3.5 bg-bg-card border border-border-main rounded-xl flex items-start gap-3 hover:bg-bg-input transition-all">
                    <span class="w-6 h-6 rounded-full bg-bg-input border border-border-main text-text-muted text-xs font-black flex items-center justify-center shrink-0">
                      {{ idx + 1 }}
                    </span>
                    <div>
                      <h5 class="text-xs font-bold text-text-main leading-tight">{{ mod.title }}</h5>
                      <p class="text-[11px] text-text-muted leading-normal mt-0.5">{{ mod.description }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Action Button -->
            <div class="pt-4 border-t border-border-main/50">
              <button
                (click)="goToWorldMap()"
                class="w-full bg-text-main text-bg-main font-bold py-3.5 rounded-xl active:scale-[0.98] transition-all cursor-pointer text-sm border-none hover:opacity-90"
              >
                Bắt Đầu Hành Trình Luyện Tập →
              </button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class PlacementTestComponent implements OnInit, OnDestroy {
  private readonly placementService = inject(PlacementTestService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly tts = inject(TtsService);

  // States: 'welcome' | 'loading' | 'running' | 'evaluating' | 'error' | 'results'
  testState = signal<'welcome' | 'loading' | 'running' | 'evaluating' | 'error' | 'results'>('welcome');
  roadmapResult = signal<any>(null);
  retryCount = signal<number>(0);

  questions: Question[] = [];
  currentQuestionIndex = 0;
  answers: UserAnswer[] = [];
  selectedGoal = 'TOEIC 550';

  // Audio system
  isAudioPlaying = false;

  ngOnInit(): void {
    // Initial fetch to cache/validate
    this.loadQuestions();
  }

  ngOnDestroy(): void {
    this.stopAudio();
  }

  loadQuestions(): void {
    this.retryCount.set(0);
    this.testState.set('loading');
    let attempt = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 10000; // 10s between retries for cold-start

    const tryFetch = () => {
      attempt++;
      this.retryCount.set(attempt);
      this.placementService.getQuestions().subscribe({
        next: (data) => {
          this.questions = data;
          if (this.questions.length === 0) {
            this.testState.set('error');
          } else {
            this.testState.set('welcome');
          }
        },
        error: (err) => {
          console.error(`Error fetching questions (attempt ${attempt})`, err);
          if (attempt < MAX_RETRIES) {
            setTimeout(() => tryFetch(), RETRY_DELAY_MS);
          } else {
            this.testState.set('error');
          }
        }
      });
    };

    tryFetch();
  }

  startTest(): void {
    if (this.questions.length > 0) {
      this.currentQuestionIndex = 0;
      this.answers = [];
      this.testState.set('running');
    } else {
      this.testState.set('error');
    }
  }

  currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  getSelectedOption(): string | null {
    const qId = this.currentQuestion().id;
    const ans = this.answers.find(a => a.questionId === qId);
    return ans ? ans.selectedOption : null;
  }

  selectOption(option: string): void {
    const qId = this.currentQuestion().id;
    const existingIndex = this.answers.findIndex(a => a.questionId === qId);
    if (existingIndex > -1) {
      this.answers[existingIndex].selectedOption = option;
    } else {
      this.answers.push({ questionId: qId, selectedOption: option });
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.stopAudio();
      this.currentQuestionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.stopAudio();
      this.currentQuestionIndex++;
    }
  }

  allQuestionsAnswered(): boolean {
    return this.answers.length === this.questions.length && 
           this.answers.every(a => !!a.selectedOption);
  }

  // Parses Reading passage text (splits description and question text)
  getReadingPassage(text: string): string {
    const splitIndex = text.indexOf('\n\n');
    if (splitIndex > -1) {
      return text.substring(0, splitIndex);
    }
    return text;
  }

  getReadingQuestion(text: string): string {
    const splitIndex = text.indexOf('\n\n');
    if (splitIndex > -1) {
      return text.substring(splitIndex + 2);
    }
    return 'Dựa vào văn bản trên, hãy trả lời câu hỏi sau:';
  }

  // Audio system controls
  toggleAudio(text: string): void {
    if (this.isAudioPlaying) {
      this.stopAudio();
    } else {
      // Loại bỏ tiền tố [Audio Question] để giọng đọc tự nhiên
      const cleanText = text.replace(/\[Audio Question\]/gi, '').trim();
      this.tts.speak(cleanText);
      this.isAudioPlaying = true;
      
      const checkEnd = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(checkEnd);
          this.isAudioPlaying = false;
        }
      }, 300);
    }
  }

  stopAudio(): void {
    this.tts.stop();
    this.isAudioPlaying = false;
  }

  submitTest(): void {
    if (!this.allQuestionsAnswered()) return;
    
    this.stopAudio();
    this.testState.set('evaluating');

    this.placementService.submitTest(this.answers, this.selectedGoal).subscribe({
      next: (roadmap) => {
        // Update cached onboarding state
        this.authService.hasRoadmapState.set(true);
        // Save result and show results screen
        this.roadmapResult.set(roadmap);
        this.testState.set('results');
      },
      error: (err) => {
        console.error('Error submitting test answers', err);
        alert('Có lỗi xảy ra khi chấm điểm bài thi qua AI. Vui lòng gửi lại.');
        this.testState.set('running');
      }
    });
  }

  goToWorldMap(): void {
    this.router.navigate(['/dashboard'], { queryParams: { tab: 'suggested' } });
  }

  cancelAndLogout(): void {
    this.authService.logout();
    this.router.navigate(['/intro']);
  }
}
