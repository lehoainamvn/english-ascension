import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyService } from '../../../services/study.service';

interface Achievement {
  svgPath: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10 space-y-6">
        <!-- Header -->
        <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-brand-primary/15 rounded-xl flex items-center justify-center border border-brand-primary/20 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-primary"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
              <h1 class="text-xl md:text-2xl font-black text-text-main">Hồ Sơ Tiến Độ Học Tập</h1>
              <p class="text-xs text-text-muted mt-0.5">Theo dõi số liệu học tập chi tiết, lịch ôn tập hàng ngày và thành tựu của bạn.</p>
            </div>
          </div>
        </div>

        <!-- Row 1: Statistics Cards -->
        @if (isLoading()) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-bg-card border border-border-main p-4 rounded-2xl animate-pulse h-20"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-bg-card border border-border-main p-4 rounded-2xl shadow-sm text-center group hover:border-brand-primary/30 transition-all">
              <div class="flex justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-primary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <p class="text-[9px] font-black text-text-muted uppercase tracking-wider">Cấp Độ</p>
              <h3 class="text-xl font-black text-brand-primary mt-1">Lv.{{ profile()?.level || 1 }}</h3>
            </div>
            <div class="bg-bg-card border border-border-main p-4 rounded-2xl shadow-sm text-center group hover:border-brand-secondary/30 transition-all">
              <div class="flex justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-secondary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <p class="text-[9px] font-black text-text-muted uppercase tracking-wider">Tổng EXP</p>
              <h3 class="text-xl font-black text-brand-secondary mt-1">{{ profile()?.exp || 0 }}</h3>
            </div>
            <div class="bg-bg-card border border-border-main p-4 rounded-2xl shadow-sm text-center group hover:border-orange-500/30 transition-all">
              <div class="flex justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              </div>
              <p class="text-[9px] font-black text-text-muted uppercase tracking-wider">Chuỗi Streak</p>
              <h3 class="text-xl font-black text-orange-500 mt-1">{{ profile()?.streak || 0 }} Ngày</h3>
            </div>
            <div class="bg-bg-card border border-border-main p-4 rounded-2xl shadow-sm text-center group hover:border-yellow-500/30 transition-all">
              <div class="flex justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500"><circle cx="12" cy="12" r="8"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="14.5" y1="12" y2="12"/></svg>
              </div>
              <p class="text-[9px] font-black text-text-muted uppercase tracking-wider">Xu Tích Lũy</p>
              <h3 class="text-xl font-black text-yellow-500 mt-1">{{ profile()?.coins || 0 }}</h3>
            </div>
          </div>
        }

        <!-- Row 2: Grid of Contribution & Achievements -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <!-- Left: Streak Contribution Grid (7 cols) -->
          <div class="lg:col-span-7 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md space-y-4">
            <h3 class="text-xs font-black text-text-muted uppercase tracking-widest border-b border-border-main/55 pb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              Lịch Học Tập Hằng Ngày (4 tuần)
            </h3>
            
            <p class="text-xxs text-text-muted leading-relaxed">Duy trì học tối thiểu 10 phút mỗi ngày để giữ chuỗi liên tục.</p>
            
            <!-- Streak heat map -->
            <div class="p-3.5 bg-bg-input/30 border border-border-main/55 rounded-2xl space-y-3">
              <div class="grid grid-cols-7 gap-1.5 justify-center max-w-sm mx-auto text-center font-bold text-[8px] text-text-muted uppercase">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
              </div>
              <div class="grid grid-cols-7 gap-1.5 justify-center max-w-sm mx-auto">
                @for (day of heatmapDays(); track $index) {
                  <div
                    [ngClass]="{
                      'bg-green-500 border border-green-500/20 shadow shadow-green-500/10': day.level === 3,
                      'bg-green-500/60 border border-green-500/10': day.level === 2,
                      'bg-green-500/20 border border-green-500/5': day.level === 1,
                      'bg-bg-input border border-border-main/40': day.level === 0
                    }"
                    class="aspect-square w-full rounded-md flex items-center justify-center text-[8px] font-bold text-white transition-all cursor-help"
                    [title]="'Ngày ' + day.name + ': ' + (day.level > 0 ? 'Đã học' : 'Chưa học')"
                  >
                  </div>
                }
              </div>
            </div>

            <div class="flex items-center justify-between text-[9px] text-text-muted">
              <span>Chưa học (Trống)</span>
              <div class="flex gap-1 items-center">
                <span class="w-2.5 h-2.5 rounded bg-bg-input border border-border-main/40"></span>
                <span class="w-2.5 h-2.5 rounded bg-green-500/20"></span>
                <span class="w-2.5 h-2.5 rounded bg-green-500/60"></span>
                <span class="w-2.5 h-2.5 rounded bg-green-500"></span>
                <span class="ml-1">Đã học nhiều</span>
              </div>
            </div>
          </div>

          <!-- Right: Achievements unlocked (5 cols) -->
          <div class="lg:col-span-5 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div class="space-y-4">
              <h3 class="text-xs font-black text-text-muted uppercase tracking-widest border-b border-border-main/55 pb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                Danh Hiệu Đạt Được
              </h3>
              
              <div class="space-y-3">
                @for (ach of achievements; track ach.title) {
                  <div class="flex items-center gap-3 p-3 rounded-xl border transition-all"
                       [class.bg-green-500/5]="ach.unlocked"
                       [class.border-green-500/20]="ach.unlocked"
                       [class.bg-bg-input/20]="!ach.unlocked"
                       [class.border-border-main/40]="!ach.unlocked"
                       [class.opacity-50]="!ach.unlocked">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                         [class.bg-yellow-500/20]="ach.unlocked"
                         [class.bg-bg-input]="!ach.unlocked">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                           [class.text-yellow-500]="ach.unlocked" [class.text-text-muted]="!ach.unlocked">
                        <path [attr.d]="ach.svgPath"/>
                      </svg>
                    </div>
                    <div class="text-[10px] min-w-0 flex-1">
                      <h4 class="font-bold text-text-main text-[11px]" [class.line-through]="!ach.unlocked">{{ ach.title }}</h4>
                      <p class="text-text-muted mt-0.5 truncate">{{ ach.desc }}</p>
                    </div>
                    @if (ach.unlocked) {
                      <span class="ml-auto text-[8px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded font-black shrink-0">UNLOCKED</span>
                    } @else {
                      <span class="ml-auto shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-text-muted"><rect width="11" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </span>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProgressComponent implements OnInit {
  private readonly studyService = inject(StudyService);

  profile = signal<any>(null);
  isLoading = signal(true);

  heatmapDays = signal<{ name: number; level: number }[]>(
    Array.from({ length: 28 }, (_, i) => ({
      name: i + 1,
      level: 0
    }))
  );

  achievements: Achievement[] = [
    {
      svgPath: 'M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M2 22l7.5-7.5M17.5 2.5 22 7l-1 1-4.5-4.5',
      title: 'Chiến Binh Từ Vựng',
      desc: 'Đánh bại quái vật đầu tiên trong Word Battle.',
      unlocked: true
    },
    {
      svgPath: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
      title: 'Streak Vô Địch',
      desc: 'Duy trì chuỗi Streak học tập liên tục 7 ngày.',
      unlocked: false
    },
    {
      svgPath: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8',
      title: 'Bạn Thân AI Mentor',
      desc: 'Thực hiện 20 hội thoại trao đổi với trợ lý AI.',
      unlocked: false
    }
  ];

  ngOnInit(): void {
    this.studyService.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.isLoading.set(false);
        this.buildHeatmap(p?.streak || 0);
        // Unlock achievements based on real data
        if (p?.streak >= 7) {
          this.achievements[1] = { ...this.achievements[1], unlocked: true };
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  buildHeatmap(streak: number): void {
    const today = new Date();
    this.heatmapDays.update(days => {
      return days.map((day, idx) => {
        const daysAgo = 27 - idx;
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        // Approximate: if within streak range, mark as active
        const isActive = daysAgo < streak;
        const level = isActive ? (daysAgo === 0 ? 3 : daysAgo < 3 ? 3 : daysAgo < 7 ? 2 : 1) : 0;
        return { name: date.getDate(), level };
      });
    });
  }
}
