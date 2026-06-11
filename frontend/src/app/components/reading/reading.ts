import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReadingService, ReadingArticle } from '../../services/reading.service';

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
            <span class="bg-brand-primary text-white px-3 py-1 rounded-xl shadow-sm">📖 Học</span>
            <span class="bg-bg-input text-text-muted border border-border-main px-3 py-1 rounded-xl">📊 Tiến độ</span>
          </div>
          <h1 class="text-2xl md:text-4xl font-black tracking-tight text-text-main mt-4">
            Luyện đọc <span class="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">TOEIC Part 7 song ngữ</span>
          </h1>
          <p class="text-xs md:text-sm text-text-muted">
            Luyện đọc song ngữ Anh – Việt theo các chủ đề thường gặp trong bài thi TOEIC, từ cơ bản đến nâng cao.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-md mx-auto relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Tìm kiếm bài đọc..."
            class="w-full bg-bg-card border border-border-main rounded-2xl px-10 py-3 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary shadow-sm"
          />
          <span class="absolute left-4 top-3.5 text-text-muted text-xs">🔍</span>
        </div>

        <!-- Categories / Tabs -->
        <div class="flex gap-2 border-b border-border-main overflow-x-auto pb-1 shrink-0 font-bold text-xs select-none scrollbar-none">
          <button
            (click)="activeTab.set('all')"
            [class.border-b-2]="activeTab() === 'all'"
            [class.border-brand-primary]="activeTab() === 'all'"
            [class.text-brand-primary]="activeTab() === 'all'"
            [class.text-text-muted]="activeTab() !== 'all'"
            class="px-4 py-3 cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap"
          >
            Tất cả ({{ articles().length }})
          </button>
          <button
            (click)="activeTab.set('level1')"
            [class.border-b-2]="activeTab() === 'level1'"
            [class.border-brand-primary]="activeTab() === 'level1'"
            [class.text-brand-primary]="activeTab() === 'level1'"
            [class.text-text-muted]="activeTab() !== 'level1'"
            class="px-4 py-3 cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap"
          >
            Level 1 ({{ getLevelCount(1) }})
          </button>
          <button
            (click)="activeTab.set('level2')"
            [class.border-b-2]="activeTab() === 'level2'"
            [class.border-brand-primary]="activeTab() === 'level2'"
            [class.text-brand-primary]="activeTab() === 'level2'"
            [class.text-text-muted]="activeTab() !== 'level2'"
            class="px-4 py-3 cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap"
          >
            Level 2 ({{ getLevelCount(2) }})
          </button>
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
            @for (topic of filteredArticles(); track topic.id) {
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
                    <span>📄</span> {{ topic.questionsCount }} câu hỏi
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
  activeTab = signal<'all' | 'level1' | 'level2'>('all');
  searchQuery = signal<string>('');

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

  getLevelCount(level: number): number {
    return this.articles().filter(a => a.level === level).length;
  }

  filteredArticles = computed(() => {
    let list = this.articles();
    
    // Search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(a => a.title.toLowerCase().includes(query));
    }

    // Tab level filter
    if (this.activeTab() === 'level1') {
      list = list.filter(a => a.level === 1);
    } else if (this.activeTab() === 'level2') {
      list = list.filter(a => a.level === 2);
    }

    return list;
  });
}
