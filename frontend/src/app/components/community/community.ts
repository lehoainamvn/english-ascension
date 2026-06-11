import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LeaderboardUser {
  rank: number;
  name: string;
  level: number;
  exp: number;
  streak: number;
}

interface SocialPost {
  user: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
}

@Component({
  selector: 'app-community',
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
            <span class="text-3xl">👥</span>
            <div>
              <h2 class="text-xl md:text-2xl font-black text-text-main">Cộng Đồng Học Viên</h2>
              <p class="text-xs text-text-muted mt-1">Cạnh tranh lành mạnh trên Bảng xếp hạng và chia sẻ các cột mốc học tập.</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <!-- Left: Leaderboard (7 cols) -->
          <div class="lg:col-span-7 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div class="space-y-4">
              <h3 class="text-xs font-black text-text-muted uppercase tracking-widest border-b border-border-main/55 pb-2">BẢNG XẾP HẠNG EXP TUẦN 🏆</h3>
              
              <div class="space-y-2.5">
                @for (player of leaderboard; track player.rank) {
                  <div class="flex items-center gap-3 p-3 bg-bg-input/30 border border-border-main/45 rounded-xl">
                    <span
                      [ngClass]="{
                        'bg-yellow-500 text-white': player.rank === 1,
                        'bg-slate-400 text-white': player.rank === 2,
                        'bg-amber-600 text-white': player.rank === 3,
                        'bg-bg-input text-text-muted': player.rank > 3
                      }"
                      class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                    >
                      {{ player.rank }}
                    </span>
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-baseline gap-2">
                        <span class="text-xs font-black text-text-main truncate">{{ player.name }}</span>
                        <span class="text-[9px] text-brand-primary font-bold">Lv.{{ player.level }}</span>
                      </div>
                      <p class="text-[9px] text-text-muted mt-0.5">🔥 Chuỗi Streak: {{ player.streak }} ngày</p>
                    </div>

                    <div class="text-right shrink-0">
                      <p class="text-xs font-black text-text-main">{{ player.exp }} EXP</p>
                      <button
                        (click)="challengePlayer(player.name)"
                        class="text-[9px] font-black text-brand-accent hover:underline uppercase tracking-wider block mt-0.5 cursor-pointer"
                      >
                        Thách đấu ⚔️
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Right: Social Feed (5 cols) -->
          <div class="lg:col-span-5 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div class="space-y-4">
              <h3 class="text-xs font-black text-text-muted uppercase tracking-widest border-b border-border-main/55 pb-2">BẢNG TIN THÀNH TỰU 📝</h3>
              
              <div class="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                @for (post of feed(); track post.time) {
                  <div class="space-y-2 border-b border-border-main/30 pb-3 last:border-b-0 last:pb-0">
                    <div class="flex items-center gap-2">
                      <span class="text-2xl">{{ post.avatar }}</span>
                      <div>
                        <h4 class="text-xs font-black text-text-main">{{ post.user }}</h4>
                        <p class="text-[8px] text-text-muted">{{ post.time }}</p>
                      </div>
                    </div>
                    
                    <p class="text-[11px] text-text-muted leading-relaxed leading-normal bg-bg-input/20 p-2.5 rounded-lg border border-border-main/20">
                      {{ post.content }}
                    </p>

                    <div class="flex items-center gap-4 text-[9px] text-text-muted">
                      <button (click)="likePost(post)" class="hover:text-brand-accent transition-colors cursor-pointer">
                        ❤️ {{ post.likes }} Thích
                      </button>
                      <span>💬 0 Bình luận</span>
                    </div>
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
export class CommunityComponent {
  leaderboard: LeaderboardUser[] = [
    { rank: 1, name: 'Dũng Sĩ Tiếng Anh', level: 12, exp: 2450, streak: 15 },
    { rank: 2, name: 'Nam_TOEIC_990', level: 10, exp: 1980, streak: 8 },
    { rank: 3, name: 'Chiến Binh Rồng', level: 9, exp: 1720, streak: 12 },
    { rank: 4, name: 'Học viên chăm chỉ', level: 7, exp: 1210, streak: 5 }
  ];

  feed = signal<SocialPost[]>([
    { user: 'Dũng Sĩ Tiếng Anh', avatar: '🧙‍♂️', time: '10 phút trước', content: 'Vừa đánh bại Slime Phản Xạ trong Word Battle chương 3! Nhận được kiếm đồng và +50 EXP!', likes: 5 },
    { user: 'Nam_TOEIC_990', avatar: '🐱', time: '1 giờ trước', content: 'Học liên tục 7 ngày rồi nha cả nhà ơi! Mục tiêu tuần này là hoàn thành placement test tiếp theo.', likes: 8 }
  ]);

  challengePlayer(playerName: string) {
    alert(`Đã gửi lời mời thách đấu minigame "Word Battle" tới người chơi [${playerName}]. Đang chờ phản hồi...`);
  }

  likePost(post: SocialPost) {
    post.likes++;
  }
}
