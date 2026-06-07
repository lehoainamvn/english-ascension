import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlacementTestService, Question } from '../../services/placement-test.service';

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
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main container -->
      <div class="relative w-full max-w-2xl backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-2xl p-6 md:p-8 transition-colors duration-300">
        
        <!-- Welcome Screen -->
        @if (testState() === 'welcome') {
          <div class="text-center py-6 space-y-6">
            <span class="bg-brand-primary/10 text-brand-primary text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              Đánh Giá Đầu Vào
            </span>
            <h2 class="text-3xl font-extrabold text-text-main tracking-tight">
              Placement Test & AI Roadmap
            </h2>
            <p class="text-text-muted text-sm leading-relaxed max-w-md mx-auto">
              Chào mừng bạn đến với bài kiểm tra năng lực tiếng Anh. Hệ thống sẽ cung cấp **12 câu hỏi** bao gồm 4 kỹ năng chính:
            </p>
            
            <div class="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
              <div class="p-3 bg-bg-input border border-border-main rounded-xl flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span class="text-xs font-bold text-text-main">Vocabulary</span>
              </div>
              <div class="p-3 bg-bg-input border border-border-main rounded-xl flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span class="text-xs font-bold text-text-main">Grammar</span>
              </div>
              <div class="p-3 bg-bg-input border border-border-main rounded-xl flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span class="text-xs font-bold text-text-main">Listening</span>
              </div>
              <div class="p-3 bg-bg-input border border-border-main rounded-xl flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span class="text-xs font-bold text-text-main">Reading</span>
              </div>
            </div>

            <p class="text-text-muted text-xs leading-relaxed max-w-md mx-auto italic">
              *Lưu ý: Kỹ năng Listening sẽ cần phát âm thanh. Vui lòng bật âm lượng thiết bị của bạn trước khi làm bài.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                (click)="startTest()"
                class="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                Bắt Đầu Làm Bài 🚀
              </button>
              <a
                routerLink="/dashboard"
                class="bg-bg-input border border-border-main hover:bg-bg-card px-6 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center text-text-muted hover:text-text-main"
              >
                Hủy bỏ
              </a>
            </div>
          </div>
        }

        <!-- Error Screen -->
        @if (testState() === 'error') {
          <div class="text-center py-10 space-y-4">
            <div class="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">
              ⚠️
            </div>
            <h3 class="text-xl font-bold text-text-main">Không thể tải đề thi</h3>
            <p class="text-text-muted text-sm max-w-sm mx-auto">
              Đã xảy ra sự cố trong quá trình kết nối với máy chủ. Vui lòng đảm bảo backend đang chạy và thử lại.
            </p>
            <div class="pt-4">
              <button
                (click)="loadQuestions()"
                class="bg-brand-primary hover:bg-brand-secondary text-white font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Tải Lại Đề 🔄
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
              @if (currentQuestion().type === 'LISTENING' && currentQuestion().audioUrl) {
                <div class="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <button
                      (click)="toggleAudio(currentQuestion().audioUrl!)"
                      [class.bg-brand-primary]="!isAudioPlaying"
                      [class.bg-red-500]="isAudioPlaying"
                      class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      @if (isAudioPlaying) {
                        <span>⏸️</span>
                      } @else {
                        <span>▶️</span>
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
              } @else {
                <h4 class="text-lg font-bold text-text-main leading-relaxed">
                  {{ currentQuestion().questionText }}
                </h4>
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
                  class="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Tiếp theo &rarr;
                </button>
              } @else {
                <button
                  (click)="submitTest()"
                  [disabled]="!allQuestionsAnswered()"
                  class="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-brand-primary/15 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Nộp Bài Thi 🎯
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
            <div class="max-w-xs mx-auto p-3.5 bg-bg-input border border-border-main rounded-xl text-xxs text-text-muted text-left font-mono space-y-1 text-[11px]">
              <div class="flex items-center gap-1.5">
                <span class="text-green-500">✓</span> <span>Checking answers correctness...</span>
              </div>
              <div class="flex items-center gap-1.5 animate-pulse">
                <span class="text-brand-primary">⏳</span> <span>Generating personalized learning modules...</span>
              </div>
              <div class="flex items-center gap-1.5 opacity-55">
                <span>▫️</span> <span>Structuring timeline layout...</span>
              </div>
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
  private readonly router = inject(Router);

  // States: 'welcome' | 'running' | 'evaluating' | 'error'
  testState = signal<'welcome' | 'running' | 'evaluating' | 'error'>('welcome');

  questions: Question[] = [];
  currentQuestionIndex = 0;
  answers: UserAnswer[] = [];

  // Audio system
  audio = new Audio();
  isAudioPlaying = false;

  ngOnInit(): void {
    // Initial fetch to cache/validate
    this.loadQuestions();
  }

  ngOnDestroy(): void {
    this.stopAudio();
  }

  loadQuestions(): void {
    this.placementService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        if (this.questions.length === 0) {
          this.testState.set('error');
        }
      },
      error: (err) => {
        console.error('Error fetching questions', err);
        this.testState.set('error');
      }
    });
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
  toggleAudio(url: string): void {
    if (this.isAudioPlaying) {
      this.stopAudio();
    } else {
      this.audio.src = url;
      this.audio.load();
      this.isAudioPlaying = true;
      this.audio.play().catch(e => {
        console.error('Audio play error', e);
        this.isAudioPlaying = false;
      });
      this.audio.onended = () => {
        this.isAudioPlaying = false;
      };
    }
  }

  stopAudio(): void {
    this.audio.pause();
    this.isAudioPlaying = false;
  }

  submitTest(): void {
    if (!this.allQuestionsAnswered()) return;
    
    this.stopAudio();
    this.testState.set('evaluating');

    this.placementService.submitTest(this.answers).subscribe({
      next: (roadmap) => {
        // Successfully assessed, redirect to roadmap timeline view
        this.router.navigate(['/roadmap']);
      },
      error: (err) => {
        console.error('Error submitting test answers', err);
        alert('Có lỗi xảy ra khi chấm điểm bài thi qua AI. Vui lòng gửi lại.');
        this.testState.set('running');
      }
    });
  }
}
