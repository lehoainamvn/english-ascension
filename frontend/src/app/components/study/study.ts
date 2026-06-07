import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudyService, Flashcard, QuizQuestion, CompletionResult } from '../../services/study.service';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main container card -->
      <div class="relative w-full max-w-2xl backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-2xl p-6 md:p-8 transition-colors duration-300">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-border-main">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
              ENGLISH ASCENSION
            </h2>
            <span class="text-xxs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              Module học
            </span>
          </div>
          <a
            routerLink="/roadmap"
            class="bg-bg-input hover:bg-bg-card border border-border-main px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-text-muted hover:text-text-main"
          >
            &larr; Lộ trình
          </a>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-text-muted font-medium">Đang chuẩn bị học liệu AI...</p>
          </div>
        } @else if (errorState()) {
          <div class="text-center py-10 space-y-4">
            <div class="text-3xl">⚠️</div>
            <h3 class="text-lg font-bold text-text-main">Không thể tải học liệu</h3>
            <p class="text-text-muted text-sm max-w-sm mx-auto">
              Không tìm thấy module được yêu cầu hoặc lỗi giao tiếp với AI. Vui lòng thử lại sau.
            </p>
            <a
              routerLink="/roadmap"
              class="bg-brand-primary hover:bg-brand-secondary text-white font-bold px-6 py-2.5 rounded-xl transition-all inline-block shadow-md"
            >
              Về Lộ Trình
            </a>
          </div>
        } @else {
          
          <!-- Mode Tabs Selector -->
          @if (studyState() !== 'rewards') {
            <div class="flex border-b border-border-main mb-6">
              <button
                (click)="setMode('flashcards')"
                [disabled]="studyState() === 'quiz_completed'"
                [class.border-b-2]="mode() === 'flashcards'"
                [class.border-brand-primary]="mode() === 'flashcards'"
                [class.text-brand-primary]="mode() === 'flashcards'"
                [class.text-text-muted]="mode() !== 'flashcards'"
                class="flex-1 py-3 text-sm font-bold transition-all text-center cursor-pointer disabled:opacity-50"
              >
                1. Flashcards Từ Vựng 🃏
              </button>
              <button
                (click)="setMode('quiz')"
                [class.border-b-2]="mode() === 'quiz'"
                [class.border-brand-primary]="mode() === 'quiz'"
                [class.text-brand-primary]="mode() === 'quiz'"
                [class.text-text-muted]="mode() !== 'quiz'"
                class="flex-1 py-3 text-sm font-bold transition-all text-center cursor-pointer"
              >
                2. Quiz Ôn Tập 📝
              </button>
            </div>
          }

          <!-- FLASHCARDS VIEW -->
          @if (mode() === 'flashcards' && studyState() === 'learning') {
            <div class="space-y-6">
              <div class="text-center">
                <span class="text-xxs text-text-muted font-bold uppercase tracking-wider text-[10px]">
                  Thẻ {{ currentCardIndex + 1 }} / {{ flashcards.length }}
                </span>
                <h3 class="text-base font-extrabold text-text-main mt-0.5">
                  Nhấp vào thẻ để lật xem nghĩa
                </h3>
              </div>

              <!-- 3D Flip Card Container -->
              <div class="perspective flex justify-center py-4">
                <div
                  (click)="isFlipped = !isFlipped"
                  [class.flipped]="isFlipped"
                  class="flip-card-inner relative w-full max-w-sm h-64 bg-bg-input border border-border-main rounded-2xl shadow-lg cursor-pointer transition-transform duration-500"
                >
                  <!-- Front Side -->
                  <div class="flip-card-front flex flex-col items-center justify-center p-6 bg-gradient-to-b from-brand-primary/5 to-transparent">
                    <span class="text-xs text-brand-primary font-bold uppercase tracking-widest bg-brand-primary/10 px-2 py-0.5 rounded">
                      {{ currentCard().partOfSpeech }}
                    </span>
                    <h2 class="text-3xl font-black text-text-main tracking-tight mt-3">
                      {{ currentCard().word }}
                    </h2>
                    <p class="text-sm text-text-muted font-mono mt-1">
                      {{ currentCard().phonetic }}
                    </p>
                    <div class="flex items-center gap-2 mt-6">
                      <button
                        (click)="speakWord($event, currentCard().word)"
                        class="w-10 h-10 rounded-full bg-brand-primary hover:bg-brand-secondary text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                        title="Nghe phát âm"
                      >
                        🔊
                      </button>
                      <span class="text-xxs text-text-muted text-[10px]">Nghe phát âm</span>
                    </div>
                  </div>

                  <!-- Back Side -->
                  <div class="flip-card-back flex flex-col justify-center p-6 bg-bg-card">
                    <div class="text-center border-b border-border-main/50 pb-3 mb-3">
                      <p class="text-xs text-brand-accent font-bold uppercase tracking-wide">Giải nghĩa</p>
                      <h3 class="text-xl font-bold text-text-main mt-1">
                        {{ currentCard().definition }}
                      </h3>
                    </div>
                    <div>
                      <p class="text-xxs text-text-muted uppercase tracking-wider text-[9px] font-bold">Ví dụ sử dụng:</p>
                      <p class="text-xs font-semibold text-text-main italic mt-1 leading-relaxed">
                        "{{ currentCard().exampleSentence }}"
                      </p>
                      <p class="text-xs text-text-muted mt-1 leading-relaxed">
                        → {{ currentCard().exampleTranslation }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Flip Card Controls -->
              <div class="flex justify-between items-center max-w-sm mx-auto pt-4">
                <button
                  (click)="prevCard()"
                  [disabled]="currentCardIndex === 0"
                  class="bg-bg-input hover:bg-bg-card border border-border-main px-4 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Thẻ trước
                </button>
                <span class="text-xs text-text-muted font-semibold">
                  Mẹo: Nhấn phím cách (Space) hoặc nhấp thẻ để lật
                </span>
                <button
                  (click)="nextCard()"
                  [disabled]="currentCardIndex === flashcards.length - 1"
                  class="bg-bg-input hover:bg-bg-card border border-border-main px-4 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Thẻ sau
                </button>
              </div>

              <!-- Completion Trigger for Flashcard -->
              @if (currentCardIndex === flashcards.length - 1) {
                <div class="text-center pt-6 max-w-sm mx-auto border-t border-border-main/50">
                  <p class="text-xs text-text-muted mb-3 italic">
                    Chúc mừng! Bạn đã hoàn thành việc xem qua 5 từ vựng của chương học này.
                  </p>
                  <button
                    (click)="setMode('quiz')"
                    class="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 rounded-xl shadow-md hover:shadow-brand-primary/10 active:scale-95 transition-all cursor-pointer"
                  >
                    Bắt Đầu Làm Quiz Ôn Tập 📝
                  </button>
                </div>
              }

            </div>
          }

          <!-- QUIZ VIEW -->
          @if (mode() === 'quiz' && studyState() === 'learning') {
            <div class="space-y-6">
              <div class="text-center">
                <span class="bg-brand-secondary/10 text-brand-secondary text-xxs px-2.5 py-0.5 rounded font-bold uppercase tracking-widest text-[10px]">
                  Kiểm tra nhanh
                </span>
                <h3 class="text-lg font-black text-text-main mt-1">Trả lời các câu hỏi ôn tập</h3>
              </div>

              <!-- Questions List -->
              <div class="space-y-6 max-h-[26rem] overflow-y-auto pr-1">
                @for (q of quizQuestions; track q.id; let i = $index) {
                  <div class="p-4 bg-bg-input/60 border border-border-main rounded-xl space-y-4">
                    <h4 class="text-sm font-bold text-text-main leading-relaxed">
                      Câu {{ i + 1 }}: {{ q.questionText }}
                    </h4>
                    
                    <!-- MULTIPLE CHOICE -->
                    @if (q.type === 'MULTIPLE_CHOICE') {
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <button
                          (click)="selectQuizOption(i, 'A')"
                          [class.border-brand-primary]="getQuizAnswer(i) === 'A'"
                          [class.bg-brand-primary/5]="getQuizAnswer(i) === 'A'"
                          class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                        >
                          <span>A. {{ q.optionA }}</span>
                          @if (getQuizAnswer(i) === 'A') {
                            <span class="text-brand-primary">✓</span>
                          }
                        </button>
                        <button
                          (click)="selectQuizOption(i, 'B')"
                          [class.border-brand-primary]="getQuizAnswer(i) === 'B'"
                          [class.bg-brand-primary/5]="getQuizAnswer(i) === 'B'"
                          class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                        >
                          <span>B. {{ q.optionB }}</span>
                          @if (getQuizAnswer(i) === 'B') {
                            <span class="text-brand-primary">✓</span>
                          }
                        </button>
                        <button
                          (click)="selectQuizOption(i, 'C')"
                          [class.border-brand-primary]="getQuizAnswer(i) === 'C'"
                          [class.bg-brand-primary/5]="getQuizAnswer(i) === 'C'"
                          class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                        >
                          <span>C. {{ q.optionC }}</span>
                          @if (getQuizAnswer(i) === 'C') {
                            <span class="text-brand-primary">✓</span>
                          }
                        </button>
                        <button
                          (click)="selectQuizOption(i, 'D')"
                          [class.border-brand-primary]="getQuizAnswer(i) === 'D'"
                          [class.bg-brand-primary/5]="getQuizAnswer(i) === 'D'"
                          class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                        >
                          <span>D. {{ q.optionD }}</span>
                          @if (getQuizAnswer(i) === 'D') {
                            <span class="text-brand-primary">✓</span>
                          }
                        </button>
                      </div>
                    }

                    <!-- FILL IN BLANK -->
                    @if (q.type === 'FILL_IN_BLANK') {
                      <div class="space-y-2">
                        <input
                          type="text"
                          [value]="getQuizAnswer(i) || ''"
                          (input)="onFillInBlankInput(i, $event)"
                          placeholder="Gõ đáp án của bạn tại đây (ví dụ: consolidate)..."
                          class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-2.5 text-xs text-text-main placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all font-semibold"
                        />
                      </div>
                    }

                    <!-- WORD MATCHING -->
                    @if (q.type === 'WORD_MATCHING' && matchingData[i]) {
                      <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                          <!-- English Words (Left) -->
                          <div class="space-y-2">
                            <p class="text-xxs font-bold text-text-muted uppercase tracking-wider text-[9px] text-center font-bold">Tiếng Anh</p>
                            @for (item of matchingData[i].eng; track item.word) {
                              <button
                                (click)="selectEngWord(i, item.word)"
                                [disabled]="item.matched"
                                [class.border-green-500]="item.matched"
                                [class.bg-green-500/10]="item.matched"
                                [class.text-green-500]="item.matched"
                                [class.border-brand-primary]="matchingData[i].selectedEng === item.word"
                                [class.bg-brand-primary/5]="matchingData[i].selectedEng === item.word"
                                class="w-full bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2 text-center text-xs font-semibold transition-all cursor-pointer disabled:cursor-default"
                              >
                                {{ item.word }} {{ item.matched ? '✓' : '' }}
                              </button>
                            }
                          </div>

                          <!-- Vietnamese Meanings (Right) -->
                          <div class="space-y-2">
                            <p class="text-xxs font-bold text-text-muted uppercase tracking-wider text-[9px] text-center font-bold">Tiếng Việt</p>
                            @for (item of matchingData[i].vie; track item.text) {
                              <button
                                (click)="selectVieText(i, item.text)"
                                [disabled]="item.matched"
                                [class.border-green-500]="item.matched"
                                [class.bg-green-500/10]="item.matched"
                                [class.text-green-500]="item.matched"
                                [class.border-brand-primary]="matchingData[i].selectedVie === item.text"
                                [class.bg-brand-primary/5]="matchingData[i].selectedVie === item.text"
                                class="w-full bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2 text-center text-xs font-semibold transition-all cursor-pointer disabled:cursor-default"
                              >
                                {{ item.text }} {{ item.matched ? '✓' : '' }}
                              </button>
                            }
                          </div>
                        </div>

                        <!-- Reset / Show Current Pairs -->
                        <div class="flex justify-between items-center text-xxs text-[10px] text-text-muted">
                          <span>
                            Đã ghép: {{ getPairsCount(i) }} / {{ matchingData[i].eng.length }} cặp
                          </span>
                          <button
                            (click)="resetMatching(i)"
                            class="text-brand-accent hover:underline cursor-pointer font-bold"
                          >
                            Làm lại ↺
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Submit Quiz -->
              <div class="pt-4 border-t border-border-main">
                <button
                  (click)="submitQuiz()"
                  [disabled]="!allQuizQuestionsAnswered()"
                  class="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-brand-primary/10 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Nộp Bài Quiz & Đánh Giá 🎯
                </button>
              </div>

            </div>
          }

          <!-- QUIZ COMPLETED / RESULTS REVIEW VIEW -->
          @if (studyState() === 'quiz_completed') {
            <div class="space-y-6">
              
              <!-- Score Box -->
              <div class="text-center py-4 bg-bg-input border border-border-main rounded-2xl">
                <span class="text-xxs font-bold text-brand-primary uppercase tracking-widest text-[10px]">
                  Kết quả hoàn thành
                </span>
                <h3 class="text-3xl font-black text-text-main mt-1">
                  Chính xác: {{ correctQuizAnswersCount }} / {{ quizQuestions.length }}
                </h3>
                <p class="text-xs text-text-muted mt-2">
                  Xem lại lời giải chi tiết cho các câu sai ở dưới trước khi nhận phần thưởng.
                </p>
              </div>

              <!-- Detailed Answers review -->
              <div class="space-y-4 max-h-[18rem] overflow-y-auto pr-1">
                @for (q of quizQuestions; track q.id; let i = $index) {
                  <div
                    [ngClass]="{
                      'border-green-500/30 bg-green-500/5': isAnswerCorrect(i),
                      'border-red-500/30 bg-red-500/5': !isAnswerCorrect(i)
                    }"
                    class="p-4 border rounded-xl space-y-2"
                  >
                    <div class="flex justify-between items-center">
                      <span class="text-xs font-bold text-text-main">Câu {{ i + 1 }}</span>
                      <span
                        [ngClass]="{
                          'text-green-500 bg-green-500/10': isAnswerCorrect(i),
                          'text-red-500 bg-red-500/10': !isAnswerCorrect(i)
                        }"
                        class="text-[10px] px-2 py-0.5 rounded font-extrabold"
                      >
                        {{ isAnswerCorrect(i) ? 'ĐÚNG ✓' : 'SAI ✗' }}
                      </span>
                    </div>

                    <p class="text-xs text-text-muted italic leading-relaxed">
                      "{{ q.questionText }}"
                    </p>

                    @if (q.type === 'WORD_MATCHING') {
                      <div class="text-xs space-y-1">
                        <p class="text-text-main font-semibold">Các cặp ghép của bạn:</p>
                        <div class="grid grid-cols-2 gap-1 text-[11px] text-text-muted pl-2">
                          @for (pair of getMatchingPairsList(i); track pair.eng) {
                            <div>{{ pair.eng }} &rarr; <span class="text-brand-accent font-semibold">{{ pair.vie }}</span></div>
                          }
                        </div>
                      </div>
                    } @else {
                      <p class="text-xs text-text-main font-semibold">
                        Đáp án của bạn: <strong class="text-brand-accent">{{ getQuizAnswer(i) }}</strong> | Đáp án đúng: <strong class="text-green-500">{{ getCorrectOptionText(q) }}</strong>
                      </p>
                    }

                    <div class="p-3 bg-bg-card border border-border-main rounded-lg text-xxs text-text-muted leading-relaxed text-[11px]">
                      <strong>Giải thích:</strong> {{ q.explanation }}
                    </div>
                  </div>
                }
              </div>

              <!-- Claim Rewards Trigger -->
              <div class="pt-4 border-t border-border-main flex gap-4">
                <button
                  (click)="claimRewards()"
                  [disabled]="isSubmittingReward()"
                  class="flex-1 relative overflow-hidden group bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  
                  <div class="relative flex items-center justify-center gap-2">
                    @if (isSubmittingReward()) {
                      <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang tính toán phần thưởng...</span>
                    } @else {
                      <span>Nhận Phần Thưởng & Lưu Tiến Trình 🏆</span>
                    }
                  </div>
                </button>
              </div>

            </div>
          }

          <!-- REWARDS & PROGRESSION VIEW -->
          @if (studyState() === 'rewards' && rewards()) {
            <div class="text-center py-6 space-y-6">
              
              <div class="space-y-1">
                <span class="text-xxs font-bold text-brand-accent uppercase tracking-widest text-[10px]">
                  Hoàn thành chương học
                </span>
                <h3 class="text-3xl font-black text-text-main">Phần Thưởng Đã Nhận!</h3>
              </div>

              <!-- Loot details -->
              <div class="flex justify-center gap-6 max-w-sm mx-auto">
                <div class="flex-1 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex flex-col items-center">
                  <span class="text-3xl">✨</span>
                  <span class="text-lg font-black text-yellow-500 mt-1">+{{ rewards()?.xpGained }} EXP</span>
                  <span class="text-[10px] text-text-muted mt-0.5">Kinh nghiệm</span>
                </div>
                <div class="flex-1 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col items-center">
                  <span class="text-3xl">🪙</span>
                  <span class="text-lg font-black text-amber-600 mt-1">+{{ rewards()?.coinsGained }} Xu</span>
                  <span class="text-[10px] text-text-muted mt-0.5">Tiền vàng</span>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="max-w-sm mx-auto space-y-2 pt-4">
                <div class="flex justify-between items-center text-xs font-bold">
                  <span>Cấp độ hiện tại: Cấp {{ rewards()?.newLevel }}</span>
                  <span class="text-text-muted">{{ rewards()?.newXp }} / {{ rewards()?.newLevel! * 100 }} EXP</span>
                </div>
                <div class="w-full h-3 bg-bg-input rounded-full overflow-hidden border border-border-main">
                  <div
                    [style.width.%]="(rewards()?.newXp! / (rewards()?.newLevel! * 100)) * 100"
                    class="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-1000"
                  ></div>
                </div>
                <p class="text-xxs text-text-muted text-[10px]">
                  Số dư tài khoản: <strong>{{ rewards()?.newCoins }} Xu</strong>
                </p>
              </div>

              <!-- Final action button -->
              <div class="pt-6 max-w-sm mx-auto">
                <a
                  routerLink="/roadmap"
                  class="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3.5 rounded-xl shadow-lg transition-all inline-block cursor-pointer"
                >
                  Quay Lại Lộ Trình Học 🗺️
                </a>
              </div>

            </div>
          }

        }

      </div>

      <!-- LEVEL UP CELEBRATION MODAL OVERLAY -->
      @if (showLevelUpModal() && rewards()) {
        <div class="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div class="relative w-full max-w-sm bg-gradient-to-b from-yellow-500/15 via-bg-card to-bg-card border border-yellow-500/30 rounded-2xl p-8 text-center shadow-2xl space-y-6 overflow-hidden animate-bounce-short">
            
            <!-- Radiating Sunburst background glow -->
            <div class="absolute inset-0 bg-radial-gradient-yellow pointer-events-none opacity-25"></div>

            <div class="space-y-2">
              <span class="text-5xl animate-bounce inline-block">👑</span>
              <h2 class="text-3xl font-black text-yellow-500 tracking-tight">THĂNG CẤP!</h2>
              <p class="text-xs text-text-muted uppercase tracking-widest font-bold">Level Up Promoted</p>
            </div>

            <!-- Promotion detail -->
            <div class="py-4 border-y border-border-main/50 space-y-3">
              <p class="text-sm text-text-muted">Bạn đã đạt đến cấp độ mới:</p>
              <div class="flex justify-center items-center gap-4">
                <span class="text-2xl font-black text-text-muted line-through">Lớp {{ rewards()?.previousLevel }}</span>
                <span class="text-3xl">&rarr;</span>
                <span class="text-4xl font-black text-yellow-500">Lớp {{ rewards()?.newLevel }}</span>
              </div>
              
              <!-- Title Evolution -->
              @if (rewards()?.newTitle; as title) {
                <div class="mt-4">
                  <p class="text-[11px] text-text-muted uppercase tracking-wider font-bold">Danh hiệu tiến hóa:</p>
                  <span class="bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 text-xs font-bold px-3 py-1 rounded-full inline-block mt-1 uppercase tracking-widest">
                    ⚔️ {{ title }} ⚔️
                  </span>
                </div>
              }
            </div>

            <p class="text-xs text-text-muted leading-relaxed">
              Tuyệt vời! Sức mạnh của bạn đã được gia tăng. Hãy tiếp tục học tập để chinh phục các vùng đất mới.
            </p>

            <button
              (click)="closeLevelUpModal()"
              class="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Tiếp tục hành trình 🚀
            </button>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .perspective {
      perspective: 1000px;
    }
    .flip-card-inner {
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .flipped {
      transform: rotateY(180deg);
    }
    .flip-card-front, .flip-card-back {
      backface-visibility: hidden;
      position: absolute;
      inset: 0;
    }
    .flip-card-back {
      transform: rotateY(180deg);
    }
    .bg-radial-gradient-yellow {
      background: radial-gradient(circle, rgba(234, 179, 8, 0.4) 0%, rgba(234, 179, 8, 0) 70%);
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
export class StudyComponent implements OnInit, OnDestroy {
  private readonly studyService = inject(StudyService);
  private readonly route = inject(ActivatedRoute);

  moduleId = 0;
  
  // States: 'learning' | 'quiz_completed' | 'rewards'
  studyState = signal<'learning' | 'quiz_completed' | 'rewards'>('learning');
  mode = signal<'flashcards' | 'quiz'>('flashcards');

  flashcards: Flashcard[] = [];
  quizQuestions: QuizQuestion[] = [];
  
  currentCardIndex = 0;
  isFlipped = false;

  // Selected answers for quiz
  userQuizAnswers: { [questionIndex: number]: string } = {};
  correctQuizAnswersCount = 0;

  // Word matching state
  matchingData: { [qIdx: number]: { eng: { word: string, matched: boolean }[], vie: { text: string, matched: boolean }[], selectedEng: string | null, selectedVie: string | null, pairs: { [eng: string]: string } } } = {};

  // Rewards detail
  rewards = signal<CompletionResult | null>(null);

  isLoading = signal(true);
  errorState = signal(false);
  isSubmittingReward = signal(false);
  showLevelUpModal = signal(false);

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('moduleId'));
    if (!this.moduleId) {
      this.errorState.set(true);
      this.isLoading.set(false);
    } else {
      this.loadModuleContent();
    }
  }

  ngOnDestroy(): void {
    window.speechSynthesis.cancel();
  }

  loadModuleContent(): void {
    this.isLoading.set(true);
    this.errorState.set(false);

    this.studyService.getModuleContent(this.moduleId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        if (data && data.flashcards && data.quizQuestions) {
          this.flashcards = data.flashcards;
          this.quizQuestions = data.quizQuestions;
          this.initializeMatchingData();
        } else {
          this.errorState.set(true);
        }
      },
      error: (err) => {
        console.error('Error loading module content', err);
        this.isLoading.set(false);
        this.errorState.set(true);
      }
    });
  }

  setMode(m: 'flashcards' | 'quiz'): void {
    this.isFlipped = false;
    this.mode.set(m);
  }

  currentCard(): Flashcard {
    return this.flashcards[this.currentCardIndex];
  }

  prevCard(): void {
    if (this.currentCardIndex > 0) {
      this.isFlipped = false;
      this.currentCardIndex--;
    }
  }

  nextCard(): void {
    if (this.currentCardIndex < this.flashcards.length - 1) {
      this.isFlipped = false;
      this.currentCardIndex++;
    }
  }

  speakWord(event: Event, word: string): void {
    event.stopPropagation(); // Avoid flipping card when clicking speaker
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  getQuizAnswer(idx: number): string | null {
    return this.userQuizAnswers[idx] || null;
  }

  selectQuizOption(idx: number, option: string): void {
    this.userQuizAnswers[idx] = option;
  }

  allQuizQuestionsAnswered(): boolean {
    return Object.keys(this.userQuizAnswers).length === this.quizQuestions.length;
  }

  initializeMatchingData(): void {
    this.matchingData = {};
    this.quizQuestions.forEach((q, idx) => {
      if (q.type === 'WORD_MATCHING') {
        const engList = q.optionA.split('|').map(w => ({ word: w.trim(), matched: false }));
        const rawVie = q.optionB.split('|');
        const vieList = rawVie.map(t => ({ text: t.trim(), matched: false })).sort(() => Math.random() - 0.5);
        this.matchingData[idx] = {
          eng: engList,
          vie: vieList,
          selectedEng: null,
          selectedVie: null,
          pairs: {}
        };
      }
    });
  }

  onFillInBlankInput(idx: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (val.trim()) {
      this.userQuizAnswers[idx] = val;
    } else {
      delete this.userQuizAnswers[idx];
    }
  }

  selectEngWord(qIdx: number, word: string): void {
    const data = this.matchingData[qIdx];
    if (!data) return;
    if (data.selectedEng === word) {
      data.selectedEng = null;
      return;
    }
    data.selectedEng = word;
    this.checkAndMatch(qIdx);
  }

  selectVieText(qIdx: number, text: string): void {
    const data = this.matchingData[qIdx];
    if (!data) return;
    if (data.selectedVie === text) {
      data.selectedVie = null;
      return;
    }
    data.selectedVie = text;
    this.checkAndMatch(qIdx);
  }

  checkAndMatch(qIdx: number): void {
    const data = this.matchingData[qIdx];
    if (!data || !data.selectedEng || !data.selectedVie) return;

    const eng = data.selectedEng;
    const vie = data.selectedVie;

    data.pairs[eng] = vie;

    const engItem = data.eng.find(item => item.word === eng);
    if (engItem) engItem.matched = true;

    const vieItem = data.vie.find(item => item.text === vie);
    if (vieItem) vieItem.matched = true;

    data.selectedEng = null;
    data.selectedVie = null;

    const totalPairsCount = data.eng.length;
    const matchedPairsCount = Object.keys(data.pairs).length;
    if (matchedPairsCount === totalPairsCount) {
      this.userQuizAnswers[qIdx] = 'COMPLETED';
    }
  }

  resetMatching(qIdx: number): void {
    const data = this.matchingData[qIdx];
    if (!data) return;
    data.selectedEng = null;
    data.selectedVie = null;
    data.pairs = {};
    data.eng.forEach(item => item.matched = false);
    data.vie.forEach(item => item.matched = false);
    delete this.userQuizAnswers[qIdx];
  }

  getPairsCount(qIdx: number): number {
    return this.matchingData[qIdx] ? Object.keys(this.matchingData[qIdx].pairs).length : 0;
  }

  getMatchingPairsList(qIdx: number): { eng: string, vie: string }[] {
    const data = this.matchingData[qIdx];
    if (!data) return [];
    return Object.entries(data.pairs).map(([eng, vie]) => ({ eng, vie }));
  }

  getCorrectOptionText(q: QuizQuestion): string {
    if (q.type === 'FILL_IN_BLANK') {
      const correctLetter = q.correctAnswer.trim().toUpperCase();
      if (correctLetter === 'A') return q.optionA;
      if (correctLetter === 'B') return q.optionB;
      if (correctLetter === 'C') return q.optionC;
      if (correctLetter === 'D') return q.optionD;
      return q.correctAnswer;
    }
    return q.correctAnswer;
  }

  isWordMatchingCorrect(qIdx: number): boolean {
    const q = this.quizQuestions[qIdx];
    const data = this.matchingData[qIdx];
    if (!data) return false;

    const correctPairs: { [key: string]: string } = {};
    q.correctAnswer.split('|').forEach(pairStr => {
      const parts = pairStr.split(':');
      if (parts.length === 2) {
        correctPairs[parts[0].trim()] = parts[1].trim();
      }
    });

    const userPairs = data.pairs;
    const keys = Object.keys(correctPairs);
    if (keys.length === 0) return false;
    for (let key of keys) {
      if (userPairs[key] !== correctPairs[key]) {
        return false;
      }
    }
    return true;
  }

  submitQuiz(): void {
    if (!this.allQuizQuestionsAnswered()) return;

    let correct = 0;
    for (let i = 0; i < this.quizQuestions.length; i++) {
      if (this.isAnswerCorrect(i)) {
        correct++;
      }
    }
    this.correctQuizAnswersCount = correct;
    this.studyState.set('quiz_completed');
  }

  isAnswerCorrect(idx: number): boolean {
    const q = this.quizQuestions[idx];
    if (q.type === 'WORD_MATCHING') {
      return this.isWordMatchingCorrect(idx);
    } else if (q.type === 'FILL_IN_BLANK') {
      const answer = this.userQuizAnswers[idx] || '';
      const correctLetter = q.correctAnswer.trim().toUpperCase();
      let correctText = '';
      if (correctLetter === 'A') correctText = q.optionA;
      else if (correctLetter === 'B') correctText = q.optionB;
      else if (correctLetter === 'C') correctText = q.optionC;
      else if (correctLetter === 'D') correctText = q.optionD;
      if (!correctText) correctText = q.correctAnswer;

      return answer.trim().toLowerCase() === correctText.trim().toLowerCase() ||
             answer.trim().toUpperCase() === correctLetter;
    } else {
      return q.correctAnswer.trim().equalsIgnoreCase(this.userQuizAnswers[idx]?.trim() || '');
    }
  }

  claimRewards(): void {
    this.isSubmittingReward.set(true);
    this.studyService.completeModule(this.moduleId, this.correctQuizAnswersCount).subscribe({
      next: (res) => {
        this.isSubmittingReward.set(false);
        this.rewards.set(res);
        this.studyState.set('rewards');
        
        // If they leveled up, trigger level up popup
        if (res.leveledUp) {
          this.showLevelUpModal.set(true);
        }
      },
      error: (err) => {
        console.error('Error claiming module rewards', err);
        alert('Lỗi lưu phần thưởng lên máy chủ. Vui lòng thử lại.');
        this.isSubmittingReward.set(false);
      }
    });
  }

  closeLevelUpModal(): void {
    this.showLevelUpModal.set(false);
  }
}

// Simple polyfill interface update for compilation helper
declare global {
  interface String {
    equalsIgnoreCase(other: string): boolean;
  }
}

// Add simple equalsIgnoreCase to JS prototype if it doesn't exist
if (!String.prototype.equalsIgnoreCase) {
  String.prototype.equalsIgnoreCase = function(other: string): boolean {
    return this.toLowerCase() === other.toLowerCase();
  };
}
