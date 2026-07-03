import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReadingService, ReadingArticleDetails, ReadingQuestion, RewardResult } from '../../../services/reading.service';
import { UserWordService, UserWord } from '../../../services/user-word.service';
import { ToastService } from '../../../services/toast.service';


interface DictionaryEntry {
  word: string;
  phonetic: string;
  meaning: string;
}

@Component({
  selector: 'app-reading-study',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-6 flex flex-col relative overflow-hidden transition-colors duration-300 select-none">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Layout Wrapper -->
      <div class="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        
        <!-- ==================================================================== -->
        <!-- LEFT COLUMN: ARTICLE PASSAGE (7 cols)                               -->
        <!-- ==================================================================== -->
        <div class="lg:col-span-7 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 md:p-6 shadow-md flex flex-col justify-between h-[calc(100vh-6.5rem)] overflow-hidden">
          
          <div class="space-y-4 flex-1 overflow-y-auto pr-1">
            <!-- Header bar inside left side -->
            <div class="flex flex-col sm:flex-row justify-between sm:items-center border-b border-border-main/40 pb-3 gap-2 shrink-0">
              <h2 class="text-base font-black text-text-main flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text shrink-0"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> {{ articleTitle() }}
              </h2>
              
              <div class="flex items-center gap-2 font-bold text-[10px]">
                <button
                  (click)="toggleBilingual()"
                  [class.bg-brand-primary]="isBilingual()"
                  [class.text-white]="isBilingual()"
                  [class.bg-bg-input]="!isBilingual()"
                  class="px-2.5 py-1.5 border border-border-main rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                >
                  <span>*A</span> Song ngữ
                </button>
                <button
                  (click)="toggleVocab()"
                  [class.bg-brand-primary]="isVocabHighlighted()"
                  [class.text-bg-main]="isVocabHighlighted()"
                  [class.bg-bg-input]="!isVocabHighlighted()"
                  class="px-2.5 py-1.5 border border-border-main rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                  Từ vựng
                </button>
                <span class="px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md uppercase tracking-wider font-extrabold text-[9px]">
                  Level {{ articleLevel() }} - {{ isBasicLevel(articleLevel()) ? 'Cơ bản' : 'Nâng cao' }}
                </span>
              </div>
            </div>

            <!-- Passage English Content with Optional Translations & Vocabulary triggers -->
            <div class="space-y-4 leading-relaxed text-xs md:text-sm font-medium pt-2">
              @for (line of passageLines(); track $index; let idx = $index) {
                <div class="space-y-1.5">
                  <!-- English sentence -->
                  <p class="text-text-main font-semibold">
                    @if (isVocabHighlighted()) {
                      <!-- Parse line to check key vocabs -->
                      @for (token of parseWords(line.eng); track $index) {
                        @if (token.isVocab) {
                          <span 
                            (click)="lookupWord(token.clean)"
                            class="bg-brand-secondary/10 border-b-2 border-brand-secondary text-brand-secondary px-1 font-bold cursor-help rounded-sm hover:bg-brand-secondary/20 transition-colors inline-block"
                          >
                            {{ token.raw }}
                          </span>
                        } @else {
                          <span>{{ token.raw }}</span>
                        }
                        <span> </span>
                      }
                    } @else {
                      {{ line.eng }}
                    }
                  </p>
                  
                  <!-- Bilingual Translation -->
                  @if (isBilingual()) {
                    <p class="text-xxs md:text-xs text-text-muted italic leading-normal pb-2 border-b border-border-main/20">
                      {{ line.vie }}
                    </p>
                  }
                </div>
              }
            </div>

            <!-- Dictionary Popover Definition Card -->
            @if (activeLookup()) {
              <div class="mt-6 p-4 bg-bg-input/60 border border-brand-secondary/20 rounded-2xl animate-fade-in space-y-1.5 relative shadow-inner shrink-0">
                <button 
                  (click)="activeLookup.set(null)" 
                  class="absolute right-3 top-3 text-[10px] text-text-muted hover:text-text-main font-bold"
                >
                  ✕
                </button>
                <div class="flex justify-between items-center pr-6">
                  <div class="flex items-baseline gap-2">
                    <span class="text-xs font-black text-brand-secondary">{{ activeLookup()?.word }}</span>
                    <span class="text-[9px] text-text-muted font-mono">{{ activeLookup()?.phonetic }}</span>
                  </div>
                  <button
                    (click)="toggleSaveLookupWord($event)"
                    class="w-7 h-7 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    [title]="isLookupWordSaved() ? 'Bỏ lưu sổ tay' : 'Lưu vào sổ tay'"
                  >
                    @if (isLookupWordSaved()) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    }
                  </button>
                </div>
                <p class="text-[11px] text-text-main font-bold leading-normal flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  Nghĩa: <span class="text-text-main font-black">{{ activeLookup()?.meaning }}</span>
                </p>

                @if (isLookupWordSaved()) {
                  <div class="mt-2 p-3 bg-yellow-500/5 dark:bg-yellow-500/10 border border-dashed border-yellow-500/30 rounded-xl text-left space-y-1.5">
                    <div class="flex justify-between items-center">
                      <label class="text-[9px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> Ghi chú sổ tay:
                      </label>
                      @if (isNotesSaving()) {
                        <span class="text-[8px] text-text-muted animate-pulse">Đang lưu...</span>
                      }
                    </div>
                    <textarea
                      [(ngModel)]="lookupWordNotes"
                      (ngModelChange)="onLookupNotesChange()"
                      placeholder="Ghi chú nhanh..."
                      rows="2"
                      class="w-full bg-bg-card border border-border-main rounded-lg px-2.5 py-1.5 text-xxs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                    ></textarea>
                  </div>
                }
              </div>
            }

          </div>

          <!-- Back button -->
          <div class="pt-4 border-t border-border-main/40 mt-4 shrink-0 flex items-center gap-3">

            <button 
              (click)="goBack()" 
              class="btn-back border-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Danh sách bài đọc
            </button>
          </div>

        </div>

        <!-- ==================================================================== -->
        <!-- RIGHT COLUMN: QUIZ QUESTIONS (5 cols)                                -->
        <!-- ==================================================================== -->
        <div class="lg:col-span-5 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 md:p-6 shadow-md flex flex-col justify-between h-[calc(100vh-6.5rem)] overflow-hidden">
          
          <!-- Top Stats Bar inside right side -->
          <div class="border-b border-border-main/55 pb-3 mb-4 flex justify-between items-center shrink-0">
            <h3 class="text-xs font-black text-text-muted uppercase tracking-widest">
              Câu hỏi ({{ questions().length }})
            </h3>
            
            <div class="text-[10px] font-black text-text-muted bg-bg-input border border-border-main px-2.5 py-1 rounded-lg flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              XP Tích Lũy
            </div>
          </div>

          <!-- Questions Scrollable Container -->
          <div class="flex-1 overflow-y-auto space-y-6 pr-1 min-h-0 scrollbar-thin">
            @for (q of questions(); track q.id; let qIdx = $index) {
              <div class="space-y-3 p-4 bg-bg-input/20 border border-border-main/60 rounded-2xl shadow-sm">
                <!-- Question Title -->
                <h4 class="text-xs font-black text-text-main flex items-start gap-1">
                  <span>Q{{ qIdx + 1 }}.</span>
                  <span>{{ q.questionText }}</span>
                </h4>

                <!-- Options -->
                <div class="space-y-2">
                  <!-- Option A -->
                  <button
                    (click)="submitAnswerOption(q, 'A')"
                    [disabled]="q.isCorrect || q.isSubmitted"
                    [class.border-green-500]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'A'"
                    [class.bg-green-500/10]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'A'"
                    [class.text-green-500]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'A'"
                    [class.border-red-500]="q.isSubmitted && q.selectedAnswer === 'A' && q.correctOption !== 'A'"
                    [class.bg-red-500/10]="q.isSubmitted && q.selectedAnswer === 'A' && q.correctOption !== 'A'"
                    [class.text-red-500]="q.isSubmitted && q.selectedAnswer === 'A' && q.correctOption !== 'A'"
                    [class.border-border-main]="q.selectedAnswer !== 'A' && (!q.isSubmitted || q.correctOption !== 'A')"
                    class="w-full p-2.5 rounded-xl border hover:border-brand-primary/40 text-left text-xxs font-semibold transition-all cursor-pointer flex justify-between items-center text-text-main active:scale-98 disabled:pointer-events-none"
                  >
                    <span>A. {{ q.optionA }}</span>
                    @if ((q.isCorrect || q.isSubmitted) && q.correctOption === 'A') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                    }
                    @if (q.isSubmitted && q.selectedAnswer === 'A' && q.correctOption !== 'A') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-red-500 shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    }
                  </button>

                  <!-- Option B -->
                  <button
                    (click)="submitAnswerOption(q, 'B')"
                    [disabled]="q.isCorrect || q.isSubmitted"
                    [class.border-green-500]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'B'"
                    [class.bg-green-500/10]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'B'"
                    [class.text-green-500]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'B'"
                    [class.border-red-500]="q.isSubmitted && q.selectedAnswer === 'B' && q.correctOption !== 'B'"
                    [class.bg-red-500/10]="q.isSubmitted && q.selectedAnswer === 'B' && q.correctOption !== 'B'"
                    [class.text-red-500]="q.isSubmitted && q.selectedAnswer === 'B' && q.correctOption !== 'B'"
                    [class.border-border-main]="q.selectedAnswer !== 'B' && (!q.isSubmitted || q.correctOption !== 'B')"
                    class="w-full p-2.5 rounded-xl border hover:border-brand-primary/40 text-left text-xxs font-semibold transition-all cursor-pointer flex justify-between items-center text-text-main active:scale-98 disabled:pointer-events-none"
                  >
                    <span>B. {{ q.optionB }}</span>
                    @if ((q.isCorrect || q.isSubmitted) && q.correctOption === 'B') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                    }
                    @if (q.isSubmitted && q.selectedAnswer === 'B' && q.correctOption !== 'B') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-red-500 shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    }
                  </button>

                  <!-- Option C -->
                  <button
                    (click)="submitAnswerOption(q, 'C')"
                    [disabled]="q.isCorrect || q.isSubmitted"
                    [class.border-green-500]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'C'"
                    [class.bg-green-500/10]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'C'"
                    [class.text-green-500]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'C'"
                    [class.border-red-500]="q.isSubmitted && q.selectedAnswer === 'C' && q.correctOption !== 'C'"
                    [class.bg-red-500/10]="q.isSubmitted && q.selectedAnswer === 'C' && q.correctOption !== 'C'"
                    [class.text-red-500]="q.isSubmitted && q.selectedAnswer === 'C' && q.correctOption !== 'C'"
                    [class.border-border-main]="q.selectedAnswer !== 'C' && (!q.isSubmitted || q.correctOption !== 'C')"
                    class="w-full p-2.5 rounded-xl border hover:border-brand-primary/40 text-left text-xxs font-semibold transition-all cursor-pointer flex justify-between items-center text-text-main active:scale-98 disabled:pointer-events-none"
                  >
                    <span>C. {{ q.optionC }}</span>
                    @if ((q.isCorrect || q.isSubmitted) && q.correctOption === 'C') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                    }
                    @if (q.isSubmitted && q.selectedAnswer === 'C' && q.correctOption !== 'C') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-red-500 shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    }
                  </button>

                  <!-- Option D -->
                  <button
                    (click)="submitAnswerOption(q, 'D')"
                    [disabled]="q.isCorrect || q.isSubmitted"
                    [class.border-green-500]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'D'"
                    [class.bg-green-500/10]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'D'"
                    [class.text-green-500]="(q.isCorrect || q.isSubmitted) && q.correctOption === 'D'"
                    [class.border-red-500]="q.isSubmitted && q.selectedAnswer === 'D' && q.correctOption !== 'D'"
                    [class.bg-red-500/10]="q.isSubmitted && q.selectedAnswer === 'D' && q.correctOption !== 'D'"
                    [class.text-red-500]="q.isSubmitted && q.selectedAnswer === 'D' && q.correctOption !== 'D'"
                    [class.border-border-main]="q.selectedAnswer !== 'D' && (!q.isSubmitted || q.correctOption !== 'D')"
                    class="w-full p-2.5 rounded-xl border hover:border-brand-primary/40 text-left text-xxs font-semibold transition-all cursor-pointer flex justify-between items-center text-text-main active:scale-98 disabled:pointer-events-none"
                  >
                    <span>D. {{ q.optionD }}</span>
                    @if ((q.isCorrect || q.isSubmitted) && q.correctOption === 'D') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                    }
                    @if (q.isSubmitted && q.selectedAnswer === 'D' && q.correctOption !== 'D') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-red-500 shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    }
                  </button>
                </div>

                <!-- Explanation Result -->
                  @if (q.isCorrect || q.isSubmitted) {
                    <div 
                      [class.bg-green-500/10]="q.isCorrect || q.selectedAnswer === q.correctOption"
                      [class.text-green-500]="q.isCorrect || q.selectedAnswer === q.correctOption"
                      [class.bg-red-500/10]="!q.isCorrect && q.selectedAnswer !== q.correctOption"
                      [class.text-red-500]="!q.isCorrect && q.selectedAnswer !== q.correctOption"
                      class="p-3 border border-transparent rounded-xl text-[10.5px] leading-relaxed animate-fade-in font-medium flex items-start gap-1.5"
                    >
                      @if (q.isCorrect || q.selectedAnswer === q.correctOption) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                        <span>Đúng! Giải thích: {{ q.explanation }}</span>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                        <span>Sai rồi! Đáp án đúng là {{ q.correctOption }}. Giải thích: {{ q.explanation }}</span>
                      }
                    </div>
                  }
              </div>
            }
          </div>

          <!-- Bottom Actions inside right side -->
          <div class="border-t border-border-main/40 pt-4 mt-4 flex justify-between items-center select-none shrink-0 font-bold text-xs">
            <div class="flex items-center gap-2">
              <button 
                (click)="prevArticle()"
                class="px-3 py-2 bg-bg-input border border-border-main text-text-muted hover:text-text-main rounded-xl cursor-pointer"
              >
                &larr; chuyển bài
              </button>
              
              <button 
                (click)="completeCurrentArticle()"
                [disabled]="isSubmitting() || isCompleted()"
                [class.bg-brand-primary]="!isCompleted()"
                [class.bg-bg-input]="isCompleted()"
                class="px-4 py-2 text-bg-main border border-border-main rounded-xl cursor-pointer active:scale-95 disabled:opacity-80 flex items-center justify-center gap-1.5"
              >
                @if (isCompleted()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-text-main"><path d="M20 6 9 17l-5-5"/></svg>
                  <span class="text-text-main">Đã hoàn thành</span>
                } @else {
                  Đánh dấu hoàn thành
                }
              </button>
            </div>

            <!-- Page indicator -->
            <div class="px-3 py-2 bg-bg-input border border-border-main rounded-xl flex items-center gap-1 shadow-sm text-xxs font-extrabold">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              {{ articleIndex() + 1 }}/{{ totalArticlesCount() }}
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .scrollbar-thin::-webkit-scrollbar {
      width: 4px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: var(--border-main);
      border-radius: 9px;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ReadingStudyComponent implements OnInit {
  private readonly readingService = inject(ReadingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userWordService = inject(UserWordService);
  private readonly toastService = inject(ToastService);

  savedWords = signal<UserWord[]>([]);
  lookupWordNotes = '';
  isNotesSaving = signal(false);
  private notesSaveTimeout: any = null;


  isRoadmap = false;
  roadmapId: number | null = null;
  articleId = 0;
  articleTitle = signal<string>('Article');
  articleLevel = signal<any>('A1');
  isCompleted = signal<boolean>(false);

  isBasicLevel(lvl: any): boolean {
    if (!lvl) return true;
    const l = String(lvl).toLowerCase().trim();
    return l === 'a1' || l === 'a2' || l === '1' || l === 'basic';
  }
  
  passageLines = signal<{ eng: string; vie: string }[]>([]);
  dictionary = signal<Record<string, DictionaryEntry>>({});
  
  questions = signal<ReadingQuestion[]>([]);
  
  isLoading = signal(true);
  isSubmitting = signal(false);

  // Toggles states
  isBilingual = signal<boolean>(true);
  isVocabHighlighted = signal<boolean>(true);
  activeLookup = signal<DictionaryEntry | null>(null);

  // Pagination helper list
  totalArticlesCount = signal<number>(1);
  articleIndex = signal<number>(0);
  allArticles = signal<any[]>([]);

  ngOnInit() {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    const isRoadmapParam = this.route.snapshot.queryParamMap.get('isRoadmap');
    const roadmapIdParam = this.route.snapshot.queryParamMap.get('roadmapId');
    this.isRoadmap = isRoadmapParam === 'true';
    if (roadmapIdParam) {
      this.roadmapId = Number(roadmapIdParam);
    }

    if (!this.articleId) {
      this.goBack();
    } else {
      this.loadSavedWords();
      this.loadContent();
    }
  }

  loadContent() {
    this.isLoading.set(true);
    this.activeLookup.set(null);

    // Fetch pagination info
    this.readingService.getArticles().subscribe({
      next: (list) => {
        this.allArticles.set(list);
        this.totalArticlesCount.set(list.length);
        const idx = list.findIndex(a => a.id === this.articleId);
        this.articleIndex.set(idx !== -1 ? idx : 0);
      }
    });

    // Fetch details
    this.readingService.getArticleDetails(this.articleId).subscribe({
      next: (art) => {
        this.articleTitle.set(art.title);
        this.articleLevel.set(art.level);
        this.isCompleted.set(art.isCompleted);
        
        // Parse raw description (stored in vietnameseContent) to extract translation and keywords
        let rawVie = art.vietnameseContent || '';
        let vieText = rawVie;
        let keywordsText = '';
        
        const keywordsIndex = rawVie.toLowerCase().indexOf('keywords:');
        if (keywordsIndex !== -1) {
          keywordsText = rawVie.substring(keywordsIndex + 9).trim();
          vieText = rawVie.substring(0, keywordsIndex).trim();
        }
        
        if (vieText.toLowerCase().startsWith('vietnamese translation:')) {
          vieText = vieText.substring(23).trim();
        }
        
        // Parse passage lines (by splitting newlines)
        const engLines = art.content ? art.content.split('\n').filter(l => l.trim().length > 0) : [];
        const vieLines = vieText ? vieText.split('\n').filter(l => l.trim().length > 0) : [];
        
        const lines: { eng: string; vie: string }[] = [];
        const maxLines = Math.max(engLines.length, vieLines.length);
        for (let i = 0; i < maxLines; i++) {
          lines.push({
            eng: engLines[i] || '',
            vie: vieLines[i] || ''
          });
        }
        this.passageLines.set(lines);

        // Parse vocabulary dictionary from raw comma-separated keywords
        const dict: Record<string, DictionaryEntry> = {};
        if (keywordsText) {
          const parts = keywordsText.split(',');
          parts.forEach(p => {
            const colon = p.indexOf(':');
            if (colon !== -1) {
              const wordPart = p.substring(0, colon).trim();
              const meaning = p.substring(colon + 1).trim();
              
              const parenStart = wordPart.indexOf('(');
              let word = wordPart;
              let phonetic = '';
              if (parenStart !== -1) {
                word = wordPart.substring(0, parenStart).trim();
                phonetic = wordPart.substring(parenStart).trim();
              }
              
              dict[word.toLowerCase().trim()] = {
                word: word,
                phonetic: phonetic,
                meaning: meaning
              };
            }
          });
        }
        this.dictionary.set(dict);

        // Setup questions
        this.questions.set((art.questions || []).map(q => ({
          ...q,
          selectedAnswer: '',
          isSubmitted: q.isCorrect // if already answered correctly in backend
        })));

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading article details', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleBilingual() {
    this.isBilingual.set(!this.isBilingual());
  }

  toggleVocab() {
    this.isVocabHighlighted.set(!this.isVocabHighlighted());
    if (!this.isVocabHighlighted()) {
      this.activeLookup.set(null);
    }
  }

  lookupWord(word: string) {
    const entry = this.dictionary()[word.toLowerCase().trim()];
    if (entry) {
      this.activeLookup.set(entry);
      this.updateLookupNotes();
    }
  }

  // Tokenize line to identify keywords to highlight
  parseWords(line: string) {
    const words = line.split(/\s+/);
    return words.map(w => {
      const clean = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase().trim();
      const isVocab = !!this.dictionary()[clean];
      return {
        raw: w,
        clean: clean,
        isVocab: isVocab
      };
    });
  }

  submitAnswerOption(question: ReadingQuestion, option: string) {
    if (question.isCorrect || question.isSubmitted) return;

    question.selectedAnswer = option;
    question.isSubmitted = true;

    this.readingService.submitAnswer(question.id, option).subscribe({
      next: (res) => {
        question.isCorrect = res.isCorrect;
        
        // Answer states are visual in the template now, no need for toast spam
      },
      error: (err) => {
        console.error('Error submitting answer', err);
      }
    });
  }

  completeCurrentArticle() {
    if (this.isSubmitting() || this.isCompleted()) return;

    this.isSubmitting.set(true);
    this.readingService.completeArticle(this.articleId).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.isCompleted.set(true);
        this.toastService.success(`🎉 Chúc mừng! Bạn đã hoàn thành bài đọc "${this.articleTitle()}" và nhận thêm +${res.xpGained} EXP & +${res.coinsGained} Coins!`);
        if (res.leveledUp) {
          this.toastService.success(`🎉 LÊN CẤP: Cấp ${res.newLevel} (Danh hiệu: ${res.newTitle})!`, 5000);
        }
        
        // Update local list
        const updated = this.allArticles().map(a => {
          if (a.id === this.articleId) {
            return { ...a, isCompleted: true };
          }
          return a;
        });
        this.allArticles.set(updated);
        this.goBack();
      },
      error: (err) => {
        console.error('Error completing article', err);
        this.isSubmitting.set(false);
        this.goBack();
      }
    });
  }

  goBack() {
    if (this.isRoadmap && this.roadmapId) {
      this.router.navigate(['/preset-roadmap', this.roadmapId]);
    } else {
      this.router.navigate(['/reading']);
    }
  }

  prevArticle() {
    const idx = this.articleIndex();
    if (idx > 0) {
      const prev = this.allArticles()[idx - 1];
      this.router.navigate(['/reading-study', prev.id]).then(() => {
        this.articleId = prev.id;
        this.loadContent();
      });
    }
  }

  nextArticle() {
    const idx = this.articleIndex();
    if (idx < this.allArticles().length - 1) {
      const next = this.allArticles()[idx + 1];
      this.router.navigate(['/reading-study', next.id]).then(() => {
        this.articleId = next.id;
        this.loadContent();
      });
    }
  }

  loadSavedWords(): void {
    this.userWordService.getUserWords().subscribe({
      next: (words: UserWord[]) => {
        this.savedWords.set(words);
        this.updateLookupNotes();
      },
      error: (err: any) => console.error('Error loading saved words', err)
    });
  }

  isLookupWordSaved(): boolean {
    const entry = this.activeLookup();
    if (!entry) return false;
    return this.savedWords().some(w => w.word.toLowerCase() === entry.word.toLowerCase());
  }

  toggleSaveLookupWord(event: Event): void {
    if (event) event.stopPropagation();
    const entry = this.activeLookup();
    if (!entry) return;

    const existing = this.savedWords().find(w => w.word.toLowerCase() === entry.word.toLowerCase());

    if (existing) {
      this.userWordService.deleteUserWord(existing.id).subscribe({
        next: () => {
          this.savedWords.set(this.savedWords().filter(w => w.id !== existing.id));
          this.lookupWordNotes = '';
        },
        error: (err: any) => console.error('Error deleting word', err)
      });
    } else {
      const payload = {
        word: entry.word,
        partOfSpeech: 'noun',
        definition: entry.meaning,
        phonetic: entry.phonetic || '',
        notes: ''
      };
      this.userWordService.saveUserWord(payload).subscribe({
        next: (saved: UserWord) => {
          this.savedWords.set([...this.savedWords(), saved]);
          this.lookupWordNotes = '';
        },
        error: (err: any) => console.error('Error saving word', err)
      });
    }
  }

  updateLookupNotes(): void {
    const entry = this.activeLookup();
    if (!entry) {
      this.lookupWordNotes = '';
      return;
    }
    const saved = this.savedWords().find(w => w.word.toLowerCase() === entry.word.toLowerCase());
    this.lookupWordNotes = saved ? (saved.notes || '') : '';
  }

  onLookupNotesChange(): void {
    const entry = this.activeLookup();
    if (!entry) return;

    const existing = this.savedWords().find(w => w.word.toLowerCase() === entry.word.toLowerCase());
    if (!existing) return;

    if (this.notesSaveTimeout) {
      clearTimeout(this.notesSaveTimeout);
    }

    this.isNotesSaving.set(true);
    this.notesSaveTimeout = setTimeout(() => {
      this.userWordService.updateUserWord(existing.id, { notes: this.lookupWordNotes }).subscribe({
        next: (updated: UserWord) => {
          this.savedWords.set(this.savedWords().map(w => w.id === updated.id ? updated : w));
          this.isNotesSaving.set(false);
        },
        error: (err: any) => {
          console.error('Error updating notes', err);
          this.isNotesSaving.set(false);
        }
      });
    }, 800);
  }
}
