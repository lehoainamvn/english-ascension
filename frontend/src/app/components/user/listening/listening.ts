import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListeningService, ListeningTopic } from '../../../services/listening.service';

@Component({
  selector: 'app-listening',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

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

        <!-- Categories / Tabs -->
        <div class="flex gap-2 border-b border-border-main overflow-x-auto pb-1 shrink-0 font-bold text-xs select-none scrollbar-none">
          @for (cat of categories(); track cat) {
            <button
              (click)="activeCategory.set(cat)"
              [class.border-b-2]="activeCategory() === cat"
              [class.border-brand-primary]="activeCategory() === cat"
              [class.text-brand-primary]="activeCategory() === cat"
              [class.text-text-muted]="activeCategory() !== cat"
              class="px-4 py-3 cursor-pointer transition-all uppercase tracking-wider whitespace-nowrap"
            >
              {{ cat }} ({{ getTopicCountForCategory(cat) }})
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
            <p class="text-xs text-text-muted font-bold">Đang tải danh sách đề nghe...</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (topic of filteredTopics(); track topic.id) {
              <div 
                [routerLink]="['/listening-study', topic.id]"
                class="bg-bg-card border border-border-main rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[170px] group cursor-pointer"
              >
                <!-- Top Header -->
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary uppercase tracking-wide">
                      {{ topic.category }}
                    </span>
                    @if (topic.completedCount === topic.questionsCount) {
                      <span class="text-[9px] font-extrabold text-green-500 flex items-center gap-0.5">
                        ✓ Hoàn thành
                      </span>
                    }
                  </div>
                  
                  <h2 class="text-base font-black text-text-main group-hover:text-brand-primary transition-colors">
                    {{ topic.title }}
                  </h2>
                  <p class="text-xxs text-text-muted">
                    {{ topic.description }} ({{ topic.questionsCount }} câu)
                  </p>
                </div>

                <!-- Progress Section -->
                <div class="space-y-1.5 mt-4">
                  <div class="flex justify-between text-[10px] font-bold text-text-muted">
                    <span>Tiến độ:</span>
                    <span>{{ topic.completedCount }} / {{ topic.questionsCount }} câu</span>
                  </div>
                  <!-- Progress Bar -->
                  <div class="w-full h-1.5 bg-bg-input border border-border-main rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500"
                      [style.width.%]="(topic.completedCount / topic.questionsCount) * 100"
                    ></div>
                  </div>
                </div>

                <!-- Footer & Action -->
                <div class="border-t border-border-main/40 pt-4 mt-4 flex justify-between items-center">
                  <span class="text-[10px] text-text-muted font-bold">
                    {{ topic.sectionsCount }} bài nghe
                  </span>

                  <a
                    [routerLink]="['/listening-study', topic.id]"
                    class="text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-1 group/btn"
                  >
                    Luyện tập
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
export class ListeningComponent implements OnInit {
  private readonly listeningService = inject(ListeningService);

  topics = signal<ListeningTopic[]>([]);
  isLoading = signal(true);
  activeCategory = signal<string>('TOEIC LISTENING');

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.isLoading.set(true);
    this.listeningService.getTopics().subscribe({
      next: (data) => {
        this.topics.set(data);
        if (data.length > 0 && !data.some(t => t.category === this.activeCategory())) {
          this.activeCategory.set(data[0].category);
        }
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
    return this.topics().filter(t => t.category === this.activeCategory());
  });

  getTopicCountForCategory(category: string): number {
    return this.topics().filter(t => t.category === category).length;
  }
}
