import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListeningService, ListeningSection, ListeningQuestion, RewardResult } from '../../services/listening.service';
import { UserWordService, UserWord } from '../../services/user-word.service';
import { ToastService } from '../../services/toast.service';


interface WordToken {
  text: string;
  cleanText: string;
  isHiddenTarget: boolean;
  isRevealed: boolean;
}

interface DiffWord {
  word: string;
  isCorrect: boolean;
  userTyped: string;
}

@Component({
  selector: 'app-listening-study',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-3 md:p-6 flex flex-col relative overflow-hidden transition-colors duration-300 select-none">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Layout Wrapper -->
      <div class="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        
        <!-- ==================================================================== -->
        <!-- LEFT PANEL: SIDEBAR (3 cols)                                        -->
        <!-- ==================================================================== -->
        <div class="lg:col-span-3 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-4 shadow-md flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
          
          <!-- Topic Header -->
          <div class="border-b border-border-main/55 pb-3 mb-3 flex justify-between items-center shrink-0">
            <div>
              <h3 class="text-sm font-black text-text-main tracking-tight uppercase">{{ topicTitle() }}</h3>
              <p class="text-[10px] text-text-muted mt-0.5">{{ topicDescription() }}</p>
            </div>
            <a
              routerLink="/listening"
              class="p-1.5 bg-bg-input hover:bg-bg-card border border-border-main rounded-lg text-[10px] font-bold text-text-muted transition-all"
            >
              &larr; Đề nghe
            </a>
          </div>

          <!-- Section List Accordion -->
          <div class="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            @for (sec of sections(); track sec.id) {
              <div class="border border-border-main/50 rounded-xl overflow-hidden bg-bg-input/20">
                <!-- Accordion Header -->
                <button
                  (click)="toggleSectionExpand(sec.id)"
                  [class.bg-brand-primary/10]="activeSectionId() === sec.id"
                  [class.border-brand-primary/30]="activeSectionId() === sec.id"
                  class="w-full px-3 py-2.5 text-left font-bold text-xs flex justify-between items-center cursor-pointer transition-colors border-b border-border-main/30"
                >
                  <div class="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones shrink-0 text-text-muted"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                    <span>{{ sec.title }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] text-text-muted">{{ getCompletedCount(sec) }}/{{ sec.questionsCount }}</span>
                    @if (sec.isCompleted) {
                      <span class="text-green-500 text-[10px] flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                      </span>
                    }
                    <span class="text-[8px] text-text-muted">{{ expandedSections()[sec.id] ? '▼' : '▶' }}</span>
                  </div>
                </button>

                <!-- Accordion Content (Questions) -->
                @if (expandedSections()[sec.id]) {
                  <div class="p-1.5 space-y-1 bg-bg-card/40">
                    @for (q of sec.questions; track q.id) {
                      <button
                        (click)="selectQuestion(sec.id, q)"
                        [class.bg-brand-primary]="activeQuestionId() === q.id"
                        [class.text-white]="activeQuestionId() === q.id"
                        [class.hover:bg-bg-input]="activeQuestionId() !== q.id"
                        class="w-full text-left px-3 py-2 rounded-lg text-xxs font-bold transition-all cursor-pointer flex justify-between items-center"
                      >
                        <span class="truncate">Câu {{ q.questionNumber }}</span>
                        @if (q.isCompleted) {
                          <span [class.text-white]="activeQuestionId() === q.id" [class.text-green-500]="activeQuestionId() !== q.id" class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                          </span>
                        }
                      </button>
                    }
                  </div>
                }
              </div>
            }
          </div>

        </div>

        <!-- ==================================================================== -->
        <!-- RIGHT PANEL: INTERACTIVE STUDY INTERFACE (9 cols)                     -->
        <!-- ==================================================================== -->
        <div class="lg:col-span-9 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 md:p-6 shadow-md flex flex-col justify-between h-[calc(100vh-6rem)] overflow-hidden">
          
          <!-- Mode Tabs -->
          <div class="flex border-b border-border-main mb-4 select-none font-bold text-xs shrink-0">
            <button
              (click)="selectTab('check')"
              [class.border-b-2]="activeTab() === 'check'"
              [class.border-brand-primary]="activeTab() === 'check'"
              [class.text-text-main]="activeTab() === 'check'"
              [class.text-text-muted]="activeTab() !== 'check'"
              class="flex-1 py-3 text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye shrink-0"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Nghe Check
            </button>
            <button
              (click)="selectTab('dictation')"
              [class.border-b-2]="activeTab() === 'dictation'"
              [class.border-brand-primary]="activeTab() === 'dictation'"
              [class.text-text-main]="activeTab() === 'dictation'"
              [class.text-text-muted]="activeTab() !== 'dictation'"
              class="flex-1 py-3 text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-line shrink-0"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/><path d="m15 5 3 3"/></svg>
              Nghe Chép
            </button>
            <button
              (click)="selectTab('full')"
              [class.border-b-2]="activeTab() === 'full'"
              [class.border-brand-primary]="activeTab() === 'full'"
              [class.text-text-main]="activeTab() === 'full'"
              [class.text-text-muted]="activeTab() !== 'full'"
              class="flex-1 py-3 text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Nghe Full
            </button>
          </div>

          <!-- Question Content Box -->
          <div class="flex-1 overflow-y-auto space-y-6 min-h-0 pr-1 py-2">
            
            @if (isLoading()) {
              <div class="flex flex-col items-center justify-center py-24 space-y-4">
                <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-xs text-text-muted font-bold">Đang tải đề luyện nghe...</p>
              </div>
            } @else if (currentQuestion().id) {
              
              <!-- ========================================== -->
              <!-- 1. TAB: NGHE CHECK                         -->
              <!-- ========================================== -->
              @if (activeTab() === 'check') {
                <div class="space-y-6 animate-fade-in flex flex-col justify-between h-full">
                  
                  <!-- Audio Player Control Row -->
                  <div class="bg-bg-input/40 border border-border-main p-4 rounded-2xl flex justify-between items-center shadow-sm shrink-0">
                    <div class="flex items-center gap-3">
                      <button 
                        (click)="prevQuestion()"
                        class="p-2.5 bg-bg-input border border-border-main hover:bg-bg-card rounded-xl transition-all cursor-pointer text-xs"
                      >
                        ◀
                      </button>
                      <button
                        (click)="togglePlay()"
                        [class.bg-brand-primary]="!isPlaying()"
                        [class.bg-red-500]="isPlaying()"
                        class="w-10 h-10 rounded-full text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center text-xs"
                      >
                      {{ isPlaying() ? '⏸' : '▶' }}
                      </button>
                      <button 
                        (click)="nextQuestion()"
                        class="p-2.5 bg-bg-input border border-border-main hover:bg-bg-card rounded-xl transition-all cursor-pointer text-xs"
                      >
                        ▶
                      </button>
                    </div>

                    <div class="flex items-center gap-2 font-bold text-xxs">
                      <span class="text-text-muted">Tốc độ:</span>
                      <button 
                        (click)="cycleSpeed()"
                        class="px-2.5 py-1 bg-bg-input border border-border-main hover:bg-bg-card rounded-lg cursor-pointer"
                      >
                        {{ playbackSpeed() }}x
                      </button>
                      <button 
                        (click)="toggleLoop()"
                        [class.bg-brand-primary]="isLooping()"
                        [class.text-white]="isLooping()"
                        [class.bg-bg-input]="!isLooping()"
                        class="p-1 bg-bg-input border border-border-main hover:bg-bg-card rounded-lg cursor-pointer flex items-center gap-1 text-xxs font-bold"
                        title="Phát lặp lại"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                        Lặp
                      </button>
                      <button
                        (click)="toggleSaveCurrentSentence($event)"
                        class="p-1 w-8 h-8 rounded-lg bg-bg-input border border-border-main hover:bg-bg-card flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        [title]="isCurrentSentenceSaved() ? 'Bỏ lưu sổ tay' : 'Lưu câu thoại vào sổ tay'"
                      >
                        @if (isCurrentSentenceSaved()) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        }
                      </button>
                    </div>
                  </div>

                  <!-- Percentage difficulty -->
                  <div class="flex gap-2 items-center justify-center shrink-0">
                    <span class="text-xxs font-bold text-text-muted">Mức ẩn từ:</span>
                    <button 
                      (click)="setPercent(30)"
                      [class.bg-brand-primary]="percent() === 30"
                      [class.text-white]="percent() === 30"
                      [class.bg-bg-input]="percent() !== 30"
                      class="px-3 py-1.5 border border-border-main rounded-xl text-xxs font-bold cursor-pointer"
                    >
                      30%
                    </button>
                    <button 
                      (click)="setPercent(50)"
                      [class.bg-brand-primary]="percent() === 50"
                      [class.text-white]="percent() === 50"
                      [class.bg-bg-input]="percent() !== 50"
                      class="px-3 py-1.5 border border-border-main rounded-xl text-xxs font-bold cursor-pointer"
                    >
                      50%
                    </button>
                    <button 
                      (click)="setPercent(100)"
                      [class.bg-brand-primary]="percent() === 100"
                      [class.text-white]="percent() === 100"
                      [class.bg-bg-input]="percent() !== 100"
                      class="px-3 py-1.5 border border-border-main rounded-xl text-xxs font-bold cursor-pointer"
                    >
                      100%
                    </button>
                  </div>

                  <!-- Dictation Sentence Board -->
                  <div class="flex-1 bg-bg-input/20 border border-border-main rounded-2xl p-6 min-h-[140px] flex items-center justify-center flex-wrap gap-2 leading-relaxed">
                    @for (w of wordTokens(); track $index; let idx = $index) {
                      @if (w.isHiddenTarget && !w.isRevealed) {
                        <!-- Hidden card block -->
                        <button
                          (click)="revealWordAtIndex(idx)"
                          class="bg-brand-primary/10 border border-brand-primary/25 hover:border-brand-primary/50 text-brand-primary px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-sm min-w-[50px] text-center"
                        >
                          ?
                        </button>
                      } @else {
                        <!-- Revealed or normal text word -->
                        <span 
                          [class.bg-green-500/10]="w.isHiddenTarget && w.isRevealed"
                          [class.text-green-500]="w.isHiddenTarget && w.isRevealed"
                          [class.border]="w.isHiddenTarget && w.isRevealed"
                          [class.border-green-500/20]="w.isHiddenTarget && w.isRevealed"
                          class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          {{ w.text }}
                        </span>
                      }
                    }
                  </div>

                  <!-- Translation block -->
                  <div class="bg-brand-primary/5 border border-brand-primary/10 p-4 rounded-xl space-y-1 text-center shrink-0">
                    <span class="text-[9px] font-black uppercase text-brand-primary tracking-widest block">Dịch Nghĩa</span>
                    <p class="text-xs text-text-main font-bold italic">"{{ currentQuestion().translation }}"</p>
                  </div>

                  <!-- Sentence Notes Box -->
                  @if (isCurrentSentenceSaved()) {
                    <div class="p-4 bg-yellow-500/5 dark:bg-yellow-500/10 border-2 border-dashed border-yellow-500/30 rounded-2xl text-left animate-fade-in space-y-2 shrink-0">
                      <div class="flex justify-between items-center">
                        <label class="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> Ghi chú câu thoại sổ tay
                        </label>
                        @if (isSentenceNotesSaving()) {
                          <span class="text-[9px] text-text-muted animate-pulse">Đang lưu...</span>
                        }
                      </div>
                      <textarea
                        [(ngModel)]="sentenceNotes"
                        (ngModelChange)="onSentenceNotesChange()"
                        placeholder="Thêm ghi chú cá nhân..."
                        rows="2.5"
                        class="w-full bg-bg-card border border-border-main rounded-xl px-3 py-2 text-xs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                      ></textarea>
                    </div>
                  }

                  <!-- Bottom buttons & shortcuts hints -->
                  <div class="space-y-4 shrink-0">
                    <!-- Reveals Actions -->
                    <div class="flex gap-2 justify-center font-bold text-xxs">
                      <button (click)="revealCount(1)" class="px-3 py-2 bg-bg-input border border-border-main hover:bg-bg-card rounded-xl cursor-pointer flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        1 từ
                      </button>
                      <button (click)="revealCount(2)" class="px-3 py-2 bg-bg-input border border-border-main hover:bg-bg-card rounded-xl cursor-pointer flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        2 từ
                      </button>
                      <button (click)="revealCount(3)" class="px-3 py-2 bg-bg-input border border-border-main hover:bg-bg-card rounded-xl cursor-pointer flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        3 từ
                      </button>
                      <button (click)="revealAll()" class="px-3 py-2 bg-bg-input border border-border-main hover:bg-bg-card rounded-xl cursor-pointer">Tất cả</button>
                      <button (click)="resetHiddenTokens()" class="px-3 py-2 bg-bg-input border border-border-main hover:bg-bg-card rounded-xl text-text-muted cursor-pointer flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        Reset
                      </button>
                    </div>

                    <!-- Keyboard Shortcuts Hint -->
                    <div class="flex justify-center gap-4 text-[9px] text-text-muted italic border-t border-border-main/35 pt-2">
                      <span><kbd class="bg-bg-input border px-1.5 py-0.5 rounded">Ctrl</kbd> phát lại</span>
                      <span><kbd class="bg-bg-input border px-1.5 py-0.5 rounded">Tab</kbd> lật từ</span>
                      <span><kbd class="bg-bg-input border px-1.5 py-0.5 rounded">Enter</kbd> câu tiếp theo</span>
                    </div>
                  </div>

                </div>
              }

              <!-- ========================================== -->
              <!-- 2. TAB: NGHE CHÉP                          -->
              <!-- ========================================== -->
              @if (activeTab() === 'dictation') {
                <div class="space-y-5 animate-fade-in">
                  
                  <!-- Audio Player Control Row -->
                  <div class="bg-bg-input/40 border border-border-main p-4 rounded-2xl flex justify-between items-center shadow-sm shrink-0">
                    <div class="flex items-center gap-3">
                      <button
                        (click)="togglePlay()"
                        [class.bg-brand-primary]="!isPlaying()"
                        [class.bg-red-500]="isPlaying()"
                        class="w-10 h-10 rounded-full text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center text-xs"
                      >
                        {{ isPlaying() ? '⏸' : '▶' }}
                      </button>
                      <span class="text-[10px] text-text-muted italic">Nghe câu thoại và ghi chép lại</span>
                    </div>

                    <div class="flex items-center gap-2 font-bold text-xxs">
                      <span class="text-text-muted">Tốc độ:</span>
                      <button 
                        (click)="cycleSpeed()"
                        class="px-2.5 py-1 bg-bg-input border border-border-main hover:bg-bg-card rounded-lg cursor-pointer"
                      >
                        {{ playbackSpeed() }}x
                      </button>
                      <button
                        (click)="toggleSaveCurrentSentence($event)"
                        class="w-8 h-8 rounded-lg bg-bg-input border border-border-main hover:bg-bg-card flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        [title]="isCurrentSentenceSaved() ? 'Bỏ lưu sổ tay' : 'Lưu câu thoại vào sổ tay'"
                      >
                        @if (isCurrentSentenceSaved()) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        }
                      </button>
                    </div>
                  </div>

                  <!-- Text Area Input -->
                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Bản chép của bạn (English):</label>
                    <textarea
                      [(ngModel)]="dictationInput"
                      [disabled]="dictationChecked()"
                      placeholder="Gõ lại câu tiếng Anh bạn nghe được tại đây..."
                      class="w-full bg-bg-input border border-border-main rounded-2xl p-4 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary min-h-[90px] resize-none leading-relaxed"
                    ></textarea>
                  </div>

                  <!-- Sentence Notes Box for Dictation Tab -->
                  @if (isCurrentSentenceSaved()) {
                    <div class="p-4 bg-yellow-500/5 dark:bg-yellow-500/10 border-2 border-dashed border-yellow-500/30 rounded-2xl text-left animate-fade-in space-y-2 shrink-0">
                      <div class="flex justify-between items-center">
                        <label class="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> Ghi chú câu thoại sổ tay
                        </label>
                        @if (isSentenceNotesSaving()) {
                          <span class="text-[9px] text-text-muted animate-pulse">Đang lưu...</span>
                        }
                      </div>
                      <textarea
                        [(ngModel)]="sentenceNotes"
                        (ngModelChange)="onSentenceNotesChange()"
                        placeholder="Thêm ghi chú cá nhân..."
                        rows="2.5"
                        class="w-full bg-bg-card border border-border-main rounded-xl px-3 py-2 text-xs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                      ></textarea>
                    </div>
                  }

                  <!-- Action Buttons -->
                  <div class="flex gap-3 text-xs font-bold">
                    <button
                      (click)="checkDictation()"
                      [disabled]="dictationChecked() || !dictationInput().trim()"
                      class="flex-1 bg-brand-primary hover:opacity-90 text-white py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      Kiểm tra đáp án
                    </button>
                    <button
                      (click)="resetDictation()"
                      class="bg-bg-input border border-border-main text-text-muted py-2.5 px-4 rounded-xl hover:bg-bg-card transition-all cursor-pointer"
                    >
                      Làm lại
                    </button>
                  </div>

                  <!-- Checking Results Visualizer -->
                  @if (dictationChecked()) {
                    <div class="bg-bg-input/20 border border-border-main rounded-2xl p-5 space-y-4">
                      
                      <!-- Diff output -->
                      <div class="space-y-1.5">
                        <span class="text-[9px] font-black uppercase text-text-muted tracking-widest block">So sánh từng từ:</span>
                        <div class="flex flex-wrap gap-1 leading-relaxed">
                          @for (item of dictationDiff(); track $index) {
                            <span 
                              [class.text-green-500]="item.isCorrect" 
                              [class.bg-green-500/10]="item.isCorrect"
                              [class.text-red-500]="!item.isCorrect"
                              [class.bg-red-500/10]="!item.isCorrect"
                              [class.border]="true"
                              [class.border-green-500/20]="item.isCorrect"
                              [class.border-red-500/20]="!item.isCorrect"
                              class="px-2 py-1 rounded-lg text-xs font-bold"
                              [title]="!item.isCorrect && item.userTyped ? 'Bạn đã gõ: ' + item.userTyped : ''"
                            >
                              {{ item.word }}
                            </span>
                          }
                        </div>
                      </div>

                      <!-- Tip feedback -->
                      <div class="text-[10.5px] text-text-muted leading-relaxed font-bold border-t border-border-main/30 pt-3 flex gap-2 items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb shrink-0 mt-0.5"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                        <span>
                          Dịch nghĩa: <strong>"{{ currentQuestion().translation }}"</strong>
                        </span>
                      </div>

                    </div>
                  }

                </div>
              }

              <!-- ========================================== -->
              <!-- 3. TAB: NGHE FULL                          -->
              <!-- ========================================== -->
              @if (activeTab() === 'full') {
                <div class="space-y-4 animate-fade-in">
                  
                  <div class="flex justify-between items-center bg-bg-input/30 p-3 rounded-xl border border-border-main/50 shrink-0">
                    <span class="text-xxs font-bold text-text-muted">Tổng hợp danh sách các câu trong bài nghe</span>
                    <button
                      (click)="playAllSection()"
                      [class.bg-brand-primary]="!isPlayingAll()"
                      [class.bg-red-500]="isPlayingAll()"
                      class="px-4 py-2 text-white text-xxs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                      {{ isPlayingAll() ? 'Dừng phát' : 'Phát toàn bộ bài' }}
                    </button>
                  </div>

                  <div class="space-y-2.5 max-h-[26rem] overflow-y-auto pr-1">
                    @for (q of activeSectionQuestions(); track q.id) {
                      <div 
                        [class.border-brand-primary/30]="activeQuestionId() === q.id"
                        [class.bg-brand-primary/5]="activeQuestionId() === q.id"
                        class="p-3 bg-bg-input/20 border border-border-main rounded-xl flex justify-between items-center hover:border-brand-primary/20 transition-all"
                      >
                        <div class="space-y-1.5 max-w-[85%]">
                          <div class="flex items-center gap-2">
                            <span class="text-[10px] font-black text-brand-primary px-1.5 py-0.5 rounded bg-brand-primary/10">Câu {{ q.questionNumber }}</span>
                            <span class="text-xs font-black text-text-main">{{ q.text }}</span>
                          </div>
                          <p class="text-xxs text-text-muted italic">"{{ q.translation }}"</p>
                        </div>
                        <button
                          (click)="speakWord(q.text)"
                          class="w-8 h-8 rounded-lg bg-bg-input border border-border-main hover:bg-brand-primary hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Phát âm câu này"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                        </button>
                      </div>
                    }
                  </div>

                </div>
              }

            } @else {
              <!-- Empty state / error -->
              <div class="text-center py-20 space-y-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle mx-auto text-text-muted"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                <h4 class="text-xs font-bold text-text-main">Không có câu hỏi trong đề này</h4>
                <p class="text-text-muted text-xxs">Đề luyện nghe chưa được thiết lập dữ liệu câu hỏi.</p>
              </div>
            }

          </div>

          <!-- Bottom Footer Action Bar -->
          @if (currentQuestion().id) {
            <div class="border-t border-border-main/40 pt-4 mt-4 flex gap-4 font-bold text-xs shrink-0 select-none">
              <button
                (click)="completeCurrentQuestion()"
                [disabled]="isSubmitting() || currentQuestion().isCompleted"
                [class.bg-brand-primary]="!currentQuestion().isCompleted"
                [class.bg-bg-input]="currentQuestion().isCompleted"
                class="flex-1 text-text-main border border-border-main py-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-98 text-center flex items-center justify-center gap-1.5 disabled:opacity-85"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                <span class="text-bg-main">{{ currentQuestion().isCompleted ? 'Đã Hoàn Thành' : 'Hoàn Thành' }}</span>
              </button>
              <button
                (click)="nextQuestion()"
                class="bg-bg-input border border-border-main text-text-muted hover:text-text-main px-6 py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                Tiếp tục &rarr;
              </button>
            </div>
          }

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
export class ListeningStudyComponent implements OnInit, OnDestroy {
  private readonly listeningService = inject(ListeningService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userWordService = inject(UserWordService);
  private readonly toastService = inject(ToastService);

  savedWords = signal<UserWord[]>([]);
  sentenceNotes = '';
  isSentenceNotesSaving = signal(false);
  private sentenceNotesTimeout: any = null;


  topicId = 0;
  topicTitle = signal<string>('Test');
  topicDescription = signal<string>('Listening set');

  sections = signal<ListeningSection[]>([]);
  activeSectionId = signal<number>(0);
  activeQuestionId = signal<number>(0);

  isLoading = signal(true);
  isSubmitting = signal(false);

  activeTab = signal<'check' | 'dictation' | 'full'>('check');

  // Accordion Expand/Collapse map
  expandedSections = signal<{ [key: number]: boolean }>({});

  // Tab Check details
  playbackSpeed = signal<number>(1.0);
  isLooping = signal<boolean>(false);
  isPlaying = signal<boolean>(false);
  percent = signal<number>(50);

  wordTokens = signal<WordToken[]>([]);

  // Tab Dictation details
  dictationInput = signal<string>('');
  dictationChecked = signal<boolean>(false);
  dictationDiff = signal<DiffWord[]>([]);

  // Tab Full details
  isPlayingAll = signal<boolean>(false);
  private allPlayTimeout: any;

  // Active items helpers
  activeSection = computed(() => {
    return this.sections().find(s => s.id === this.activeSectionId());
  });

  activeSectionQuestions = computed(() => {
    const sec = this.activeSection();
    return sec ? sec.questions : [];
  });

  currentQuestionIndex = computed(() => {
    const list = this.activeSectionQuestions();
    return list.findIndex(q => q.id === this.activeQuestionId());
  });

  currentQuestion = computed(() => {
    const list = this.activeSectionQuestions();
    const idx = this.currentQuestionIndex();
    if (idx === -1 || list.length === 0) return {} as ListeningQuestion;
    return list[idx];
  });

  // Shortcut Keydown listener
  private keyListener = (event: KeyboardEvent) => {
    // Only intercept when focusing on Check mode and input isn't in focus
    if (this.activeTab() === 'check' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      if (event.key === 'Control') {
        event.preventDefault();
        this.replayAudio();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        this.revealNextWord();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this.completeCurrentQuestion();
      }
    }
  };

  ngOnInit() {
    this.topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    if (!this.topicId) {
      this.router.navigate(['/listening']);
    } else {
      this.loadSavedWords();
      this.loadContent();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.keyListener);
    }
  }

