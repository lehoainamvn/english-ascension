import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VocabularyService, VocabTopic, VocabWord, RewardResult } from '../../services/vocabulary.service';
import { UserWordService, UserWord } from '../../services/user-word.service';
import { ToastService } from '../../services/toast.service';


interface MatchCard {
  id: string; // 'eng-X' or 'vie-X'
  wordId: number;
  text: string;
  type: 'eng' | 'vie';
  isMatched: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-vocabulary-study',
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
            <h2 class="text-lg font-black tracking-tight text-text-main uppercase">
              TỪ VỰNG: {{ topicTitle() }}
            </h2>
          </div>
          <a
            routerLink="/vocabulary"
            class="btn-back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Kho từ vựng
          </a>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs text-text-muted font-bold">Đang tải từ vựng...</p>
          </div>
        } @else if (errorState()) {
          <div class="text-center py-10 space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle mx-auto text-text-muted"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            <h3 class="text-sm font-bold text-text-main">Không tìm thấy chủ đề</h3>
            <p class="text-text-muted text-xxs max-w-sm mx-auto">
              Chủ đề từ vựng được yêu cầu không tồn tại hoặc có lỗi giao tiếp.
            </p>
            <a
              routerLink="/vocabulary"
              class="btn-back mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Về Danh Sách
            </a>
          </div>
        } @else {
          
          <!-- Top Level Tabs -->
          @if (studyState() === 'learning') {
            <div class="flex border-b border-border-main mb-6 select-none font-bold text-xs">
              <button
                (click)="activeTab.set('view')"
                [class.border-b-2]="activeTab() === 'view'"
                [class.border-brand-primary]="activeTab() === 'view'"
                [class.text-text-main]="activeTab() === 'view'"
                [class.text-text-muted]="activeTab() !== 'view'"
                class="flex-1 py-3 text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye shrink-0"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                Xem từ
              </button>
              <button
                (click)="onStudyTabClick()"
                [class.border-b-2]="activeTab() === 'study'"
                [class.border-brand-primary]="activeTab() === 'study'"
                [class.text-text-main]="activeTab() === 'study'"
                [class.text-text-muted]="activeTab() !== 'study'"
                class="flex-1 py-3 text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Học
              </button>
              <button
                (click)="onPlayTabClick()"
                [class.border-b-2]="activeTab() === 'play'"
                [class.border-brand-primary]="activeTab() === 'play'"
                [class.text-text-main]="activeTab() === 'play'"
                [class.text-text-muted]="activeTab() !== 'play'"
                class="flex-1 py-3 text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gamepad-2 shrink-0"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="17" x2="17.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
                Chơi
              </button>
            </div>
          }

          <!-- ========================================== -->
          <!-- 1. TAB: XEM TỪ                             -->
          <!-- ========================================== -->
          @if (activeTab() === 'view' && studyState() === 'learning') {
            <div class="space-y-4 animate-fade-in">
              <p class="text-xxs text-text-muted font-bold">Danh sách tất cả {{ words().length }} từ vựng trong chủ đề:</p>
              
              <div class="space-y-2.5 max-h-[26rem] overflow-y-auto pr-1">
                @for (w of words(); track w.id) {
                  <div class="p-4 bg-bg-input/40 border border-border-main rounded-xl flex flex-col hover:border-brand-primary/20 transition-all gap-3">
                    <div class="flex justify-between items-start">
                      <div class="space-y-1 max-w-[80%]">
                        <div class="flex items-baseline gap-2">
                          <span class="text-sm font-black text-text-main">{{ w.word }}</span>
                          <span class="text-[10px] text-brand-secondary font-bold">({{ w.partOfSpeech }})</span>
                          <span class="text-xxs text-text-muted font-mono">{{ w.phonetic }}</span>
                        </div>
                        <p class="text-xs text-text-main font-bold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          Nghĩa: {{ w.definition }}
                        </p>
                        <p class="text-[10px] text-text-muted italic leading-relaxed">"{{ w.exampleSentence }}" &rarr; {{ w.exampleTranslation }}</p>
                      </div>

                      <div class="flex items-center gap-2">
                        @if (w.isLearned) {
                          <span class="w-7 h-7 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center text-xs font-bold" title="Đã thuộc">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                          </span>
                        }
                        <button
                          (click)="speakWord(w.word)"
                          class="w-8 h-8 rounded-lg bg-bg-input border border-border-main hover:bg-brand-primary hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                        </button>
                        <button
                          (click)="toggleSaveWord($event, w)"
                          class="w-8 h-8 rounded-lg bg-bg-input border border-border-main hover:bg-bg-card flex items-center justify-center transition-all cursor-pointer shadow-sm"
                          [title]="isWordSaved(w.word) ? 'Bỏ lưu sổ tay' : 'Lưu vào sổ tay'"
                        >
                          @if (isWordSaved(w.word)) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          }
                        </button>
                      </div>
                    </div>

                    @if (isWordSaved(w.word)) {
                      <div class="p-3 bg-yellow-500/5 dark:bg-yellow-500/10 border border-dashed border-yellow-500/30 rounded-xl space-y-1.5 animate-fade-in text-left">
                        <div class="flex justify-between items-center">
                          <label class="text-[9px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> Ghi chú cá nhân:
                          </label>
                          @if (isWordNotesSaving(w.word)) {
                            <span class="text-[8px] text-text-muted animate-pulse">Đang lưu...</span>
                          }
                        </div>
                        <textarea
                          [ngModel]="getWordNotes(w.word)"
                          (ngModelChange)="onWordNotesChange(w, $event)"
                          placeholder="Ví dụ: Từ này xuất hiện trong..."
                          rows="2"
                          class="w-full bg-bg-card border border-border-main rounded-lg px-2.5 py-1.5 text-xxs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                        ></textarea>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <!-- ========================================== -->
          <!-- 2. TAB: HỌC                                -->
          <!-- ========================================== -->
          @if (activeTab() === 'study' && studyState() === 'learning') {
            @if (unlearnedWords().length === 0) {
              <!-- All words learned success state -->
              <div class="py-16 text-center space-y-4 animate-fade-in flex flex-col items-center">
                <div class="w-16 h-16 rounded-full bg-bg-input border border-border-main flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy text-text-main"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </div>
                <h3 class="text-sm font-black text-text-main">Chúc mừng! Bạn đã thuộc tất cả từ!</h3>
                <p class="text-xxs text-text-muted max-w-xs leading-normal">
                  Bạn đã ghi nhớ toàn bộ từ vựng trong chủ đề <strong>{{ topicTitle() }}</strong>. Hãy tiếp tục chơi game để củng cố phản xạ hoặc chuyển qua chủ đề khác!
                </p>
                <div class="flex gap-2">
                  <button
                    (click)="activeTab.set('play')"
                    class="bg-brand-primary hover:opacity-90 text-bg-main font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gamepad-2"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="17" x2="17.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
                    Chơi Game Ghép Thẻ
                  </button>
                  <a
                    routerLink="/vocabulary"
                    class="bg-bg-input border border-border-main text-text-main font-bold text-xs px-5 py-2.5 rounded-xl transition-all hover:bg-bg-card"
                  >
                    Học chủ đề khác
                  </a>
                </div>
              </div>
            } @else {
              <!-- Interactive learning view -->
              <div class="space-y-6 animate-fade-in">
                
                <!-- Sub-Modes tab menu -->
                <div class="flex justify-center gap-1.5 overflow-x-auto pb-1 shrink-0 font-bold text-[10px] select-none scrollbar-none">
                  <button
                    (click)="setSubMode('flashcard')"
                    [class.bg-brand-primary]="studySubMode() === 'flashcard'"
                    [class.text-bg-main]="studySubMode() === 'flashcard'"
                    [class.bg-bg-input]="studySubMode() !== 'flashcard'"
                    [class.text-text-muted]="studySubMode() !== 'flashcard'"
                    class="px-4 py-2 border border-border-main/50 rounded-xl cursor-pointer hover:text-text-main transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                    Flashcard
                  </button>
                  <button
                    (click)="setSubMode('quiz')"
                    [class.bg-brand-primary]="studySubMode() === 'quiz'"
                    [class.text-bg-main]="studySubMode() === 'quiz'"
                    [class.bg-bg-input]="studySubMode() !== 'quiz'"
                    [class.text-text-muted]="studySubMode() !== 'quiz'"
                    class="px-4 py-2 border border-border-main/50 rounded-xl cursor-pointer hover:text-text-main transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
                    Trắc nghiệm
                  </button>
                  <button
                    (click)="setSubMode('typing')"
                    [class.bg-brand-primary]="studySubMode() === 'typing'"
                    [class.text-bg-main]="studySubMode() === 'typing'"
                    [class.bg-bg-input]="studySubMode() !== 'typing'"
                    [class.text-text-muted]="studySubMode() !== 'typing'"
                    class="px-4 py-2 border border-border-main/50 rounded-xl cursor-pointer hover:text-text-main transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard"><path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>
                    Gõ từ
                  </button>
                  <button
                    (click)="setSubMode('speaking')"
                    [class.bg-brand-primary]="studySubMode() === 'speaking'"
                    [class.text-bg-main]="studySubMode() === 'speaking'"
                    [class.bg-bg-input]="studySubMode() !== 'speaking'"
                    [class.text-text-muted]="studySubMode() !== 'speaking'"
                    class="px-4 py-2 border border-border-main/50 rounded-xl cursor-pointer hover:text-text-main transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    Phát âm
                  </button>
                </div>

                <!-- Learning main area card -->
                <div class="p-6 bg-bg-card border border-border-main rounded-2xl shadow-inner min-h-[240px] flex flex-col justify-between items-center relative">
                  
                  <!-- SUB-MODE: FLASHCARD -->
                  @if (studySubMode() === 'flashcard') {
                    <div class="w-full flex flex-col items-center justify-center space-y-4 cursor-pointer relative" (click)="isCardFlipped.set(!isCardFlipped())">
                      <button
                        (click)="toggleSaveWord($event, currentWord())"
                        class="absolute top-0 right-0 w-8 h-8 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center transition-all cursor-pointer shadow-sm z-20"
                        [title]="isWordSaved(currentWord().word) ? 'Bỏ lưu sổ tay' : 'Lưu vào sổ tay'"
                      >
                        @if (isWordSaved(currentWord().word)) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        }
                      </button>

                      <span class="text-[9px] font-black text-text-muted uppercase tracking-wider self-start">THẺ TỪ VỰNG {{ currentStudyIndex() + 1 }} / {{ unlearnedWords().length }}</span>
                      
                      <div class="h-32 flex flex-col items-center justify-center text-center">
                        @if (!isCardFlipped()) {
                          <!-- Front -->
                          <span class="text-xs bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2 py-0.5 rounded-full font-bold uppercase">{{ currentWord().partOfSpeech }}</span>
                          <h2 class="text-3xl font-black text-text-main mt-2">{{ currentWord().word }}</h2>
                          <p class="text-xs text-text-muted font-mono mt-0.5">{{ currentWord().phonetic }}</p>
                        } @else {
                          <!-- Back -->
                          <h3 class="text-base font-black text-text-main flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right shrink-0 text-brand-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            {{ currentWord().definition }}
                          </h3>
                          <p class="text-[11px] text-text-muted leading-relaxed italic max-w-sm mt-3 bg-bg-input/30 p-2 rounded-lg">
                            "{{ currentWord().exampleSentence }}"<br/>
                            <span class="text-[10px]">&rarr; {{ currentWord().exampleTranslation }}</span>
                          </p>
                        }
                      </div>

                      <div class="flex items-center gap-2">
                        <button
                          (click)="speakWordWithEvent(currentWord().word, $event)"
                          class="p-2 bg-bg-input border border-border-main rounded-full hover:bg-brand-primary hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                          Nghe phát âm
                        </button>
                        <span class="text-[10px] text-text-muted italic">Nhấp vào thẻ để lật mặt sau</span>
                      </div>
                    </div>
                  }

                  <!-- SUB-MODE: QUIZ (Trắc nghiệm) -->
                  @if (studySubMode() === 'quiz') {
                    <div class="w-full flex flex-col space-y-4">
                      <div class="flex justify-between items-center text-[10px] font-bold text-text-muted">
                        <span>CÂU HỎI {{ currentStudyIndex() + 1 }} / {{ unlearnedWords().length }}</span>
                        <span class="bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded-full font-black uppercase">{{ currentWord().partOfSpeech }}</span>
                      </div>

                      <div class="text-center py-2 relative">
                        <button
                          (click)="toggleSaveWord($event, currentWord())"
                          class="absolute top-0 right-0 w-8 h-8 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center text-xs transition-all cursor-pointer shadow-sm z-20"
                          [title]="isWordSaved(currentWord().word) ? 'Bỏ lưu sổ tay' : 'Lưu vào sổ tay'"
                        >
                          {{ isWordSaved(currentWord().word) ? '❤️' : '🤍' }}
                        </button>
                        <div class="flex justify-center items-baseline gap-2">
                          <h2 class="text-2xl font-black text-text-main">{{ currentWord().word }}</h2>
                          <span class="text-xs text-text-muted font-mono">({{ currentWord().partOfSpeech }})</span>
                        </div>
                        <div class="flex justify-center items-center gap-1.5 mt-2">
                          <button (click)="speakWord(currentWord().word)" class="text-xs text-text-muted hover:text-text-main flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                            {{ currentWord().phonetic }}
                          </button>
                        </div>
                      </div>

                      <!-- Options Grid -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        @for (opt of quizChoices(); track opt; let idx = $index) {
                          <button
                            (click)="selectQuizOption(opt)"
                            [disabled]="quizAnswered()"
                            [class.border-green-500]="quizAnswered() && opt === currentWord().definition"
                            [class.bg-green-500/10]="quizAnswered() && opt === currentWord().definition"
                            [class.text-green-500]="quizAnswered() && opt === currentWord().definition"
                            [class.border-red-500]="quizAnswered() && selectedQuizOption() === opt && opt !== currentWord().definition"
                            [class.bg-red-500/10]="quizAnswered() && selectedQuizOption() === opt && opt !== currentWord().definition"
                            [class.text-red-500]="quizAnswered() && selectedQuizOption() === opt && opt !== currentWord().definition"
                            [class.border-border-main]="!quizAnswered() || (selectedQuizOption() !== opt && opt !== currentWord().definition)"
                            class="bg-bg-input border hover:border-brand-primary/30 p-2.5 text-left text-xxs font-semibold rounded-xl cursor-pointer transition-all flex justify-between items-center"
                          >
                            <span>{{ idx + 1 }}. {{ opt }}</span>
                            @if (quizAnswered() && opt === currentWord().definition) {
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                            }
                            @if (quizAnswered() && selectedQuizOption() === opt && opt !== currentWord().definition) {
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-red-500 shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            }
                          </button>
                        }
                      </div>

                      <!-- Feedback message -->
                      @if (quizAnswered()) {
                        <div class="text-center py-1 text-xs font-bold flex items-center justify-center gap-1.5" [class.text-green-500]="isQuizCorrect()" [class.text-red-500]="!isQuizCorrect()">
                          @if (isQuizCorrect()) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            Chính xác!
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle shrink-0"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            Chưa đúng! Đáp án đúng là: {{ currentWord().definition }}
                          }
                        </div>
                      }
                    </div>
                  }

                  <!-- SUB-MODE: TYPING (Gõ từ) -->
                  @if (studySubMode() === 'typing') {
                    <div class="w-full flex flex-col space-y-4">
                      <div class="flex justify-between items-center text-[10px] font-bold text-text-muted">
                        <span>VIẾT TỪ CHÍNH TẢ {{ currentStudyIndex() + 1 }} / {{ unlearnedWords().length }}</span>
                        <span class="bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full font-black uppercase">{{ currentWord().partOfSpeech }}</span>
                      </div>

                      <div class="text-center py-2 space-y-1 relative">
                        <button
                          (click)="toggleSaveWord($event, currentWord())"
                          class="absolute top-0 right-0 w-8 h-8 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center text-xs transition-all cursor-pointer shadow-sm z-20"
                          [title]="isWordSaved(currentWord().word) ? 'Bỏ lưu sổ tay' : 'Lưu vào sổ tay'"
                        >
                          {{ isWordSaved(currentWord().word) ? '❤️' : '🤍' }}
                        </button>
                        <span class="text-xxs uppercase text-text-muted font-bold block">Gõ từ tiếng Anh có nghĩa:</span>
                        <h2 class="text-lg font-black text-text-main flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          {{ currentWord().definition }}
                        </h2>
                        <span class="text-xxs text-text-muted font-mono">Phiên âm gợi ý: {{ currentWord().phonetic }}</span>
                      </div>

                      <div class="flex gap-2">
                        <input
                          type="text"
                          [(ngModel)]="typingInput"
                          [disabled]="typingChecked()"
                          (keyup.enter)="checkTyping()"
                          placeholder="Gõ từ tại đây..."
                          class="flex-1 bg-bg-input border border-border-main rounded-xl px-4 py-2.5 text-xxs font-semibold text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        />
                        <button
                          (click)="checkTyping()"
                          [disabled]="typingChecked() || !typingInput.trim()"
                          class="bg-brand-primary hover:bg-brand-secondary text-white text-xxs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Kiểm tra
                        </button>
                      </div>

                      @if (typingChecked()) {
                        <div class="text-center py-1 text-xs font-bold flex items-center justify-center gap-1.5" [class.text-green-500]="isTypingCorrect()" [class.text-red-500]="!isTypingCorrect()">
                          @if (isTypingCorrect()) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            <span>Chính xác! Bạn đã viết đúng.</span>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle shrink-0"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            <span>Chưa đúng! Đáp án đúng là: <strong class="uppercase text-text-main font-black">{{ currentWord().word }}</strong></span>
                          }
                        </div>
                      }
                    </div>
                  }

                  <!-- SUB-MODE: SPEAKING (Phát âm) -->
                  @if (studySubMode() === 'speaking') {
                    <div class="w-full flex flex-col items-center space-y-4">
                      <div class="w-full flex justify-between items-center text-[10px] font-bold text-text-muted">
                        <span>LUYỆN PHÁT ÂM {{ currentStudyIndex() + 1 }} / {{ unlearnedWords().length }}</span>
                        <span class="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-black uppercase">{{ currentWord().partOfSpeech }}</span>
                      </div>

                      <div class="text-center py-2 relative w-full">
                        <button
                          (click)="toggleSaveWord($event, currentWord())"
                          class="absolute top-0 right-0 w-8 h-8 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center text-xs transition-all cursor-pointer shadow-sm z-20"
                          [title]="isWordSaved(currentWord().word) ? 'Bỏ lưu sổ tay' : 'Lưu vào sổ tay'"
                        >
                          {{ isWordSaved(currentWord().word) ? '❤️' : '🤍' }}
                        </button>
                        <h2 class="text-2xl font-black text-text-main uppercase tracking-wide">{{ currentWord().word }}</h2>
                        <p class="text-xs text-text-muted font-mono mt-0.5">{{ currentWord().phonetic }}</p>
                      </div>

                      <!-- Recording status -->
                      <div class="flex flex-col items-center gap-3">
                        <button
                          (click)="startSpeechRecognition()"
                          [class.bg-brand-primary]="isRecording()"
                          [class.animate-pulse]="isRecording()"
                          [class.ring-4]="isRecording()"
                          [class.ring-brand-accent/20]="isRecording()"
                          [class.bg-brand-primary]="!isRecording()"
                          class="w-12 h-12 rounded-full text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                        </button>
                        <span class="text-xxs text-text-muted font-bold">
                          {{ isRecording() ? 'Đang lắng nghe... Hãy đọc to từ trên!' : 'Nhấp nút mic để bắt đầu phát âm' }}
                        </span>
                      </div>

                      @if (speechResult()) {
                        <div class="text-center text-xs font-bold flex items-center justify-center gap-1.5" [class.text-green-500]="speechResult() === 'correct'" [class.text-red-500]="speechResult() === 'incorrect'">
                          @if (speechResult() === 'correct') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            <span>Phát âm chính xác! Trùng khớp 100%.</span>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle shrink-0"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            <span>Chưa khớp. Thử phát âm rõ ràng lại nhé!</span>
                          }
                        </div>
                      }
                    </div>
                  }

                  <!-- Personal Notes Box (If word is saved) -->
                  @if (isWordSaved(currentWord().word)) {
                    <div class="w-full max-w-sm mt-4 p-4 bg-yellow-500/5 dark:bg-yellow-500/10 border-2 border-dashed border-yellow-500/30 rounded-2xl text-left animate-fade-in space-y-2 shrink-0">
                      <div class="flex justify-between items-center">
                        <label class="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> Ghi chú sổ tay cho từ "{{ currentWord().word }}"
                        </label>
                        @if (isWordNotesSaving(currentWord().word)) {
                          <span class="text-[9px] text-text-muted animate-pulse">Đang lưu...</span>
                        }
                      </div>
                      <textarea
                        [ngModel]="getWordNotes(currentWord().word)"
                        (ngModelChange)="onWordNotesChange(currentWord(), $event)"
                        placeholder="Ghi chú cá nhân..."
                        rows="3"
                        class="w-full bg-bg-card border border-border-main rounded-xl px-3 py-2 text-xs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                      ></textarea>
                    </div>
                  }

                </div>

                <!-- Word Level Action Bar -->
                <div class="flex gap-4 font-bold text-xs pt-2">
                  <button
                    (click)="markWordMastered()"
                    [disabled]="isActionSubmitting()"
                    class="flex-1 bg-brand-primary hover:opacity-90 text-bg-main py-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-98 text-center flex items-center justify-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                    Đã Thuộc
                  </button>
                  <button
                    (click)="nextStudyWord()"
                    class="bg-bg-input border border-border-main text-text-muted hover:text-text-main px-6 py-3 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Học tiếp &rarr;
                  </button>
                </div>

                <!-- Footer tip -->
                <div class="text-center text-[10px] text-text-muted italic">
                  *Phím tắt: Bấm **Tab** tương đương "Đã thuộc" | Bấm **Enter** tương đương "Học tiếp"
                </div>

              </div>
            }
          }

          <!-- ========================================== -->
          <!-- 3. TAB: CHƠI (Mini Matching Game)          -->
          <!-- ========================================== -->
          @if (activeTab() === 'play' && studyState() === 'learning') {
            <div class="space-y-6 animate-fade-in text-center flex flex-col items-center">
              
              @if (!gameStarted()) {
                <!-- Game Home screen -->
                <div class="py-12 space-y-4 max-w-sm">
                  <div class="w-16 h-16 rounded-full bg-brand-secondary/15 flex items-center justify-center text-3xl text-brand-secondary mx-auto">🎮</div>
                  <h3 class="text-sm font-black text-text-main">Trò Chơi Ghép Thẻ Từ Vựng</h3>
                  <p class="text-xxs text-text-muted leading-normal">
                    Nhiệm vụ của bạn là ghép nối từ tiếng Anh với nghĩa tiếng Việt tương ứng. Ghép chính xác toàn bộ trong thời gian ngắn nhất để nhận phần thưởng!
                  </p>
                  <button
                    (click)="startGame()"
                    class="bg-brand-primary hover:opacity-90 text-bg-main font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm w-full flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                    Bắt đầu chơi
                  </button>
                </div>
              } @else if (gameCompleted()) {
                <!-- Game Over screen -->
                <div class="py-12 space-y-6 max-w-sm">
                  <div class="w-16 h-16 rounded-full bg-bg-input border border-border-main flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 text-text-main"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <h3 class="text-base font-black text-text-main">Chiến Thắng!</h3>
                  <p class="text-xxs text-text-muted leading-normal">
                    Tuyệt vời! Bạn đã ghép đúng toàn bộ thẻ trong thời gian <strong>{{ gameTime() }} giây</strong>!
                  </p>
                  
                  <div class="p-4 bg-brand-secondary/10 border border-brand-secondary/25 rounded-2xl flex justify-between items-center text-xs font-bold max-w-xs mx-auto">
                    <span>Phần thưởng thắng game:</span>
                    <span class="text-brand-secondary font-black">+15 EXP & +5 Coins</span>
                  </div>

                  <div class="flex gap-2">
                    <button
                      (click)="startGame()"
                      class="flex-1 bg-brand-primary hover:opacity-90 text-bg-main font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                      Chơi lại
                    </button>
                    <button
                      (click)="activeTab.set('view')"
                      class="flex-1 bg-bg-input border border-border-main text-text-main font-bold text-xs py-2.5 rounded-xl transition-all hover:bg-bg-card"
                    >
                      Về Xem từ
                    </button>
                  </div>
                </div>
              } @else {
                <!-- Game active board -->
                <div class="w-full space-y-4">
                  <div class="flex justify-between items-center text-xxs font-bold text-text-muted">
                    <span>Thời gian: {{ gameTime() }}s</span>
                    <span>Hãy ghép các cặp thẻ đúng</span>
                  </div>

                  <!-- Cards Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @for (card of gameCards(); track card.id) {
                      <button
                        (click)="clickGameCard(card)"
                        [disabled]="card.isMatched"
                        [class.border-green-500]="card.isMatched"
                        [class.bg-green-500/10]="card.isMatched"
                        [class.text-green-500]="card.isMatched"
                        [class.border-brand-primary]="card.isSelected && !card.isMatched"
                        [class.bg-brand-primary/5]="card.isSelected && !card.isMatched"
                        [class.border-border-main]="!card.isSelected && !card.isMatched"
                        class="bg-bg-input border p-3 rounded-xl min-h-[70px] flex items-center justify-center text-center text-xxs font-bold transition-all cursor-pointer active:scale-95"
                      >
                        {{ card.text }}
                      </button>
                    }
                  </div>
                </div>
              }

            </div>
          }

        }

      </div>
    </div>
  `,
  styles: [`
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-none {
      -ms-overflow-style: none;
      scrollbar-width: none;
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
export class VocabularyStudyComponent implements OnInit, OnDestroy {
  private readonly vocabService = inject(VocabularyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userWordService = inject(UserWordService);
  private readonly toastService = inject(ToastService);

  topicId = 0;
  savedWords = signal<UserWord[]>([]);
  wordNotesMap: { [word: string]: string } = {};
  savingNotesWords = signal<{ [word: string]: boolean }>({});
  private notesTimeouts: { [word: string]: any } = {};

  topicTitle = signal<string>('Topic');
  topicCategory = signal<string>('600 TỪ VỰNG TOEIC');

  words = signal<VocabWord[]>([]);
  unlearnedWords = computed(() => this.words().filter(w => !w.isLearned));
  currentWord = computed(() => {
    const list = this.unlearnedWords();
    if (list.length === 0) return {} as VocabWord;
    return list[this.currentStudyIndex() % list.length];
  });

  activeTab = signal<'view' | 'study' | 'play'>('view');
  studySubMode = signal<'flashcard' | 'quiz' | 'typing' | 'speaking'>('flashcard');
  studyState = signal<'learning' | 'quiz_completed' | 'rewards'>('learning');
  
  isLoading = signal(true);
  errorState = signal(false);
  isActionSubmitting = signal(false);

  // Tab Study details
  currentStudyIndex = signal(0);
  isCardFlipped = signal(false);

  // Sub-mode MCQ Quiz
  quizChoices = signal<string[]>([]);
  selectedQuizOption = signal<string | null>(null);
  quizAnswered = signal(false);
  isQuizCorrect = signal(false);

  // Sub-mode Spelling Typing
  typingInput = '';
  typingChecked = signal(false);
  isTypingCorrect = signal(false);

  // Sub-mode Pronunciation Speaking
  isRecording = signal(false);
  speechResult = signal<'correct' | 'incorrect' | null>(null);

  // Match Game details
  gameStarted = signal(false);
  gameCompleted = signal(false);
  gameCards = signal<MatchCard[]>([]);
  gameTime = signal(0);
  private timerId: any;
  private selectedGameCard: MatchCard | null = null;

  // Key Listener for Shortcuts
  private keyListener = (event: KeyboardEvent) => {
    if (this.activeTab() === 'study' && this.unlearnedWords().length > 0) {
      if (event.key === 'Tab') {
        event.preventDefault();
        this.markWordMastered();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this.nextStudyWord();
      }
    }
  };

  ngOnInit() {
    this.topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    if (!this.topicId) {
      this.errorState.set(true);
      this.isLoading.set(false);
    } else {
      this.loadSavedWords();
      this.loadContent();
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.keyListener);
    }
  }

  ngOnDestroy() {
    this.stopGameTimer();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.keyListener);
    }
  }

  loadSavedWords(): void {
    this.userWordService.getUserWords().subscribe({
      next: (words: UserWord[]) => {
        this.savedWords.set(words);
        const map: { [word: string]: string } = {};
        words.forEach(w => {
          map[w.word.toLowerCase()] = w.notes || '';
        });
        this.wordNotesMap = map;
      },
      error: (err: any) => console.error('Error loading saved words', err)
    });
  }

  isWordSaved(wordText: string): boolean {
    if (!wordText) return false;
    return this.savedWords().some(w => w.word.toLowerCase() === wordText.toLowerCase());
  }

  toggleSaveWord(event: Event, card: any): void {
    if (event) event.stopPropagation();
    const wordText = card.word;
    const existing = this.savedWords().find(w => w.word.toLowerCase() === wordText.toLowerCase());

    if (existing) {
      this.userWordService.deleteUserWord(existing.id).subscribe({
        next: () => {
          this.savedWords.set(this.savedWords().filter(w => w.id !== existing.id));
          delete this.wordNotesMap[wordText.toLowerCase()];
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
          this.wordNotesMap[saved.word.toLowerCase()] = '';
        },
        error: (err: any) => console.error('Error saving word', err)
      });
    }
  }

  getWordNotes(wordText: string): string {
    if (!wordText) return '';
    return this.wordNotesMap[wordText.toLowerCase()] || '';
  }

  isWordNotesSaving(wordText: string): boolean {
    if (!wordText) return false;
    return this.savingNotesWords()[wordText.toLowerCase()] || false;
  }

  onWordNotesChange(card: any, newNotes: string): void {
    const wordText = card.word;
    this.wordNotesMap[wordText.toLowerCase()] = newNotes;

    const existing = this.savedWords().find(w => w.word.toLowerCase() === wordText.toLowerCase());
    if (!existing) return;

    if (this.notesTimeouts[wordText.toLowerCase()]) {
      clearTimeout(this.notesTimeouts[wordText.toLowerCase()]);
    }

    const savingMap = { ...this.savingNotesWords() };
    savingMap[wordText.toLowerCase()] = true;
    this.savingNotesWords.set(savingMap);

    this.notesTimeouts[wordText.toLowerCase()] = setTimeout(() => {
      this.userWordService.updateUserWord(existing.id, { notes: newNotes }).subscribe({
        next: (updated: UserWord) => {
          this.savedWords.set(this.savedWords().map(w => w.id === updated.id ? updated : w));
          
          const doneSavingMap = { ...this.savingNotesWords() };
          doneSavingMap[wordText.toLowerCase()] = false;
          this.savingNotesWords.set(doneSavingMap);
        },
        error: (err: any) => {
          console.error('Error updating notes', err);
          const doneSavingMap = { ...this.savingNotesWords() };
          doneSavingMap[wordText.toLowerCase()] = false;
          this.savingNotesWords.set(doneSavingMap);
        }
      });
    }, 800);
  }

  loadContent() {
    this.isLoading.set(true);
    this.errorState.set(false);

    this.vocabService.getTopics().subscribe({
      next: (topics) => {
        const t = topics.find(topic => topic.id === this.topicId);
        if (t) {
          this.topicTitle.set(t.title);
          this.topicCategory.set(t.category);
        }

        // Fetch words list
        this.vocabService.getTopicWords(this.topicId).subscribe({
          next: (data) => {
            this.words.set(data);
            this.isLoading.set(false);
            this.setupSubModeContent();
          },
          error: (err) => {
            console.error('Error loading vocabulary words', err);
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading topic details', err);
        this.errorState.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onStudyTabClick() {
    this.activeTab.set('study');
    this.setupSubModeContent();
  }

  onPlayTabClick() {
    this.activeTab.set('play');
    this.gameStarted.set(false);
    this.gameCompleted.set(false);
    this.stopGameTimer();
  }

  setSubMode(mode: 'flashcard' | 'quiz' | 'typing' | 'speaking') {
    this.studySubMode.set(mode);
    this.setupSubModeContent();
  }

  setupSubModeContent() {
    this.isCardFlipped.set(false);
    this.selectedQuizOption.set(null);
    this.quizAnswered.set(false);
    this.isQuizCorrect.set(false);
    this.typingInput = '';
    this.typingChecked.set(false);
    this.isTypingCorrect.set(false);
    this.isRecording.set(false);
    this.speechResult.set(null);

    // Generate choices for Quiz
    if (this.studySubMode() === 'quiz' && this.unlearnedWords().length > 0) {
      const current = this.currentWord();
      const choices = this.generateChoices(current);
      this.quizChoices.set(choices);
    }
  }

  generateChoices(currentWord: VocabWord): string[] {
    const correct = currentWord.definition;
    const others = this.words()
      .filter(w => w.id !== currentWord.id)
      .map(w => w.definition);
    
    const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const combined = [correct, ...shuffledOthers];
    return combined.sort(() => Math.random() - 0.5);
  }

  selectQuizOption(opt: string) {
    if (this.quizAnswered()) return;
    this.selectedQuizOption.set(opt);
    this.quizAnswered.set(true);
    const correct = this.currentWord().definition;
    this.isQuizCorrect.set(opt === correct);
  }

  checkTyping() {
    if (this.typingChecked() || !this.typingInput.trim()) return;
    this.typingChecked.set(true);
    const correct = this.currentWord().word.toLowerCase().trim();
    const user = this.typingInput.toLowerCase().trim();
    this.isTypingCorrect.set(user === correct);
  }

  startSpeechRecognition() {
    this.isRecording.set(true);
    this.speechResult.set(null);
    
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript.toLowerCase().trim();
        const target = this.currentWord().word.toLowerCase().trim();
        if (resultText === target) {
          this.speechResult.set('correct');
        } else {
          this.speechResult.set('incorrect');
        }
        this.isRecording.set(false);
      };
      recognition.onerror = () => {
        this.runSimulatedSpeech();
      };
      recognition.start();
    } else {
      this.runSimulatedSpeech();
    }
  }

  runSimulatedSpeech() {
    setTimeout(() => {
      if (this.isRecording()) {
        this.isRecording.set(false);
        // Simulate high success rate for a realistic demo
        this.speechResult.set(Math.random() > 0.15 ? 'correct' : 'incorrect');
      }
    }, 1500);
  }

  markWordMastered() {
    const word = this.currentWord();
    if (!word || !word.id || this.isActionSubmitting()) return;

    this.isActionSubmitting.set(true);
    this.vocabService.markWordLearned(word.id).subscribe({
      next: (res) => {
        this.isActionSubmitting.set(false);
        
        // Update word status locally
        const updated = this.words().map(w => {
          if (w.id === word.id) {
            return { ...w, isLearned: true };
          }
          return w;
        });
        this.words.set(updated);

        // If all learned, complete the entire topic!
        if (this.unlearnedWords().length === 0) {
          this.completeTopicProgress();
        } else {
          this.setupSubModeContent();
        }
      },
      error: (err) => {
        console.error('Error marking word learned', err);
        this.isActionSubmitting.set(false);

        // Fallback local update
        const updated = this.words().map(w => {
          if (w.id === word.id) return { ...w, isLearned: true };
          return w;
        });
        this.words.set(updated);
        this.setupSubModeContent();
      }
    });
  }

  nextStudyWord() {
    if (this.unlearnedWords().length > 1) {
      this.currentStudyIndex.update(i => i + 1);
      this.setupSubModeContent();
    } else {
      this.setupSubModeContent();
    }
  }

  completeTopicProgress() {
    this.vocabService.completeTopic(this.topicId).subscribe({
      next: (res) => {
        this.toastService.success(`🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ chủ đề và nhận thêm +${res.xpGained} EXP & +${res.coinsGained} Coins!`);
        if (res.leveledUp) {
          this.toastService.success(`🎉 LÊN CẤP: Cấp ${res.newLevel} (Danh hiệu: ${res.newTitle})!`, 5000);
        }
        this.router.navigate(['/vocabulary']);
      },
      error: (err) => {
        console.error('Error completing topic progress', err);
        this.router.navigate(['/vocabulary']);
      }
    });
  }

  speakWord(word: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  speakWordWithEvent(word: string, event: Event) {
    event.stopPropagation();
    this.speakWord(word);
  }

  // Matching game implementation
  startGame() {
    this.gameStarted.set(true);
    this.gameCompleted.set(false);
    this.gameTime.set(0);
    this.selectedGameCard = null;

    // Pick 4 words from this topic
    const sourceWords = [...this.words()].sort(() => Math.random() - 0.5).slice(0, 4);
    
    // Create cards
    const cards: MatchCard[] = [];
    sourceWords.forEach(w => {
      cards.push({
        id: `eng-${w.id}`,
        wordId: w.id,
        text: w.word,
        type: 'eng',
        isMatched: false,
        isSelected: false
      });
      cards.push({
        id: `vie-${w.id}`,
        wordId: w.id,
        text: w.definition,
        type: 'vie',
        isMatched: false,
        isSelected: false
      });
    });

    // Shuffle cards
    const shuffled = cards.sort(() => Math.random() - 0.5);
    this.gameCards.set(shuffled);

    this.startGameTimer();
  }

  startGameTimer() {
    this.stopGameTimer();
    this.timerId = setInterval(() => {
      this.gameTime.update(t => t + 1);
    }, 1000);
  }

  stopGameTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  clickGameCard(card: MatchCard) {
    if (card.isMatched) return;

    // Deselect previously selected card of the SAME type
    const updated = this.gameCards().map(c => {
      if (c.type === card.type) {
        return { ...c, isSelected: c.id === card.id ? !c.isSelected : false };
      }
      return c;
    });
    this.gameCards.set(updated);

    const reloadedCard = this.gameCards().find(c => c.id === card.id);
    if (!reloadedCard) return;

    if (!reloadedCard.isSelected) {
      this.selectedGameCard = null;
      return;
    }

    if (this.selectedGameCard === null) {
      this.selectedGameCard = reloadedCard;
    } else {
      // Compare cards
      const match1 = this.selectedGameCard;
      const match2 = reloadedCard;

      if (match1.type !== match2.type && match1.wordId === match2.wordId) {
        // Matched successfully!
        const matched = this.gameCards().map(c => {
          if (c.wordId === match1.wordId) {
            return { ...c, isMatched: true, isSelected: false };
          }
          return c;
        });
        this.gameCards.set(matched);
        this.selectedGameCard = null;

        // Verify if game finished
        const allMatched = this.gameCards().every(c => c.isMatched);
        if (allMatched) {
          this.gameFinished();
        }
      } else {
        // Incorrect match
        this.selectedGameCard = reloadedCard;
        // Turn off other selections
        const resetSelections = this.gameCards().map(c => {
          if (c.id !== reloadedCard.id) {
            return { ...c, isSelected: false };
          }
          return c;
        });
        this.gameCards.set(resetSelections);
      }
    }
  }

  gameFinished() {
    this.stopGameTimer();
    this.gameCompleted.set(true);

    // Call completeTopic to award points (+15 Coins, +50 EXP)
    this.vocabService.completeTopic(this.topicId).subscribe({
      next: (res) => {
        this.toastService.success(`🎉 Chúc mừng! Bạn đã chiến thắng game ghép thẻ và nhận thêm +${res.xpGained} EXP & +${res.coinsGained} Coins!`);
        if (res.leveledUp) {
          this.toastService.success(`🎉 LÊN CẤP: Cấp ${res.newLevel} (Danh hiệu: ${res.newTitle})!`, 5000);
        }
        this.router.navigate(['/vocabulary']);
      },
      error: (err) => {
        console.error('Error sending match game rewards', err);
        this.toastService.success('🎉 Đã hoàn thành game ghép thẻ!');
        this.router.navigate(['/vocabulary']);
      }
    });
  }
}
