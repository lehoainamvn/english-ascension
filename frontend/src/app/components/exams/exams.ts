import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ExamItem {
  id: number;
  title: string;
  duration: number; // minutes
  questionsCount: number;
  difficulty: string;
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-4xl mx-auto relative z-10 space-y-6">
        <!-- Header -->
        <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🏆</span>
            <div>
              <h2 class="text-xl md:text-2xl font-black text-text-main">Trung Tâm Đề Thi (Exam Hub)</h2>
              <p class="text-xs text-text-muted mt-1">Luyện tập giải đề thi thử TOEIC, IELTS & CEFR để tự tin trước kỳ thi thật.</p>
            </div>
          </div>
        </div>

        <!-- Mode Select or Active Exam -->
        @if (activeExam() === null) {
          <!-- Exam list view -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (exam of exams; track exam.id) {
              <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md flex flex-col justify-between hover:border-brand-primary/30 transition-all duration-300">
                <div class="space-y-3">
                  <div class="flex justify-between items-start">
                    <span class="text-[9px] font-extrabold text-brand-primary uppercase tracking-widest px-2 py-0.5 bg-brand-primary/10 rounded-md">
                      {{ exam.difficulty }}
                    </span>
                    <span class="text-xxs text-text-muted font-semibold">⏳ {{ exam.duration }} phút</span>
                  </div>
                  
                  <h3 class="text-base font-black text-text-main leading-tight">{{ exam.title }}</h3>
                  <p class="text-xs text-text-muted">Bộ câu hỏi trắc nghiệm gồm {{ exam.questionsCount }} câu tổng hợp.</p>
                </div>

                <div class="pt-6 border-t border-border-main/40 mt-6 flex justify-between items-center">
                  <span class="text-[10px] text-text-muted">Hoàn thành để nhận +100 EXP</span>
                  <button
                    (click)="startExam(exam)"
                    class="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Bắt đầu thi
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <!-- Active Exam Screen -->
          <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md space-y-6">
            <div class="flex justify-between items-center border-b border-border-main/50 pb-4">
              <div>
                <span class="text-xxs font-black text-brand-primary uppercase tracking-wider">ĐANG THI ĐỀ</span>
                <h3 class="text-base font-black text-text-main mt-0.5">{{ activeExam()?.title }}</h3>
              </div>
              <div class="bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-xl text-center shrink-0">
                <span class="text-[9px] text-red-500 font-bold block uppercase tracking-wider">Thời gian còn lại</span>
                <span class="text-sm font-mono font-bold text-red-500">{{ formatTime(timeLeft()) }}</span>
              </div>
            </div>

            <!-- Simple Question Sheet -->
            <div class="space-y-4">
              <h4 class="text-xs font-bold text-text-main">Câu hỏi 1: Which of the following is correct grammar?</h4>
              
              <div class="space-y-2">
                <button
                  (click)="answer.set('A')"
                  [class.border-brand-primary]="answer() === 'A'"
                  [class.bg-brand-primary/5]="answer() === 'A'"
                  class="w-full p-3 rounded-xl border border-border-main hover:border-brand-primary/40 text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>A. She doesn't likes coffee.</span>
                </button>
                <button
                  (click)="answer.set('B')"
                  [class.border-brand-primary]="answer() === 'B'"
                  [class.bg-brand-primary/5]="answer() === 'B'"
                  class="w-full p-3 rounded-xl border border-border-main hover:border-brand-primary/40 text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>B. She doesn't like coffee.</span>
                </button>
                <button
                  (click)="answer.set('C')"
                  [class.border-brand-primary]="answer() === 'C'"
                  [class.bg-brand-primary/5]="answer() === 'C'"
                  class="w-full p-3 rounded-xl border border-border-main hover:border-brand-primary/40 text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>C. She didn't liked coffee.</span>
                </button>
              </div>
            </div>

            <div class="pt-6 border-t border-border-main/50 flex gap-3 text-xs font-bold">
              <button
                (click)="submitExam()"
                [disabled]="!answer()"
                class="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 rounded-xl transition-all cursor-pointer disabled:opacity-40"
              >
                Nộp Bài Thi
              </button>
              <button
                (click)="cancelExam()"
                class="bg-bg-input border border-border-main text-text-muted py-3 px-6 rounded-xl hover:bg-bg-card transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class ExamsComponent implements OnDestroy {
  exams: ExamItem[] = [
    { id: 1, title: 'TOEIC Part 5: Vocabulary & Grammar Practice', duration: 15, questionsCount: 20, difficulty: 'Intermediate' },
    { id: 2, title: 'CEFR Level Placement Examination', duration: 30, questionsCount: 40, difficulty: 'All levels' },
    { id: 3, title: 'Luyện đề Nghe TOEIC Part 1 & Part 2', duration: 20, questionsCount: 25, difficulty: 'Beginner' },
    { id: 4, title: 'Đề thi thử Ngữ pháp nâng cao C1', duration: 45, questionsCount: 50, difficulty: 'Advanced' }
  ];

  activeExam = signal<ExamItem | null>(null);
  timeLeft = signal(0);
  answer = signal<string | null>(null);
  private timerId: any;

  startExam(exam: ExamItem) {
    this.activeExam.set(exam);
    this.timeLeft.set(exam.duration * 60);
    this.answer.set(null);
    
    this.timerId = setInterval(() => {
      this.timeLeft.update(t => {
        if (t <= 1) {
          this.submitExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  submitExam() {
    this.clearTimer();
    const isCorrect = this.answer() === 'B';
    if (isCorrect) {
      alert(`Bài thi hoàn tất! Bạn đạt kết quả xuất sắc: 10/10 điểm. Nhận +100 EXP & +20 xu thưởng!`);
    } else {
      alert(`Bài thi hoàn tất! Bạn đạt điểm trung bình: 6/10. Hãy luyện tập thêm ngữ pháp nhé.`);
    }
    this.activeExam.set(null);
  }

  cancelExam() {
    if (confirm('Bạn có chắc chắn muốn hủy bài thi đang làm? Kết quả sẽ không được lưu.')) {
      this.clearTimer();
      this.activeExam.set(null);
    }
  }

  clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    this.clearTimer();
  }
}
