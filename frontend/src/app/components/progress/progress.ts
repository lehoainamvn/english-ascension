import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Achievement {
  icon: string;
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

      <div class="max-w-4xl mx-auto relative z-10 space-y-6">
        <!-- Header -->
        <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md">
          <div class="flex items-center gap-3">
            <span class="text-3xl">📊</span>
            <div>
              <h2 class="text-xl md:text-2xl font-black text-text-main">Hồ Sơ Tiến Độ Học Tập</h2>
              <p class="text-xs text-text-muted mt-1">Theo dõi số liệu học tập chi tiết, lịch ôn tập hàng ngày và thành tựu của bạn.</p>
            </div>
          </div>
        </div>

        <!-- Row 1: Statistics Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-bg-card border border-border-main p-4 rounded-2xl shadow-sm text-center">
            <p class="text-[9px] font-black text-text-muted uppercase tracking-wider">Thời gian học</p>
            <h3 class="text-xl font-black text-brand-primary mt-1">24.5 Giờ</h3>
          </div>
          <div class="bg-bg-card border border-border-main p-4 rounded-2xl shadow-sm text-center">
            <p class="text-[9px] font-black text-text-muted uppercase tracking-wider">Từ đã học</p>
            <h3 class="text-xl font-black text-brand-secondary mt-1">340 Từ</h3>
          </div>
          <div class="bg-bg-card border border-border-main p-4 rounded-2xl shadow-sm text-center">
            <p class="text-[9px] font-black text-text-muted uppercase tracking-wider">Chuỗi Streak</p>
            <h3 class="text-xl font-black text-orange-500 mt-1">🔥 8 Ngày</h3>
          </div>
          <div class="bg-bg-card border border-border-main p-4 rounded-2xl shadow-sm text-center">
            <p class="text-[9px] font-black text-text-muted uppercase tracking-wider">Tỷ lệ chính xác</p>
            <h3 class="text-xl font-black text-green-500 mt-1">82%</h3>
          </div>
        </div>

        <!-- Row 2: Grid of Contribution & Achievements -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <!-- Left: Streak Contribution Grid (7 cols) -->
          <div class="lg:col-span-7 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md space-y-4">
            <h3 class="text-xs font-black text-text-muted uppercase tracking-widest border-b border-border-main/55 pb-2">LỊCH HỌC TẬP HẰNG NGÀY (STREAK GRID)</h3>
            
            <p class="text-xxs text-text-muted leading-relaxed">Duy trì học tối thiểu 10 phút mỗi ngày để giữ chuỗi liên tục.</p>
            
            <!-- Streak heat map mockup -->
            <div class="p-3.5 bg-bg-input/30 border border-border-main/55 rounded-2xl space-y-3">
              <div class="grid grid-cols-7 gap-1.5 justify-center max-w-sm mx-auto text-center font-bold text-[8px] text-text-muted uppercase">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
              </div>
              <div class="grid grid-cols-7 gap-1.5 justify-center max-w-sm mx-auto">
                <!-- Row of weeks mockups -->
                @for (day of days; track $index) {
                  <div
                    [ngClass]="{
                      'bg-green-500 border border-green-500/20 shadow shadow-green-500/10': day.level === 3,
                      'bg-green-500/60 border border-green-500/10': day.level === 2,
                      'bg-green-500/20 border border-green-500/5': day.level === 1,
                      'bg-bg-input border border-border-main/40': day.level === 0
                    }"
                    class="aspect-square w-full rounded-md flex items-center justify-center text-[8px] font-bold text-white transition-all cursor-help"
                    [title]="'Ngày ' + day.name + ': ' + (day.level > 0 ? 'Học ' + (day.level * 15) + ' phút' : 'Chưa học')"
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
              <h3 class="text-xs font-black text-text-muted uppercase tracking-widest border-b border-border-main/55 pb-2">DANH HIỆU ĐẠT ĐƯỢC 🏆</h3>
              
              <div class="space-y-3">
                @for (ach of achievements; track ach.title) {
                  <div class="flex items-center gap-3 p-2.5 bg-bg-input/20 border border-border-main/45 rounded-xl">
                    <span class="text-2xl shrink-0">{{ ach.icon }}</span>
                    <div class="text-[10px]">
                      <h4 class="font-bold text-text-main text-[11px]" [class.line-through]="!ach.unlocked">{{ ach.title }}</h4>
                      <p class="text-text-muted mt-0.5">{{ ach.desc }}</p>
                    </div>
                    @if (ach.unlocked) {
                      <span class="ml-auto text-[8px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded font-black">UNLOCKED</span>
                    } @else {
                      <span class="ml-auto text-[8px] bg-bg-input text-text-muted border border-border-main px-2 py-0.5 rounded font-black">LOCKED</span>
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
export class ProgressComponent {
  days = Array.from({ length: 28 }, (_, i) => ({
    name: i + 1,
    level: i === 27 || i === 26 || i === 25 || i === 24 ? 3 : i % 5 === 0 ? 0 : i % 3 === 0 ? 1 : 2
  }));

  achievements: Achievement[] = [
    { icon: '⚔️', title: 'Chiến Binh Từ Vựng', desc: 'Đánh bại quái vật đầu tiên trong Word Battle.', unlocked: true },
    { icon: '🔥', title: 'Streak Vô Địch', desc: 'Duy trì chuỗi Streak học tập liên tục 7 ngày.', unlocked: true },
    { icon: '🧙‍♂️', title: 'Bạn Thân AI Mentor', desc: 'Thực hiện 20 hội thoại trao đổi với trợ lý AI.', unlocked: false }
  ];
}
