import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { API_BASE_URL } from '../../api-config';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main transition-colors duration-300 relative overflow-hidden">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-5xl mx-auto px-4 py-6 z-10 relative space-y-6">
        
        <!-- Header -->
        <div class="bg-bg-card border border-border-main rounded-2xl p-5 shadow-xs transition-colors duration-300">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-brand-primary/15 rounded-xl flex items-center justify-center border border-brand-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users text-brand-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h2 class="text-lg font-black text-text-main leading-tight">Cộng Đồng Học Viên</h2>
              <p class="text-xs text-text-muted mt-0.5">Tham gia trò chuyện cùng mọi người và theo dõi thứ hạng của bạn trên Bảng xếp hạng.</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Left: Leaderboard (7 cols) -->
          <div class="lg:col-span-7 bg-bg-card border border-border-main rounded-2xl p-5 shadow-xs flex flex-col space-y-4">
            <div class="flex items-center gap-2 border-b border-border-main/50 pb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z"/></svg>
              <h3 class="text-xs font-black text-text-main uppercase tracking-wider">Bảng Xếp Hạng EXP</h3>
            </div>

            <!-- List container -->
            <div class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              @for (player of leaderboard(); track player.rank) {
                <div 
                  [class.bg-brand-primary/5]="player.email === currentUserEmail"
                  [class.border-brand-primary/30]="player.email === currentUserEmail"
                  class="flex items-center gap-3 p-3 bg-bg-input/20 border border-border-main/40 rounded-xl hover:border-border-main transition-colors"
                >
                  <span
                    [class.bg-yellow-500]="player.rank === 1"
                    [class.text-white]="player.rank === 1"
                    [class.bg-slate-400]="player.rank === 2"
                    [class.bg-amber-600]="player.rank === 3"
                    [class.bg-bg-input]="player.rank > 3"
                    [class.text-text-muted]="player.rank > 3"
                    class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                  >
                    {{ player.rank }}
                  </span>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-baseline gap-2">
                      <span class="text-xs font-black text-text-main truncate">
                        {{ player.name }}
                        @if (player.email === currentUserEmail) {
                          <span class="ml-1 text-[9px] bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded-md font-bold">Bạn</span>
                        }
                      </span>
                      <span class="text-[9px] text-brand-primary font-bold">Lv.{{ player.level }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-[9px] text-text-muted mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap text-red-500 shrink-0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      <span>Chuỗi Streak: {{ player.streak }} ngày</span>
                    </div>
                  </div>

                  <div class="text-right shrink-0">
                    <p class="text-xs font-black text-text-main">{{ player.exp }} EXP</p>
                    @if (player.email !== currentUserEmail) {
                      <button
                        (click)="challengePlayer(player.name)"
                        class="text-[9px] font-black text-brand-accent hover:underline uppercase tracking-wider block mt-0.5 cursor-pointer bg-transparent border-none p-0"
                      >
                        Thách đấu ⚔️
                      </button>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Sticky personal rank row -->
            @if (myRankEntry(); as me) {
              <div class="mt-4 pt-3 border-t border-border-main/55">
                <p class="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Thứ hạng của bạn</p>
                <div class="flex items-center gap-3 p-3 bg-brand-primary/10 border-2 border-brand-primary/30 rounded-xl">
                  <span class="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {{ me.rank }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-baseline gap-2">
                      <span class="text-xs font-black text-text-main truncate">{{ me.name }}</span>
                      <span class="text-[9px] text-brand-primary font-bold">Lv.{{ me.level }}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-[9px] text-text-muted mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap text-red-500 shrink-0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      <span>Chuỗi Streak: {{ me.streak }} ngày</span>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-xs font-black text-text-main">{{ me.exp }} EXP</p>
                    <span class="text-[9px] font-black text-brand-primary uppercase tracking-wider">Đang cập nhật</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Right: Global Chat Box (5 cols) -->
          <div class="lg:col-span-5 bg-bg-card border border-border-main rounded-2xl p-5 shadow-xs flex flex-col h-[525px]">
            <div class="flex items-center gap-2 border-b border-border-main/50 pb-3 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square text-brand-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <h3 class="text-xs font-black text-text-main uppercase tracking-wider">Phòng Trò Chuyện</h3>
            </div>
            
            <!-- Chat list -->
            <div id="chat-scroll-container" class="flex-1 overflow-y-auto my-3 pr-1 space-y-3 scrollbar-thin">
              @for (msg of chatMessages(); track msg.createdAt) {
                <div class="flex flex-col space-y-0.5">
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-[11px] font-black" [class.text-brand-primary]="msg.senderEmail === currentUserEmail" [class.text-brand-secondary]="msg.senderEmail !== currentUserEmail">
                      {{ msg.senderName }}
                    </span>
                    <span class="text-[8px] text-text-muted font-bold">{{ formatTime(msg.createdAt) }}</span>
                  </div>
                  <div 
                    [class.bg-brand-primary/10]="msg.senderEmail === currentUserEmail"
                    [class.border-brand-primary/15]="msg.senderEmail === currentUserEmail"
                    [class.bg-bg-input/30]="msg.senderEmail !== currentUserEmail"
                    class="text-xs text-text-main leading-relaxed px-3 py-2 rounded-2xl border border-border-main/30 inline-block max-w-[90%] break-words"
                  >
                    {{ msg.content }}
                  </div>
                </div>
              }
              @if (chatMessages().length === 0) {
                <div class="h-full flex flex-col items-center justify-center text-center text-text-muted py-12 space-y-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square opacity-40"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <p class="text-xxs">Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!</p>
                </div>
              }
            </div>

            <!-- Send form -->
            <form (submit)="sendMessage($event)" class="pt-3 border-t border-border-main/50 flex gap-2 shrink-0">
              <input
                type="text"
                [(ngModel)]="newMessage"
                name="chatMsg"
                placeholder="Nhập tin nhắn..."
                maxlength="200"
                class="flex-1 bg-bg-input border border-border-main/80 rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-semibold"
              />
              <button
                type="submit"
                [disabled]="!newMessage.trim()"
                class="bg-brand-primary hover:bg-brand-primary/90 text-white p-2 rounded-xl flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CommunityComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  leaderboard = signal<any[]>([]);
  chatMessages = signal<any[]>([]);
  newMessage = '';
  isLoadingLeaderboard = signal(true);
  isLoadingChat = signal(true);

  currentUserEmail = '';
  private chatPollingInterval: any = null;

  myRankEntry = computed(() => {
    return this.leaderboard().find(item => item.email === this.currentUserEmail) || null;
  });

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.currentUserEmail = user.email;
    }
    this.loadLeaderboard();
    this.loadChatMessages();
    // Auto-refresh chat every 2 seconds for real-time feel
    this.chatPollingInterval = setInterval(() => {
      this.silentRefreshChat();
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.chatPollingInterval) {
      clearInterval(this.chatPollingInterval);
    }
  }

  loadLeaderboard(): void {
    this.isLoadingLeaderboard.set(true);
    this.http.get<any[]>(`${API_BASE_URL}/api/community/leaderboard`).subscribe({
      next: (data) => { this.leaderboard.set(data); this.isLoadingLeaderboard.set(false); },
      error: (err) => { console.error('Failed to load leaderboard', err); this.isLoadingLeaderboard.set(false); }
    });
  }

  loadChatMessages(): void {
    this.isLoadingChat.set(true);
    this.http.get<any[]>(`${API_BASE_URL}/api/community/chat`).subscribe({
      next: (data) => {
        this.chatMessages.set(data);
        this.isLoadingChat.set(false);
        this.scrollToBottom();
      },
      error: (err) => { console.error('Failed to load chat messages', err); this.isLoadingChat.set(false); }
    });
  }

  silentRefreshChat(): void {
    this.http.get<any[]>(`${API_BASE_URL}/api/community/chat`).subscribe({
      next: (data) => {
        const prev = this.chatMessages();
        const hasNew = data.length > prev.length;
        this.chatMessages.set(data);
        if (hasNew) this.scrollToBottom();
      },
      error: () => {}
    });
  }

  sendMessage(event: Event): void {
    event.preventDefault();
    if (!this.newMessage.trim()) return;

    const body = { content: this.newMessage.trim() };
    this.newMessage = '';

    this.http.post<any>(`${API_BASE_URL}/api/community/chat`, body).subscribe({
      next: (savedMessage) => {
        this.chatMessages.update(msgs => [...msgs, savedMessage]);
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Failed to send message', err);
      }
    });
  }

  challengePlayer(playerName: string) {
    alert(`Đã gửi lời mời thách đấu minigame "Word Battle" tới người chơi [${playerName}]. Đang chờ phản hồi...`);
  }

  formatTime(isoString: string): string {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const el = document.getElementById('chat-scroll-container');
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }
}

