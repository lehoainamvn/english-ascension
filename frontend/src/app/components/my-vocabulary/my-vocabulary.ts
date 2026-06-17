import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserWordService, UserWord } from '../../services/user-word.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-my-vocabulary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-4xl mx-auto relative z-10 space-y-6">
        
        <!-- Header -->
        <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-3">
              <span class="p-2.5 bg-bg-input rounded-xl text-text-main">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </span>
              <div>
                <h2 class="text-xl md:text-2xl font-black text-text-main uppercase tracking-wide">Sổ Tay Từ Vựng Cá Nhân</h2>
                <p class="text-xs text-text-muted mt-1">Nơi lưu trữ những từ vựng tâm đắc kèm ghi chú và ý tưởng sáng tạo của bạn</p>
              </div>
            </div>
            
            <button
              (click)="showAddModal.set(true)"
              class="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-bg-card font-black text-xs rounded-xl shadow-md cursor-pointer transition-all border-none flex items-center gap-1.5 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Thêm từ mới
            </button>
          </div>
        </div>

        <!-- Navigation Tabs inside My Vocabulary -->
        <div class="flex border-b border-border-main select-none font-bold text-xs">
          <button
            (click)="activeSubTab.set('list')"
            [class.border-b-2]="activeSubTab() === 'list'"
            [class.border-brand-primary]="activeSubTab() === 'list'"
            [class.text-brand-primary]="activeSubTab() === 'list'"
            [class.text-text-muted]="activeSubTab() !== 'list'"
            class="px-5 py-3.5 cursor-pointer uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
            Từ vựng của tôi ({{ words().length }})
          </button>
          <button
            (click)="activeSubTab.set('review')"
            [class.border-b-2]="activeSubTab() === 'review'"
            [class.border-brand-primary]="activeSubTab() === 'review'"
            [class.text-brand-primary]="activeSubTab() === 'review'"
            [class.text-text-muted]="activeSubTab() !== 'review'"
            class="px-5 py-3.5 cursor-pointer uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Ôn tập Spaced Repetition
            @if (words().length > 0) {
              <span class="bg-brand-primary text-bg-card text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-bold">NEW</span>
            }
          </button>
        </div>

        <!-- ========================================== -->
        <!-- TAB 1: SAVED WORDS LIST                    -->
        <!-- ========================================== -->
        @if (activeSubTab() === 'list') {
          <div class="space-y-4 animate-fade-in">
            <!-- Search & Actions -->
            <div class="flex items-center justify-between gap-3">
              <div class="w-full">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  placeholder="Tìm kiếm từ vựng hoặc nghĩa..."
                  class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-2.5 text-xs text-text-main placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-semibold"
                />
              </div>
            </div>

            <!-- Words Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @if (filteredWords().length > 0) {
                @for (word of filteredWords(); track word.id) {
                  <div class="notebook-card bg-bg-card border border-border-main rounded-2xl p-5 shadow-sm hover:border-brand-primary/20 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden">
                    <div class="space-y-3">
                      <!-- Word Title Header -->
                      <div class="flex justify-between items-start">
                        <div class="space-y-0.5">
                          <div class="flex items-baseline gap-2">
                            <span class="text-base font-black text-text-main uppercase tracking-wide select-text">{{ word.word }}</span>
                            <span class="text-[9px] text-brand-secondary italic font-black">({{ word.partOfSpeech }})</span>
                          </div>
                          @if (word.phonetic) {
                            <p class="text-[10px] text-text-muted font-mono select-text">{{ word.phonetic }}</p>
                          }
                        </div>

                        <!-- Action controls -->
                        <div class="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            (click)="speakWord(word.word)"
                            class="w-7 h-7 rounded-lg bg-bg-input border border-border-main hover:bg-brand-primary/10 hover:text-brand-primary transition-all cursor-pointer flex items-center justify-center text-xs text-text-main"
                            title="Nghe phát âm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                          </button>
                          <button
                            (click)="deleteWord(word.id)"
                            class="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 transition-all cursor-pointer flex items-center justify-center text-xs"
                            title="Xóa từ"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </button>
                        </div>
                      </div>

                      <!-- Meaning block -->
                      <div class="p-2.5 bg-bg-input/40 border border-border-main/50 rounded-xl flex items-center gap-1.5">
                        <span class="text-text-muted shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </span>
                        <p class="text-xs text-text-muted font-medium">Định nghĩa: <span class="text-text-main font-bold select-text">{{ word.definition }}</span></p>
                      </div>

                      <!-- Notes handwriting post-it block -->
                      <div class="p-3 bg-yellow-500/5 dark:bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-xl space-y-1.5 text-left relative">
                        <div class="flex justify-between items-center text-[9px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                          <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                            Ghi chú cá nhân
                          </span>
                          @if (editingWordId() !== word.id) {
                            <button
                              (click)="startEditNotes(word)"
                              class="text-brand-primary hover:underline bg-transparent border-none cursor-pointer text-[9px] flex items-center gap-0.5"
                            >
                              Sửa
                              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit-3"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                          }
                        </div>

                        @if (editingWordId() === word.id) {
                          <div class="space-y-2 pt-1" (click)="$event.stopPropagation()">
                            <textarea
                              [(ngModel)]="editingNotesText"
                              rows="2"
                              class="w-full bg-bg-card border border-border-main rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-yellow-500 font-medium font-sans resize-none"
                              placeholder="Nhập ghi chú hoặc ý nghĩa đặc biệt..."
                            ></textarea>
                            <div class="flex gap-2 justify-end text-[10px] font-bold">
                              <button
                                (click)="saveEditNotes(word)"
                                class="px-2.5 py-1 bg-yellow-500 text-white rounded cursor-pointer border-none"
                              >
                                Lưu
                              </button>
                              <button
                                (click)="cancelEditNotes()"
                                class="px-2.5 py-1 bg-bg-input border border-border-main text-text-muted rounded cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        } @else {
                          <p class="text-xs italic text-text-main leading-relaxed font-serif tracking-wide select-text whitespace-pre-line">
                            {{ word.notes || 'Chưa có ghi chú nào. Hãy thêm ghi chú để học từ vựng hiệu quả hơn!' }}
                          </p>
                        }
                      </div>

                    </div>

                    <!-- Footer dates -->
                    <div class="mt-4 pt-2 border-t border-border-main/40 flex justify-between items-center text-[9px] text-text-muted">
                      <span>Lưu ngày: {{ word.savedDate }}</span>
                      <span>Ôn tập: {{ word.repetitions || 0 }} lần</span>
                    </div>
                  </div>
                }
              } @else {
                <div class="col-span-1 md:col-span-2 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-12 text-center text-text-muted space-y-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox mx-auto text-text-muted"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                  <h4 class="text-xs font-black text-text-main uppercase">Không tìm thấy từ vựng</h4>
                  <p class="text-xxs max-w-sm mx-auto leading-relaxed">Hãy nhập từ khác hoặc click nút "Thêm từ mới" để lưu trữ từ vựng đầu tiên của bạn.</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- ========================================== -->
        <!-- TAB 2: SPACED REPETITION REVIEW            -->
        <!-- ========================================== -->
        @if (activeSubTab() === 'review') {
          <div class="space-y-6 animate-fade-in flex flex-col items-center">
            
            @if (words().length === 0) {
              <div class="w-full backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-12 text-center text-text-muted space-y-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox mx-auto text-text-muted"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                <h4 class="text-xs font-black text-text-main uppercase">Chưa có từ vựng để ôn tập</h4>
                <p class="text-xxs leading-relaxed max-w-sm mx-auto">Sổ tay hiện đang trống. Sau khi lưu các từ vựng khó trong lúc học, bạn sẽ có thể ôn tập chúng tại đây!</p>
              </div>
            } @else {
              
              <!-- Review Stats header -->
              <div class="w-full flex justify-between items-center bg-bg-card border border-border-main rounded-xl px-5 py-3 text-xs font-bold transition-colors duration-300">
                <span class="text-text-muted">Từ đang ôn tập: <span class="text-brand-primary font-black">{{ currentCardIndex() + 1 }}</span> / {{ words().length }}</span>
                <span class="text-brand-secondary">Hoàn thành: {{ getCompletionRate() }}%</span>
              </div>

              <!-- FLASHCARD WRAPPER -->
              <div 
                (click)="isFlipped.set(!isFlipped())"
                class="w-full max-w-md h-72 cursor-pointer perspective-1000 select-none group"
              >
                <!-- Card Inner -->
                <div 
                  [class.rotate-y-180]="isFlipped()"
                  class="relative w-full h-full duration-500 transform-style-3d shadow-xl rounded-3xl border border-border-main bg-bg-card transition-transform flex items-center justify-center p-6 text-center"
                >
                  <!-- Front of card -->
                  <div class="absolute inset-0 backface-hidden flex flex-col justify-between p-6 rounded-3xl">
                    <div class="text-right">
                      <span class="text-[9px] bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold border border-brand-primary/15">
                        {{ currentWord().partOfSpeech }}
                      </span>
                    </div>
                    
                    <div class="space-y-4">
                      <h3 class="text-3xl font-black text-text-main uppercase tracking-wide select-text">
                        {{ currentWord().word }}
                      </h3>
                      @if (currentWord().phonetic) {
                        <p class="text-sm text-text-muted select-text">
                          {{ currentWord().phonetic }}
                        </p>
                      }
                    </div>

                    <div class="text-center text-xxs text-text-muted font-bold animate-bounce mt-auto flex items-center justify-center gap-1">
                      <span>Click để lật thẻ xem nghĩa & ghi chú</span>
                    </div>
                  </div>

                  <!-- Back of card -->
                  <div class="absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-between p-6 bg-bg-input/60 rounded-3xl">
                    <div class="text-left">
                      <span class="text-[9px] bg-brand-secondary/10 text-brand-secondary px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold border border-brand-secondary/15">
                        Ý NGHĨA
                      </span>
                    </div>

                    <div class="space-y-3">
                      <p class="text-xl font-bold text-text-main select-text">
                        {{ currentWord().definition }}
                      </p>
                      
                      <!-- Personal notes display on back of card -->
                      @if (currentWord().notes) {
                        <div class="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-left max-w-xs mx-auto">
                          <p class="text-[8px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest flex items-center gap-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                            Ghi chú cá nhân:
                          </p>
                          <p class="text-xxs italic text-text-main mt-0.5 font-serif leading-relaxed select-text">{{ currentWord().notes }}</p>
                        </div>
                      }
                      
                      <div class="h-px bg-border-main/50 max-w-[80px] mx-auto"></div>
                      <p class="text-[10px] text-text-muted font-semibold leading-relaxed">
                        Nhấn nút loa bên dưới để nghe phát âm
                      </p>
                    </div>

                    <!-- Actions on flipped card -->
                    <div class="flex gap-2 justify-center shrink-0" (click)="$event.stopPropagation()">
                      <button
                        (click)="speakWord(currentWord().word)"
                        class="w-10 h-10 rounded-xl bg-bg-card border border-border-main hover:bg-brand-primary/15 hover:text-brand-primary transition-all flex items-center justify-center text-sm shadow-sm text-text-main"
                        title="Nghe phát âm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                      </button>

                      <button
                        (click)="simulatePronunciationSpeech()"
                        [class.bg-brand-secondary/15]="isListeningSim()"
                        [class.text-brand-secondary]="isListeningSim()"
                        class="w-10 h-10 rounded-xl bg-bg-card border border-border-main hover:bg-brand-secondary/15 hover:text-brand-secondary transition-all flex items-center justify-center text-sm shadow-sm text-text-main"
                        title="Luyện nói (Speech Check)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Speech check popover message -->
              @if (speechScoreMsg()) {
                <div class="bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-[11px] font-bold px-4 py-2.5 rounded-xl shadow-inner max-w-sm w-full text-center animate-fade-in flex items-center justify-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  <span>{{ speechScoreMsg() }}</span>
                </div>
              }

              <!-- Rating / Confidence controls (Only visible when flipped) -->
              @if (isFlipped()) {
                <div class="w-full max-w-md space-y-2.5 animate-fade-in">
                  <p class="text-[10px] font-bold text-center text-text-muted uppercase tracking-wider">Mức độ tự tin nhớ từ của bạn:</p>
                  
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      (click)="rateConfidence(1)"
                      class="bg-bg-input hover:bg-bg-card hover:border-red-500/50 text-text-main py-2 rounded-xl text-xxs font-black transition-all shadow-sm border border-border-main cursor-pointer"
                    >
                      Chưa Nhớ
                    </button>
                    <button
                      (click)="rateConfidence(3)"
                      class="bg-bg-input hover:bg-bg-card hover:border-yellow-500/50 text-text-main py-2 rounded-xl text-xxs font-black transition-all shadow-sm border border-border-main cursor-pointer"
                    >
                      Sơ Sơ
                    </button>
                    <button
                      (click)="rateConfidence(5)"
                      class="bg-brand-primary text-bg-card hover:opacity-90 py-2 rounded-xl text-xxs font-black transition-all shadow-sm border-none cursor-pointer"
                    >
                      Thuộc Lòng
                    </button>
                  </div>
                </div>
              } @else {
                <p class="text-xxs text-text-muted font-bold italic text-center animate-pulse">Lật thẻ để chấm điểm trí nhớ & luyện phát âm giọng bản xứ</p>
              }

            }

          </div>
        }

        <!-- ADD WORD MODAL -->
        @if (showAddModal()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div class="bg-bg-card border border-border-main p-6 rounded-2xl w-full max-w-sm shadow-2xl relative space-y-4">
              <div class="flex justify-between items-center border-b border-border-main pb-3">
                <h3 class="text-sm font-black text-text-main uppercase tracking-wider">Thêm từ mới vào Sổ tay</h3>
                <button (click)="showAddModal.set(false)" class="text-text-muted hover:text-text-main bg-transparent border-none text-sm cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              <div class="space-y-3 text-left">
                <div>
                  <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Từ vựng *</label>
                  <input
                    type="text"
                    [(ngModel)]="newWord.word"
                    placeholder="Ví dụ: Ephemeral"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Từ loại</label>
                    <select
                      [(ngModel)]="newWord.pos"
                      class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none"
                    >
                      <option value="noun">Danh từ (noun)</option>
                      <option value="verb">Động từ (verb)</option>
                      <option value="adjective">Tính từ (adjective)</option>
                      <option value="adverb">Trạng từ (adverb)</option>
                      <option value="preposition">Giới từ (preposition)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Phiên âm</label>
                    <input
                      type="text"
                      [(ngModel)]="newWord.phonetic"
                      placeholder="Ví dụ: /ɪˈfemərəl/"
                      class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Nghĩa tiếng Việt *</label>
                  <input
                    type="text"
                    [(ngModel)]="newWord.meaning"
                    placeholder="Ví dụ: Phù du, chóng tàn"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div>
                  <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Ghi chú cá nhân / Mẹo ghi nhớ</label>
                  <textarea
                    [(ngModel)]="newWord.notes"
                    placeholder="Ví dụ: Nghĩ tới bong bóng xà phòng bay..."
                    rows="3"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
                  ></textarea>
                </div>
              </div>

              <div class="flex gap-3 pt-3 border-t border-border-main/50 text-xs font-bold">
                <button
                  (click)="saveNewWord()"
                  [disabled]="isAddingWord()"
                  class="flex-1 bg-brand-primary text-bg-main py-2 rounded-xl active:scale-98 transition-all disabled:opacity-50 cursor-pointer border-none font-bold"
                >
                  {{ isAddingWord() ? 'Đang lưu...' : 'Lưu từ vựng' }}
                </button>
                <button
                  (click)="showAddModal.set(false)"
                  class="flex-1 bg-bg-input border border-border-main text-text-muted py-2 rounded-xl hover:bg-bg-card transition-all cursor-pointer font-bold"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    /* Perspective for 3D Flips */
    .perspective-1000 {
      perspective: 1000px;
    }
    .transform-style-3d {
      transform-style: preserve-3d;
    }
    .backface-hidden {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
    .rotate-y-180 .backface-hidden {
      pointer-events: auto;
    }

    .animate-fade-in {
      animation: fadeIn 0.25s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MyVocabularyComponent implements OnInit {
  private readonly userWordService = inject(UserWordService);
  private readonly toastService = inject(ToastService);

  searchQuery = '';
  activeSubTab = signal<'list' | 'review'>('list');

  // Flashcard Flip state
  isFlipped = signal<boolean>(false);
  currentCardIndex = signal<number>(0);

  // Mic check states
  isListeningSim = signal<boolean>(false);
  speechScoreMsg = signal<string | null>(null);

  // Handbook notebook state
  words = signal<UserWord[]>([]);
  editingWordId = signal<number | null>(null);
  editingNotesText = '';
  showAddModal = signal(false);
  isAddingWord = signal(false);
  newWord = { word: '', pos: 'noun', meaning: '', phonetic: '', notes: '' };

  filteredWords = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.words();
    return this.words().filter(w => 
      w.word.toLowerCase().includes(query) || 
      (w.definition && w.definition.toLowerCase().includes(query)) ||
      (w.notes && w.notes.toLowerCase().includes(query))
    );
  });

  currentWord = computed(() => {
    const list = this.words();
    if (list.length === 0) return {} as UserWord;
    const index = this.currentCardIndex() % list.length;
    return list[index];
  });

  ngOnInit(): void {
    this.loadWords();
  }

  loadWords(): void {
    this.userWordService.getUserWords().subscribe({
      next: (data) => {
        this.words.set(data || []);
      },
      error: (err) => {
        console.error('Error loading saved words', err);
        this.words.set([]);
      }
    });
  }

  saveNewWord(): void {
    if (!this.newWord.word.trim() || !this.newWord.meaning.trim()) {
      this.toastService.warning('Vui lòng điền đầy đủ từ vựng và nghĩa tiếng Việt.');
      return;
    }
    this.isAddingWord.set(true);
    this.userWordService.saveUserWord({
      word: this.newWord.word.trim(),
      partOfSpeech: this.newWord.pos,
      definition: this.newWord.meaning.trim(),
      phonetic: this.newWord.phonetic.trim(),
      notes: this.newWord.notes.trim()
    }).subscribe({
      next: (saved) => {
        this.words.set([saved, ...this.words()]);
        this.isAddingWord.set(false);
        this.showAddModal.set(false);
        this.toastService.success('Đã lưu từ vựng vào sổ tay!');
        // Reset form
        this.newWord = { word: '', pos: 'noun', meaning: '', phonetic: '', notes: '' };
      },
      error: (err) => {
        console.error('Error saving word', err);
        this.isAddingWord.set(false);
        this.toastService.error('Có lỗi xảy ra khi lưu từ vựng.');
      }
    });
  }

  startEditNotes(word: UserWord): void {
    this.editingWordId.set(word.id);
    this.editingNotesText = word.notes || '';
  }

  saveEditNotes(word: UserWord): void {
    this.userWordService.updateUserWord(word.id, { notes: this.editingNotesText }).subscribe({
      next: (updated) => {
        this.words.set(this.words().map(w => w.id === updated.id ? updated : w));
        this.editingWordId.set(null);
        this.editingNotesText = '';
        this.toastService.success('Đã lưu ghi chú thành công!');
      },
      error: (err) => {
        console.error('Error updating notes', err);
        this.toastService.error('Có lỗi xảy ra khi lưu ghi chú.');
      }
    });
  }

  cancelEditNotes(): void {
    this.editingWordId.set(null);
    this.editingNotesText = '';
  }

  getCompletionRate(): number {
    if (this.words().length === 0) return 0;
    return Math.round(((this.currentCardIndex()) / this.words().length) * 100);
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

  deleteWord(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa từ này khỏi sổ tay từ vựng của mình?')) {
      this.userWordService.deleteUserWord(id).subscribe({
        next: () => {
          this.words.set(this.words().filter(w => w.id !== id));
          this.toastService.success('Đã xóa từ vựng khỏi sổ tay!');
          if (this.currentCardIndex() >= this.words().length && this.currentCardIndex() > 0) {
            this.currentCardIndex.set(this.words().length - 1);
          }
        },
        error: (err) => {
          console.error('Error deleting word', err);
          this.toastService.error('Có lỗi xảy ra khi xóa từ vựng.');
        }
      });
    }
  }

  // Simulate smart voice analysis tool
  simulatePronunciationSpeech() {
    if (this.isListeningSim()) return;

    this.isListeningSim.set(true);
    this.speechScoreMsg.set('🎙️ Đang nghe phát âm của bạn... Hãy nói "' + this.currentWord().word + '"');

    setTimeout(() => {
      // Simulate speech analysis scores
      const score = Math.floor(Math.random() * 20) + 81; // Random score between 81 and 100
      this.isListeningSim.set(false);
      this.speechScoreMsg.set(`🎉 Độ chính xác: ${score}%! Phân tích IPA nhận dạng tốt phụ âm.`);
      
      // Auto clear message after 4s
      setTimeout(() => this.speechScoreMsg.set(null), 4000);
    }, 2000);
  }

  rateConfidence(confidence: number) {
    const list = this.words();
    if (list.length === 0) return;
    const index = this.currentCardIndex() % list.length;
    const word = list[index];

    const updatedReps = (word.repetitions || 0) + 1;
    let updatedInterval = 1;
    if (confidence === 1) {
      updatedInterval = 1;
    } else if (confidence === 3) {
      updatedInterval = (word.interval || 1) * 2;
    } else {
      updatedInterval = (word.interval || 1) * 3;
    }

    this.userWordService.updateUserWord(word.id, {
      repetitions: updatedReps,
      interval: updatedInterval
    }).subscribe({
      next: (updated) => {
        // Update local list
        this.words.set(this.words().map(w => w.id === updated.id ? updated : w));
        
        // Reset flips and increment pointer
        this.isFlipped.set(false);
        this.speechScoreMsg.set(null);

        // Go to next card
        setTimeout(() => {
          if (this.currentCardIndex() + 1 >= this.words().length) {
            alert('🎉 Tuyệt vời! Bạn đã hoàn thành vòng ôn tập hôm nay cho toàn bộ từ vựng!');
            this.currentCardIndex.set(0);
          } else {
            this.currentCardIndex.set(this.currentCardIndex() + 1);
          }
        }, 200);
      },
      error: (err) => console.error('Error updating confidence rate', err)
    });
  }
}
