import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudyAiService, UserDocListItem, UserDocDetails } from '../../../services/study-ai.service';
import { Flashcard, QuizQuestion } from '../../../services/study.service';
import { UserWordService, UserWord } from '../../../services/user-word.service';
import { ClassroomService, ClassRoomSummary, ClassQuizQuestionDto } from '../../../services/classroom.service';
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-ai-document-learning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-6 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>


      <main class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        <!-- Left Column: Upload area & Document list (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          
          <!-- Upload Area Card -->
          <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 shadow-xl">
            <h3 class="text-xs font-black text-text-main uppercase tracking-wider mb-3">Tải Lên Tài Liệu Học</h3>
            
            <div class="mb-4 flex items-center justify-between gap-3 text-xxs font-bold">
              <span class="text-text-muted">Số lượng từ vựng trích xuất:</span>
              <select 
                [(ngModel)]="flashcardCountToExtract"
                class="bg-bg-input border border-border-main rounded-lg px-2.5 py-1 text-text-main focus:outline-none focus:border-brand-primary"
              >
                <option [value]="5">5 từ vựng</option>
                <option [value]="10">10 từ vựng</option>
                <option [value]="15">15 từ vựng</option>
                <option [value]="20">20 từ vựng</option>
              </select>
            </div>

            <div
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
              [class.border-brand-primary]="isDragging"
              [class.bg-brand-primary/5]="isDragging"
              class="border-2 border-dashed border-border-main hover:border-brand-primary/60 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[12rem] bg-bg-input/20 relative"
            >
              <input
                type="file"
                (change)="onFileSelected($event)"
                accept=".pdf,.docx,.txt"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                [disabled]="isAnalyzing()"
              />
              
              @if (isAnalyzing()) {
                <div class="flex flex-col items-center justify-center space-y-3">
                  <div class="relative">
                    <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>
                  </div>
                  <p class="text-[11px] font-bold text-brand-primary animate-pulse">AI đang đọc & phân tích...</p>
                  <p class="text-[9px] text-text-muted">Đang trích xuất Flashcards & Quizzes</p>
                </div>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload-cloud text-text-muted mb-2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                <p class="text-xs font-bold text-text-main">Kéo thả hoặc Click để tải tệp</p>
                <p class="text-[10px] text-text-muted mt-1">Hỗ trợ định dạng PDF, DOCX, TXT</p>
                <p class="text-[9px] text-brand-secondary font-bold mt-3 bg-brand-secondary/10 px-2 py-0.5 rounded-full">Phân tích bằng AI Groq</p>
              }
            </div>
            
            @if (uploadError()) {
              <div class="mt-3 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xxs font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                {{ uploadError() }}
              </div>
            }
          </div>

          <!-- Document List Card -->
          <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
            <h3 class="text-xs font-black text-text-main uppercase tracking-wider border-b border-border-main/40 pb-2 mb-3 flex justify-between items-center">
              <span>Thư Viện Tài Liệu</span>
              <span class="bg-bg-input px-2 py-0.5 rounded text-[10px] font-bold text-text-muted">{{ documents().length }} file</span>
            </h3>

            <div class="space-y-2.5 overflow-y-auto max-h-[22rem] pr-1 flex-1">
              @if (documents().length === 0) {
                <div class="text-center py-10 text-text-muted text-xxs flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open text-text-muted/60"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  <p>Thư viện trống. Hãy tải lên tài liệu đầu tiên của bạn!</p>
                </div>
              }

              @for (doc of documents(); track doc.id) {
                <div
                  (click)="selectDocument(doc.id)"
                  [class.border-brand-primary]="selectedDocId() === doc.id"
                  [class.bg-brand-primary/5]="selectedDocId() === doc.id"
                  [class.border-border-main]="selectedDocId() !== doc.id"
                  [class.bg-bg-input/20]="selectedDocId() !== doc.id"
                  class="p-3 border rounded-xl cursor-pointer hover:border-brand-primary/50 transition-all flex items-center justify-between group text-xxs relative overflow-hidden"
                >
                  <div class="flex items-center gap-2.5 min-w-0 flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text shrink-0 text-text-muted"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                    <div class="min-w-0">
                      <p class="font-bold text-text-main truncate pr-2" [class.text-brand-primary]="selectedDocId() === doc.id">
                        {{ doc.fileName }}
                      </p>
                      <p class="text-[9px] text-text-muted mt-0.5">
                        {{ doc.createdAt | date:'dd/MM/yyyy HH:mm' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0 z-10">
                    <span class="bg-bg-input text-text-muted font-bold text-[8px] px-1.5 py-0.5 rounded">
                      {{ doc.flashcardCount }} từ
                    </span>
                    <button
                      (click)="deleteDocument($event, doc.id)"
                      class="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Xóa tài liệu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Right Column: Document Details Study Arena (8 cols) -->
        <div class="lg:col-span-8 flex flex-col min-h-[30rem]">
          
          @if (selectedDoc(); as doc) {
            <!-- Header of Selected Doc -->
            <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 shadow-xl mb-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-main/40 pb-4 mb-4">
                <div class="min-w-0">
                  <span class="text-[9px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2.5 py-0.5 rounded-full">Chi tiết học liệu AI</span>
                  <h2 class="text-lg font-black text-text-main mt-1.5 truncate pr-4">{{ doc.fileName }}</h2>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <button
                    (click)="openSaveToClassModal(doc)"
                    class="px-3.5 py-2 bg-brand-secondary/10 hover:bg-brand-secondary/20 border border-brand-secondary/30 text-brand-secondary hover:text-brand-secondary text-[10px] font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    title="Lưu bộ câu hỏi và từ vựng này vào lớp học của bạn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/><path d="M21.5 12v6"/></svg>
                    Lưu vào lớp
                  </button>
                  <div class="flex border border-border-main rounded-xl p-1 bg-bg-input/30 text-xxs font-bold">
                    <button
                      (click)="activeTab = 'flashcards'"
                      [class.bg-brand-primary]="activeTab === 'flashcards'"
                      [class.text-bg-main]="activeTab === 'flashcards'"
                      [class.text-text-muted]="activeTab !== 'flashcards'"
                      class="px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                      Flashcards
                    </button>
                    <button
                      (click)="activeTab = 'quizzes'"
                      [class.bg-brand-primary]="activeTab === 'quizzes'"
                      [class.text-bg-main]="activeTab === 'quizzes'"
                      [class.text-text-muted]="activeTab !== 'quizzes'"
                      class="px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
                      Thử Thách Quiz
                    </button>
                  </div>
                </div>
              </div>

              <!-- Content Tab Arena -->
              @if (activeTab === 'flashcards') {
                <!-- Flashcard Sub-arena -->
                <div class="flex flex-col items-center py-6">
                  
                  @if (doc.flashcards.length > 0) {
                    <!-- Main Flipped Card -->
                    <div
                      (click)="isFlipped = !isFlipped"
                      [class.flipped]="isFlipped"
                      class="flashcard-container w-full max-w-md h-60 cursor-pointer relative select-none rounded-2xl shadow-xl border border-border-main/50"
                    >
                      <!-- Front Side -->
                      <div class="flashcard-front absolute inset-0 bg-gradient-to-br from-bg-card to-bg-input flex flex-col justify-between p-6 rounded-2xl backface-hidden">
                        <div class="flex justify-between items-start">
                          <span class="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Từ vựng {{ currentCardIndex + 1 }}/{{ doc.flashcards.length }}</span>
                          <div class="flex items-center gap-2">
                            <button
                              (click)="toggleSaveWord($event, doc.flashcards[currentCardIndex])"
                              class="w-7 h-7 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center transition-all cursor-pointer shadow-sm z-20"
                              [title]="isWordSaved(doc.flashcards[currentCardIndex].word) ? 'Bỏ lưu sổ tay' : 'Lưu vào sổ tay'"
                            >
                              @if (isWordSaved(doc.flashcards[currentCardIndex].word)) {
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                              } @else {
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                              }
                            </button>
                            <button (click)="speakWord(doc.flashcards[currentCardIndex].word)" class="w-7 h-7 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center transition-all cursor-pointer shadow-sm" title="Phát âm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2 text-text-muted"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                            </button>
                            <button
                              (click)="deleteFlashcard($event, doc.flashcards[currentCardIndex])"
                              class="w-7 h-7 rounded-full bg-bg-card hover:bg-red-500/15 border border-border-main hover:border-red-500/30 flex items-center justify-center transition-all cursor-pointer shadow-sm z-20"
                              title="Xóa từ vựng khỏi tài liệu"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                          </div>
                        </div>
                        <div class="text-center my-auto space-y-1">
                          <h3 class="text-3xl font-black text-text-main tracking-tight">
                            {{ doc.flashcards[currentCardIndex].word }}
                          </h3>
                          <p class="text-xs text-brand-accent font-semibold">
                            {{ doc.flashcards[currentCardIndex].partOfSpeech }}
                          </p>
                          <p class="text-xxs text-text-muted italic">
                            {{ doc.flashcards[currentCardIndex].phonetic }}
                          </p>
                        </div>
                        <div class="text-center text-[10px] text-text-muted italic flex items-center justify-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                          Chạm vào thẻ để lật xem nghĩa
                        </div>
                      </div>

                      <!-- Back Side -->
                      <div class="flashcard-back absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-bg-card to-bg-input flex flex-col justify-between p-6 rounded-2xl backface-hidden rotate-y-180">
                        <div class="flex justify-between items-start">
                          <span class="text-[9px] font-bold text-brand-secondary uppercase tracking-widest">Giải nghĩa chi tiết</span>
                          <div class="flex items-center gap-2">
                            <button
                              (click)="toggleSaveWord($event, doc.flashcards[currentCardIndex])"
                              class="w-7 h-7 rounded-full bg-bg-card hover:bg-bg-input/60 border border-border-main flex items-center justify-center transition-all cursor-pointer shadow-sm z-20"
                              [title]="isWordSaved(doc.flashcards[currentCardIndex].word) ? 'Bỏ lưu sổ tay' : 'Lưu vào sổ tay'"
                            >
                              @if (isWordSaved(doc.flashcards[currentCardIndex].word)) {
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-main"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                              } @else {
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-text-muted"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                              }
                            </button>
                            <button
                              (click)="deleteFlashcard($event, doc.flashcards[currentCardIndex])"
                              class="w-7 h-7 rounded-full bg-bg-card hover:bg-red-500/15 border border-border-main hover:border-red-500/30 flex items-center justify-center transition-all cursor-pointer shadow-sm z-20"
                              title="Xóa từ vựng khỏi tài liệu"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                            <span class="text-xxs bg-brand-primary/15 text-brand-primary px-2 py-0.5 rounded-full font-bold">Ý NGHĨA</span>
                          </div>
                        </div>
                        <div class="text-center my-auto space-y-3">
                          <h4 class="text-lg font-black text-text-main">
                            {{ doc.flashcards[currentCardIndex].definition }}
                          </h4>
                          <div class="space-y-1 text-xxs">
                            <p class="text-text-main font-bold italic">
                              "{{ doc.flashcards[currentCardIndex].exampleSentence }}"
                            </p>
                            <p class="text-text-muted font-semibold">
                              {{ doc.flashcards[currentCardIndex].exampleTranslation }}
                            </p>
                          </div>
                        </div>
                        <div class="text-center text-[10px] text-text-muted italic flex items-center justify-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                          Chạm lần nữa để xem từ vựng
                        </div>
                      </div>
                    </div>

                    <!-- Navigation Controls -->
                    <div class="flex items-center gap-6 mt-8">
                      <button
                        (click)="prevCard()"
                        [disabled]="currentCardIndex === 0"
                        class="bg-bg-input hover:bg-bg-card border border-border-main text-text-main p-3 rounded-xl disabled:opacity-30 disabled:cursor-default cursor-pointer transition-all active:scale-95 font-bold text-xs"
                      >
                        &larr; Từ Trước
                      </button>
                      <span class="text-xs text-text-muted font-bold">
                        Từ {{ currentCardIndex + 1 }} / {{ doc.flashcards.length }}
                      </span>
                      <button
                        (click)="nextCard()"
                        [disabled]="currentCardIndex === doc.flashcards.length - 1"
                        class="bg-brand-primary hover:bg-brand-secondary text-white p-3 rounded-xl disabled:opacity-30 disabled:cursor-default cursor-pointer transition-all active:scale-95 font-bold text-xs shadow-md shadow-brand-primary/15"
                      >
                        Từ Tiếp &rarr;
                      </button>
                    </div>

                    <div class="mt-4 flex gap-3">
                      <button
                        (click)="openAddWordModal()"
                        class="px-4 py-2 border border-brand-primary/30 hover:border-brand-primary/60 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary rounded-xl font-bold text-xxs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                        Thêm từ vựng mới
                      </button>
                    </div>

                    <!-- Personal Notes Box (If word is saved) -->
                    @if (isWordSaved(doc.flashcards[currentCardIndex].word)) {
                      <div class="w-full max-w-md mt-4 p-4 bg-yellow-500/5 dark:bg-yellow-500/10 border-2 border-dashed border-yellow-500/30 rounded-2xl text-left animate-fade-in space-y-2 shrink-0">
                        <div class="flex justify-between items-center">
                          <label class="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> Ghi chú sổ tay cho từ "{{ doc.flashcards[currentCardIndex].word }}"
                          </label>
                          @if (isNotesSaving()) {
                            <span class="text-[9px] text-text-muted animate-pulse">Đang lưu...</span>
                          }
                        </div>
                        <textarea
                          [(ngModel)]="currentWordNotes"
                          (ngModelChange)="onNotesChange(doc.flashcards[currentCardIndex])"
                          placeholder="Ghi chú cá nhân..."
                          rows="3"
                          class="w-full bg-bg-card border border-border-main rounded-xl px-3 py-2 text-xs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all font-semibold resize-none"
                        ></textarea>
                      </div>
                    }
                  } @else {
                    <div class="text-center py-12 text-text-muted">
                      Chưa có flashcard cho tài liệu này.
                    </div>
                  }
                </div>
              } @else {
                <!-- Quiz Sub-arena -->
                <div class="py-4 space-y-6">
                  @if (doc.quizQuestions.length > 0) {
                    
                    @if (!showQuizResults) {
                      <!-- Quiz Customization Bar -->
                      <div class="p-3 bg-bg-input/30 border border-border-main/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xxs">
                        <span class="font-bold text-text-muted shrink-0">Tùy chỉnh quiz:</span>
                        <div class="flex flex-wrap items-center gap-2">
                          <div class="flex items-center gap-1.5">
                            <label class="text-text-muted font-bold">Loại:</label>
                            <select [(ngModel)]="quizCustomType" class="bg-bg-input border border-border-main rounded-lg px-2 py-1 text-text-main focus:outline-none focus:border-brand-primary font-bold">
                              <option value="MIXED">Hỗn hợp</option>
                              <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                              <option value="FILL_IN_BLANK">Điền vào chỗ trống</option>
                            </select>
                          </div>
                          <div class="flex items-center gap-1.5">
                            <label class="text-text-muted font-bold">Số câu:</label>
                            <select [(ngModel)]="quizCustomCount" class="bg-bg-input border border-border-main rounded-lg px-2 py-1 text-text-main focus:outline-none focus:border-brand-primary font-bold">
                              <option [value]="3">3 câu</option>
                              <option [value]="5">5 câu</option>
                              <option [value]="8">8 câu</option>
                              <option [value]="10">10 câu</option>
                              <option [value]="15">15 câu</option>
                            </select>
                          </div>
                          <button
                            (click)="regenerateQuiz(doc)"
                            [disabled]="isRegeneratingQuiz()"
                            class="px-3 py-1.5 bg-brand-secondary/10 hover:bg-brand-secondary/20 border border-brand-secondary/30 text-brand-secondary rounded-lg font-bold cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5"
                          >
                            @if (isRegeneratingQuiz()) {
                              <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              AI đang tạo...
                            } @else {
                              Tạo lại Quiz AI
                            }
                          </button>
                        </div>
                      </div>

                      <div class="space-y-6">
                        @for (q of doc.quizQuestions; track q.id; let idx = $index) {
                          <div class="p-5 border border-border-main/50 bg-bg-input/20 rounded-2xl space-y-4">
                            <div class="flex justify-between items-start">
                              <span class="text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Câu {{ idx + 1 }}</span>
                              <span class="text-[9px] text-text-muted font-semibold uppercase tracking-wider">{{ q.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : 'Điền vào chỗ trống' }}</span>
                            </div>
                            <h4 class="text-sm font-extrabold text-text-main leading-relaxed">
                              {{ q.questionText }}
                            </h4>

                            <!-- Choices for MULTIPLE CHOICE -->
                            @if (q.type === 'MULTIPLE_CHOICE') {
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <button
                                  (click)="selectAnswer(q.id, 'A')"
                                  [class.border-brand-primary]="selectedAnswers[q.id] === 'A'"
                                  [class.bg-brand-primary/5]="selectedAnswers[q.id] === 'A'"
                                  class="p-3 text-left border border-border-main hover:border-brand-primary/40 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                                >
                                  <span class="w-5 h-5 flex items-center justify-center bg-bg-input border border-border-main/50 rounded-full font-bold text-[10px] shrink-0">A</span>
                                  <span>{{ q.optionA }}</span>
                                </button>
                                <button
                                  (click)="selectAnswer(q.id, 'B')"
                                  [class.border-brand-primary]="selectedAnswers[q.id] === 'B'"
                                  [class.bg-brand-primary/5]="selectedAnswers[q.id] === 'B'"
                                  class="p-3 text-left border border-border-main hover:border-brand-primary/40 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                                >
                                  <span class="w-5 h-5 flex items-center justify-center bg-bg-input border border-border-main/50 rounded-full font-bold text-[10px] shrink-0">B</span>
                                  <span>{{ q.optionB }}</span>
                                </button>
                                <button
                                  (click)="selectAnswer(q.id, 'C')"
                                  [class.border-brand-primary]="selectedAnswers[q.id] === 'C'"
                                  [class.bg-brand-primary/5]="selectedAnswers[q.id] === 'C'"
                                  class="p-3 text-left border border-border-main hover:border-brand-primary/40 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                                >
                                  <span class="w-5 h-5 flex items-center justify-center bg-bg-input border border-border-main/50 rounded-full font-bold text-[10px] shrink-0">C</span>
                                  <span>{{ q.optionC }}</span>
                                </button>
                                <button
                                  (click)="selectAnswer(q.id, 'D')"
                                  [class.border-brand-primary]="selectedAnswers[q.id] === 'D'"
                                  [class.bg-brand-primary/5]="selectedAnswers[q.id] === 'D'"
                                  class="p-3 text-left border border-border-main hover:border-brand-primary/40 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                                >
                                  <span class="w-5 h-5 flex items-center justify-center bg-bg-input border border-border-main/50 rounded-full font-bold text-[10px] shrink-0">D</span>
                                  <span>{{ q.optionD }}</span>
                                </button>
                              </div>
                            }

                            <!-- Text input for FILL IN BLANK -->
                            @if (q.type === 'FILL_IN_BLANK') {
                              <div class="text-xs">
                                <input
                                  type="text"
                                  placeholder="Nhập từ còn thiếu..."
                                  [(ngModel)]="selectedAnswers[q.id]"
                                  class="w-full bg-bg-input border border-border-main rounded-xl p-3 focus:outline-none focus:border-brand-primary text-text-main text-xs"
                                />
                              </div>
                            }
                          </div>
                        }

                        <button
                          (click)="submitQuiz(doc.quizQuestions)"
                          class="w-full bg-brand-primary hover:opacity-90 text-bg-main text-xs font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-98 text-center flex items-center justify-center gap-2"
                        >
                          Nộp Bài Khảo Sát Quiz
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        </button>
                      </div>

                    } @else {
                      <!-- Quiz Results Panel -->
                      <div class="space-y-6">
                        <div class="text-center p-6 bg-bg-input/30 border border-border-main rounded-2xl max-w-md mx-auto space-y-2.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy mx-auto text-text-muted"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                          <h3 class="text-base font-black text-text-main">Kết Quả Luyện Tập</h3>
                          <p class="text-text-muted text-xs">Bạn đã trả lời đúng <strong>{{ correctCount }} / {{ doc.quizQuestions.length }}</strong> câu hỏi.</p>
                          <div class="text-2xl font-black text-text-main">{{ (correctCount / doc.quizQuestions.length) * 100 }}%</div>
                          <button
                            (click)="resetQuiz()"
                            class="bg-bg-input hover:bg-bg-card border border-border-main text-text-main text-xxs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                            Làm Lại Quiz
                          </button>
                        </div>

                        <!-- Detail feedback -->
                        <div class="space-y-4">
                          <h4 class="text-xs font-bold text-text-main border-b border-border-main/40 pb-1.5 uppercase">Chi tiết từng câu hỏi</h4>
                          
                          @for (q of doc.quizQuestions; track q.id; let idx = $index) {
                            <div
                              class="p-4 border rounded-xl space-y-2 text-xxs"
                              [class.border-green-500/30]="isAnswerCorrect(q)"
                              [class.bg-green-500/5]="isAnswerCorrect(q)"
                              [class.border-red-500/30]="!isAnswerCorrect(q)"
                              [class.bg-red-500/5]="!isAnswerCorrect(q)"
                            >
                              <div class="flex justify-between font-bold">
                                <span>Câu {{ idx + 1 }}: {{ q.type }}</span>
                                <span [class.text-green-500]="isAnswerCorrect(q)" [class.text-red-500]="!isAnswerCorrect(q)" class="flex items-center gap-0.5">
                                  @if (isAnswerCorrect(q)) {
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                                    Đúng
                                  } @else {
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                    Sai
                                  }
                                </span>
                              </div>
                              <p class="text-text-main font-semibold">{{ q.questionText }}</p>
                              
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-1 text-[10px] pt-1">
                                <p><span class="text-text-muted">Câu trả lời của bạn:</span> <strong [class.text-red-500]="!isAnswerCorrect(q)" [class.text-green-500]="isAnswerCorrect(q)">{{ selectedAnswers[q.id] || '(Không trả lời)' }}</strong></p>
                                <p><span class="text-text-muted">Đáp án đúng:</span> <strong class="text-green-500">{{ q.correctAnswer }}</strong></p>
                              </div>

                              <div class="bg-bg-card/40 border border-border-main/40 p-2.5 rounded-lg text-text-muted mt-2">
                                <span class="font-bold text-text-main">Giải thích AI:</span> {{ q.explanation }}
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }

                  } @else {
                    <div class="text-center py-12 text-text-muted">
                      Chưa có câu hỏi kiểm tra cho tài liệu này.
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Extracted Text Inspector Accordion -->
            <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-4 shadow-xl mt-4">
              <details class="group">
                <summary class="flex justify-between items-center font-bold text-xs text-text-main cursor-pointer list-none">
                  <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                    Xem văn bản tài liệu trích xuất
                  </span>
                  <span class="transition-transform group-open:rotate-180 text-xxs font-normal">▼</span>
                </summary>
                <div class="mt-4 pt-3 border-t border-border-main/30 text-xxs text-text-muted max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {{ doc.extractedText }}
                </div>
              </details>
            </div>

          } @else {
            <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-3xl p-8 shadow-xl flex-1 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 rounded-2xl bg-bg-input border border-border-main flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-open text-text-muted"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <h3 class="text-lg font-black text-text-main">AI Document Study Area</h3>
              <p class="text-text-muted text-xs max-w-sm mt-1 mb-6">
                Chọn một tài liệu từ danh sách bên trái hoặc tải lên tài liệu mới để bắt đầu học từ vựng và luyện kiểm tra.
              </p>
              <div class="p-4 bg-bg-input/30 border border-border-main rounded-2xl text-[11px] text-text-muted font-semibold max-w-sm flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb shrink-0 mt-0.5"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                Học từ tài liệu giúp bạn nắm vững các từ vựng chuyên ngành hoặc ôn tập đúng các văn bản phục vụ trực tiếp cho công việc của bạn!
              </div>
            </div>
          }
        </div>

      </main>

      <!-- Add Word Modal Dialog -->
      @if (isAddWordModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div class="bg-bg-card border border-border-main rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto m-4 text-left">
            <h3 class="text-sm font-black text-text-main uppercase tracking-wider mb-4 border-b border-border-main/40 pb-2 flex justify-between items-center">
              <span>Thêm từ vựng thủ công</span>
              <button (click)="closeAddWordModal()" class="text-text-muted hover:text-text-main cursor-pointer p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </h3>

            <div class="space-y-4 text-xs font-semibold">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] text-text-muted uppercase mb-1">Từ vựng *</label>
                  <input
                    type="text"
                    [(ngModel)]="newWordForm.word"
                    placeholder="E.g. enhance"
                    class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold"
                  />
                </div>
                <div>
                  <label class="block text-[10px] text-text-muted uppercase mb-1">Từ loại *</label>
                  <select
                    [(ngModel)]="newWordForm.partOfSpeech"
                    class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold"
                  >
                    <option value="verb">verb (động từ)</option>
                    <option value="noun">noun (danh từ)</option>
                    <option value="adjective">adjective (tính từ)</option>
                    <option value="adverb">adverb (trạng từ)</option>
                    <option value="preposition">preposition (giới từ)</option>
                    <option value="pronoun">pronoun (đại từ)</option>
                    <option value="conjunction">conjunction (liên từ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[10px] text-text-muted uppercase mb-1">Phiên âm</label>
                <input
                  type="text"
                  [(ngModel)]="newWordForm.phonetic"
                  placeholder="E.g. /ɪnˈhɑːns/"
                  class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold"
                />
              </div>

              <div>
                <label class="block text-[10px] text-text-muted uppercase mb-1">Định nghĩa tiếng Việt *</label>
                <input
                  type="text"
                  [(ngModel)]="newWordForm.definition"
                  placeholder="E.g. nâng cao, tăng cường"
                  class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold"
                />
              </div>

              <div>
                <label class="block text-[10px] text-text-muted uppercase mb-1">Câu ví dụ tiếng Anh</label>
                <textarea
                  [(ngModel)]="newWordForm.exampleSentence"
                  placeholder="E.g. We need to enhance our communication skills."
                  rows="2"
                  class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold resize-none"
                ></textarea>
              </div>

              <div>
                <label class="block text-[10px] text-text-muted uppercase mb-1">Dịch nghĩa câu ví dụ</label>
                <textarea
                  [(ngModel)]="newWordForm.exampleTranslation"
                  placeholder="E.g. Chúng ta cần nâng cao kỹ năng giao tiếp của mình."
                  rows="2"
                  class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold resize-none"
                ></textarea>
              </div>

              @if (addWordError) {
                <p class="text-red-500 text-xxs font-bold mt-1">{{ addWordError }}</p>
              }

              <div class="flex justify-end gap-3 pt-2">
                <button
                  (click)="closeAddWordModal()"
                  class="px-4 py-2 border border-border-main rounded-xl hover:bg-bg-input text-text-muted transition-all cursor-pointer font-bold text-xxs"
                >
                  Hủy bỏ
                </button>
                <button
                  (click)="submitAddWord()"
                  class="px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-secondary transition-all cursor-pointer font-bold text-xxs shadow-md shadow-brand-primary/15"
                >
                  Thêm từ
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Save to Class Modal Dialog -->
      @if (isSaveToClassModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div class="bg-bg-card border border-border-main rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto m-4 text-left">
            <h3 class="text-sm font-black text-text-main uppercase tracking-wider mb-4 border-b border-border-main/40 pb-2 flex justify-between items-center">
              <span>Lưu bộ câu hỏi vào lớp học</span>
              <button (click)="closeSaveToClassModal()" class="text-text-muted hover:text-text-main cursor-pointer p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </h3>

            <div class="space-y-4 text-xs font-semibold">
              <div>
                <label class="block text-[10px] text-text-muted uppercase mb-1">Chọn lớp học *</label>
                @if (myOwnedClasses().length === 0) {
                  <div class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xxs font-semibold">
                    Bạn chưa sở hữu lớp học nào. Hãy tạo một lớp học mới trước!
                  </div>
                } @else {
                  <select
                    [(ngModel)]="selectedClassIdForImport"
                    class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold"
                  >
                    @for (cls of myOwnedClasses(); track cls.id) {
                      <option [value]="cls.id">{{ cls.name }}</option>
                    }
                  </select>
                }
              </div>

              <div>
                <label class="block text-[10px] text-text-muted uppercase mb-1">Tiêu đề đề thi *</label>
                <input
                  type="text"
                  [(ngModel)]="saveToClassForm.title"
                  placeholder="VD: Kiểm tra từ vựng Unit 1"
                  class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold"
                />
              </div>

              <div>
                <label class="block text-[10px] text-text-muted uppercase mb-1">Mô tả đề thi</label>
                <textarea
                  [(ngModel)]="saveToClassForm.description"
                  placeholder="Mô tả về bộ đề..."
                  rows="2"
                  class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-text-main font-semibold resize-none"
                ></textarea>
              </div>

              <div class="space-y-2 pt-2 border-t border-border-main/40">
                <label class="block text-[10px] text-text-muted uppercase mb-1">Nội dung muốn lưu</label>
                
                <label class="flex items-center gap-2.5 cursor-pointer text-text-main">
                  <input
                    type="checkbox"
                    [(ngModel)]="saveToClassForm.importQuizzes"
                    [disabled]="!(selectedDoc()?.quizQuestions && selectedDoc()!.quizQuestions.length > 0)"
                    class="accent-brand-primary h-4 w-4"
                  />
                  <span>Nhập các câu hỏi Quiz có sẵn ({{ selectedDoc()?.quizQuestions?.length || 0 }} câu)</span>
                </label>

                <label class="flex items-center gap-2.5 cursor-pointer text-text-main">
                  <input
                    type="checkbox"
                    [(ngModel)]="saveToClassForm.importFlashcards"
                    [disabled]="!(selectedDoc()?.flashcards && selectedDoc()!.flashcards.length > 0)"
                    class="accent-brand-primary h-4 w-4"
                  />
                  <span>Chuyển đổi Flashcards thành câu điền từ ({{ selectedDoc()?.flashcards?.length || 0 }} câu)</span>
                </label>
              </div>

              @if (saveToClassError()) {
                <p class="text-red-500 text-xxs font-bold mt-1">{{ saveToClassError() }}</p>
              }

              <div class="flex justify-end gap-3 pt-2">
                <button
                  (click)="closeSaveToClassModal()"
                  class="px-4 py-2 border border-border-main rounded-xl hover:bg-bg-input text-text-muted transition-all cursor-pointer font-bold text-xxs"
                >
                  Hủy
                </button>
                <button
                  (click)="confirmSaveToClass()"
                  [disabled]="isSavingToClass() || myOwnedClasses().length === 0"
                  class="px-4 py-2 bg-brand-primary text-white hover:bg-brand-secondary rounded-xl transition-all cursor-pointer font-bold text-xxs disabled:opacity-50 disabled:cursor-default"
                >
                  {{ isSavingToClass() ? 'Đang lưu...' : 'Xác nhận Lưu' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .backface-hidden {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
    .flashcard-container {
      perspective: 1000px;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-style: preserve-3d;
    }
    .flashcard-container.flipped {
      transform: rotateY(180deg);
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AiDocumentLearningComponent implements OnInit {
  private readonly studyAiService = inject(StudyAiService);
  private readonly userWordService = inject(UserWordService);
  private readonly classroomService = inject(ClassroomService);
  private readonly toastService = inject(ToastService);

  isSaveToClassModalOpen = signal(false);
  isSavingToClass = signal(false);
  myOwnedClasses = signal<ClassRoomSummary[]>([]);
  selectedClassIdForImport = signal<number | null>(null);
  saveToClassForm = {
    title: '',
    description: '',
    importQuizzes: true,
    importFlashcards: true
  };
  saveToClassError = signal<string | null>(null);

  documents = signal<UserDocListItem[]>([]);
  selectedDocId = signal<number | null>(null);
  selectedDoc = signal<UserDocDetails | null>(null);

  savedWords = signal<UserWord[]>([]);
  currentWordNotes = '';
  isNotesSaving = signal(false);
  private notesSaveTimeout: any = null;


  isDragging = false;
  isAnalyzing = signal(false);
  uploadError = signal<string | null>(null);

  activeTab: 'flashcards' | 'quizzes' = 'flashcards';

  // Flashcard state
  currentCardIndex = 0;
  isFlipped = false;

  // Quiz state
  selectedAnswers: { [key: number]: string } = {};
  showQuizResults = false;
  correctCount = 0;

  // Quiz customization
  quizCustomType = 'MIXED';
  quizCustomCount = 5;
  isRegeneratingQuiz = signal(false);

  flashcardCountToExtract = 5;
  isAddWordModalOpen = signal(false);
  addWordError = '';
  newWordForm = {
    word: '',
    partOfSpeech: 'verb',
    phonetic: '',
    definition: '',
    exampleSentence: '',
    exampleTranslation: ''
  };

  openAddWordModal(): void {
    this.isAddWordModalOpen.set(true);
    this.addWordError = '';
    this.newWordForm = {
      word: '',
      partOfSpeech: 'verb',
      phonetic: '',
      definition: '',
      exampleSentence: '',
      exampleTranslation: ''
    };
  }

  closeAddWordModal(): void {
    this.isAddWordModalOpen.set(false);
  }

  submitAddWord(): void {
    const doc = this.selectedDoc();
    if (!doc) return;

    if (!this.newWordForm.word.trim() || !this.newWordForm.definition.trim()) {
      this.addWordError = 'Vui lòng điền đầy đủ Từ vựng và Định nghĩa!';
      return;
    }

    this.studyAiService.addFlashcardToDocument(doc.id, this.newWordForm).subscribe({
      next: (savedFlashcard) => {
        this.selectedDoc.update(d => {
          if (d) {
            d.flashcards.push(savedFlashcard);
          }
          return d;
        });
        this.closeAddWordModal();
        this.toastService.success('Đã thêm từ vựng mới vào tài liệu!');
        // Navigate to the newly added word
        if (doc.flashcards.length > 0) {
          this.currentCardIndex = doc.flashcards.length - 1;
          this.isFlipped = false;
          this.updateCurrentNotes();
        }
      },
      error: (err) => {
        console.error('Error adding flashcard', err);
        this.addWordError = err.error?.error || 'Có lỗi xảy ra khi thêm từ vựng.';
        this.toastService.error(this.addWordError);
      }
    });
  }

  deleteFlashcard(event: MouseEvent, flashcard: Flashcard): void {
    event.stopPropagation();
    const doc = this.selectedDoc();
    if (!doc || !flashcard.id) return;

    if (confirm(`Bạn có chắc chắn muốn xóa từ vựng "${flashcard.word}" khỏi tài liệu không?`)) {
      this.studyAiService.deleteFlashcardFromDocument(doc.id, flashcard.id).subscribe({
        next: () => {
          const idx = doc.flashcards.findIndex(f => f.id === flashcard.id);
          if (idx !== -1) {
            this.selectedDoc.update(d => {
              if (d) {
                d.flashcards.splice(idx, 1);
              }
              return d;
            });
            this.toastService.success('Đã xóa từ vựng khỏi tài liệu!');
            if (this.currentCardIndex >= doc.flashcards.length) {
              this.currentCardIndex = Math.max(0, doc.flashcards.length - 1);
            }
            this.isFlipped = false;
            this.updateCurrentNotes();
          }
        },
        error: (err) => {
          console.error('Error deleting flashcard', err);
          this.toastService.error('Có lỗi xảy ra khi xóa từ vựng khỏi tài liệu.');
        }
      });
    }
  }

  openSaveToClassModal(doc: UserDocDetails): void {
    this.saveToClassForm = {
      title: doc.fileName.replace(/\.[^/.]+$/, "") + ' - Quiz & Từ vựng',
      description: `Bộ câu hỏi ôn tập tự động trích xuất từ tài liệu "${doc.fileName}"`,
      importQuizzes: doc.quizQuestions && doc.quizQuestions.length > 0,
      importFlashcards: doc.flashcards && doc.flashcards.length > 0
    };
    this.saveToClassError.set(null);
    this.selectedClassIdForImport.set(null);
    this.isSavingToClass.set(false);
    
    // Load classrooms
    this.classroomService.getMyClasses().subscribe({
      next: (classes) => {
        const owned = classes.filter(c => c.isOwner);
        this.myOwnedClasses.set(owned);
        if (owned.length > 0) {
          this.selectedClassIdForImport.set(owned[0].id);
        }
        this.isSaveToClassModalOpen.set(true);
      },
      error: (err) => {
        console.error('Error loading classes', err);
        alert('Không thể tải danh sách lớp học của bạn.');
      }
    });
  }

  closeSaveToClassModal(): void {
    this.isSaveToClassModalOpen.set(false);
  }

  confirmSaveToClass(): void {
    const classId = this.selectedClassIdForImport();
    if (!classId) {
      this.saveToClassError.set('Vui lòng chọn lớp học để lưu.');
      return;
    }
    if (!this.saveToClassForm.title.trim()) {
      this.saveToClassError.set('Tiêu đề quiz không được để trống.');
      return;
    }
    
    const doc = this.selectedDoc();
    if (!doc) return;

    const questions: Partial<ClassQuizQuestionDto>[] = [];

    // 1. Add existing quiz questions if checked
    if (this.saveToClassForm.importQuizzes && doc.quizQuestions) {
      doc.quizQuestions.forEach((q) => {
        questions.push({
          questionNumber: questions.length + 1,
          type: q.type === 'MULTIPLE_CHOICE' ? 'MULTIPLE_CHOICE' : 'FILL_IN_BLANK',
          questionText: q.questionText,
          optionA: q.optionA || null,
          optionB: q.optionB || null,
          optionC: q.optionC || null,
          optionD: q.optionD || null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || null
        });
      });
    }

    // 2. Add flashcards as FILL_IN_BLANK questions if checked
    if (this.saveToClassForm.importFlashcards && doc.flashcards) {
      doc.flashcards.forEach((card) => {
        const blankedExample = card.exampleSentence.replace(new RegExp(card.word, 'gi'), '_____');
        const questionText = `Điền từ tiếng Anh thích hợp có nghĩa là "${card.definition}" (${card.partOfSpeech}):\n${blankedExample}`;
        
        questions.push({
          questionNumber: questions.length + 1,
          type: 'FILL_IN_BLANK',
          questionText: questionText,
          optionA: null,
          optionB: null,
          optionC: null,
          optionD: null,
          correctAnswer: card.word.trim(),
          explanation: `Từ đúng: "${card.word}" (${card.partOfSpeech}) - Phiên âm: ${card.phonetic}.\nDịch câu ví dụ: ${card.exampleTranslation}`
        });
      });
    }

    if (questions.length === 0) {
      this.saveToClassError.set('Vui lòng chọn ít nhất một nội dung (Quiz hoặc Flashcard) để nhập.');
      return;
    }

    this.isSavingToClass.set(true);
    this.saveToClassError.set(null);

    this.classroomService.createQuiz(
      classId,
      this.saveToClassForm.title,
      this.saveToClassForm.description,
      questions
    ).subscribe({
      next: (quiz) => {
        this.isSavingToClass.set(false);
        this.closeSaveToClassModal();
        this.toastService.success(`Đã lưu thành công bộ câu hỏi vào lớp dưới dạng đề thi: "${quiz.title}"!`);
      },
      error: (err) => {
        console.error('Error creating quiz from document', err);
        const errMsg = err.error?.error || 'Có lỗi xảy ra khi lưu vào lớp học.';
        this.saveToClassError.set(errMsg);
        this.toastService.error(errMsg);
        this.isSavingToClass.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadDocuments();
    this.loadSavedWords();
  }

  loadDocuments(): void {
    this.studyAiService.listDocuments().subscribe({
      next: (docs) => this.documents.set(docs),
      error: (err) => console.error('Error listing documents', err)
    });
  }

  selectDocument(docId: number): void {
    this.selectedDocId.set(docId);
    this.studyAiService.getDocumentDetails(docId).subscribe({
      next: (details) => {
        this.selectedDoc.set(details);
        // Reset states
        this.activeTab = 'flashcards';
        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.resetQuiz();
        this.updateCurrentNotes();
      },
      error: (err) => console.error('Error fetching doc details', err)
    });
  }

  // File selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  // Drag & drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(file: File): void {
    // Validate file size and type
    const allowedExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isAllowed) {
      this.uploadError.set('Chỉ hỗ trợ file PDF, Word (DOCX) và Text (TXT).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      this.uploadError.set('Dung lượng tệp tin vượt quá 5MB.');
      return;
    }

    this.uploadError.set(null);
    this.isAnalyzing.set(true);

    this.studyAiService.uploadDocument(file, this.flashcardCountToExtract).subscribe({
      next: (res) => {
        this.isAnalyzing.set(false);
        this.toastService.success('Đã tải lên và phân tích tài liệu bằng AI thành công!');
        this.loadDocuments();
        // Automatically select the newly created document
        if (res.documentId) {
          this.selectDocument(res.documentId);
        }
      },
      error: (err) => {
        this.isAnalyzing.set(false);
        console.error('Error uploading file', err);
        const errMsg = err.error?.error || 'Có lỗi xảy ra trong quá trình AI phân tích tài liệu.';
        this.uploadError.set(errMsg);
        this.toastService.error(errMsg);
      }
    });
  }

  deleteDocument(event: MouseEvent, docId: number): void {
    event.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này và toàn bộ dữ liệu ôn tập liên quan không?')) {
      this.studyAiService.deleteDocument(docId).subscribe({
        next: () => {
          this.toastService.success('Đã xóa tài liệu thành công!');
          this.loadDocuments();
          if (this.selectedDocId() === docId) {
            this.selectedDocId.set(null);
            this.selectedDoc.set(null);
          }
        },
        error: (err) => {
          console.error('Error deleting document', err);
          this.toastService.error('Có lỗi xảy ra khi xóa tài liệu.');
        }
      });
    }
  }

  // Flashcards navigation
  prevCard(): void {
    if (this.currentCardIndex > 0) {
      this.isFlipped = false;
      setTimeout(() => {
        this.currentCardIndex--;
        this.updateCurrentNotes();
      }, 150);
    }
  }

  nextCard(): void {
    const doc = this.selectedDoc();
    if (doc && this.currentCardIndex < doc.flashcards.length - 1) {
      this.isFlipped = false;
      setTimeout(() => {
        this.currentCardIndex++;
        this.updateCurrentNotes();
      }, 150);
    }
  }

  // Quiz evaluation
  selectAnswer(questionId: number, answer: string): void {
    this.selectedAnswers[questionId] = answer;
  }

  submitQuiz(questions: QuizQuestion[]): void {
    let score = 0;
    for (let q of questions) {
      if (this.isAnswerCorrect(q)) {
        score++;
      }
    }
    this.correctCount = score;
    this.showQuizResults = true;
  }

  isAnswerCorrect(q: QuizQuestion): boolean {
    const ans = this.selectedAnswers[q.id];
    if (!ans) return false;

    if (q.type === 'MULTIPLE_CHOICE') {
      return ans.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();
    } else {
      // For fill in blank, do a case-insensitive check and trim whitespaces
      return ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    }
  }

  resetQuiz(): void {
    this.selectedAnswers = {};
    this.showQuizResults = false;
    this.correctCount = 0;
  }

  regenerateQuiz(doc: UserDocDetails): void {
    if (!doc) return;
    this.isRegeneratingQuiz.set(true);
    this.studyAiService.regenerateQuiz(doc.id, this.quizCustomCount, this.quizCustomType).subscribe({
      next: (res) => {
        this.selectedDoc.update(d => {
          if (d) {
            d.quizQuestions = res.quizQuestions || [];
          }
          return d;
        });
        this.resetQuiz();
        this.toastService.success('Đã tạo lại câu hỏi Quiz bằng AI thành công!');
        this.isRegeneratingQuiz.set(false);
      },
      error: (err) => {
        console.error('Error regenerating quiz', err);
        this.isRegeneratingQuiz.set(false);
        this.toastService.error(err.error?.error || 'Có lỗi khi tạo lại quiz.');
      }
    });
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
    const doc = this.selectedDoc();
    if (!doc || doc.flashcards.length === 0) return;
    const currentWordText = doc.flashcards[this.currentCardIndex].word;
    const saved = this.savedWords().find(w => w.word.toLowerCase() === currentWordText.toLowerCase());
    this.currentWordNotes = saved ? (saved.notes || '') : '';
  }

  isWordSaved(wordText: string): boolean {
    if (!wordText) return false;
    return this.savedWords().some(w => w.word.toLowerCase() === wordText.toLowerCase());
  }

  toggleSaveWord(event: Event, card: Flashcard): void {
    if (event) event.stopPropagation();
    const wordText = card.word;
    const existing = this.savedWords().find(w => w.word.toLowerCase() === wordText.toLowerCase());

    if (existing) {
      this.userWordService.deleteUserWord(existing.id).subscribe({
        next: () => {
          this.savedWords.set(this.savedWords().filter(w => w.id !== existing.id));
          this.currentWordNotes = '';
        },
        error: (err: any) => {
          console.error('Error deleting word', err);
          this.toastService.error('Có lỗi xảy ra khi bỏ lưu từ vựng.');
        }
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
        error: (err: any) => {
          console.error('Error saving word', err);
          this.toastService.error('Có lỗi xảy ra khi lưu từ vựng.');
        }
      });
    }
  }

  speakWord(word: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
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
}
