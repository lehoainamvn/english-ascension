import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GrammarService, GrammarLesson } from '../../services/grammar.service';

@Component({
  selector: 'app-grammar-topics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10 space-y-8 animate-fade-in">
        
        <!-- Header Title & Subtitle -->
        <div class="text-center space-y-2 max-w-2xl mx-auto">
          <h1 class="text-2xl md:text-4xl font-black tracking-tight text-text-main">
            Chinh phục <span class="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">Ngữ pháp TOEIC</span>
          </h1>
          <p class="text-xs md:text-sm text-text-muted">
            Hệ thống bài học từ cơ bản đến nâng cao, giúp bạn nắm vững ngữ pháp và đạt điểm cao trong kỳ thi TOEIC.
          </p>
        </div>

        <!-- Banner: Luyện tập ngẫu nhiên -->
        <div class="p-6 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/5 to-transparent border border-border-main rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl text-brand-primary">
              🔀
            </div>
            <div>
              <h3 class="text-sm font-black text-text-main">Luyện tập ngẫu nhiên</h3>
              <p class="text-xxs text-text-muted mt-0.5">10 câu hỏi ngẫu nhiên từ ngân hàng 1000+ câu hỏi ngữ pháp.</p>
            </div>
          </div>
          <button
            (click)="startRandomPractice()"
            class="bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            ✈️ Bắt đầu
          </button>
        </div>

        <!-- Search bar & Stats -->
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div class="flex items-center w-full max-w-md bg-bg-card border border-border-main rounded-2xl px-4 py-2.5 shadow-sm">
            <span class="text-text-muted text-base shrink-0 mr-3">🔍</span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Tìm kiếm bài học hoặc chủ đề..."
              class="w-full bg-transparent text-text-main text-xs placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div class="text-[11px] font-bold text-text-muted shrink-0 self-end">
            Đã hoàn thành: <span class="text-brand-primary font-black">{{ completedCount() }}</span> / {{ lessons().length }} chủ đề
          </div>
        </div>

        <!-- Card Grid -->
        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs text-text-muted font-bold">Đang tải danh sách bài học ngữ pháp...</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (card of filteredLessons(); track card.id) {
              <div 
                [routerLink]="['/grammar-study', card.id]"
                class="bg-bg-card border border-border-main rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between group min-h-[150px] cursor-pointer"
              >
                <!-- Card Header -->
                <div class="space-y-1">
                  <div class="flex justify-between items-start gap-2">
                    <h3 class="text-sm font-black text-text-main group-hover:text-brand-primary transition-colors pr-2">
                      {{ card.title }}
                    </h3>
                    
                    <span 
                      [ngClass]="{
                        'bg-green-500/10 text-green-500 border-green-500/20': card.practiceCompleted,
                        'bg-amber-500/10 text-amber-500 border-amber-500/20': card.lessonCompleted && !card.practiceCompleted,
                        'bg-bg-input text-text-muted border-border-main': !card.lessonCompleted && !card.practiceCompleted
                      }"
                      class="text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wide"
                    >
                      {{ getStatusText(card) }}
                    </span>
                  </div>
                  <p class="text-[11px] text-text-muted leading-tight">{{ card.vietnameseTitle }}</p>
                </div>

                <!-- Card Body & Footer -->
                <div class="flex justify-between items-end border-t border-border-main/40 pt-4 mt-6">
                  <div class="space-y-1 text-[10px] font-bold">
                    <div class="flex items-center gap-1.5 text-brand-primary">
                      <span class="text-xs">🌐</span>
                      <span>{{ card.questionsCount }} câu hỏi luyện tập</span>
                    </div>
                    @if (card.practiceCompleted && card.score !== null) {
                      <div class="text-green-500">
                        Điểm tốt nhất: {{ card.score }}%
                      </div>
                    }
                  </div>

                  <a
                    [routerLink]="['/grammar-study', card.id]"
                    class="text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-1 group/btn"
                  >
                    {{ getActionText(card) }}
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
    .animate-fade-in {
      animation: fadeIn 0.35s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class GrammarTopicsComponent implements OnInit {
  private readonly grammarService = inject(GrammarService);
  private readonly router = inject(Router);

  searchQuery = '';
  lessons = signal<GrammarLesson[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.isLoading.set(true);
    this.grammarService.getLessons().subscribe({
      next: (data) => {
        this.lessons.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading grammar lessons', err);
        this.isLoading.set(false);
      }
    });
  }

  filteredLessons = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.lessons();
    return this.lessons().filter(l => 
      l.title.toLowerCase().includes(query) || 
      l.vietnameseTitle.toLowerCase().includes(query)
    );
  });

  completedCount = computed(() => {
    return this.lessons().filter(l => l.practiceCompleted).length;
  });

  getStatusText(lesson: GrammarLesson): string {
    if (lesson.practiceCompleted) return 'Đã hoàn thành';
    if (lesson.lessonCompleted) return 'Đang luyện tập';
    return 'Chưa bắt đầu';
  }

  getActionText(lesson: GrammarLesson): string {
    if (lesson.practiceCompleted) return 'Ôn tập';
    if (lesson.lessonCompleted) return 'Luyện tập';
    return 'Học ngay';
  }

  startRandomPractice() {
    if (this.lessons().length > 0) {
      // Direct random lesson
      const randomIndex = Math.floor(Math.random() * this.lessons().length);
      const randomLesson = this.lessons()[randomIndex];
      this.router.navigate(['/grammar-study', randomLesson.id]);
    } else {
      alert('Không tìm thấy bài học ngữ pháp nào để luyện tập.');
    }
  }
}
