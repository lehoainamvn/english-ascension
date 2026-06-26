import { Component, inject, OnInit, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReadingService, ReadingArticle } from '../../../services/reading.service';

@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10 space-y-8 animate-fade-in">
        
        <!-- Header -->
        <div class="text-center space-y-2 max-w-2xl mx-auto">
          <div class="flex items-center justify-center gap-2 select-none shrink-0 font-bold text-xs">
            <span class="bg-brand-primary text-bg-card px-3 py-1 rounded-xl shadow-sm flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Học
            </span>
            <span class="bg-bg-input text-text-muted border border-border-main px-3 py-1 rounded-xl flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart shrink-0"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
              Tiến độ
            </span>
          </div>
          <h1 class="text-2xl md:text-4xl font-black tracking-tight text-text-main mt-4">
            Luyện đọc <span class="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">TOEIC Part 7 song ngữ</span>
          </h1>
          <p class="text-xs md:text-sm text-text-muted">
            Luyện đọc song ngữ Anh – Việt theo các chủ đề thường gặp trong bài thi TOEIC, từ cơ bản đến nâng cao.
          </p>
        </div>

        <!-- Filters Bar -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center max-w-6xl mx-auto">
          <!-- Search Input -->
          <div class="flex items-center flex-1 max-w-md bg-bg-card border border-border-main rounded-2xl px-4 py-2.5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search text-text-muted shrink-0 mr-2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Tìm kiếm bài đọc..."
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
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
              </select>
            </div>

            <!-- Status Filter Dropdown -->
            <div class="flex items-center gap-2 bg-bg-card border border-border-main rounded-2xl px-3 py-2 shadow-sm shrink-0">
              <span class="text-[10px] text-text-muted font-bold whitespace-nowrap">Trạng thái:</span>
              <select
                [ngModel]="statusFilter()"
                (ngModelChange)="statusFilter.set($event)"
                class="bg-transparent border-none text-text-main text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">Tất cả</option>
                <option value="NOT_STARTED">Chưa học</option>
                <option value="COMPLETED">Đã hoàn thành</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Topics List -->
        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs text-text-muted font-bold">Đang tải danh sách bài đọc...</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (topic of paginatedArticles(); track topic.id) {
              <div 
                [routerLink]="['/reading-study', topic.id]"
                class="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[150px] group cursor-pointer"
              >
                <!-- Top Header -->
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span 
                      [class.bg-green-500/10]="topic.level === 1"
                      [class.text-green-500]="topic.level === 1"
                      [class.bg-brand-secondary/10]="topic.level === 2"
                      [class.text-brand-secondary]="topic.level === 2"
                      class="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide"
                    >
                      Level {{ topic.level }}
                    </span>
                    @if (topic.isCompleted) {
                      <span class="text-[9px] font-extrabold text-green-500 flex items-center gap-0.5">
                        ✓ Đã đọc xong
                      </span>
                    }
                  </div>
                  
                  <h2 class="text-sm font-black text-text-main group-hover:text-brand-primary transition-colors">
                    {{ topic.title }}
                  </h2>
                  <p class="text-[11px] text-text-muted flex items-center gap-1 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text shrink-0"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                    <span>{{ topic.questionsCount }} câu hỏi</span>
                  </p>
                </div>

                <!-- Footer & Action -->
                <div class="border-t border-border-main/40 pt-4 mt-6 flex justify-between items-center">
                  <span class="text-[10px] text-text-muted font-bold">
                    {{ topic.level === 1 ? 'Cơ bản' : 'Nâng cao' }}
                  </span>

                  <a
                    [routerLink]="['/reading-study', topic.id]"
                    class="text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-1 group/btn"
                  >
                    Đọc ngay
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
          @if (filteredArticles().length === 0) {
            <div class="text-center py-16 bg-bg-card border border-border-main rounded-2xl flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox text-text-muted mb-4"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
              <p class="text-xs text-text-muted font-bold">Không tìm thấy bài đọc nào trong danh mục này.</p>
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
export class ReadingComponent implements OnInit {
  private readonly readingService = inject(ReadingService);

  articles = signal<ReadingArticle[]>([]);
  isLoading = signal(true);
  
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
      untracked(() => this.currentPage.set(1));
    });
  }

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.isLoading.set(true);
    this.readingService.getArticles().subscribe({
      next: (data) => {
        this.articles.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading reading articles', err);
        this.isLoading.set(false);
      }
    });
  }

  filteredArticles = computed(() => {
    let list = this.articles();
    
    // Level filter
    const level = this.levelFilter();
    if (level !== 'ALL') {
      const lvlNum = parseInt(level, 10);
      list = list.filter(a => a.level === lvlNum);
    }

    // Search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(a => a.title.toLowerCase().includes(query));
    }

    // Status filter
    const status = this.statusFilter();
    if (status === 'NOT_STARTED') {
      list = list.filter(a => !a.isCompleted);
    } else if (status === 'COMPLETED') {
      list = list.filter(a => a.isCompleted);
    }

    return list;
  });

  paginatedArticles = computed(() => {
    const list = this.filteredArticles();
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredArticles().length / this.pageSize);
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
}