  ngOnDestroy() {
    this.stopAudio();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.keyListener);
    }
  }

  loadContent() {
    this.isLoading.set(true);
    this.listeningService.getTopics().subscribe({
      next: (topics) => {
        const top = topics.find(t => t.id === this.topicId);
        if (top) {
          this.topicTitle.set(top.title);
          this.topicDescription.set(top.description);
        }

        // Fetch detailed sections & questions
        this.listeningService.getTopicSections(this.topicId).subscribe({
          next: (data) => {
            this.sections.set(data);
            
            // Expand first section by default
            if (data.length > 0) {
              const expands = { ...this.expandedSections() };
              data.forEach((s, i) => {
                expands[s.id] = (i === 0);
              });
              this.expandedSections.set(expands);

              this.activeSectionId.set(data[0].id);
              if (data[0].questions && data[0].questions.length > 0) {
                this.activeQuestionId.set(data[0].questions[0].id);
                this.generateTokensForCurrentQuestion();
              }
            }

            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error loading sections', err);
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading topic details', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleSectionExpand(sectionId: number) {
    this.expandedSections.update(exps => ({
      ...exps,
      [sectionId]: !exps[sectionId]
    }));
  }

  getCompletedCount(sec: ListeningSection): number {
    if (!sec.questions) return 0;
    return sec.questions.filter(q => q.isCompleted).length;
  }

  selectQuestion(sectionId: number, question: ListeningQuestion) {
    this.stopAudio();
    this.activeSectionId.set(sectionId);
    this.activeQuestionId.set(question.id);
    
    // Automatically expand selected section
    this.expandedSections.update(exps => ({
      ...exps,
      [sectionId]: true
    }));

    this.resetDictation();
    this.generateTokensForCurrentQuestion();
    this.updateSentenceNotes();
  }

  selectTab(tab: 'check' | 'dictation' | 'full') {
    this.stopAudio();
    this.activeTab.set(tab);
    if (tab === 'check') {
      this.generateTokensForCurrentQuestion();
    }
    this.updateSentenceNotes();
  }

  // --------------------------------------------------------------------
  // Audio Player Engine (Speech Synthesis fallback)
  // --------------------------------------------------------------------
  speakWord(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = this.playbackSpeed();
      utterance.onend = () => {
        if (this.isLooping() && this.isPlaying() && this.activeTab() === 'check') {
          setTimeout(() => {
            if (this.isLooping() && this.isPlaying()) {
              this.speakWord(text);
            }
          }, 800);
        } else {
          this.isPlaying.set(false);
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.isPlaying.set(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      this.isPlaying.set(true);
      this.speakWord(this.currentQuestion().text);
    }
  }

  replayAudio() {
    this.isPlaying.set(true);
    this.speakWord(this.currentQuestion().text);
  }

  stopAudio() {
    this.isPlaying.set(false);
    this.isPlayingAll.set(false);
    if (this.allPlayTimeout) {
      clearTimeout(this.allPlayTimeout);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  cycleSpeed() {
    const current = this.playbackSpeed();
    let next = 1.0;
    if (current === 1.0) next = 1.2;
    else if (current === 1.2) next = 1.5;
    else if (current === 1.5) next = 0.8;
    this.playbackSpeed.set(next);

    if (this.isPlaying()) {
      this.speakWord(this.currentQuestion().text);
    }
  }

  toggleLoop() {
    this.isLooping.set(!this.isLooping());
  }

  // --------------------------------------------------------------------
  // Tab Check Engine
  // --------------------------------------------------------------------
  setPercent(val: number) {
    this.percent.set(val);
    this.generateTokensForCurrentQuestion();
  }

  generateTokensForCurrentQuestion() {
    const question = this.currentQuestion();
    if (!question || !question.text) return;

    const rawWords = question.text.split(/\s+/);
    const count = rawWords.length;
    const hideCount = Math.max(1, Math.round(count * (this.percent() / 100)));

    // Pick indexes to hide deterministically based on hash of sentence & index
    const cleanTokens: WordToken[] = rawWords.map((word, index) => {
      const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase();
      return {
        text: word,
        cleanText: clean,
        isHiddenTarget: false,
        isRevealed: false
      };
    });

    // Simple deterministic index selector
    const step = Math.max(1, Math.round(count / hideCount));
    let hiddenSelected = 0;
    for (let i = 0; i < count; i++) {
      if (i % step === 0 && hiddenSelected < hideCount) {
        cleanTokens[i].isHiddenTarget = true;
        hiddenSelected++;
      }
    }

    // Ensure at least one is hidden if hideCount > 0
    if (hiddenSelected === 0 && count > 0) {
      cleanTokens[Math.floor(count / 2)].isHiddenTarget = true;
    }

    this.wordTokens.set(cleanTokens);
    this.updateSentenceNotes();
  }

  revealWordAtIndex(index: number) {
    const tokens = [...this.wordTokens()];
    if (tokens[index]) {
      tokens[index].isRevealed = true;
      this.wordTokens.set(tokens);
    }
  }

  revealNextWord() {
    const tokens = [...this.wordTokens()];
    const firstHidden = tokens.find(w => w.isHiddenTarget && !w.isRevealed);
    if (firstHidden) {
      firstHidden.isRevealed = true;
      this.wordTokens.set(tokens);
    }
  }

  revealCount(n: number) {
    const tokens = [...this.wordTokens()];
    let count = 0;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].isHiddenTarget && !tokens[i].isRevealed) {
        tokens[i].isRevealed = true;
        count++;
        if (count >= n) break;
      }
    }
    this.wordTokens.set(tokens);
  }

  revealAll() {
    const tokens = this.wordTokens().map(w => {
      if (w.isHiddenTarget) {
        return { ...w, isRevealed: true };
      }
      return w;
    });
    this.wordTokens.set(tokens);
  }

  resetHiddenTokens() {
    const tokens = this.wordTokens().map(w => {
      if (w.isHiddenTarget) {
        return { ...w, isRevealed: false };
      }
      return w;
    });
    this.wordTokens.set(tokens);
  }

  // --------------------------------------------------------------------
  // Tab Dictation Engine
  // --------------------------------------------------------------------
  checkDictation() {
    const correct = this.currentQuestion().text;
    const user = this.dictationInput().trim();
    if (!user) return;

    const correctWords = correct.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase().split(/\s+/);
    const userWords = user.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase().split(/\s+/);

    const diffs: DiffWord[] = correct.split(/\s+/).map((word, idx) => {
      const cleanCorrect = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase();
      const cleanUser = userWords[idx] || '';
      return {
        word: word,
        isCorrect: cleanCorrect === cleanUser,
        userTyped: cleanUser
      };
    });

    this.dictationDiff.set(diffs);
    this.dictationChecked.set(true);

    const isAllCorrect = diffs.every(d => d.isCorrect);
    if (isAllCorrect) {
      // Auto complete the question if correct!
      this.completeCurrentQuestion();
    }
  }

  resetDictation() {
    this.dictationInput.set('');
    this.dictationChecked.set(false);
    this.dictationDiff.set([]);
  }

  // --------------------------------------------------------------------
  // Tab Full Engine
  // --------------------------------------------------------------------
  playAllSection() {
    if (this.isPlayingAll()) {
      this.stopAudio();
    } else {
      this.isPlayingAll.set(true);
      this.playSectionIndex(0);
    }
  }

  playSectionIndex(index: number) {
    const list = this.activeSectionQuestions();
    if (index >= list.length || !this.isPlayingAll()) {
      this.isPlayingAll.set(false);
      return;
    }

    const q = list[index];
    this.activeQuestionId.set(q.id);
    this.speakWord(q.text);

    // Estimate duration based on sentence length (roughly 4 words per second)
    const wordsCount = q.text.split(/\s+/).length;
    const durationMs = Math.max(2000, (wordsCount / 3) * 1000 + 1000);

    this.allPlayTimeout = setTimeout(() => {
      this.playSectionIndex(index + 1);
    }, durationMs);
  }

  // --------------------------------------------------------------------
  // Completion & Rewards Logic
  // --------------------------------------------------------------------
  completeCurrentQuestion() {
    const q = this.currentQuestion();
    if (!q || !q.id || this.isSubmitting() || q.isCompleted) return;

    this.isSubmitting.set(true);
    this.listeningService.completeQuestion(q.id).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);

        // Update locally
        const updated = this.sections().map(s => {
          if (s.id === this.activeSectionId()) {
            const qs = s.questions.map(question => {
              if (question.id === q.id) {
                return { ...question, isCompleted: true };
              }
              return question;
            });
            return { ...s, questions: qs };
          }
          return s;
        });
        this.sections.set(updated);

        // Alert rewards in toast fashion
        this.toastService.success(`✓ Hoàn thành Câu ${q.questionNumber}! Bạn được +${res.xpGained} EXP & +${res.coinsGained} Coins.`);

        // Verify if all questions in section are completed
        const currentSec = this.activeSection();
        if (currentSec && currentSec.questions.every(question => question.isCompleted)) {
          this.completeCurrentSection(currentSec.id);
        }
      },
      error: (err) => {
        console.error('Error completing question', err);
        this.isSubmitting.set(false);
      }
    });
  }

  completeCurrentSection(secId: number) {
    this.listeningService.completeSection(secId).subscribe({
      next: (res) => {
        // Mark section as completed locally
        const updated = this.sections().map(s => {
          if (s.id === secId) {
            return { ...s, isCompleted: true };
          }
          return s;
        });
        this.sections.set(updated);

        this.toastService.success(`🎉 Tuyệt vời! Bạn đã hoàn thành toàn bộ "${this.activeSection()?.title}" và nhận thêm +${res.xpGained} EXP & +${res.coinsGained} Coins!`);
        if (res.leveledUp) {
          this.toastService.success(`🎉 LÊN CẤP: Cấp ${res.newLevel} (Danh hiệu: ${res.newTitle})!`, 5000);
        }
        this.router.navigate(['/listening']);
      },
      error: (err) => {
        console.error('Error completing section', err);
        this.router.navigate(['/listening']);
      }
    });
  }

  prevQuestion() {
    const list = this.activeSectionQuestions();
    const idx = this.currentQuestionIndex();
    if (idx > 0) {
      this.selectQuestion(this.activeSectionId(), list[idx - 1]);
    }
  }

  nextQuestion() {
    const list = this.activeSectionQuestions();
    const idx = this.currentQuestionIndex();
    if (idx < list.length - 1) {
      this.selectQuestion(this.activeSectionId(), list[idx + 1]);
    } else {
      // Go to next section if exists
      const currentSecIdx = this.sections().findIndex(s => s.id === this.activeSectionId());
      if (currentSecIdx < this.sections().length - 1) {
        const nextSec = this.sections()[currentSecIdx + 1];
        if (nextSec.questions && nextSec.questions.length > 0) {
          this.selectQuestion(nextSec.id, nextSec.questions[0]);
        }
      }
    }
  }

  loadSavedWords(): void {
    this.userWordService.getUserWords().subscribe({
      next: (words: UserWord[]) => {
        this.savedWords.set(words);
        this.updateSentenceNotes();
      },
      error: (err: any) => console.error('Error loading saved words', err)
    });
  }

  updateSentenceNotes(): void {
    const question = this.currentQuestion();
    if (!question || !question.text) {
      this.sentenceNotes = '';
      return;
    }
    const saved = this.savedWords().find(w => w.word.toLowerCase() === question.text.toLowerCase());
    this.sentenceNotes = saved ? (saved.notes || '') : '';
  }

  isCurrentSentenceSaved(): boolean {
    const question = this.currentQuestion();
    if (!question || !question.text) return false;
    return this.savedWords().some(w => w.word.toLowerCase() === question.text.toLowerCase());
  }

  toggleSaveCurrentSentence(event: Event): void {
    if (event) event.stopPropagation();
    const question = this.currentQuestion();
    if (!question || !question.text) return;

    const existing = this.savedWords().find(w => w.word.toLowerCase() === question.text.toLowerCase());

    if (existing) {
      this.userWordService.deleteUserWord(existing.id).subscribe({
        next: () => {
          this.savedWords.set(this.savedWords().filter(w => w.id !== existing.id));
          this.sentenceNotes = '';
        },
        error: (err: any) => console.error('Error deleting sentence', err)
      });
    } else {
      const payload = {
        word: question.text,
        partOfSpeech: 'sentence',
        definition: question.translation || '',
        phonetic: '',
        notes: ''
      };
      this.userWordService.saveUserWord(payload).subscribe({
        next: (saved: UserWord) => {
          this.savedWords.set([...this.savedWords(), saved]);
          this.sentenceNotes = '';
        },
        error: (err: any) => console.error('Error saving sentence', err)
      });
    }
  }

  onSentenceNotesChange(): void {
    const question = this.currentQuestion();
    if (!question || !question.text) return;

    const existing = this.savedWords().find(w => w.word.toLowerCase() === question.text.toLowerCase());
    if (!existing) return;

    if (this.sentenceNotesTimeout) {
      clearTimeout(this.sentenceNotesTimeout);
    }

    this.isSentenceNotesSaving.set(true);
    this.sentenceNotesTimeout = setTimeout(() => {
      this.userWordService.updateUserWord(existing.id, { notes: this.sentenceNotes }).subscribe({
        next: (updated: UserWord) => {
          this.savedWords.set(this.savedWords().map(w => w.id === updated.id ? updated : w));
          this.isSentenceNotesSaving.set(false);
        },
        error: (err: any) => {
          console.error('Error updating notes', err);
          this.isSentenceNotesSaving.set(false);
        }
      });
    }, 800);
  }
}
