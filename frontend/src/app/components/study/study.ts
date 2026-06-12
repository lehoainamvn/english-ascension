import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudyService, Flashcard, QuizQuestion, CompletionResult } from '../../services/study.service';
import { UserWordService, UserWord } from '../../services/user-word.service';
import { ToastService } from '../../services/toast.service';

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
        <div class="flex justify-between items-center mb-4 pb-3 border-b border-border-main">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-black tracking-tight text-text-main uppercase">
              ENGLISH ASCENSION
            </h2>
          </div>
          <button
            (click)="goBack()"
            class="bg-bg-input hover:bg-bg-card border border-border-main px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all text-text-muted hover:text-text-main cursor-pointer"
          >
            &larr; Quay lại
          </button>
        </div>

        <!-- Module Info -->
        <div class="mb-5 p-4 bg-brand-accent/5 border border-brand-accent/15 rounded-xl text-left">
          <h3 class="text-sm font-black text-brand-accent">
            {{ moduleTitle() }}
          </h3>
          <p class="text-xxs text-text-muted mt-1 leading-relaxed text-[11px]">
            {{ moduleDescription() }}
          </p>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle mx-auto text-text-muted"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            <h3 class="text-lg font-bold text-text-main">Không thể tải học liệu</h3>
            <p class="text-text-muted text-sm max-w-sm mx-auto">
              Không tìm thấy module được yêu cầu hoặc lỗi giao tiếp với AI. Vui lòng thử lại sau.
            </p>
            <a
              routerLink="/grammar-topics"
              class="bg-brand-primary hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl transition-all inline-block shadow-md cursor-pointer"
            >
              Về Danh Sách
            </a>
          </div>
        } @else {
          
          <!-- ==================================================================== -->
          <!-- 1. VIEW: LEARNING MODE (Study or Take Test)                         -->
          <!-- ==================================================================== -->
          @if (studyState() === 'learning') {
            
            <!-- Main Study / Test Toggle (On Top) -->
            @if (!isSingleSkillMode()) {
              <div class="flex p-1 bg-bg-input/60 border border-border-main/50 rounded-2xl mb-6 shadow-inner select-none text-xs font-bold">
                <button
                  (click)="studyMode.set('study')"
                  [class.bg-bg-card]="studyMode() === 'study'"
                  [class.text-text-main]="studyMode() === 'study'"
                  [class.shadow-sm]="studyMode() === 'study'"
                  [class.text-text-muted]="studyMode() !== 'study'"
                  class="flex-1 py-2 rounded-xl text-center cursor-pointer transition-all border-none font-black flex items-center justify-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Học Lý thuyết & Tài liệu
                </button>
                <button
                  (click)="studyMode.set('test')"
                  [class.bg-bg-card]="studyMode() === 'test'"
                  [class.text-text-main]="studyMode() === 'test'"
                  [class.shadow-sm]="studyMode() === 'test'"
                  [class.text-text-muted]="studyMode() !== 'test'"
                  class="flex-1 py-2 rounded-xl text-center cursor-pointer transition-all border-none font-black flex items-center justify-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text shrink-0"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                  Làm Bài Kiểm Tra
                </button>
              </div>
            }

            <!-- STUDY MODE SUB-TABS AND CONTENT -->
            @if (studyMode() === 'study') {
              
              <!-- Sub-tab Selector for Study Mode -->
              @if (!isSingleSkillMode()) {
                <div class="flex border-b border-border-main/50 mb-6 overflow-x-auto select-none text-xs font-bold">
                  <button
                    (click)="activeTab.set('grammar')"
                    [class.border-b-2]="activeTab() === 'grammar'"
                    [class.border-brand-primary]="activeTab() === 'grammar'"
                    [class.text-text-main]="activeTab() === 'grammar'"
                    [class.text-text-muted]="activeTab() !== 'grammar'"
                    class="flex-1 min-w-[90px] py-3 text-center cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap bg-transparent border-none font-black flex items-center justify-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Ngữ pháp
                  </button>
                  <button
                    (click)="activeTab.set('vocabulary')"
                    [class.border-b-2]="activeTab() === 'vocabulary'"
                    [class.border-brand-primary]="activeTab() === 'grammar' ? '' : (activeTab() === 'vocabulary' ? 'border-brand-primary' : '')"
                    [class.text-text-main]="activeTab() === 'vocabulary'"
                    [class.text-text-muted]="activeTab() !== 'vocabulary'"
                    class="flex-1 min-w-[90px] py-3 text-center cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap bg-transparent border-none font-black flex items-center justify-center gap-1"
                    [class.border-b-2]="activeTab() === 'vocabulary'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book shrink-0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    Từ vựng
                  </button>
                  <button
                    (click)="activeTab.set('listening')"
                    [class.border-b-2]="activeTab() === 'listening'"
                    [class.border-brand-primary]="activeTab() === 'listening'"
                    [class.text-text-main]="activeTab() === 'listening'"
                    [class.text-text-muted]="activeTab() !== 'listening'"
                    class="flex-1 min-w-[90px] py-3 text-center cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap bg-transparent border-none font-black flex items-center justify-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones shrink-0"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                    Nghe
                  </button>
                  <button
                    (click)="activeTab.set('pronunciation')"
                    [class.border-b-2]="activeTab() === 'pronunciation'"
                    [class.border-brand-primary]="activeTab() === 'pronunciation'"
                    [class.text-text-main]="activeTab() === 'pronunciation'"
                    [class.text-text-muted]="activeTab() !== 'pronunciation'"
                    class="flex-1 min-w-[90px] py-3 text-center cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap bg-transparent border-none font-black flex items-center justify-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic shrink-0"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    Phát âm
                  </button>
                </div>
              }
 
              <!-- Study Mode - Grammar Tab -->
              @if (activeTab() === 'grammar') {
                <div class="space-y-6 animate-fade-in">
                  <div class="p-5 bg-bg-input/30 border border-border-main rounded-2xl space-y-4 text-left">
                    <div class="flex items-center gap-2 pb-2 border-b border-border-main">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open text-text-main"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      <h3 class="font-black text-text-main text-sm uppercase tracking-wide">
                        {{ getGrammarTheory().title }}
                      </h3>
                    </div>
                    
                    <div class="space-y-4 max-h-[22rem] overflow-y-auto pr-1">
                      @for (sec of getGrammarTheory().sections; track sec.heading) {
                        <div class="p-3 bg-bg-card border border-border-main rounded-xl space-y-1.5">
                          <h4 class="text-xs font-bold text-text-main flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-brand-primary shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            {{ sec.heading }}
                          </h4>
                          <p class="text-[11px] text-text-muted leading-relaxed">
                            {{ sec.detail }}
                          </p>
                          @if (sec.example) {
                            <p class="text-[10px] font-mono text-text-main font-semibold italic bg-bg-input/40 px-2 py-1 rounded mt-1 border border-border-main/20">
                              {{ sec.example }}
                            </p>
                          }
                        </div>
                      }
                    </div>
                  </div>
 
                  <div class="pt-2 border-t border-border-main/50">
                    @if (isSingleSkillMode()) {
                      <button
                        (click)="completeSkillAndGoBack()"
                        class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                        <span>Hoàn thành & Quay lại Bản đồ</span>
                      </button>
                    } @else {
                      <button
                        (click)="activeTab.set('vocabulary'); updateLocalProgress('VOCABULARY')"
                        class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        <span>Tiếp tục sang Học từ vựng</span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Study Mode - Vocabulary Tab -->
              @if (activeTab() === 'vocabulary') {
                <div class="space-y-6 animate-fade-in">
                  <div class="text-center">
                    <span class="text-xxs text-text-muted font-bold uppercase tracking-wider text-[10px]">
                      Thẻ từ vựng {{ currentCardIndex + 1 }} / {{ flashcards.length }}
                    </span>
                    <h3 class="text-sm font-black text-text-main mt-0.5">Lật thẻ để ghi nhớ từ mới</h3>
                  </div>

                  <div class="perspective flex justify-center py-4">
                    <div
                      (click)="isFlipped = !isFlipped"
                      [class.flipped]="isFlipped"
                      class="flip-card-inner relative w-full max-w-sm h-64 bg-bg-input border border-border-main rounded-2xl shadow-lg cursor-pointer transition-transform duration-500"
                    >
                      <!-- Front Side -->
                      <div class="flip-card-front flex flex-col items-center justify-center p-6 bg-gradient-to-b from-bg-input/20 to-transparent">
                        <button
                          (click)="toggleSaveWord($event, currentCard())"
                          class="absolute top-4 right-4 w-9 h-9 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center text-sm transition-all cursor-pointer shadow-sm z-20"
                          title="Lưu vào sổ tay"
                        >
                          @if (isWordSaved(currentCard().word)) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted hover:text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          }
                        </button>
                        <span class="text-xs text-text-main font-bold uppercase tracking-widest bg-bg-input px-2 py-0.5 rounded border border-border-main">
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
                            class="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center transition-all cursor-pointer shadow-md border-none"
                            title="Nghe phát âm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                          </button>
                          <span class="text-[10px] text-text-muted font-semibold">Nghe phát âm</span>
                        </div>
                      </div>

                      <!-- Back Side -->
                      <div class="flip-card-back flex flex-col justify-center p-6 bg-bg-card">
                        <button
                          (click)="toggleSaveWord($event, currentCard())"
                          class="absolute top-4 right-4 w-9 h-9 rounded-full bg-bg-input hover:bg-bg-card border border-border-main flex items-center justify-center text-sm transition-all cursor-pointer shadow-sm z-20"
                          title="Lưu vào sổ tay"
                        >
                          @if (isWordSaved(currentCard().word)) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted hover:text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          }
                        </button>
                        <div class="text-center border-b border-border-main/50 pb-3 mb-3">
                          <p class="text-xs text-text-main font-bold uppercase tracking-wide">Giải nghĩa</p>
                          <h3 class="text-sm font-black text-text-main mt-1">
                            {{ currentCard().definition }}
                          </h3>
                        </div>
                        <div class="text-left">
                          <p class="text-[9px] text-text-muted uppercase tracking-wider font-bold">Ví dụ sử dụng:</p>
                          <p class="text-xs font-semibold text-text-main italic mt-1 leading-normal">
                            "{{ currentCard().exampleSentence }}"
                          </p>
                          <p class="text-xs text-text-muted mt-1 leading-normal flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            {{ currentCard().exampleTranslation }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-between items-center max-w-sm mx-auto pt-4 font-bold text-xs">
                    <button
                      (click)="prevCard()"
                      [disabled]="currentCardIndex === 0"
                      class="bg-bg-input hover:bg-bg-card border border-border-main px-4 py-2 rounded-xl text-text-muted hover:text-text-main transition-all disabled:opacity-30 cursor-pointer font-bold"
                    >
                      Thẻ trước
                    </button>
                    <span class="text-[10px] text-text-muted italic">Click vào thẻ để xoay</span>
                    <button
                      (click)="nextCard()"
                      [disabled]="currentCardIndex === flashcards.length - 1"
                      class="bg-bg-input hover:bg-bg-card border border-border-main px-4 py-2 rounded-xl text-text-muted hover:text-text-main transition-all disabled:opacity-30 cursor-pointer font-bold"
                    >
                      Thẻ sau
                    </button>
                  </div>

                  <!-- Personal Notes Box (If word is saved) -->
                  @if (isWordSaved(currentCard().word)) {
                    <div class="max-w-sm mx-auto mt-4 p-4 bg-yellow-500/5 dark:bg-yellow-500/10 border-2 border-dashed border-yellow-500/30 rounded-2xl text-left animate-fade-in space-y-2">
                      <div class="flex justify-between items-center">
                        <label class="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                          Ghi chú sổ tay cho từ "{{ currentCard().word }}"
                        </label>
                        @if (isNotesSaving()) {
                          <span class="text-[9px] text-text-muted animate-pulse">Đang lưu...</span>
                        }
                      </div>
                      <textarea
                        [(ngModel)]="currentWordNotes"
                        (ngModelChange)="onNotesChange(currentCard())"
                        placeholder="Ví dụ: Từ này xuất hiện trong báo cáo tài chính, nghĩa là trì hoãn..."
                        rows="3"
                        class="w-full bg-bg-card border border-border-main rounded-xl px-3 py-2 text-xs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                      ></textarea>
                    </div>
                  }

                  <div class="pt-6 border-t border-border-main/50 mt-6">
                    @if (isSingleSkillMode()) {
                      <button
                        (click)="completeSkillAndGoBack()"
                        class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                        <span>Hoàn thành & Quay lại Bản đồ</span>
                      </button>
                    } @else {
                      <button
                        (click)="activeTab.set('listening'); updateLocalProgress('LISTENING')"
                        class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                        <span>Hoàn thành học Từ vựng & Tiếp tục sang phần Luyện nghe</span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Study Mode - Listening Tab -->
              @if (activeTab() === 'listening') {
                <div class="space-y-6 animate-fade-in">
                  <div class="text-center">
                    <span class="bg-bg-input text-text-main border border-border-main text-xxs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                      Luyện nghe hiểu
                    </span>
                    <h3 class="text-base font-black text-text-main mt-1">Lắng nghe đoạn văn hội thoại</h3>
                  </div>

                  <div class="p-4 bg-bg-input/60 border border-border-main rounded-2xl flex flex-col items-center gap-3 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones text-text-main"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                    <div class="text-center">
                      <h4 class="text-xs font-bold text-text-main">Chuyên đề nghe: Weekly Study Dialogue</h4>
                      <p class="text-[10px] text-text-muted mt-0.5">Bấm nút Play bên dưới để nghe bài phát âm nói.</p>
                    </div>

                    <div class="flex items-end justify-center gap-1.5 h-8 py-1">
                      @for (bar of listeningWave; track $index) {
                        <div
                          class="w-1 bg-brand-primary rounded-full transition-all duration-300"
                          [style.height.px]="isListeningAudioPlaying() ? bar.height : 4"
                          [style.opacity]="isListeningAudioPlaying() ? 1 : 0.4"
                        ></div>
                      }
                    </div>

                    <button
                      (click)="toggleListeningAudio()"
                      [class.bg-brand-primary]="!isListeningAudioPlaying()"
                      [class.text-white]="!isListeningAudioPlaying()"
                      [class.bg-red-500]="isListeningAudioPlaying()"
                      class="w-12 h-12 rounded-full text-white flex items-center justify-center transition-all cursor-pointer shadow-md border-none active:scale-95 text-base"
                    >
                      @if (isListeningAudioPlaying()) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="14" y="4" rx="1"/><rect width="4" height="16" x="6" y="4" rx="1"/></svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                      }
                    </button>
                  </div>

                  <!-- Listening comprehension quiz (self check) -->
                  <div class="p-4 bg-bg-input/30 border border-border-main rounded-2xl space-y-4 text-left">
                    <h4 class="text-xs font-bold text-text-main">Question: What does the speaker recommend doing to consolidate new vocabulary?</h4>
                    
                    <div class="space-y-2">
                      <button
                        (click)="selectListeningAnswer('A')"
                        [class.border-brand-primary]="selectedListeningAnswer() === 'A'"
                        [class.bg-bg-input]="selectedListeningAnswer() === 'A'"
                        class="w-full p-3 rounded-xl border border-border-main hover:border-brand-primary/40 bg-bg-card text-text-main text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                      >
                        <span>A. Doing elaborate research on general grammar rules</span>
                      </button>
                      <button
                        (click)="selectListeningAnswer('B')"
                        [class.border-brand-primary]="selectedListeningAnswer() === 'B'"
                        [class.bg-bg-input]="selectedListeningAnswer() === 'B'"
                        class="w-full p-3 rounded-xl border border-border-main hover:border-brand-primary/40 bg-bg-card text-text-main text-left text-xs font-semibold transition-all cursor-pointer flex justify-between items-center"
                      >
                        <span>B. Practicing with flashcards on a regular schedule</span>
                      </button>
                    </div>

                    @if (listeningSubmitted()) {
                      <div
                        [class.bg-green-500/10]="isListeningCorrect()"
                        [class.border-green-500/20]="isListeningCorrect()"
                        [class.text-green-500]="isListeningCorrect()"
                        [class.bg-red-500/10]="!isListeningCorrect()"
                        [class.border-red-500/20]="!isListeningCorrect()"
                        [class.text-red-500]="!isListeningCorrect()"
                        class="p-3 border rounded-xl text-xxs font-semibold leading-relaxed text-[11px]"
                      >
                        @if (isListeningCorrect()) {
                          <span>Chính xác! Bạn đã nghe rất tốt. Lựa chọn hợp lý là ôn tập flashcards đều đặn. Nhận ngay +15 EXP!</span>
                        } @else {
                          <span>Chưa chính xác. Hãy nghe kỹ lại lời khuyên từ speaker nhé!</span>
                        }
                      </div>
                    }

                    <div class="flex gap-2 font-bold text-xs">
                      <button
                        (click)="submitListeningAnswer()"
                        [disabled]="!selectedListeningAnswer() || listeningSubmitted()"
                        class="flex-1 bg-brand-primary text-white hover:opacity-90 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-40 border-none font-black"
                      >
                        Kiểm tra câu trả lời
                      </button>
                      <button
                        (click)="resetListening()"
                        class="bg-bg-input border border-border-main text-text-muted px-4 py-2 rounded-xl hover:bg-bg-card transition-all cursor-pointer font-bold"
                      >
                        Làm lại
                      </button>
                    </div>

                    <div class="pt-4 border-t border-border-main/50 mt-4">
                      @if (isSingleSkillMode()) {
                        <button
                          (click)="completeSkillAndGoBack()"
                          [disabled]="!listeningSubmitted()"
                          class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md transition-all disabled:opacity-40 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                          <span>Hoàn thành & Quay lại Bản đồ</span>
                        </button>
                      } @else {
                        <button
                          (click)="activeTab.set('pronunciation'); updateLocalProgress('PRONUNCIATION')"
                          [disabled]="!listeningSubmitted()"
                          class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md transition-all disabled:opacity-40 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                          <span>Hoàn thành Luyện nghe & Tiếp tục sang phần Phát âm</span>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }

              <!-- Study Mode - Pronunciation Tab -->
              @if (activeTab() === 'pronunciation') {
                <div class="space-y-6 animate-fade-in">
                  <div class="text-center">
                    <span class="bg-bg-input text-text-main border border-border-main text-xxs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                      Luyện phát âm giọng nói
                    </span>
                    <h3 class="text-base font-black text-text-main mt-1">Nói từ vựng theo mẫu</h3>
                  </div>

                  <div class="space-y-3 text-left">
                    <p class="text-xxs font-bold text-text-muted uppercase tracking-wider text-[9px]">Chọn từ muốn luyện nói:</p>
                    <div class="flex flex-wrap gap-2">
                      @for (item of flashcards; track item.id; let idx = $index) {
                        <button
                          (click)="selectSpeakWord(idx)"
                          [class.bg-brand-primary]="selectedSpeakWordIndex() === idx"
                          [class.text-bg-main]="selectedSpeakWordIndex() === idx"
                          [class.border-brand-primary]="selectedSpeakWordIndex() === idx"
                          [class.bg-bg-input]="selectedSpeakWordIndex() !== idx"
                          [class.text-text-main]="selectedSpeakWordIndex() !== idx"
                          class="px-3 py-1.5 border border-border-main rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          {{ item.word }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="p-6 bg-bg-card border-2 border-border-main rounded-2xl flex flex-col items-center gap-4 text-center">
                    <span class="text-xxs font-black text-text-muted uppercase tracking-wider">TỪ ĐANG LUYỆN</span>
                    <h2 class="text-2xl font-black text-text-main uppercase">{{ getSpeakWord() }}</h2>
                    <p class="text-xs text-text-muted font-mono">{{ getSpeakPhonetic() }}</p>

                    <div class="flex flex-col items-center gap-3 mt-4">
                      <button
                        (click)="toggleSpeakRecord()"
                        [class.bg-brand-primary]="isRecording()"
                        [class.text-bg-main]="isRecording()"
                        [class.animate-pulse]="isRecording()"
                        [class.ring-4]="isRecording()"
                        [class.ring-brand-primary/20]="isRecording()"
                        [class.bg-brand-primary]="!isRecording()"
                        class="w-16 h-16 rounded-full text-white flex items-center justify-center transition-all shadow-lg border-none active:scale-95 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                      </button>

                      <p class="text-xxs text-text-muted text-[10px] font-bold">
                        {{ isRecording() ? 'Đang lắng nghe... Hãy nói to rõ ràng!' : 'Nhấp nút mic để bắt đầu nói' }}
                      </p>

                      @if (isRecording()) {
                        <div class="flex items-end justify-center gap-1 h-5 pt-1">
                          <div class="w-0.5 bg-brand-primary rounded-full animate-bounce h-3"></div>
                          <div class="w-0.5 bg-brand-primary rounded-full animate-bounce h-5" style="animation-delay: 0.1s"></div>
                          <div class="w-0.5 bg-brand-primary rounded-full animate-bounce h-2" style="animation-delay: 0.2s"></div>
                          <div class="w-0.5 bg-brand-primary rounded-full animate-bounce h-4" style="animation-delay: 0.3s"></div>
                        </div>
                      }

                      @if (speakScore()) {
                        <div class="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in flex flex-col gap-0.5">
                          <span class="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            Điểm phát âm: <strong>{{ speakScore() }}%</strong> Match ({{ speakScore()! > 85 ? 'Xuất sắc!' : 'Tốt!' }})
                          </span>
                          <span class="text-[10px] text-text-muted">Nhận ngay +10 EXP thưởng!</span>
                        </div>
                      }
                    </div>
                  </div>

                  <div class="pt-6 border-t border-border-main/50 mt-6">
                    @if (isSingleSkillMode()) {
                      <button
                        (click)="completeSkillAndGoBack()"
                        class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                        <span>Hoàn thành & Quay lại Bản đồ</span>
                      </button>
                    } @else {
                      <button
                        (click)="studyMode.set('test'); updateLocalProgress('TEST')"
                        class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        <span>Đã học xong! Bắt đầu làm bài test để qua màn</span>
                      </button>
                    }
                  </div>
                </div>
              }
            }

            <!-- TEST MODE CONTENT -->
            @if (studyMode() === 'test') {
              <div class="space-y-6 animate-fade-in">
                <!-- Test Guide -->
                <div class="p-4 bg-bg-input/30 border border-border-main rounded-2xl flex gap-3 text-left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list shrink-0 text-text-muted mt-0.5"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                  <div class="text-[11px] leading-relaxed">
                    <h4 class="font-black text-text-main text-xs uppercase mb-1">BÀI KIỂM TRA ĐÁNH GIÁ CHUYÊN ĐỀ</h4>
                    <p class="text-text-muted">
                      Hãy trả lời toàn bộ các câu hỏi bên dưới. Bạn cần đạt tối thiểu **7.0 / 10 điểm** (trả lời đúng ít nhất 70% số câu hỏi) để qua màn và nhận phần thưởng RPG.
                    </p>
                  </div>
                </div>

                <!-- Questions List -->
                <div class="space-y-6 max-h-[26rem] overflow-y-auto pr-1 text-left">
                  @for (q of quizQuestions; track q.id; let i = $index) {
                    <div class="p-4 bg-bg-input/60 border border-border-main rounded-xl space-y-4">
                      <div class="flex justify-between items-center">
                        <span class="text-xxs bg-bg-input text-text-main border border-border-main px-2.5 py-0.5 rounded font-bold uppercase text-[9px]">
                          Câu {{ i + 1 }}
                        </span>
                        <span class="text-xxs text-text-muted text-[10px] font-semibold">
                          {{ q.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : q.type === 'FILL_IN_BLANK' ? 'Điền vào chỗ trống' : 'Ghép từ vựng' }}
                        </span>
                      </div>
                      
                      <h4 class="text-xs font-bold text-text-main leading-relaxed">
                        {{ q.questionText }}
                      </h4>
                      
                      <!-- MULTIPLE CHOICE -->
                      @if (q.type === 'MULTIPLE_CHOICE') {
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <button
                            (click)="selectQuizOption(i, 'A')"
                            [class.border-brand-primary]="getQuizAnswer(i) === 'A'"
                            [class.bg-bg-input]="getQuizAnswer(i) === 'A'"
                            class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-[11px] font-semibold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>A. {{ q.optionA }}</span>
                            @if (getQuizAnswer(i) === 'A') { <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-brand-primary shrink-0"><path d="M20 6 9 17l-5-5"/></svg> }
                          </button>
                          <button
                            (click)="selectQuizOption(i, 'B')"
                            [class.border-brand-primary]="getQuizAnswer(i) === 'B'"
                            [class.bg-bg-input]="getQuizAnswer(i) === 'B'"
                            class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-[11px] font-semibold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>B. {{ q.optionB }}</span>
                            @if (getQuizAnswer(i) === 'B') { <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-brand-primary shrink-0"><path d="M20 6 9 17l-5-5"/></svg> }
                          </button>
                          <button
                            (click)="selectQuizOption(i, 'C')"
                            [class.border-brand-primary]="getQuizAnswer(i) === 'C'"
                            [class.bg-bg-input]="getQuizAnswer(i) === 'C'"
                            class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-[11px] font-semibold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>C. {{ q.optionC }}</span>
                            @if (getQuizAnswer(i) === 'C') { <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-brand-primary shrink-0"><path d="M20 6 9 17l-5-5"/></svg> }
                          </button>
                          <button
                            (click)="selectQuizOption(i, 'D')"
                            [class.border-brand-primary]="getQuizAnswer(i) === 'D'"
                            [class.bg-bg-input]="getQuizAnswer(i) === 'D'"
                            class="bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2.5 text-left text-[11px] font-semibold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>D. {{ q.optionD }}</span>
                            @if (getQuizAnswer(i) === 'D') { <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-brand-primary shrink-0"><path d="M20 6 9 17l-5-5"/></svg> }
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
                            placeholder="Gõ đáp án của bạn tại đây..."
                            class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-2.5 text-xs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-semibold"
                          />
                        </div>
                      }

                      <!-- WORD MATCHING -->
                      @if (q.type === 'WORD_MATCHING' && matchingData[i]) {
                        <div class="space-y-4">
                          <div class="grid grid-cols-2 gap-4">
                            <!-- English Words (Left) -->
                            <div class="space-y-2">
                              <p class="text-[9px] font-black text-text-muted uppercase tracking-wider text-center">Tiếng Anh</p>
                              @for (item of matchingData[i].eng; track item.word) {
                                <button
                                  (click)="selectEngWord(i, item.word)"
                                  [disabled]="item.matched"
                                  [class.border-green-500]="item.matched"
                                  [class.bg-green-500/10]="item.matched"
                                  [class.text-green-500]="item.matched"
                                  [class.border-brand-primary]="matchingData[i].selectedEng === item.word"
                                  [class.bg-bg-input]="matchingData[i].selectedEng === item.word"
                                  class="w-full bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2 text-center text-xs font-semibold transition-all cursor-pointer"
                                >
                                  <span>{{ item.word }}</span>
                                  @if (item.matched) { <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check shrink-0"><path d="M20 6 9 17l-5-5"/></svg> }
                                </button>
                              }
                            </div>

                            <!-- Vietnamese Meanings (Right) -->
                            <div class="space-y-2">
                              <p class="text-[9px] font-black text-text-muted uppercase tracking-wider text-center">Tiếng Việt</p>
                              @for (item of matchingData[i].vie; track item.text) {
                                <button
                                  (click)="selectVieText(i, item.text)"
                                  [disabled]="item.matched"
                                  [class.border-green-500]="item.matched"
                                  [class.bg-green-500/10]="item.matched"
                                  [class.text-green-500]="item.matched"
                                  [class.border-brand-primary]="matchingData[i].selectedVie === item.text"
                                  [class.bg-bg-input]="matchingData[i].selectedVie === item.text"
                                  class="w-full bg-bg-input border border-border-main hover:border-brand-primary/30 rounded-lg p-2 text-center text-xs font-semibold transition-all cursor-pointer"
                                >
                                  <span>{{ item.text }}</span>
                                  @if (item.matched) { <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check shrink-0"><path d="M20 6 9 17l-5-5"/></svg> }
                                </button>
                              }
                            </div>
                          </div>

                          <div class="flex justify-between items-center text-[10px] text-text-muted">
                            <span>Đã ghép: {{ getPairsCount(i) }} / {{ matchingData[i].eng.length }} cặp</span>
                            <button (click)="resetMatching(i)" class="text-brand-primary hover:underline cursor-pointer font-bold">Làm lại ↺</button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>

                <!-- Submit button -->
                <div class="pt-4 border-t border-border-main">
                  <button
                    (click)="submitQuiz()"
                    [disabled]="!allQuizQuestionsAnswered()"
                    class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3.5 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-xs text-center border-none flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    Nộp Bài Kiểm Tra & Xem Kết Quả
                  </button>
                  @if (!allQuizQuestionsAnswered()) {
                    <p class="text-center text-[10px] text-red-500/80 font-bold mt-2 flex items-center justify-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                      Hãy hoàn thành đầy đủ tất cả các câu hỏi trên trước khi nộp bài!
                    </p>
                  }
                </div>
              </div>
            }

          }

          <!-- ==================================================================== -->
          <!-- 2. VIEW: QUIZ COMPLETED / RESULTS REVIEW (PASS STATE)                -->
          <!-- ==================================================================== -->
          @if (studyState() === 'quiz_completed') {
            <div class="space-y-6 animate-fade-in text-left">
              
              <!-- Score Box -->
              <div class="text-center py-5 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <div class="flex items-center justify-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-party-popper text-green-500"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>
                  <span class="text-xxs font-bold text-green-500 uppercase tracking-widest text-[10px]">CHÚC MỪNG BẠN ĐÃ ĐẠT ĐIỂM ĐỖ!</span>
                </div>
                <h3 class="text-3xl font-black text-text-main mt-1">
                  {{ getTestScore() }} / 10 điểm
                </h3>
                <p class="text-xs text-text-muted mt-2">
                  (Đúng {{ correctQuizAnswersCount }} / {{ quizQuestions.length }} câu hỏi)
                </p>
                <p class="text-[11px] text-text-muted mt-1">
                  Xem lại lời giải chi tiết cho các câu hỏi bên dưới trước khi nhận phần thưởng RPG.
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
                        class="text-[10px] px-2 py-0.5 rounded font-extrabold flex items-center gap-1"
                      >
                        @if (isAnswerCorrect(i)) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                          ĐÚNG
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          SAI
                        }
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
                            <div>{{ pair.eng }} &rarr; <span class="text-text-main font-semibold">{{ pair.vie }}</span></div>
                          }
                        </div>
                      </div>
                    } @else {
                      <p class="text-xs text-text-main font-semibold">
                        Đáp án của bạn: <strong class="text-brand-primary">{{ getQuizAnswer(i) }}</strong> | Đáp án đúng: <strong class="text-green-500">{{ getCorrectOptionText(q) }}</strong>
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
                  class="flex-1 relative overflow-hidden group bg-brand-primary text-bg-main hover:opacity-90 font-black py-3.5 px-6 rounded-xl shadow-md border-none active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                  <div class="relative flex items-center justify-center gap-2">
                    @if (isSubmittingReward()) {
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span>Đang tính toán phần thưởng...</span>
                    } @else {
                      <span>Nhận Phần Thưởng & Lưu Tiến Trình 🏆</span>
                    }
                  </div>
                </button>
              </div>

            </div>
          }

          <!-- ==================================================================== -->
          <!-- 3. VIEW: QUIZ FAILED (FAIL STATE)                                    -->
          <!-- ==================================================================== -->
          @if (studyState() === 'quiz_failed') {
            <div class="text-center py-6 space-y-6 animate-fade-in">
              <div class="space-y-2">
                <div class="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle text-red-500"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                </div>
                <h3 class="text-2xl font-black text-red-500 tracking-tight">CHƯA ĐẠT YÊU CẦU</h3>
                <p class="text-xs text-text-muted uppercase tracking-widest font-bold">Test Failed</p>
              </div>

              <div class="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-sm mx-auto space-y-2">
                <p class="text-sm text-text-muted">Kết quả bài kiểm tra của bạn:</p>
                <h2 class="text-3xl font-black text-red-500">
                  {{ getTestScore() }} / 10 điểm
                </h2>
                <p class="text-xs text-text-muted font-semibold">
                  (Đúng {{ correctQuizAnswersCount }} trên {{ quizQuestions.length }} câu hỏi)
                </p>
                <p class="text-[11px] text-red-500/80 font-bold mt-4 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                  Bạn cần đạt tối thiểu 7.0 điểm để qua màn và nhận phần thưởng RPG.
                </p>
              </div>

              <div class="flex flex-col gap-3 max-w-sm mx-auto pt-4 font-bold text-xs">
                <button
                  (click)="studyMode.set('study'); activeTab.set('grammar'); studyState.set('learning')"
                  class="w-full bg-bg-input hover:bg-bg-card border border-border-main text-text-main py-3 rounded-xl transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Quay lại ôn tập lý thuyết
                </button>
                <button
                  (click)="resetTest()"
                  class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3 rounded-xl shadow-md active:scale-98 transition-all cursor-pointer text-sm border-none flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Làm lại bài kiểm tra
                </button>
              </div>
            </div>
          }

          <!-- ==================================================================== -->
          <!-- 4. VIEW: REWARDS & PROGRESSION                                       -->
          <!-- ==================================================================== -->
          @if (studyState() === 'rewards' && rewards()) {
            <div class="text-center py-6 space-y-6 animate-fade-in">
              
              <div class="space-y-1">
                <span class="text-xxs font-bold text-text-main uppercase tracking-widest text-[10px]">
                  Hoàn thành chương học
                </span>
                <h3 class="text-3xl font-black text-text-main">Phần Thưởng Đã Nhận!</h3>
              </div>

              <div class="flex justify-center gap-6 max-w-sm mx-auto">
                <div class="flex-1 p-4 bg-bg-input/60 border border-border-main rounded-2xl flex flex-col items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap text-text-main"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <span class="text-lg font-black text-text-main mt-0.5">+{{ rewards()?.xpGained }} EXP</span>
                  <span class="text-[10px] text-text-muted">Kinh nghiệm</span>
                </div>
                <div class="flex-1 p-4 bg-bg-input/60 border border-border-main rounded-2xl flex flex-col items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins text-text-main"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
                  <span class="text-lg font-black text-text-main mt-0.5">+{{ rewards()?.coinsGained }} Xu</span>
                  <span class="text-[10px] text-text-muted">Tiền vàng</span>
                </div>
              </div>

              <div class="max-w-sm mx-auto space-y-2 pt-4">
                <div class="flex justify-between items-center text-xs font-bold">
                  <span>Cấp độ hiện tại: Cấp {{ rewards()?.newLevel }}</span>
                  <span class="text-text-muted">{{ rewards()?.newXp }} / {{ rewards()?.newLevel! * 100 }} EXP</span>
                </div>
                <div class="w-full h-3 bg-bg-input rounded-full overflow-hidden border border-border-main">
                  <div
                    [style.width.%]="(rewards()?.newXp! / (rewards()?.newLevel! * 100)) * 100"
                    class="h-full bg-brand-primary transition-all duration-1000"
                  ></div>
                </div>
                <p class="text-xxs text-text-muted text-[10px]">
                  Số dư tài khoản: <strong>{{ rewards()?.newCoins }} Xu</strong>
                </p>
              </div>

              <div class="pt-6 max-w-sm mx-auto">
                <button
                  (click)="goBack()"
                  class="w-full bg-brand-primary text-bg-main hover:opacity-90 font-black py-3.5 rounded-xl shadow-md active:scale-98 transition-all inline-block cursor-pointer text-center text-xs border-none flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                  Quay Lại Bản Đồ Học Tập
                </button>
              </div>

            </div>
          }

        }

      </div>

      <!-- LEVEL UP CELEBRATION MODAL OVERLAY -->
      @if (showLevelUpModal() && rewards()) {
        <div class="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div class="relative w-full max-w-sm bg-bg-card border border-border-main rounded-2xl p-8 text-center shadow-2xl space-y-6 overflow-hidden animate-bounce-short">

            <div class="space-y-2">
              <div class="w-16 h-16 rounded-full bg-bg-input border border-border-main flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown text-text-main"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.019a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
              </div>
              <h2 class="text-3xl font-black text-text-main tracking-tight">THĂNG CẤP!</h2>
              <p class="text-xs text-text-muted uppercase tracking-widest font-bold">Level Up Promoted</p>
            </div>

            <div class="py-4 border-y border-border-main/50 space-y-3">
              <p class="text-sm text-text-muted">Bạn đã đạt đến cấp độ mới:</p>
              <div class="flex justify-center items-center gap-4">
                <span class="text-2xl font-black text-text-muted line-through">Lớp {{ rewards()?.previousLevel }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right text-text-muted"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                <span class="text-4xl font-black text-text-main">Lớp {{ rewards()?.newLevel }}</span>
              </div>
              
              @if (rewards()?.newTitle; as title) {
                <div class="mt-4">
                  <p class="text-[11px] text-text-muted uppercase tracking-wider font-bold">Danh hiệu tiến hóa:</p>
                  <span class="bg-bg-input text-text-main border border-border-main text-xs font-bold px-3 py-1 rounded-full inline-block mt-1 uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sword"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/></svg>
                    {{ title }}
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sword"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/></svg>
                  </span>
                </div>
              }
            </div>

            <button
              (click)="closeLevelUpModal()"
              class="w-full bg-brand-primary text-bg-main font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              Tiếp tục hành trình
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

    @keyframes bounceShort {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .animate-bounce-short {
      animation: bounceShort 2s infinite ease-in-out;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class StudyComponent implements OnInit, OnDestroy {
  private readonly studyService = inject(StudyService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly userWordService = inject(UserWordService);
  private readonly toastService = inject(ToastService);

  moduleId = 0;
  
  // Tab selected: 'grammar' | 'vocabulary' | 'listening' | 'pronunciation'
  activeTab = signal<'grammar' | 'vocabulary' | 'listening' | 'pronunciation'>('grammar');
  
  // States: 'learning' | 'quiz_completed' | 'rewards' | 'quiz_failed'
  studyState = signal<'learning' | 'quiz_completed' | 'rewards' | 'quiz_failed'>('learning');

  isSingleSkillMode = signal(false);
  nextProgressParam = 'TEST';

  savedWords = signal<UserWord[]>([]);
  currentWordNotes = '';
  isNotesSaving = signal(false);
  private notesSaveTimeout: any = null;

  moduleTitle = signal<string>('Chủ đề học');
  moduleDescription = signal<string>('Nội dung học chi tiết');
  studyMode = signal<'study' | 'test'>('study');

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

  // Listening Mode States
  isListeningAudioPlaying = signal(false);
  listeningWave = [
    { height: 8 }, { height: 20 }, { height: 12 }, { height: 24 }, { height: 16 },
    { height: 6 }, { height: 15 }, { height: 28 }, { height: 10 }, { height: 18 }
  ];
  selectedListeningAnswer = signal<string | null>(null);
  listeningSubmitted = signal(false);
  isListeningCorrect = signal(false);

  // Pronunciation Mode States
  selectedSpeakWordIndex = signal(0);
  isRecording = signal(false);
  speakScore = signal<number | null>(null);

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('moduleId'));
    
    // Read the query parameter mode ('study' or 'test')
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    if (modeParam === 'study' || modeParam === 'test') {
      this.studyMode.set(modeParam);
    }

    // Read the query parameter tab
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'grammar' || tabParam === 'vocabulary' || tabParam === 'listening' || tabParam === 'pronunciation') {
      this.activeTab.set(tabParam);
    }

    // Read next parameter for progress update
    const nextParam = this.route.snapshot.queryParamMap.get('next');
    if (nextParam) {
      this.nextProgressParam = nextParam;
    }

    // Activate single skill mode if tab or mode=test is specified from maps
    if (tabParam || modeParam === 'test') {
      this.isSingleSkillMode.set(true);
    }

    if (!this.moduleId) {
      this.errorState.set(true);
      this.isLoading.set(false);
    } else {
      this.loadModuleContent();
      this.loadSavedWords();
    }
  }

  ngOnDestroy(): void {
    window.speechSynthesis.cancel();
  }

  updateLocalProgress(nextProgress: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`progress_module_${this.moduleId}`, nextProgress);
    }
  }

  completeSkillAndGoBack(): void {
    this.updateLocalProgress(this.nextProgressParam);
    this.studyService.completeStep(this.moduleId, this.activeTab().toUpperCase()).subscribe({
      next: (res) => {
        this.toastService.success(`✓ Hoàn thành: +${res.xpGained} EXP & +${res.coinsGained} Coins!`);
        if (res.leveledUp) {
          this.toastService.success(`🎉 LÊN CẤP: Cấp ${res.newLevel} (Danh hiệu: ${res.newTitle})!`, 5000);
        }
        this.goBack();
      },
      error: (err) => {
        console.error('Error completing step', err);
        this.goBack();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  loadSavedWords(): void {
    this.userWordService.getUserWords().subscribe({
      next: (words: UserWord[]) => {
        this.savedWords.set(words);
        this.updateCurrentNotes();
      },
      error: (err: any) => console.error('Error loading saved words', err)
    });
  }

  updateCurrentNotes(): void {
    if (this.flashcards.length === 0) return;
    const currentWordText = this.currentCard().word;
    const saved = this.savedWords().find(w => w.word.toLowerCase() === currentWordText.toLowerCase());
    this.currentWordNotes = saved ? (saved.notes || '') : '';
  }

  isWordSaved(wordText: string): boolean {
    return this.savedWords().some(w => w.word.toLowerCase() === wordText.toLowerCase());
  }

  toggleSaveWord(event: Event, card: Flashcard): void {
    event.stopPropagation();
    const wordText = card.word;
    const existing = this.savedWords().find(w => w.word.toLowerCase() === wordText.toLowerCase());

    if (existing) {
      this.userWordService.deleteUserWord(existing.id).subscribe({
        next: () => {
          this.savedWords.set(this.savedWords().filter(w => w.id !== existing.id));
          this.currentWordNotes = '';
        },
        error: (err: any) => console.error('Error deleting word', err)
      });
    } else {
      const payload = {
        word: card.word,
        partOfSpeech: card.partOfSpeech || 'noun',
        definition: card.definition,
        phonetic: card.phonetic || '',
        notes: ''
      };
      this.userWordService.saveUserWord(payload).subscribe({
        next: (saved: UserWord) => {
          this.savedWords.set([...this.savedWords(), saved]);
          this.currentWordNotes = '';
        },
        error: (err: any) => console.error('Error saving word', err)
      });
    }
  }

  onNotesChange(card: Flashcard): void {
    const existing = this.savedWords().find(w => w.word.toLowerCase() === card.word.toLowerCase());
    if (!existing) return;

    if (this.notesSaveTimeout) {
      clearTimeout(this.notesSaveTimeout);
    }

    this.isNotesSaving.set(true);
    this.notesSaveTimeout = setTimeout(() => {
      this.userWordService.updateUserWord(existing.id, { notes: this.currentWordNotes }).subscribe({
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

  loadModuleContent(): void {
    this.isLoading.set(true);
    this.errorState.set(false);

    this.studyService.getModuleContent(this.moduleId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        if (data && data.flashcards && data.quizQuestions) {
          this.flashcards = data.flashcards;
          this.quizQuestions = data.quizQuestions;
          if (data.moduleTitle) this.moduleTitle.set(data.moduleTitle);
          if (data.moduleDescription) this.moduleDescription.set(data.moduleDescription);
          this.initializeMatchingData();
          this.updateCurrentNotes();
        } else {
          this.loadMockContent();
        }
      },
      error: (err) => {
        console.error('Error loading module content', err);
        // Fallback to local mockup data if the server fails
        this.loadMockContent();
      }
    });
  }

  loadMockContent(): void {
    this.isLoading.set(false);
    this.errorState.set(false);
    this.moduleTitle.set('Module ' + this.moduleId + ': English Lesson');
    this.moduleDescription.set('Hãy hoàn thành phần học lý thuyết và làm bài test đánh giá để qua màn.');
    
    this.flashcards = [
      { id: 1, word: 'Elaborate', partOfSpeech: 'adjective', phonetic: '/iˈlæb.ər.ət/', definition: 'Kỹ lưỡng, tỉ mỉ, công phu', exampleSentence: 'The RPG interface was designed with elaborate care.', exampleTranslation: 'Giao diện RPG được thiết kế với sự chăm chút tỉ mỉ.' },
      { id: 2, word: 'Pragmatic', partOfSpeech: 'adjective', phonetic: '/præɡˈmæt.ɪk/', definition: 'Thực tế, thực tiễn', exampleSentence: 'We must take a pragmatic approach to language learning.', exampleTranslation: 'Chúng ta phải có một hướng tiếp cận thực tế đối với việc học ngôn ngữ.' },
      { id: 3, word: 'Consolidate', partOfSpeech: 'verb', phonetic: '/kənˈsɒl.ɪ.deɪt/', definition: 'Củng cố, hợp nhất', exampleSentence: 'Practice grammar daily to consolidate your knowledge.', exampleTranslation: 'Luyện tập ngữ pháp hàng ngày để củng cố kiến thức của bạn.' }
    ];

    this.quizQuestions = [
      {
        id: 1,
        type: 'MULTIPLE_CHOICE',
        questionText: 'Select the correct word: The plans for the project were very ________, requiring months of design.',
        optionA: 'pragmatic',
        optionB: 'elaborate',
        optionC: 'obsolete',
        optionD: 'trivial',
        correctAnswer: 'B',
        explanation: 'Elaborate có nghĩa là kỹ lưỡng, phức tạp, phù hợp với ngữ cảnh cần thiết kế nhiều tháng.'
      },
      {
        id: 2,
        type: 'FILL_IN_BLANK',
        questionText: 'Fill in the blank: "We must ________ (củng cố) our vocabulary daily to avoid forgetting."',
        optionA: 'consolidate',
        optionB: 'adhere',
        optionC: 'negotiate',
        optionD: 'postpone',
        correctAnswer: 'A',
        explanation: 'Consolidate có nghĩa là củng cố, làm cho vững chắc.'
      }
    ];
    this.initializeMatchingData();
    this.updateCurrentNotes();
  }

  currentCard(): Flashcard {
    return this.flashcards[this.currentCardIndex];
  }

  prevCard(): void {
    if (this.currentCardIndex > 0) {
      this.isFlipped = false;
      this.currentCardIndex--;
      this.updateCurrentNotes();
    }
  }

  nextCard(): void {
    if (this.currentCardIndex < this.flashcards.length - 1) {
      this.isFlipped = false;
      this.currentCardIndex++;
      this.updateCurrentNotes();
    }
  }

  speakWord(event: Event, word: string): void {
    event.stopPropagation();
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

  getTestScore(): number {
    if (this.quizQuestions.length === 0) return 0;
    const score = (this.correctQuizAnswersCount * 10.0) / this.quizQuestions.length;
    return Math.round(score * 10) / 10;
  }

  resetTest(): void {
    this.userQuizAnswers = {};
    this.initializeMatchingData();
    this.correctQuizAnswersCount = 0;
    this.studyState.set('learning');
    this.studyMode.set('test');
  }

  getGrammarTheory(): { title: string; sections: { heading: string; detail: string; example?: string }[] } {
    if (this.moduleId === 1) {
      return {
        title: 'Lý thuyết Ngữ pháp: Các từ loại trong Tiếng Anh (Parts of Speech)',
        sections: [
          {
            heading: '1. Danh từ (Noun - N)',
            detail: 'Từ dùng để chỉ người, sự vật, địa điểm, khái niệm. Ví dụ các từ vựng trong bài học: achievement (thành tựu), vocabulary (từ vựng).',
            example: 'Example: "Passing the exam was a great achievement."'
          },
          {
            heading: '2. Động từ (Verb - V)',
            detail: 'Từ dùng để chỉ hành động hoặc trạng thái của một chủ thể. Ví dụ: consolidate (củng cố, hợp nhất).',
            example: 'Example: "We need to consolidate our basic grammar."'
          },
          {
            heading: '3. Tính từ (Adjective - Adj)',
            detail: 'Từ bổ nghĩa cho danh từ, mô tả đặc tính, tính chất của sự vật. Ví dụ: fundamental (cơ bản, chủ chốt).',
            example: 'Example: "Grammar is a fundamental part of learning English."'
          },
          {
            heading: '4. Giới từ (Preposition - Prep)',
            detail: 'Từ biểu thị mối tương quan giữa hai danh từ hoặc đại từ. Ví dụ: preposition (giới từ).',
            example: 'Example: "In, on, and at are common prepositions."'
          }
        ]
      };
    } else if (this.moduleId === 2) {
      return {
        title: 'Lý thuyết Ngữ pháp: Từ vựng giao tiếp & đàm phán công sở (Business English)',
        sections: [
          {
            heading: '1. Động từ hợp tác (Collaborate)',
            detail: 'Dùng để mô tả việc làm việc chung giữa nhiều người. Thường đi kèm giới từ "on" (hợp tác về cái gì) hoặc "with" (hợp tác với ai).',
            example: 'Example: "We should collaborate on this project."'
          },
          {
            heading: '2. Cấu trúc đàm phán (Negotiation)',
            detail: 'Danh từ chỉ sự thương lượng. Cấu trúc thường dùng: "under negotiation" (đang đàm phán) hoặc "end with a successful agreement" (kết thúc bằng hợp đồng thành công).',
            example: 'Example: "The contract is under negotiation."'
          },
          {
            heading: '3. Danh từ chỉ mối quan hệ (Colleague)',
            detail: 'Chỉ người làm việc chung, đồng nghiệp trong công ty.',
            example: 'Example: "My colleague helped me write the report."'
          }
        ]
      };
    } else {
      return {
        title: 'Lý thuyết Ngữ pháp: Nghe hiểu & Đọc hiểu học thuật (Academic English)',
        sections: [
          {
            heading: '1. Danh từ chỉ quan điểm (Perspective)',
            detail: 'Chỉ góc nhìn, cách nhìn nhận một vấn đề. Thường sử dụng cụm từ "perspective on something" (quan điểm về cái gì).',
            example: 'Example: "Try to see it from my perspective."'
          },
          {
            heading: '2. Danh từ số nhiều bất quy tắc (Irregular Plural)',
            detail: 'Một số danh từ học thuật khi chuyển sang số nhiều có quy tắc thay đổi đặc biệt. Ví dụ: "analysis" (số ít) chuyển thành "analyses" (số nhiều).',
            example: 'Example: "The data analysis was very helpful. We need more analyses."'
          },
          {
            heading: '3. Thuật ngữ chuyên ngành (Terminology)',
            detail: 'Chỉ hệ thống các từ ngữ chuyên sâu trong một lĩnh vực học thuật cụ thể.',
            example: 'Example: "Medical terminology is hard to learn."'
          }
        ]
      };
    }
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
    
    const score = (correct * 10.0) / this.quizQuestions.length;
    if (score >= 7.0) {
      this.studyState.set('quiz_completed');
    } else {
      this.studyState.set('quiz_failed');
    }
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
        this.toastService.success(`🏆 Hoàn thành bài test: +${res.xpGained} EXP & +${res.coinsGained} Coins!`);
        if (res.leveledUp) {
          this.toastService.success(`🎉 LÊN CẤP: Cấp ${res.newLevel} (Danh hiệu: ${res.newTitle})!`, 5000);
        }
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(`progress_module_${this.moduleId}`);
        }
        this.goBack();
      },
      error: (err) => {
        console.error('Error claiming module rewards', err);
        this.isSubmittingReward.set(false);
        this.toastService.success('🏆 Đã hoàn thành bài test!');
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(`progress_module_${this.moduleId}`);
        }
        this.goBack();
      }
    });
  }

  closeLevelUpModal(): void {
    this.showLevelUpModal.set(false);
  }

  // Listening Tab Controller
  toggleListeningAudio(): void {
    if (this.isListeningAudioPlaying()) {
      this.stopListeningAudio();
    } else {
      this.playListeningAudio();
    }
  }

  playListeningAudio(): void {
    this.isListeningAudioPlaying.set(true);
    const intId = setInterval(() => {
      this.listeningWave.forEach(bar => {
        bar.height = Math.floor(Math.random() * 24) + 6;
      });
    }, 120);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = "We must take a pragmatic approach to language learning. Daily flashcards help to consolidate our vocabulary. It is the most effective way to avoid forgetting new words.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => {
        clearInterval(intId);
        this.isListeningAudioPlaying.set(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  }

  stopListeningAudio(): void {
    this.isListeningAudioPlaying.set(false);
    window.speechSynthesis.cancel();
  }

  selectListeningAnswer(ans: string): void {
    if (this.listeningSubmitted()) return;
    this.selectedListeningAnswer.set(ans);
  }

  submitListeningAnswer(): void {
    if (!this.selectedListeningAnswer()) return;
    this.listeningSubmitted.set(true);
    this.isListeningCorrect.set(this.selectedListeningAnswer() === 'B');
  }

  resetListening(): void {
    this.stopListeningAudio();
    this.selectedListeningAnswer.set(null);
    this.listeningSubmitted.set(false);
    this.isListeningCorrect.set(false);
  }

  // Pronunciation Tab Controller
  getSpeakWord(): string {
    if (this.flashcards.length === 0) return 'Elaborate';
    return this.flashcards[this.selectedSpeakWordIndex()]?.word || 'Elaborate';
  }

  getSpeakPhonetic(): string {
    if (this.flashcards.length === 0) return '/iˈlæb.ər.ət/';
    return this.flashcards[this.selectedSpeakWordIndex()]?.phonetic || '/iˈlæb.ər.ət/';
  }

  selectSpeakWord(idx: number): void {
    this.selectedSpeakWordIndex.set(idx);
    this.isRecording.set(false);
    this.speakScore.set(null);
  }

  toggleSpeakRecord(): void {
    if (this.isRecording()) {
      this.isRecording.set(false);
      return;
    }

    this.isRecording.set(true);
    this.speakScore.set(null);

    // Simulate voice check recording
    setTimeout(() => {
      if (this.isRecording()) {
        this.isRecording.set(false);
        this.speakScore.set(Math.floor(Math.random() * 20) + 80);
      }
    }, 2500);
  }
}

// polyfill
declare global {
  interface String {
    equalsIgnoreCase(other: string): boolean;
  }
}

if (!String.prototype.equalsIgnoreCase) {
  String.prototype.equalsIgnoreCase = function(other: string): boolean {
    return this.toLowerCase() === other.toLowerCase();
  };
}
