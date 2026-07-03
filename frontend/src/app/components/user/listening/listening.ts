import { Component, inject, OnInit, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListeningService, ListeningTopic } from '../../../services/listening.service';

@Component({
  selector: 'app-listening',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10 space-y-8 animate-fade-in">
        
        <!-- Header -->
        <div class="text-center space-y-2 max-w-2xl mx-auto">
          <h1 class="text-2xl md:text-4xl font-black tracking-tight text-text-main">
            Kho <span class="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">Luyện Nghe Tiếng Anh</span>
          </h1>
          <p class="text-xs md:text-sm text-text-muted">
            Nâng cao phản xạ nghe hiểu qua phương pháp lặp lại, ghi chép chính tả và kiểm tra transcript.
          </p>
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
              placeholder="Tìm kiếm chủ đề bài nghe..."
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
                @for (cat of categories(); track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
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
                <option value="IN_PROGRESS">Đang học</option>
                <option value="COMPLETED">Đã hoàn thành</option>
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bg-bg-card border border-border-main rounded-2xl p-5 h-48 animate-pulse"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (topic of paginatedTopics(); track topic.id) {
              <div 
                [routerLink]="['/listening-study', topic.id]"
                class="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[160px] group cursor-pointer"
              >
                <!-- Top Header -->
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded bg-bg-input text-text-muted border border-border-main/50 uppercase tracking-wide">
                      Level {{ topic.category }}
                    </span>
                    <span 
                      [class.bg-green-500/10]="topic.completedCount === topic.questionsCount && topic.questionsCount > 0"
                      [class.text-green-500]="topic.completedCount === topic.questionsCount && topic.questionsCount > 0"
                      [class.border-green-500/20]="topic.completedCount === topic.questionsCount && topic.questionsCount > 0"
                      
                      [class.bg-amber-500/10]="topic.completedCount > 0 && topic.completedCount < topic.questionsCount"
                      [class.text-amber-500]="topic.completedCount > 0 && topic.completedCount < topic.questionsCount"
                      [class.border-amber-500/20]="topic.completedCount > 0 && topic.completedCount < topic.questionsCount"
                      
                      [class.bg-bg-input]="topic.completedCount === 0"
                      [class.text-text-muted]="topic.completedCount === 0"
                      [class.border-border-main]="topic.completedCount === 0"
                      
                      class="text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wide"
                    >
                      {{ topic.completedCount === topic.questionsCount && topic.questionsCount > 0 ? 'Đã học' : (topic.completedCount > 0 ? 'Đang học' : 'Chưa học') }}
                    </span>
                  </div>
                  
                  <h2 class="text-base font-black text-text-main group-hover:text-brand-primary transition-colors">
                    {{ topic.category }} – {{ topic.title }}
                  </h2>
                  <p class="text-xxs text-text-muted">
                    {{ topic.questionsCount }} câu thoại cốt lõi
                  </p>
                </div>

                <!-- Footer & Action -->
                <div class="border-t border-border-main/40 pt-4 mt-6 flex justify-between items-center">
                  <div class="text-[10px] font-bold text-text-muted">
                    Tiến độ: <span class="text-brand-primary font-black">{{ topic.completedCount }}</span> / {{ topic.questionsCount }} câu
                  </div>

                  <a
                    [routerLink]="['/listening-study', topic.id]"
                    class="text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-1 group/btn"
                  >
                    Vào học
                    <span class="inline-block translate-x-0 group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                  </a>
                </div>
              </div>
            }
          </div>

          <!-- Empty state -->
          @if (filteredTopics().length === 0) {
            <div class="text-center py-20 bg-bg-card border border-border-main rounded-2xl flex flex-col items-center justify-center gap-3">
              <div class="w-16 h-16 rounded-2xl bg-bg-input flex items-center justify-center text-3xl">🔍</div>
              <p class="text-sm font-bold text-text-main">Không tìm thấy chủ đề</p>
              <p class="text-xs text-text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
            </div>
          }

          <!-- Pagination Controls -->
          @if (totalPages() > 1) {
            <div class="flex items-center justify-center gap-2 pt-4">
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="p-2 rounded-xl bg-bg-card border border-border-main text-text-muted hover:text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>

              @for (page of pageNumbers(); track $index) {
                @if (page === '...') {
                  <span class="w-9 h-9 font-bold text-xs text-text-muted flex items-center justify-center">...</span>
                } @else {
                  <button
                    (click)="goToPage(page)"
                    [class.bg-brand-primary]="currentPage() === page"
                    [class.text-white]="currentPage() === page"
                    [class.border-brand-primary]="currentPage() === page"
                    [class.bg-bg-card]="currentPage() !== page"
                    [class.text-text-muted]="currentPage() !== page"
                    class="w-9 h-9 rounded-xl border border-border-main font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center hover:border-brand-primary/30"
                  >
                    {{ page }}
                  </button>
                }
              }

              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="p-2 rounded-xl bg-bg-card border border-border-main text-text-muted hover:text-text-main disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-primary/30 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
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
export class ListeningComponent implements OnInit {
  private readonly listeningService = inject(ListeningService);

  topics = signal<ListeningTopic[]>([]);
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
    this.loadTopics();
  }

  loadTopics() {
    this.isLoading.set(true);
    this.listeningService.getTopics().subscribe({
      next: (data) => {
        this.topics.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading listening topics', err);
        this.isLoading.set(false);
      }
    });
  }

  categories = computed(() => {
    const cats = this.topics().map(t => t.category);
    const unique = Array.from(new Set(cats));
    return unique;
  });

  filteredTopics = computed(() => {
    let list = this.topics();

    // Level filter
    const level = this.levelFilter();
    if (level !== 'ALL') {
      list = list.filter(t => t.category === level);
    }

    // Search query filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    const status = this.statusFilter();
    if (status === 'NOT_STARTED') {
      list = list.filter(t => t.completedCount === 0);
    } else if (status === 'IN_PROGRESS') {
      list = list.filter(t => t.completedCount > 0 && t.completedCount < t.questionsCount);
    } else if (status === 'COMPLETED') {
      list = list.filter(t => t.completedCount === t.questionsCount);
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

  getCompletedTopicsCount() {
    return this.topics().filter(t => t.completedCount === t.questionsCount && t.questionsCount > 0).length;
  }

  getInProgressCount() {
    return this.topics().filter(t => t.completedCount > 0 && t.completedCount < t.questionsCount).length;
  }

  getLevelBarClass(category: string): string {
    const cat = (category || '').toUpperCase();
    if (cat.includes('A1')) return 'bg-gradient-to-r from-emerald-400 to-teal-400';
    if (cat.includes('A2')) return 'bg-gradient-to-r from-green-400 to-emerald-400';
    if (cat.includes('B1')) return 'bg-gradient-to-r from-sky-400 to-blue-400';
    if (cat.includes('B2')) return 'bg-gradient-to-r from-blue-400 to-indigo-400';
    if (cat.includes('C1')) return 'bg-gradient-to-r from-violet-400 to-purple-400';
    if (cat.includes('C2')) return 'bg-gradient-to-r from-purple-400 to-pink-400';
    return 'bg-gradient-to-r from-brand-primary to-brand-secondary';
  }

  getLevelIconBg(category: string): string {
    const cat = (category || '').toUpperCase();
    if (cat.includes('A1')) return 'bg-emerald-500/10';
    if (cat.includes('A2')) return 'bg-green-500/10';
    if (cat.includes('B1')) return 'bg-sky-500/10';
    if (cat.includes('B2')) return 'bg-blue-500/10';
    if (cat.includes('C1')) return 'bg-violet-500/10';
    if (cat.includes('C2')) return 'bg-purple-500/10';
    return 'bg-brand-primary/10';
  }

  getLevelBadgeClass(category: string): string {
    const cat = (category || '').toUpperCase();
    if (cat.includes('A1')) return 'bg-emerald-500/15 text-emerald-600';
    if (cat.includes('A2')) return 'bg-green-500/15 text-green-600';
    if (cat.includes('B1')) return 'bg-sky-500/15 text-sky-600';
    if (cat.includes('B2')) return 'bg-blue-500/15 text-blue-600';
    if (cat.includes('C1')) return 'bg-violet-500/15 text-violet-600';
    if (cat.includes('C2')) return 'bg-purple-500/15 text-purple-600';
    return 'bg-brand-primary/10 text-brand-primary';
  }

  getTopicEmoji(category: string, title: string): string {
    const t = (title || '').toLowerCase();
    if (t.includes('neighbor') || t.includes('community')) return '🏘️';
    if (t.includes('food') || t.includes('cafe') || t.includes('restaurant')) return '🍽️';
    if (t.includes('travel') || t.includes('airport') || t.includes('train')) return '✈️';
    if (t.includes('shop') || t.includes('store') || t.includes('market')) return '🛒';
    if (t.includes('health') || t.includes('doctor') || t.includes('hospital')) return '🏥';
    if (t.includes('school') || t.includes('library') || t.includes('education')) return '📚';
    if (t.includes('work') || t.includes('job') || t.includes('office')) return '💼';
    if (t.includes('family') || t.includes('home') || t.includes('house')) return '🏠';
    if (t.includes('phone') || t.includes('call')) return '📞';
    if (t.includes('sport') || t.includes('game')) return '⚽';
    if (t.includes('direction') || t.includes('map') || t.includes('street')) return '🗺️';
    const cat = (category || '').toUpperCase();
    if (cat.includes('A1') || cat.includes('A2')) return '🌱';
    if (cat.includes('B1') || cat.includes('B2')) return '📘';
    if (cat.includes('C1') || cat.includes('C2')) return '🎓';
    return '🎧';
  }

  getProgressBarClass(topic: any): string {
    if (topic.completedCount === topic.questionsCount && topic.questionsCount > 0) {
      return 'bg-green-500';
    }
    return 'bg-gradient-to-r from-brand-primary to-brand-secondary';
  }
}
