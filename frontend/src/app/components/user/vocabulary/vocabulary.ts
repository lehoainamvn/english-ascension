import { Component, inject, OnInit, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VocabularyService, VocabTopic } from '../../../services/vocabulary.service';

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10 space-y-8 animate-fade-in">
        
        <!-- Header -->
        <div class="text-center space-y-2 max-w-2xl mx-auto">
          <h1 class="text-2xl md:text-4xl font-black tracking-tight text-text-main">
            Kho <span class="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">Từ Vựng Tiếng Anh</span>
          </h1>
          <p class="text-xs md:text-sm text-text-muted">
            Học từ vựng theo chủ đề với lộ trình cá nhân hóa CEFR và luyện thi TOEIC chuyên sâu
          </p>
        </div>

        <!-- Primary Tab Switcher (CEFR vs TOEIC) -->
        <div class="flex gap-2 p-1 bg-bg-input/60 border border-border-main/50 rounded-2xl max-w-sm mx-auto shadow-inner">
          <button
            (click)="selectPrimaryTab('CEFR')"
            [class.bg-brand-primary]="activeTab() === 'CEFR'"
            [class.text-bg-card]="activeTab() === 'CEFR'"
            [class.shadow-md]="activeTab() === 'CEFR'"
            [class.text-text-muted]="activeTab() !== 'CEFR'"
            class="flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            Từ Vựng CEFR
          </button>
          <button
            (click)="selectPrimaryTab('TOEIC')"
            [class.bg-brand-primary]="activeTab() === 'TOEIC'"
            [class.text-bg-card]="activeTab() === 'TOEIC'"
            [class.shadow-md]="activeTab() === 'TOEIC'"
            [class.text-text-muted]="activeTab() !== 'TOEIC'"
            class="flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            Luyện Thi TOEIC
          </button>
        </div>

        <!-- Filters Bar -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center max-w-6xl mx-auto">
          <!-- Search Bar -->
          <div class="flex items-center flex-1 max-w-md bg-bg-card border border-border-main rounded-2xl px-4 py-2.5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search text-text-muted shrink-0 mr-2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Tìm kiếm chủ đề từ vựng..."
              class="w-full bg-transparent text-text-main text-xs placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div class="flex gap-3 shrink-0">
            <!-- Level Filter Dropdown -->
            <div class="flex items-center gap-2 bg-bg-card border border-border-main rounded-2xl px-3 py-2 shadow-sm">
              <span class="text-[10px] text-text-muted font-bold whitespace-nowrap">Cấp độ:</span>
              <select
                [ngModel]="levelFilter()"
                (ngModelChange)="levelFilter.set($event)"
                class="bg-transparent border-none text-text-main text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả cấp độ</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            <!-- Status Filter Dropdown -->
            <div class="flex items-center gap-2 bg-bg-card border border-border-main rounded-2xl px-3 py-2 shadow-sm">
              <span class="text-[10px] text-text-muted font-bold whitespace-nowrap">Trạng thái:</span>
              <select
                [ngModel]="statusFilter()"
                (ngModelChange)="statusFilter.set($event)"
                class="bg-transparent border-none text-text-main text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả</option>
                <option value="NOT_STARTED">Chưa học</option>
                <option value="IN_PROGRESS">Đang học</option>
                <option value="COMPLETED">Đã thuộc</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Result count -->
        <div class="flex justify-between items-center text-[11px] text-text-muted font-bold -mt-4">
          <div>
            Hiển thị {{ filteredTopics().length }} chủ đề
            @if (levelFilter() !== 'ALL') { · cấp <strong>{{ levelFilter() }}</strong> }
            @if (searchQuery()) { · tìm "<strong>{{ searchQuery() }}</strong>" }
          </div>
          <div>
            Đã hoàn thành: <span class="text-brand-primary">{{ getCompletedTopicsCount() }}</span> / {{ topics().length }} chủ đề
          </div>
        </div>

        <!-- Topics List -->
        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs text-text-muted font-bold">Đang tải danh sách chủ đề từ vựng...</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (topic of paginatedTopics(); track topic.id) {
              <div 
                [routerLink]="['/vocabulary-study', topic.id]"
                class="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[160px] group cursor-pointer"
              >
                <!-- Top Header -->
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded bg-bg-input text-text-muted border border-border-main/50 uppercase tracking-wide">
                      {{ topic.category === 'TỪ VỰNG CEFR' ? 'CEFR Level' : (topic.category === 'VOCABULARY' ? 'Từ vựng TOEIC' : topic.category) }}
                    </span>
                    <span 
                      [class.bg-green-500/10]="topic.learnedCount === topic.wordsCount && topic.wordsCount > 0"
                      [class.text-green-500]="topic.learnedCount === topic.wordsCount && topic.wordsCount > 0"
                      [class.border-green-500/20]="topic.learnedCount === topic.wordsCount && topic.wordsCount > 0"
                      
                      [class.bg-amber-500/10]="topic.learnedCount > 0 && topic.learnedCount < topic.wordsCount"
                      [class.text-amber-500]="topic.learnedCount > 0 && topic.learnedCount < topic.wordsCount"
                      [class.border-amber-500/20]="topic.learnedCount > 0 && topic.learnedCount < topic.wordsCount"
                      
                      [class.bg-bg-input]="topic.learnedCount === 0"
                      [class.text-text-muted]="topic.learnedCount === 0"
                      [class.border-border-main]="topic.learnedCount === 0"
                      
                      class="text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wide"
                    >
                      {{ topic.learnedCount === topic.wordsCount && topic.wordsCount > 0 ? 'Đã học' : (topic.learnedCount > 0 ? 'Đang học' : 'Chưa học') }}
                    </span>
                  </div>
                  
                  <h2 class="text-base font-black text-text-main group-hover:text-brand-primary transition-colors">
                    {{ topic.title }}
                  </h2>
                  <p class="text-xxs text-text-muted">
                    {{ topic.wordsCount }} từ vựng cốt lõi
                  </p>
                </div>

                <!-- Footer & Action -->
                <div class="border-t border-border-main/40 pt-4 mt-6 flex justify-between items-center">
                  <div class="text-[10px] font-bold text-text-muted">
                    Tiến độ: <span class="text-brand-primary font-black">{{ topic.learnedCount }}</span> / {{ topic.wordsCount }} từ
                  </div>

                  <a
                    [routerLink]="['/vocabulary-study', topic.id]"
                    class="text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-1 group/btn"
                  >
                    Vào học
                    <span class="inline-block translate-x-0 group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                  </a>
                </div>
              </div>
            }
          </div>

          <!-- Pagination Controls -->
          @if (totalPages() > 1) {
            <div class="flex items-center justify-center gap-2 pt-8">
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="p-2 rounded-xl bg-bg-card border border-border-main text-text-muted hover:text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
              </button>

              @for (page of pageNumbers(); track $index) {
                @if (page === '...') {
                  <span class="w-9 h-9 font-bold text-xs text-text-muted flex items-center justify-center">...</span>
                } @else {
                  <button
                    (click)="goToPage(page)"
                    [class.bg-brand-primary]="currentPage() === page"
                    [class.text-bg-card]="currentPage() === page"
                    [class.border-brand-primary]="currentPage() === page"
                    [class.bg-bg-card]="currentPage() !== page"
                    [class.text-text-muted]="currentPage() !== page"
                    [class.hover:text-text-main]="currentPage() !== page"
                    class="w-9 h-9 rounded-xl border border-border-main font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center hover:border-brand-primary/30"
                  >
                    {{ page }}
                  </button>
                }
              }

              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="p-2 rounded-xl bg-bg-card border border-border-main text-text-muted hover:text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          }

          <!-- Empty state -->
          @if (filteredTopics().length === 0) {
            <div class="text-center py-16 bg-bg-card border border-border-main rounded-2xl flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox text-text-muted mb-4"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
              <p class="text-xs text-text-muted font-bold">Không tìm thấy chủ đề nào trong danh mục này.</p>
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
      animation: fadeIn 0.35s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class VocabularyComponent implements OnInit {
  private readonly vocabService = inject(VocabularyService);

  topics = signal<VocabTopic[]>([]);
  isLoading = signal(true);
  
  // Tab control
  activeTab = signal<'CEFR' | 'TOEIC'>('CEFR');
  
  // Filter control
  searchQuery = signal<string>('');
  statusFilter = signal<string>('ALL');
  levelFilter = signal<string>('ALL');

  // Pagination
  pageSize = 9;
  currentPage = signal<number>(1);

  constructor() {
    effect(() => {
      this.searchQuery();
      this.levelFilter();
      this.statusFilter();
      this.activeTab();
      untracked(() => this.currentPage.set(1));
    });
  }

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.isLoading.set(true);
    this.vocabService.getTopics().subscribe({
      next: (data) => {
        this.topics.set(data);
        this.isLoading.set(false);
        // Determine initial tab
        const cats = data.map(t => t.category);
        if (cats.includes('TỪ VỰNG CEFR')) {
          this.activeTab.set('CEFR');
        } else if (data.length > 0) {
          this.activeTab.set('TOEIC');
        }
      },
      error: (err) => {
        console.error('Error loading vocabulary topics', err);
        this.isLoading.set(false);
      }
    });
  }

  filteredTopics = computed(() => {
    let list = this.topics().filter(t => {
      if (this.activeTab() === 'CEFR') {
        return t.category === 'TỪ VỰNG CEFR';
      } else {
        return t.category !== 'TỪ VỰNG CEFR';
      }
    });
    
    // Search query filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(t => t.title.toLowerCase().includes(query));
    }

    // Level filter
    const level = this.levelFilter();
    if (level !== 'ALL') {
      list = list.filter(t => t.title.toUpperCase().includes(level));
    }

    // Status filter
    const status = this.statusFilter();
    if (status === 'NOT_STARTED') {
      list = list.filter(t => t.learnedCount === 0);
    } else if (status === 'IN_PROGRESS') {
      list = list.filter(t => t.learnedCount > 0 && !t.isCompleted);
    } else if (status === 'COMPLETED') {
      list = list.filter(t => t.isCompleted);
    }

    return list;
  });

  paginatedTopics = computed(() => {
    const list = this.filteredTopics();
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredTopics().length / this.pageSize);
  });

  pageNumbers = computed<(number | string)[]>(() => {
    const current = this.currentPage();
    const max = this.totalPages();
    if (max <= 7) {
      return Array.from({ length: max }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', max];
    }
    if (current >= max - 3) {
      return [1, '...', max - 4, max - 3, max - 2, max - 1, max];
    }
    return [1, '...', current - 1, current, current + 1, '...', max];
  });

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  selectPrimaryTab(tab: 'CEFR' | 'TOEIC') {
    this.activeTab.set(tab);
    // Reset filters on tab switch
    this.searchQuery.set('');
    this.statusFilter.set('ALL');
    this.levelFilter.set('ALL');
  }

  getCompletedTopicsCount() {
    return this.topics().filter(t => t.learnedCount === t.wordsCount && t.wordsCount > 0).length;
  }
}
