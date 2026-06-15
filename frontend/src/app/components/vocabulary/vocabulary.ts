import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VocabularyService, VocabTopic } from '../../services/vocabulary.service';

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
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target shrink-0"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase shrink-0"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
            Luyện Thi TOEIC
          </button>
        </div>

        <!-- Sub-Categories / Sub-Tabs -->
        <div class="flex gap-2 border-b border-border-main overflow-x-auto pb-1 shrink-0 font-bold text-xs select-none scrollbar-none">
          @for (cat of subCategories(); track cat) {
            <button
              (click)="activeCategory.set(cat)"
              [class.border-b-2]="activeCategory() === cat"
              [class.border-brand-primary]="activeCategory() === cat"
              [class.text-brand-primary]="activeCategory() === cat"
              [class.text-text-muted]="activeCategory() !== cat"
              class="px-4 py-3 cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap"
            >
              {{ cat === 'TỪ VỰNG CEFR' ? 'Tất cả chủ đề CEFR' : cat }} ({{ getTopicCountForCategory(cat) }})
            </button>
          }
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
            @for (topic of filteredTopics(); track topic.id) {
              <div 
                [routerLink]="['/vocabulary-study', topic.id]"
                class="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[160px] group cursor-pointer"
              >
                <!-- Top Header -->
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary uppercase tracking-wide">
                      {{ topic.category === 'TỪ VỰNG CEFR' ? 'CEFR Level' : topic.category }}
                    </span>
                    @if (topic.isCompleted) {
                      <span class="text-[9px] font-extrabold text-green-500 flex items-center gap-0.5">
                        ✓ Đã thuộc
                      </span>
                    }
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
  activeCategory = signal<string>('TỪ VỰNG CEFR');

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.isLoading.set(true);
    this.vocabService.getTopics().subscribe({
      next: (data) => {
        this.topics.set(data);
        this.isLoading.set(false);
        // Determine initial tab/category
        const cats = data.map(t => t.category);
        if (cats.includes('TỪ VỰNG CEFR')) {
          this.activeTab.set('CEFR');
          this.activeCategory.set('TỪ VỰNG CEFR');
        } else if (cats.length > 0) {
          this.activeTab.set('TOEIC');
          this.activeCategory.set(cats[0]);
        }
      },
      error: (err) => {
        console.error('Error loading vocabulary topics', err);
        this.isLoading.set(false);
      }
    });
  }

  subCategories = computed(() => {
    if (this.activeTab() === 'CEFR') {
      return ['TỪ VỰNG CEFR'];
    } else {
      const cats = this.topics()
        .map(t => t.category)
        .filter(c => c !== 'TỪ VỰNG CEFR');
      return Array.from(new Set(cats));
    }
  });

  filteredTopics = computed(() => {
    return this.topics().filter(t => t.category === this.activeCategory());
  });

  getTopicCountForCategory(category: string): number {
    return this.topics().filter(t => t.category === category).length;
  }

  selectPrimaryTab(tab: 'CEFR' | 'TOEIC') {
    this.activeTab.set(tab);
    const subCats = this.subCategories();
    if (subCats.length > 0) {
      this.activeCategory.set(subCats[0]);
    }
  }
}
