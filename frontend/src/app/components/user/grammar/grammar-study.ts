import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrammarService, GrammarLesson, GrammarQuestion, RewardResult } from '../../../services/grammar.service';
import { UserWordService, UserWord } from '../../../services/user-word.service';
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-grammar-study',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Container Card -->
      <div class="relative w-full max-w-2xl backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-2xl p-5 md:p-8 transition-colors duration-300">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-border-main">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-black tracking-tight bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent uppercase">
              HỌC NGỮ PHÁP
            </h2>
            <span class="text-[9px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
              TOEIC
            </span>
          </div>
          <a
            routerLink="/grammar-topics"
            class="btn-back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Danh sách chủ đề
          </a>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs text-text-muted font-bold">Đang tải học liệu...</p>
          </div>
        } @else if (errorState()) {
          <div class="text-center py-10 space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle mx-auto text-text-muted"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            <h3 class="text-sm font-bold text-text-main">Không tìm thấy bài học</h3>
            <p class="text-text-muted text-xxs max-w-sm mx-auto">
              Không tìm thấy chủ đề ngữ pháp được yêu cầu hoặc lỗi giao tiếp với máy chủ. Vui lòng thử lại sau.
            </p>
            <a
              routerLink="/grammar-topics"
              class="btn-back mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Về Danh Sách
            </a>
          </div>
        } @else {
          
          <!-- Tab Selector -->
          @if (studyState() === 'learning') {
            <div class="flex border-b border-border-main mb-6 select-none font-bold text-xs">
              <button
                (click)="activeTab.set('lesson')"
                [class.border-b-2]="activeTab() === 'lesson'"
                [class.border-brand-primary]="activeTab() === 'lesson'"
                [class.text-text-main]="activeTab() === 'lesson'"
                [class.text-text-muted]="activeTab() !== 'lesson'"
                class="flex-1 py-3 text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Bài học (Lý thuyết)
              </button>
              <button
                (click)="onPracticeTabClick()"
                [class.border-b-2]="activeTab() === 'practice'"
                [class.border-brand-primary]="activeTab() === 'practice'"
                [class.text-text-main]="activeTab() === 'practice'"
                [class.text-text-muted]="activeTab() !== 'practice'"
                class="flex-1 py-3 text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-line shrink-0"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/><path d="m15 5 3 3"/></svg>
                <span>Luyện tập</span>
                @if (!lessonCompleted()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                }
              </button>
            </div>
          }

          <!-- ========================================== -->
          <!-- 1. TAB: LESSON (Theory Reading)            -->
          <!-- ========================================== -->
          @if (activeTab() === 'lesson' && studyState() === 'learning') {
            <div class="space-y-6 animate-fade-in">
              <div class="space-y-1">
                <h1 class="text-lg md:text-xl font-black text-text-main">{{ lesson()?.title }}</h1>
                <p class="text-xs text-text-muted">{{ lesson()?.vietnameseTitle }}</p>
              </div>

              <!-- Theory Content Render -->
              <div class="p-5 md:p-6 bg-bg-input/40 border border-border-main rounded-2xl max-h-[25rem] overflow-y-auto pr-2 text-xs md:text-sm text-text-main leading-relaxed space-y-3 font-medium select-text">
                <div [innerHTML]="parsedTheoryHtml()"></div>
              </div>

              <!-- Lesson Reward Section -->
              <div class="p-4 bg-bg-input/30 border border-border-main rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex gap-2.5 items-center">
                  <div class="w-9 h-9 rounded-xl bg-bg-input border border-border-main flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gift text-text-muted"><polyline points="20 12 20 22 4 22 4 12"/><rect width="22" height="5" x="1" y="7" rx="2" ry="2"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-text-main">Phần thưởng hoàn thành bài học</h4>
                    <p class="text-[10px] text-text-muted">Đọc xong lý thuyết để nhận <strong>+{{ lesson()?.xpRewardLesson }} EXP</strong> và <strong>+{{ lesson()?.coinRewardLesson }} Coins</strong>.</p>
                  </div>
                </div>

                @if (!lessonCompleted()) {
                  <button
                    (click)="completeLessonPart()"
                    [disabled]="isSubmitting()"
                    class="w-full sm:w-auto bg-brand-primary hover:opacity-90 text-bg-main font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5"
                  >
                    Đã học xong
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gift"><polyline points="20 12 20 22 4 22 4 12"/><rect width="22" height="5" x="1" y="7" rx="2" ry="2"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                  </button>
                } @else {
                  <div class="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto items-stretch sm:items-center shrink-0">
                    <span class="text-xs font-black text-green-500 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                      Đã nhận thưởng
                    </span>
                    <button
                      (click)="activeTab.set('practice')"
                      class="bg-brand-secondary hover:bg-brand-primary text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Sang Luyện tập &rarr;
                    </button>
                  </div>
                }
              </div>
            </div>
          }

          <!-- ========================================== -->
          <!-- 2. TAB: PRACTICE (Quiz Questions)          -->
          <!-- ========================================== -->
          @if (activeTab() === 'practice' && studyState() === 'learning') {
            @if (!lessonCompleted()) {
              <!-- Locked State Overlay -->
              <div class="py-16 text-center space-y-4 animate-fade-in flex flex-col items-center">
                <div class="w-16 h-16 rounded-full bg-bg-input border border-border-main flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock text-text-muted"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 class="text-sm font-black text-text-main">Phần Luyện Tập Đang Khóa</h3>
                <p class="text-xxs text-text-muted max-w-xs leading-normal">
                  Bạn cần hoàn thành phần đọc lý thuyết ở tab "Bài học" và nhấn nút xác nhận nhận thưởng để mở khóa thử thách luyện tập này.
                </p>
                <button
                  (click)="activeTab.set('lesson')"
                  class="bg-brand-primary hover:opacity-90 text-bg-main font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Đi tới Bài học
                </button>
              </div>
            } @else {
              <!-- Unlocked Quiz list -->
              <div class="space-y-6 animate-fade-in">
                <div class="space-y-1">
                  <h3 class="text-sm font-black text-text-main">Thử Thách Luyện Tập: {{ lesson()?.title }}</h3>
                  <p class="text-xxs text-text-muted">Hoàn thành các câu hỏi trắc nghiệm và điền vào chỗ trống dưới đây.</p>
                </div>

                <!-- Questions List -->
                <div class="space-y-5 max-h-[22rem] overflow-y-auto pr-1">
                  @for (q of questions; track q.id; let i = $index) {
                    <div class="p-4 bg-bg-input/60 border border-border-main rounded-xl space-y-4 relative">
                      <div class="flex justify-between items-start pr-8">
                        <h4 class="text-xs font-bold text-text-main leading-relaxed">
                          Câu {{ i + 1 }}: {{ q.questionText }}
                        </h4>
                        <button
                          (click)="toggleSaveGrammarQuestion($event, q)"
                          class="absolute top-4 right-4 w-7 h-7 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center transition-all cursor-pointer shadow-sm"
                          [title]="isGrammarQuestionSaved(q) ? 'Bỏ lưu sổ tay' : 'Lưu câu hỏi vào sổ tay'"
                        >
                          @if (isGrammarQuestionSaved(q)) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          }
                        </button>
                      </div>
                      
                      <!-- MCQ -->
                      @if (q.type === 'MULTIPLE_CHOICE') {
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <button
                            (click)="selectOption(i, 'A')"
                            [class.border-brand-primary]="userAnswers[i] === 'A'"
                            [class.bg-brand-primary/5]="userAnswers[i] === 'A'"
                            class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-xxs font-semibold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>A. {{ q.optionA }}</span>
                            @if (userAnswers[i] === 'A') { <span class="text-brand-primary">✓</span> }
                          </button>
                          <button
                            (click)="selectOption(i, 'B')"
                            [class.border-brand-primary]="userAnswers[i] === 'B'"
                            [class.bg-brand-primary/5]="userAnswers[i] === 'B'"
                            class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-xxs font-semibold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>B. {{ q.optionB }}</span>
                            @if (userAnswers[i] === 'B') { <span class="text-brand-primary">✓</span> }
                          </button>
                          <button
                            (click)="selectOption(i, 'C')"
                            [class.border-brand-primary]="userAnswers[i] === 'C'"
                            [class.bg-brand-primary/5]="userAnswers[i] === 'C'"
                            class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-xxs font-semibold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>C. {{ q.optionC }}</span>
                            @if (userAnswers[i] === 'C') { <span class="text-brand-primary">✓</span> }
                          </button>
                          <button
                            (click)="selectOption(i, 'D')"
                            [class.border-brand-primary]="userAnswers[i] === 'D'"
                            [class.bg-brand-primary/5]="userAnswers[i] === 'D'"
                            class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-xxs font-semibold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>D. {{ q.optionD }}</span>
                            @if (userAnswers[i] === 'D') { <span class="text-brand-primary">✓</span> }
                          </button>
                        </div>
                      }

                      <!-- FILL IN BLANK -->
                      @if (q.type === 'FILL_IN_BLANK') {
                        <input
                          type="text"
                          [value]="userAnswers[i] || ''"
                          (input)="onFillInBlankInput(i, $event)"
                          placeholder="Nhập câu trả lời của bạn..."
                          class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-2.5 text-xxs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-semibold"
                        />
                      }

                      <!-- Sentence Notes Box for Grammar Question -->
                      @if (isGrammarQuestionSaved(q)) {
                        <div class="mt-4 p-3 bg-yellow-500/5 dark:bg-yellow-500/10 border border-dashed border-yellow-500/30 rounded-xl text-left space-y-1.5 animate-fade-in shrink-0">
                          <div class="flex justify-between items-center">
                            <label class="text-[9px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> Ghi chú giải thích câu hỏi:
                            </label>
                            @if (isGrammarNotesSaving(q)) {
                              <span class="text-[8px] text-text-muted animate-pulse">Đang lưu...</span>
                            }
                          </div>
                          <textarea
                            [ngModel]="getGrammarNotes(q)"
                            (ngModelChange)="onGrammarNotesChange(q, $event)"
                            placeholder="Ghi chú cá nhân..."
                            rows="2"
                            class="w-full bg-bg-card border border-border-main rounded-lg px-2.5 py-1.5 text-xxs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                          ></textarea>
                        </div>
                      }
                    </div>
                  }
                </div>

                <!-- Submit Button -->
                <div class="pt-4 border-t border-border-main">
                  <button
                    (click)="submitPracticeQuiz()"
                    [disabled]="!allQuestionsAnswered()"
                    class="w-full bg-brand-primary text-bg-main font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer text-xs flex items-center justify-center gap-2"
                  >
                    Nộp bài & Xem kết quả
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
                  </button>
                </div>
              </div>
            }
          }

          <!-- ========================================== -->
          <!-- 3. VIEW: QUIZ COMPLETED / RESULTS REVIEW   -->
          <!-- ========================================== -->
          @if (studyState() === 'quiz_completed') {
            <div class="space-y-6 animate-fade-in">
              <div class="text-center py-4 bg-bg-input border border-border-main rounded-2xl">
                <span class="text-[9px] font-black text-brand-primary uppercase tracking-wider">Kết quả luyện tập</span>
                <h3 class="text-2xl font-black text-text-main mt-1">
                  Đúng: {{ correctCount }} / {{ questions.length }} câu
                </h3>
                <p class="text-xxs text-text-muted mt-1.5">Xem giải thích đáp án chi tiết bên dưới trước khi nhận thưởng.</p>
              </div>

              <!-- Answer Review List -->
              <div class="space-y-4 max-h-[18rem] overflow-y-auto pr-1">
                @for (q of questions; track q.id; let i = $index) {
                  <div
                    [ngClass]="{
                      'border-green-500/30 bg-green-500/5': isAnswerCorrect(i),
                      'border-red-500/30 bg-red-500/5': !isAnswerCorrect(i)
                    }"
                    class="p-4 border rounded-xl space-y-2"
                  >
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-text-main">Câu {{ i + 1 }}</span>
                        <button
                          (click)="toggleSaveGrammarQuestion($event, q)"
                          class="w-6 h-6 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center transition-all cursor-pointer shadow-sm"
                          [title]="isGrammarQuestionSaved(q) ? 'Bỏ lưu sổ tay' : 'Lưu câu hỏi vào sổ tay'"
                        >
                          @if (isGrammarQuestionSaved(q)) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          }
                        </button>
                      </div>
                      <span
                        [ngClass]="{
                          'text-green-500 bg-green-500/10': isAnswerCorrect(i),
                          'text-red-500 bg-red-500/10': !isAnswerCorrect(i)
                        }"
                        class="text-[9px] px-2 py-0.5 rounded font-extrabold flex items-center gap-0.5"
                      >
                        @if (isAnswerCorrect(i)) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                          ĐÚNG
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          SAI
                        }
                      </span>
                    </div>

                    <p class="text-xs text-text-muted italic leading-relaxed">
                      "{{ q.questionText }}"
                    </p>

                    <p class="text-xs text-text-main font-semibold">
                      Đáp án của bạn: <strong class="text-brand-accent">{{ userAnswers[i] }}</strong> | Đáp án đúng: <strong class="text-green-500">{{ getCorrectOptionText(q) }}</strong>
                    </p>

                    <div class="p-3 bg-bg-card border border-border-main rounded-lg text-xxs text-text-muted leading-relaxed">
                      <strong>Giải thích:</strong> {{ q.explanation }}
                    </div>

                    <!-- Sentence Notes Box for Grammar Question in Results Review -->
                    @if (isGrammarQuestionSaved(q)) {
                      <div class="mt-4 p-3 bg-yellow-500/5 dark:bg-yellow-500/10 border border-dashed border-yellow-500/30 rounded-xl text-left space-y-1.5 animate-fade-in shrink-0">
                        <div class="flex justify-between items-center">
                          <label class="text-[9px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> Ghi chú giải thích câu hỏi:
                          </label>
                          @if (isGrammarNotesSaving(q)) {
                            <span class="text-[8px] text-text-muted animate-pulse">Đang lưu...</span>
                          }
                        </div>
                        <textarea
                          [ngModel]="getGrammarNotes(q)"
                          (ngModelChange)="onGrammarNotesChange(q, $event)"
                          placeholder="Ghi chú cá nhân..."
                          rows="2"
                          class="w-full bg-bg-card border border-border-main rounded-lg px-2.5 py-1.5 text-xxs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                        ></textarea>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Claim Rewards Trigger -->
              <div class="pt-4 border-t border-border-main">
                <button
                  (click)="claimPracticeRewards()"
                  [disabled]="isSubmitting()"
                  class="w-full bg-brand-primary text-bg-main font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer text-xs flex items-center justify-center gap-2"
                >
                  Nhận thưởng Luyện tập & Hoàn thành
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </button>
              </div>
            </div>
          }

          <!-- ========================================== -->
          <!-- 4. VIEW: REWARDS SUMMARY                   -->
          <!-- ========================================== -->
          @if (studyState() === 'rewards' && rewards()) {
            <div class="text-center py-6 space-y-6 animate-fade-in">
              <div class="space-y-1">
                <span class="text-[9px] font-black text-brand-accent uppercase tracking-wider">Rèn luyện hoàn tất</span>
                <h3 class="text-2xl font-black text-text-main">Bài Luyện Tập Đã Xong!</h3>
              </div>

              <div class="flex justify-center gap-6 max-w-sm mx-auto">
                <div class="flex-1 p-4 bg-bg-input/30 border border-border-main rounded-2xl flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap text-text-muted"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
                  <span class="text-sm font-black text-text-main mt-1">+{{ rewards()?.xpGained }} EXP</span>
                  <span class="text-[9px] text-text-muted mt-0.5">Kinh nghiệm</span>
                </div>
                <div class="flex-1 p-4 bg-bg-input/30 border border-border-main rounded-2xl flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins text-text-muted"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
                  <span class="text-sm font-black text-text-main mt-1">+{{ rewards()?.coinsGained }} Xu</span>
                  <span class="text-[9px] text-text-muted mt-0.5">Tiền vàng</span>
                </div>
              </div>

              <div class="max-w-sm mx-auto space-y-2 pt-4">
                <div class="flex justify-between items-center text-xxs font-bold">
                  <span>Cấp độ hiện tại: Lớp {{ rewards()?.newLevel }}</span>
                  <span class="text-text-muted">{{ rewards()?.newXp }} / {{ rewards()?.newLevel! * 100 }} EXP</span>
                </div>
                <div class="w-full h-2 bg-bg-input rounded-full overflow-hidden border border-border-main">
                  <div
                    [style.width.%]="(rewards()?.newXp! / (rewards()?.newLevel! * 100)) * 100"
                    class="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-1000"
                  ></div>
                </div>
                <p class="text-[10px] text-text-muted">
                  Số dư tài khoản: <strong>{{ rewards()?.newCoins }} Xu</strong>
                </p>
              </div>

              <div class="pt-6 max-w-sm mx-auto">
                <a
                  routerLink="/grammar-topics"
                  class="w-full bg-brand-primary hover:opacity-90 text-bg-main font-bold py-3.5 rounded-xl shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  Quay Lại Danh Sách Chủ Đề
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
                </a>
              </div>
            </div>
          }

        }

      </div>

      <!-- LEVEL UP MODAL -->
      @if (showLevelUpModal() && rewards()) {
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div class="relative w-full max-w-sm bg-gradient-to-b from-yellow-500/15 via-bg-card to-bg-card border border-yellow-500/30 rounded-2xl p-8 text-center shadow-2xl space-y-6">
            
            <div class="space-y-2">
                <div class="w-16 h-16 rounded-full bg-bg-input border border-border-main flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown text-text-muted"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
                </div>
                <h2 class="text-2xl font-black text-text-main tracking-tight">THĂNG CẤP!</h2>
              <p class="text-[9px] text-text-muted uppercase tracking-wider font-bold">Bạn đã thăng tiến sức mạnh</p>
            </div>

            <div class="py-4 border-y border-border-main/50 space-y-3">
              <p class="text-xs text-text-muted">Bạn đã đạt cấp độ mới:</p>
              <div class="flex justify-center items-center gap-4">
                <span class="text-lg font-black text-text-muted line-through">Lv.{{ rewards()?.previousLevel }}</span>
                <span class="text-xl">&rarr;</span>
                <span class="text-35xl font-black text-yellow-500">Lv.{{ rewards()?.newLevel }}</span>
              </div>
              
              @if (rewards()?.newTitle; as title) {
                <div class="mt-4">
                  <p class="text-[10px] text-text-muted uppercase tracking-wider font-bold">Danh hiệu tiến hóa:</p>
                  <span class="bg-bg-input border border-border-main text-text-muted text-[10px] font-bold px-3 py-1 rounded-full inline-block mt-1 uppercase tracking-widest">
                      {{ title }}
                    </span>
                </div>
              }
            </div>

            <button
              (click)="closeLevelUpModal()"
              class="w-full bg-brand-primary text-bg-main font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
            >
              Tiếp tục rèn luyện
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class GrammarStudyComponent implements OnInit, OnDestroy {
  private readonly grammarService = inject(GrammarService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userWordService = inject(UserWordService);
  private readonly toastService = inject(ToastService);

  lessonId = 0;
  savedWords = signal<UserWord[]>([]);
  grammarNotesMap: { [qText: string]: string } = {};
  savingNotesGrammar = signal<{ [qText: string]: boolean }>({});
  private grammarNotesTimeouts: { [qText: string]: any } = {};

  
  lesson = signal<GrammarLesson | null>(null);
  questions: GrammarQuestion[] = [];
  userAnswers: { [qIdx: number]: string } = {};

  activeTab = signal<'lesson' | 'practice'>('lesson');
  studyState = signal<'learning' | 'quiz_completed' | 'rewards'>('learning');
  
  isLoading = signal(true);
  errorState = signal(false);
  isSubmitting = signal(false);
  
  lessonCompleted = signal(false);
  correctCount = 0;

  rewards = signal<RewardResult | null>(null);
  showLevelUpModal = signal(false);

  ngOnInit() {
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    if (!this.lessonId) {
      this.errorState.set(true);
      this.isLoading.set(false);
    } else {
      this.loadSavedWords();
      this.loadContent();
    }
  }

  ngOnDestroy() {
    // Clean up
  }

  loadContent() {
    this.isLoading.set(true);
    this.errorState.set(false);

    this.grammarService.getLesson(this.lessonId).subscribe({
      next: (data) => {
        this.lesson.set(data);
        this.lessonCompleted.set(data.lessonCompleted);

        // Fetch questions
        this.grammarService.getQuestions(this.lessonId).subscribe({
          next: (questions) => {
            this.questions = questions;
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error loading quiz questions', err);
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading lesson details', err);
        this.errorState.set(true);
        this.isLoading.set(false);
      }
    });
  }

  parsedTheoryHtml(): string {
    const content = this.lesson()?.theoryContent;
    if (!content) return '';
    return this.parseMarkdown(content);
  }

  parseMarkdown(text: string): string {
    return text
      .replace(/### (.*)/g, '<h3 class="text-sm font-black text-brand-secondary mt-5 mb-2">$1</h3>')
      .replace(/## (.*)/g, '<h2 class="text-xs font-black text-brand-primary mt-6 mb-3">$1</h2>')
      .replace(/# (.*)/g, '<h1 class="text-sm font-black text-text-main mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-primary font-black">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-text-muted">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-bg-input px-1.5 py-0.5 rounded font-mono text-[10px] text-brand-accent">$1</code>')
      .replace(/- (.*)/g, '<div class="flex items-start gap-1.5 my-1 pl-2"><span class="text-brand-primary shrink-0">•</span><span>$1</span></div>')
      .split('\n').join('<br/>');
  }

  onPracticeTabClick() {
    if (this.lessonCompleted()) {
      this.activeTab.set('practice');
    } else {
      alert('Vui lòng hoàn thành phần đọc lý thuyết bài học và nhận thưởng trước để mở khóa luyện tập.');
    }
  }

  completeLessonPart() {
    this.isSubmitting.set(true);
    this.grammarService.completeLesson(this.lessonId).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.lessonCompleted.set(true);
        
        this.toastService.success(`🎉 Học tốt lắm! Bạn đã nhận được +${res.xpGained} EXP & +${res.coinsGained} Coins. Hãy tiếp tục làm bài Luyện tập nhé!`);
        
        this.activeTab.set('practice');
        if (res.leveledUp) {
          this.toastService.success(`🎉 LÊN CẤP: Cấp ${res.newLevel} (Danh hiệu: ${res.newTitle})!`, 5000);
        }
      },
      error: (err) => {
        console.error('Error completing lesson part', err);
        this.isSubmitting.set(false);
        this.lessonCompleted.set(true);
        this.activeTab.set('practice');
        this.toastService.success('🎉 Đã hoàn thành lý thuyết bài học!');
      }
    });
  }

  selectOption(qIdx: number, option: string) {
    this.userAnswers[qIdx] = option;
  }

  onFillInBlankInput(qIdx: number, event: Event) {
    const val = (event.target as HTMLInputElement).value;
    if (val.trim()) {
      this.userAnswers[qIdx] = val.trim();
    } else {
      delete this.userAnswers[qIdx];
    }
  }

  allQuestionsAnswered(): boolean {
    return Object.keys(this.userAnswers).length === this.questions.length;
  }

  submitPracticeQuiz() {
    if (!this.allQuestionsAnswered()) return;

    let correct = 0;
    this.questions.forEach((q, idx) => {
      if (this.isAnswerCorrect(idx)) {
        correct++;
      }
    });

    this.correctCount = correct;
    this.studyState.set('quiz_completed');
  }

  isAnswerCorrect(idx: number): boolean {
    const q = this.questions[idx];
    const userAnswer = this.userAnswers[idx] || '';
    if (q.type === 'FILL_IN_BLANK') {
      return userAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
    }
    return userAnswer.toUpperCase() === q.correctAnswer.toUpperCase();
  }

  getCorrectOptionText(q: GrammarQuestion): string {
    const correctLetter = q.correctAnswer.trim().toUpperCase();
    if (correctLetter === 'A') return q.optionA || '';
    if (correctLetter === 'B') return q.optionB || '';
    if (correctLetter === 'C') return q.optionC || '';
    if (correctLetter === 'D') return q.optionD || '';
    return q.correctAnswer;
  }

  claimPracticeRewards() {
    this.isSubmitting.set(true);
    
    // Calculate score percentage
    const finalScore = Math.round((this.correctCount / this.questions.length) * 100);

    this.grammarService.completePractice(this.lessonId, finalScore).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.toastService.success(`🎉 Hoàn thành luyện tập: +${res.xpGained} EXP & +${res.coinsGained} Coins!`);
        if (res.leveledUp) {
          this.toastService.success(`🎉 LÊN CẤP: Cấp ${res.newLevel} (Danh hiệu: ${res.newTitle})!`, 5000);
        }
        this.router.navigate(['/grammar-topics']);
      },
      error: (err) => {
        console.error('Error completing practice rewards', err);
        this.isSubmitting.set(false);
        this.toastService.success('🎉 Đã hoàn thành luyện tập!');
        this.router.navigate(['/grammar-topics']);
      }
    });
  }

  closeLevelUpModal() {
    this.showLevelUpModal.set(false);
  }

  loadSavedWords(): void {
    this.userWordService.getUserWords().subscribe({
      next: (words: UserWord[]) => {
        this.savedWords.set(words);
        const map: { [key: string]: string } = {};
        words.forEach(w => {
          map[w.word.toLowerCase()] = w.notes || '';
        });
        this.grammarNotesMap = map;
      },
      error: (err: any) => console.error('Error loading saved words', err)
    });
  }

  getGrammarKey(q: GrammarQuestion): string {
    return `grammar: ${q.questionText}`;
  }

  isGrammarQuestionSaved(q: GrammarQuestion): boolean {
    const key = this.getGrammarKey(q);
    return this.savedWords().some(w => w.word.toLowerCase() === key.toLowerCase());
  }

  toggleSaveGrammarQuestion(event: Event, q: GrammarQuestion): void {
    if (event) event.stopPropagation();
    const key = this.getGrammarKey(q);
    const existing = this.savedWords().find(w => w.word.toLowerCase() === key.toLowerCase());

    if (existing) {
      this.userWordService.deleteUserWord(existing.id).subscribe({
        next: () => {
          this.savedWords.set(this.savedWords().filter(w => w.id !== existing.id));
          delete this.grammarNotesMap[key.toLowerCase()];
        },
        error: (err: any) => console.error('Error deleting grammar question', err)
      });
    } else {
      const payload = {
        word: key,
        partOfSpeech: 'grammar',
        definition: `Đáp án đúng: ${this.getCorrectOptionText(q)} | Giải thích: ${q.explanation || ''}`,
        phonetic: '',
        notes: ''
      };
      this.userWordService.saveUserWord(payload).subscribe({
        next: (saved: UserWord) => {
          this.savedWords.set([...this.savedWords(), saved]);
          this.grammarNotesMap[saved.word.toLowerCase()] = '';
        },
        error: (err: any) => console.error('Error saving grammar question', err)
      });
    }
  }

  getGrammarNotes(q: GrammarQuestion): string {
    const key = this.getGrammarKey(q);
    return this.grammarNotesMap[key.toLowerCase()] || '';
  }

  isGrammarNotesSaving(q: GrammarQuestion): boolean {
    const key = this.getGrammarKey(q);
    return this.savingNotesGrammar()[key.toLowerCase()] || false;
  }

  onGrammarNotesChange(q: GrammarQuestion, newNotes: string): void {
    const key = this.getGrammarKey(q);
    this.grammarNotesMap[key.toLowerCase()] = newNotes;

    const existing = this.savedWords().find(w => w.word.toLowerCase() === key.toLowerCase());
    if (!existing) return;

    if (this.grammarNotesTimeouts[key.toLowerCase()]) {
      clearTimeout(this.grammarNotesTimeouts[key.toLowerCase()]);
    }

    const savingMap = { ...this.savingNotesGrammar() };
    savingMap[key.toLowerCase()] = true;
    this.savingNotesGrammar.set(savingMap);

    this.grammarNotesTimeouts[key.toLowerCase()] = setTimeout(() => {
      this.userWordService.updateUserWord(existing.id, { notes: newNotes }).subscribe({
        next: (updated: UserWord) => {
          this.savedWords.set(this.savedWords().map(w => w.id === updated.id ? updated : w));
          
          const doneSavingMap = { ...this.savingNotesGrammar() };
          doneSavingMap[key.toLowerCase()] = false;
          this.savingNotesGrammar.set(doneSavingMap);
        },
        error: (err: any) => {
          console.error('Error updating notes', err);
          const doneSavingMap = { ...this.savingNotesGrammar() };
          doneSavingMap[key.toLowerCase()] = false;
          this.savingNotesGrammar.set(doneSavingMap);
        }
      });
    }, 800);
  }
}
