import {
  Component, inject, signal, ViewChild, ElementRef,
  AfterViewChecked, OnInit, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudyAiService } from '../../services/study-ai.service';

interface ChatMsg {
  sender: 'USER' | 'AI';
  text: string;
  ts: Date;
}

@Component({
  selector: 'app-ai-chat-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Bubble Button -->
    <button
      id="ai-chat-bubble-btn"
      (click)="toggleChat()"
      [class.scale-95]="isOpen()"
      class="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-bg-card border-2 border-border-main shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
      [title]="isOpen() ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'"
    >
      <!-- Pulse ring when closed -->
      @if (!isOpen()) {
        <span class="absolute inset-0 rounded-full border-2 border-text-muted/30 animate-ping pointer-events-none"></span>
      }

      @if (isOpen()) {
        <!-- X icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          class="text-text-main transition-all">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      } @else {
        <!-- Bot icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="text-text-main transition-all">
          <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
        </svg>

        <!-- Unread dot -->
        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 w-5 h-5 bg-text-main text-bg-main rounded-full text-[9px] font-black flex items-center justify-center border border-bg-main">
            {{ unreadCount() > 9 ? '9+' : unreadCount() }}
          </span>
        }
      }
    </button>

    <!-- Chat Panel -->
    @if (isOpen()) {
      <div
        id="ai-chat-panel"
        class="fixed bottom-24 right-6 z-[9998] w-[360px] max-h-[520px] flex flex-col bg-bg-card border border-border-main rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        style="box-shadow: 0 25px 50px rgba(0,0,0,0.4);"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-border-main bg-bg-input/40 shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-bg-input border border-border-main flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="text-text-muted">
                <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
                <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-black text-text-main leading-none">Merlin AI</p>
              <p class="text-[9px] text-text-muted font-semibold leading-none mt-0.5 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                Trợ lý học tiếng Anh
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              (click)="clearChat()"
              class="p-1.5 rounded-lg hover:bg-bg-input border border-transparent hover:border-border-main transition-all cursor-pointer"
              title="Xóa lịch sử"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="text-text-muted">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div
          #chatBox
          class="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 max-h-[340px]"
          style="scrollbar-width: thin;"
        >
          @for (msg of messages(); track msg.ts) {
            <div
              class="flex items-end gap-2 animate-fade-in"
              [class.flex-row-reverse]="msg.sender === 'USER'"
            >
              <!-- AI Avatar -->
              @if (msg.sender === 'AI') {
                <div class="w-6 h-6 rounded-full bg-bg-input border border-border-main flex items-center justify-center shrink-0 mb-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-text-muted">
                    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
                  </svg>
                </div>
              }

              <!-- Bubble -->
              <div
                class="max-w-[78%] px-3 py-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm"
                [class.bg-text-main]="msg.sender === 'USER'"
                [class.text-bg-main]="msg.sender === 'USER'"
                [class.rounded-br-none]="msg.sender === 'USER'"
                [class.bg-bg-input]="msg.sender === 'AI'"
                [class.border]="msg.sender === 'AI'"
                [class.border-border-main]="msg.sender === 'AI'"
                [class.text-text-main]="msg.sender === 'AI'"
                [class.rounded-bl-none]="msg.sender === 'AI'"
              >
                @if (msg.sender === 'AI') {
                  <div [innerHTML]="parseMarkdown(msg.text)" class="bubble-md"></div>
                } @else {
                  <p class="whitespace-pre-wrap font-medium">{{ msg.text }}</p>
                }
                <span class="block text-[8px] mt-1 opacity-50 text-right font-semibold">
                  {{ msg.ts | date:'HH:mm' }}
                </span>
              </div>

              <!-- User Avatar -->
              @if (msg.sender === 'USER') {
                <div class="w-6 h-6 rounded-full bg-bg-input border border-border-main flex items-center justify-center shrink-0 mb-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-text-muted">
                    <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
                  </svg>
                </div>
              }
            </div>
          }

          <!-- Typing indicator -->
          @if (isThinking()) {
            <div class="flex items-end gap-2 animate-fade-in">
              <div class="w-6 h-6 rounded-full bg-bg-input border border-border-main flex items-center justify-center shrink-0 mb-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="text-text-muted">
                  <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
                  <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
                </svg>
              </div>
              <div class="px-4 py-3 bg-bg-input border border-border-main rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <span class="dot1 w-1.5 h-1.5 bg-text-muted rounded-full"></span>
                <span class="dot2 w-1.5 h-1.5 bg-text-muted rounded-full"></span>
                <span class="dot3 w-1.5 h-1.5 bg-text-muted rounded-full"></span>
              </div>
            </div>
          }
        </div>

        <!-- Quick Chips -->
        <div class="px-4 pt-2 pb-1 flex gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
          @for (chip of quickChips; track chip.label) {
            <button
              (click)="sendQuick(chip.prompt)"
              [disabled]="isThinking()"
              class="text-[9px] font-bold text-text-muted border border-border-main bg-bg-input hover:bg-bg-card hover:text-text-main px-2.5 py-1 rounded-full shrink-0 cursor-pointer transition-all disabled:opacity-40"
            >
              {{ chip.label }}
            </button>
          }
        </div>

        <!-- Ask about current page block -->
        @if (hasPageContent()) {
          <div class="px-4 pb-1 pt-1 shrink-0">
            <button
              type="button"
              (click)="askAboutPage()"
              [disabled]="isThinking()"
              class="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-brand-primary/25 bg-brand-primary/5 hover:bg-brand-primary/10 text-text-main text-[10px] font-black cursor-pointer transition-all active:scale-98 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="text-brand-primary animate-pulse">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
              </svg>
              Giải thích nội dung trang này 💡
            </button>
          </div>
        }

        <!-- Input -->
        <div class="px-4 py-3 border-t border-border-main shrink-0">
          <form (ngSubmit)="send()" class="flex items-center gap-2">
            <input
              #inputEl
              type="text"
              [(ngModel)]="input"
              name="bubbleMsgInput"
              placeholder="Hỏi Merlin về tiếng Anh..."
              [disabled]="isThinking()"
              autocomplete="off"
              class="flex-1 bg-bg-input border border-border-main rounded-xl px-3 py-2 text-[11px] text-text-main placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-all"
            />
            <button
              type="submit"
              [disabled]="isThinking() || !input.trim()"
              class="w-8 h-8 rounded-xl bg-text-main hover:opacity-80 border border-border-main flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="text-bg-main">
                <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    }

    <!-- Selection Tooltip Button -->
    @if (showTooltip()) {
      <button
        (click)="askAboutSelection($event)"
        [style.left.px]="tooltipPos().x"
        [style.top.px]="tooltipPos().y"
        class="fixed z-[10000] bg-text-main text-bg-main text-[11px] font-black px-3 py-2 rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 border border-border-main/20 cursor-pointer"
        style="transform: translate(-50%, -100%); pointer-events: auto;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-primary animate-pulse">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
        </svg>
        Hỏi Merlin AI
      </button>
    }
  `,
  styles: [`
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
    .animate-fade-in  { animation: fadeIn 0.18s ease-out both; }

    .dot1 { animation: dotBounce 1.3s infinite 0s; }
    .dot2 { animation: dotBounce 1.3s infinite 0.2s; }
    .dot3 { animation: dotBounce 1.3s infinite 0.4s; }
    @keyframes dotBounce {
      0%, 80%, 100% { transform: scale(0.5); opacity: 0.4; }
      40%           { transform: scale(1);   opacity: 1; }
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    ::ng-deep .bubble-md strong { font-weight: 800; }
    ::ng-deep .bubble-md em { font-style: italic; opacity: 0.85; }
    ::ng-deep .bubble-md code {
      background: var(--bg-main);
      color: var(--text-main);
      padding: 1px 4px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 10px;
    }
    ::ng-deep .bubble-md ul { list-style: disc; padding-left: 1rem; margin: 4px 0; }
    ::ng-deep .bubble-md li { margin-bottom: 2px; }
  `]
})
export class AiChatBubbleComponent implements OnInit, AfterViewChecked {
  private readonly studyAiService = inject(StudyAiService);

  @ViewChild('chatBox') private chatBox!: ElementRef;

  isOpen = signal(false);
  isThinking = signal(false);
  messages = signal<ChatMsg[]>([]);
  unreadCount = signal(0);
  input = '';
  private shouldScroll = false;

  // Selection state
  selectedText = signal<string>('');
  tooltipPos = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  showTooltip = signal<boolean>(false);

  quickChips = [
    { label: 'Thì hiện tại hoàn thành', prompt: 'Giải thích thì Hiện tại hoàn thành và cho ví dụ thực tế.' },
    { label: 'Sửa câu', prompt: 'Sửa lỗi ngữ pháp: She dont knows how to speaking English.' },
    { label: 'Accept vs Except', prompt: 'Phân biệt Accept và Except bằng ví dụ.' },
    { label: 'Email lịch sự', prompt: 'Viết lại câu sau lịch sự hơn: I want you to reply now.' },
    { label: 'Phrasal verbs', prompt: 'Cho tôi 5 phrasal verbs hay dùng trong công việc và ví dụ.' },
  ];

  ngOnInit(): void {
    this.messages.set([{
      sender: 'AI',
      text: 'Xin chào! Tôi là **Merlin AI**, trợ lý học tiếng Anh của bạn.\n\nBạn có thể hỏi tôi về:\n- Giải thích ngữ pháp\n- Sửa lỗi câu văn\n- Tra từ vựng & phân biệt từ\n- Tiếng Anh công sở\n\n*Mẹo: Bạn có thể **bôi đen (highlight)** bất kỳ cụm từ nào trên trang để hỏi tôi giải thích trực tiếp!* 🎓',
      ts: new Date()
    }]);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.unreadCount.set(0);
      this.shouldScroll = true;
      // focus input after opening
      setTimeout(() => {
        const el = document.querySelector<HTMLInputElement>('#ai-chat-panel input');
        el?.focus();
      }, 250);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    const path = event.composedPath();
    const isInsideChat = path.some(el => {
      const id = (el as HTMLElement).id;
      return id === 'ai-chat-panel' || id === 'ai-chat-bubble-btn';
    });
    if (isInsideChat) return;

    setTimeout(() => {
      const selection = window.getSelection();
      const txt = selection ? selection.toString().trim() : '';

      if (txt && txt.length > 1) {
        this.selectedText.set(txt);
        
        const range = selection!.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        this.tooltipPos.set({
          x: rect.left + (rect.width / 2),
          y: rect.top - 8
        });
        this.showTooltip.set(true);
      } else {
        this.showTooltip.set(false);
        this.selectedText.set('');
      }
    }, 50);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.showTooltip()) {
      this.showTooltip.set(false);
      this.selectedText.set('');
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen()) this.isOpen.set(false);
    this.showTooltip.set(false);
    this.selectedText.set('');
  }

  send(): void {
    const text = this.input.trim();
    if (!text || this.isThinking()) return;

    this.messages.update(m => [...m, { sender: 'USER', text, ts: new Date() }]);
    this.input = '';
    this.isThinking.set(true);
    this.shouldScroll = true;

    const context = this.scrapePageContent();
    let apiPrompt = text;
    if (context && this.hasPageContent()) {
      apiPrompt = `[Ngữ cảnh trang tài liệu học người dùng đang mở]:\n${context}\n\n[Câu hỏi của người dùng]: ${text}`;
    }

    this.studyAiService.chatWithMentor(apiPrompt).subscribe({
      next: (res) => {
        this.isThinking.set(false);
        this.messages.update(m => [...m, { sender: 'AI', text: res.reply, ts: new Date() }]);
        this.shouldScroll = true;
        if (!this.isOpen()) {
          this.unreadCount.update(n => n + 1);
        }
      },
      error: () => {
        this.isThinking.set(false);
        this.messages.update(m => [...m, {
          sender: 'AI',
          text: 'Xin lỗi, có lỗi kết nối đến AI. Vui lòng thử lại sau!',
          ts: new Date()
        }]);
        this.shouldScroll = true;
      }
    });
  }

  sendQuick(prompt: string): void {
    if (this.isThinking()) return;
    this.input = prompt;
    this.send();
  }

  clearChat(): void {
    this.messages.set([{
      sender: 'AI',
      text: 'Đã xóa lịch sử trò chuyện. Bắt đầu lại thôi! 🎓',
      ts: new Date()
    }]);
    this.shouldScroll = true;
  }

  hasPageContent(): boolean {
    if (typeof window === 'undefined') return false;
    const url = window.location.pathname;
    return url.includes('/study') ||
           url.includes('/grammar-study') ||
           url.includes('/vocabulary-study') ||
           url.includes('/listening-study') ||
           url.includes('/reading-study') ||
           url.includes('/document-learning') ||
           url.includes('/my-vocabulary');
  }

  scrapePageContent(): string {
    if (typeof window === 'undefined') return '';
    const url = window.location.pathname;
    let content = '';

    try {
      if (url.includes('/grammar-study') || url.includes('/study')) {
        const headings = Array.from(document.querySelectorAll('h3, h4')).map(el => el.textContent?.trim()).filter(Boolean);
        const paragraphs = Array.from(document.querySelectorAll('p, li')).map(el => el.textContent?.trim()).filter(Boolean);
        content = `Tiêu đề: ${headings.join(' | ')}\nChi tiết:\n${paragraphs.slice(0, 15).join('\n')}`;
      } else if (url.includes('/reading-study')) {
        const passage = document.querySelector('.reading-passage, .select-text, p')?.textContent?.trim() || '';
        content = `Đoạn văn đọc:\n${passage.substring(0, 1500)}`;
      } else if (url.includes('/listening-study')) {
        const dialogue = Array.from(document.querySelectorAll('.dialogue-row, p')).map(el => el.textContent?.trim()).filter(Boolean);
        content = `Đoạn hội thoại/Kịch bản nghe:\n${dialogue.slice(0, 15).join('\n')}`;
      } else if (url.includes('/my-vocabulary')) {
        const words = Array.from(document.querySelectorAll('.notebook-card')).map(el => el.textContent?.trim()).filter(Boolean);
        content = `Danh sách từ vựng đang xem:\n${words.slice(0, 10).join('\n')}`;
      } else if (url.includes('/document-learning')) {
        const docText = document.querySelector('.extracted-text, .select-text, p')?.textContent?.trim() || '';
        content = `Tài liệu đang học:\n${docText.substring(0, 1500)}`;
      } else {
        const mainEl = document.querySelector('router-outlet + *') || document.querySelector('body');
        if (mainEl) {
          const texts = Array.from(mainEl.querySelectorAll('h1, h2, h3, h4, p, li'))
            .map(el => el.textContent?.trim())
            .filter(t => t && t.length > 10)
            .slice(0, 20);
          content = texts.join('\n');
        }
      }
    } catch (e) {
      console.error('Error scraping content', e);
    }

    return content.trim();
  }

  askAboutSelection(event: Event): void {
    event.stopPropagation();
    const txt = this.selectedText();
    if (!txt) return;

    this.showTooltip.set(false);
    this.selectedText.set('');
    try {
      window.getSelection()?.removeAllRanges();
    } catch (_) {}

    this.isOpen.set(true);

    const pageContext = this.scrapePageContent();
    let userPrompt = `Giải thích cụm này giúp tôi: "${txt}"`;
    let apiPrompt = userPrompt;
    if (pageContext) {
      apiPrompt = `[Ngữ cảnh trang tài liệu đang đọc]:\n${pageContext}\n\n[Yêu cầu]: Hãy giải thích nghĩa, cách dùng và ý nghĩa của từ/cụm từ/câu sau trong ngữ cảnh trên: "${txt}"`;
    }

    this.messages.update(m => [...m, { sender: 'USER', text: userPrompt, ts: new Date() }]);
    this.isThinking.set(true);
    this.shouldScroll = true;

    this.studyAiService.chatWithMentor(apiPrompt).subscribe({
      next: (res) => {
        this.isThinking.set(false);
        this.messages.update(m => [...m, { sender: 'AI', text: res.reply, ts: new Date() }]);
        this.shouldScroll = true;
      },
      error: () => {
        this.isThinking.set(false);
        this.messages.update(m => [...m, {
          sender: 'AI',
          text: 'Xin lỗi, có lỗi kết nối đến AI. Vui lòng thử lại sau!',
          ts: new Date()
        }]);
        this.shouldScroll = true;
      }
    });
  }

  askAboutPage(): void {
    if (this.isThinking()) return;
    const context = this.scrapePageContent();
    if (!context) return;

    const userMsg = "Giải thích và tóm tắt kiến thức trang này giúp tôi.";
    const apiPrompt = `[Nội dung tài liệu/bài học tôi đang mở trên màn hình]:\n${context}\n\n[Yêu cầu]: Hãy tóm tắt ngắn gọn và giải thích các điểm ngữ pháp, từ vựng hoặc kiến thức cốt lõi trong tài liệu trên. Hãy hướng dẫn tôi cách học tốt phần này.`;

    this.messages.update(m => [...m, { sender: 'USER', text: userMsg, ts: new Date() }]);
    this.isThinking.set(true);
    this.shouldScroll = true;

    this.studyAiService.chatWithMentor(apiPrompt).subscribe({
      next: (res) => {
        this.isThinking.set(false);
        this.messages.update(m => [...m, { sender: 'AI', text: res.reply, ts: new Date() }]);
        this.shouldScroll = true;
      },
      error: () => {
        this.isThinking.set(false);
        this.messages.update(m => [...m, {
          sender: 'AI',
          text: 'Xin lỗi, có lỗi kết nối đến AI. Vui lòng thử lại sau!',
          ts: new Date()
        }]);
        this.shouldScroll = true;
      }
    });
  }

  private scrollBottom(): void {
    try {
      const el = this.chatBox?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch (_) {}
  }

  parseMarkdown(text: string): string {
    if (!text) return '';
    let h = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    h = h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*(.*?)\*/g, '<em>$1</em>');
    h = h.replace(/`(.*?)`/g, '<code>$1</code>');
    h = h.replace(/(?:^|<br>)\s*-\s+(.*?)(?=<br>|$)/g, '<li>$1</li>');
    h = h.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    h = h.replace(/<br><ul>/g, '<ul>').replace(/<\/ul><br>/g, '</ul>');
    return h;
  }
}
