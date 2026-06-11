import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CharacterService, Character } from '../../services/character.service';
import { StudyService } from '../../services/study.service';
import { AuthService } from '../../services/auth.service';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar';

interface ShopItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  type: 'OUTFIT' | 'HAIR_STYLE' | 'HAIR_COLOR' | 'TITLE' | 'STREAK_FREEZE';
  value: string;
  icon: string;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, CharacterAvatarComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 flex flex-col items-center justify-start relative overflow-hidden transition-colors duration-300">
      
      <!-- Background glowing gradient circles -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-6xl z-10 space-y-6">
        
        <!-- Header / Banner -->
        <div class="relative w-full backdrop-blur-xl bg-bg-card border border-border-main shadow-lg rounded-2xl p-6 md:p-8 transition-colors duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2 text-center md:text-left">
            <span class="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-widest border border-yellow-500/20">
              🪙 Cửa Hàng RPG
            </span>
            <h1 class="text-3xl font-extrabold tracking-tight mt-2 text-text-main">
              TIỆM TẠP HÓA ASCENSION
            </h1>
            <p class="text-xs text-text-muted max-w-xl">
              Sử dụng Xu (Coins) kiếm được từ quá trình học để mở khóa trang phục, kiểu tóc, danh hiệu hoành tráng hoặc mua Thẻ Đóng Băng Streak để bảo toàn chuỗi ngày học của bạn!
            </p>
          </div>

          <!-- Currency Board -->
          <div class="flex items-center gap-6 bg-bg-input/60 border border-border-main/50 px-6 py-4 rounded-xl shadow-inner shrink-0">
            <div class="text-center">
              <p class="text-2xl font-black text-yellow-500 flex items-center justify-center gap-1.5 animate-pulse">
                🪙 {{ coins() }}
              </p>
              <p class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold mt-1">Xu Hiện Có</p>
            </div>
            <div class="h-8 w-px bg-border-main/50"></div>
            <div class="text-center">
              <p class="text-2xl font-black text-red-500 flex items-center justify-center gap-1.5">
                🔥 {{ streak() }}
              </p>
              <p class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold mt-1">Chuỗi Ngày</p>
            </div>
          </div>
        </div>

        <!-- Main Body Grid (Preview + Shop items) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Live Preview Character Column (4 cols) -->
          <div class="lg:col-span-4 space-y-4">
            <div class="bg-bg-card border border-border-main rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition-colors duration-300">
              <span class="bg-brand-primary/10 text-brand-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-4 border border-brand-primary/15">
                Xem Trước Đại Diện
              </span>

              <!-- Avatar Viewport -->
              <div class="relative w-48 h-48 flex items-center justify-center bg-bg-input/50 rounded-2xl border border-border-main shadow-inner p-4 mb-4">
                <app-character-avatar [character]="getPreviewCharacter()" class="w-full h-full drop-shadow-2xl" />
              </div>

              <!-- Name & Title -->
              <h3 class="text-lg font-black text-text-main truncate w-full px-2 min-h-[1.75rem]">
                {{ character()?.name || 'Hiệp Sĩ Tập Sự' }}
              </h3>
              
              <span class="text-xxs font-black text-brand-secondary uppercase tracking-widest bg-brand-secondary/10 px-3 py-1 rounded-full mt-2 border border-brand-secondary/20">
                👑 {{ character()?.title || 'Novice' }}
              </span>

              <!-- Reset Preview buttons if changed -->
              @if (hasPreviewChanges()) {
                <button
                  (click)="resetPreview()"
                  class="mt-4 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest cursor-pointer"
                >
                  ✕ Hủy Xem Trước
                </button>
              }
            </div>

            <!-- AI Quote Box -->
            <div class="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-5 shadow-sm text-center">
              <span class="text-base">🧙‍♂️</span>
              <p class="text-[11px] text-brand-primary/95 italic font-medium leading-relaxed mt-2">
                "Diện mạo hào hoa tăng cao sĩ khí! Hãy chọn trang phục thật ngầu trước khi tham gia cuộc thi đấu chữ."
              </p>
            </div>
          </div>

          <!-- Shop Catalog Column (8 cols) -->
          <div class="lg:col-span-8 space-y-5">
            
            <!-- Category Tabs -->
            <div class="flex items-center overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-border-main">
              @for (tab of tabs; track tab.id) {
                <button
                  (click)="activeTab.set(tab.id)"
                  [class.bg-brand-primary]="activeTab() === tab.id"
                  [class.text-white]="activeTab() === tab.id"
                  [class.border-brand-primary]="activeTab() === tab.id"
                  [class.bg-bg-card]="activeTab() !== tab.id"
                  [class.text-text-muted]="activeTab() !== tab.id"
                  [class.border-border-main]="activeTab() !== tab.id"
                  class="px-4 py-2.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all hover:scale-105 shrink-0"
                >
                  {{ tab.label }}
                </button>
              }
            </div>

            <!-- Feedback Notifications -->
            @if (feedbackMsg()) {
              <div
                [class.bg-green-500/10]="isSuccess()"
                [class.border-green-500/20]="isSuccess()"
                [class.text-green-500]="isSuccess()"
                [class.bg-red-500/10]="!isSuccess()"
                [class.border-red-500/20]="!isSuccess()"
                [class.text-red-400]="!isSuccess()"
                class="border text-xs p-4 rounded-xl flex items-center justify-between shadow-sm animate-fade-in"
              >
                <span class="font-semibold">{{ feedbackMsg() }}</span>
                <button (click)="feedbackMsg.set(null)" class="text-text-muted hover:text-text-main font-bold shrink-0 ml-2">✕</button>
              </div>
            }

            <!-- Items Catalog Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              @for (item of filteredItems(); track item.id) {
                <div
                  [class.border-brand-primary]="isPreviewing(item)"
                  [class.bg-brand-primary/5]="isPreviewing(item)"
                  class="bg-bg-card border border-border-main hover:border-border-main/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm transition-all group duration-300 relative overflow-hidden"
                >
                  <!-- Tag for Previewing / Equipped -->
                  @if (isEquipped(item)) {
                    <span class="absolute top-3 right-3 bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                      Đang Trang Bị
                    </span>
                  } @else if (isPreviewing(item)) {
                    <span class="absolute top-3 right-3 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                      Đang Xem Thử
                    </span>
                  }

                  <!-- Content info -->
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-xl bg-bg-input border border-border-main/50 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                        {{ item.icon }}
                      </div>
                      <div>
                        <h4 class="font-black text-text-main text-sm leading-snug">{{ item.name }}</h4>
                        <span class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold">{{ getCategoryLabel(item.type) }}</span>
                      </div>
                    </div>
                    
                    <p class="text-xs text-text-muted leading-relaxed font-normal">
                      {{ item.desc }}
                    </p>
                  </div>

                  <!-- Purchase Control -->
                  <div class="mt-5 pt-3 border-t border-border-main/50 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-1.5 shrink-0">
                      <span class="text-sm">🪙</span>
                      <span class="font-black text-yellow-500 text-sm tracking-tight">{{ item.cost }} Xu</span>
                    </div>

                    <div class="flex items-center gap-2">
                      <!-- Live Preview button (only for outfits/hair) -->
                      @if (canPreviewItem(item.type) && !isEquipped(item)) {
                        <button
                          (click)="previewItem(item)"
                          [class.bg-bg-input]="!isPreviewing(item)"
                          [class.text-text-muted]="!isPreviewing(item)"
                          [class.bg-brand-primary/15]="isPreviewing(item)"
                          [class.text-brand-primary]="isPreviewing(item)"
                          class="px-2.5 py-1.5 rounded-lg border border-border-main/50 text-[10px] font-black cursor-pointer uppercase transition-all"
                        >
                          Xem thử
                        </button>
                      }

                      <!-- Buy Button -->
                      @if (isEquipped(item)) {
                        <button
                          disabled
                          class="px-4 py-1.5 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-black"
                        >
                          Trang bị
                        </button>
                      } @else {
                        <button
                          (click)="purchase(item)"
                          [class.bg-brand-primary]="coins() >= item.cost"
                          [class.hover:bg-brand-primary/90]="coins() >= item.cost"
                          [class.text-white]="coins() >= item.cost"
                          [class.bg-bg-input]="coins() < item.cost"
                          [class.text-text-muted]="coins() < item.cost"
                          [class.cursor-not-allowed]="coins() < item.cost"
                          class="px-4 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all shadow-sm"
                        >
                          Mua ngay
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Empty category state -->
            @if (filteredItems().length === 0) {
              <div class="text-center py-12 bg-bg-card border border-border-main rounded-2xl">
                <span class="text-3xl">📭</span>
                <p class="text-xs text-text-muted font-semibold mt-3">Không có vật phẩm nào trong mục này.</p>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `]
})
export class ShopComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly characterService = inject(CharacterService);
  private readonly studyService = inject(StudyService);

  // States
  coins = signal<number>(0);
  streak = signal<number>(0);
  character = signal<Character | null>(null);

  // UI state
  activeTab = signal<string>('outfit');
  feedbackMsg = signal<string | null>(null);
  isSuccess = signal<boolean>(true);

  // Temp preview overrides
  previewOutfit = signal<string | null>(null);
  previewHairStyle = signal<string | null>(null);
  previewHairColor = signal<string | null>(null);

  tabs = [
    { id: 'outfit', label: '🥋 Trang Phục' },
    { id: 'hair_style', label: '💇‍♂️ Kiểu Tóc' },
    { id: 'hair_color', label: '🎨 Màu Tóc' },
    { id: 'title', label: '🎖️ Danh Hiệu' },
    { id: 'buff', label: '⚡ Hỗ Trợ' }
  ];

  // Static shop catalog
  shopCatalog: ShopItem[] = [
    // Outfits
    { id: 'outfit_warrior', name: 'Giáp Chiến Binh Hoàng Kim', desc: 'Bộ chiến giáp mạ vàng rực rỡ, biểu trưng cho sự bền bỉ chiến đấu.', cost: 80, type: 'OUTFIT', value: 'WARRIOR', icon: '🛡️' },
    { id: 'outfit_mage', name: 'Áo Choàng Pháp Sư Tối Thượng', desc: 'Trang phục thêu tơ tím quý phái chứa linh lực ngôn từ sâu thẳm.', cost: 100, type: 'OUTFIT', value: 'MAGE', icon: '🔮' },
    { id: 'outfit_rogue', name: 'Mũ Trùm Sát Thủ Bóng Đêm', desc: 'Y phục gọn gàng tàng hình trong bóng đêm giúp phản xạ chớp nhoáng.', cost: 120, type: 'OUTFIT', value: 'ROGUE', icon: '🗡️' },
    { id: 'outfit_casual', name: 'Y Phục Casual Năng Động', desc: 'Trang phục thoải mái, trẻ trung giúp tinh thần thoải mái tiếp thu từ vựng.', cost: 50, type: 'OUTFIT', value: 'CASUAL', icon: '👕' },

    // Hair Styles
    { id: 'hair_short', name: 'Kiểu Tóc Ngắn Cá Tính', desc: 'Tóc ngắn gọn gàng năng động cho các đấu sĩ từ vựng.', cost: 25, type: 'HAIR_STYLE', value: 'SHORT', icon: '💇' },
    { id: 'hair_long', name: 'Mái Tóc Dài Lãng Tử', desc: 'Mái tóc dài thướt tha mang phong vị tri thức cao quý.', cost: 35, type: 'HAIR_STYLE', value: 'LONG', icon: '🧔' },
    { id: 'hair_curly', name: 'Tóc Xoăn Nghệ Sĩ', desc: 'Những lọn tóc xoăn bồng bềnh đậm chất nghệ thuật sáng tạo.', cost: 40, type: 'HAIR_STYLE', value: 'CURLY', icon: '🧑‍🦱' },
    { id: 'hair_spiky', name: 'Kiểu Tóc Dựng Chiến Sĩ', desc: 'Kiểu tóc dựng đứng gai góc tràn đầy nhuệ khí phiêu lưu.', cost: 45, type: 'HAIR_STYLE', value: 'SPIKY', icon: '🦔' },

    // Hair Colors
    { id: 'color_black', name: 'Màu Đen Huyền Bí', desc: 'Màu đen nguyên bản tinh tế và thanh lịch truyền thống.', cost: 15, type: 'HAIR_COLOR', value: 'BLACK', icon: '⚫' },
    { id: 'color_brown', name: 'Màu Nâu Lịch Lãm', desc: 'Nâu hạt dẻ ấm áp tạo cảm giác gần gũi tinh tế.', cost: 20, type: 'HAIR_COLOR', value: 'BROWN', icon: '🟤' },
    { id: 'color_blonde', name: 'Màu Vàng Rực Rỡ', desc: 'Vàng kim bắt mắt làm bừng sáng mọi vùng đất trên bản đồ.', cost: 30, type: 'HAIR_COLOR', value: 'BLONDE', icon: '🟡' },
    { id: 'color_red', name: 'Màu Đỏ Hỏa Ngục', desc: 'Sắc đỏ rực cháy bốc lửa sẵn sàng thiêu rụi mọi thử thách.', cost: 35, type: 'HAIR_COLOR', value: 'RED', icon: '🔴' },
    { id: 'color_silver', name: 'Màu Bạc Bạch Kim', desc: 'Màu trắng bạc hoàng gia tượng trưng cho trí tuệ lỗi lạc.', cost: 40, type: 'HAIR_COLOR', value: 'SILVER', icon: '⚪' },

    // Titles
    { id: 'title_reflex', name: 'Danh hiệu: Chiến Thần Phản Xạ', desc: 'Hiển thị danh hiệu đặc sắc này cạnh nhân vật và trên bảng xếp hạng.', cost: 150, type: 'TITLE', value: 'Chiến Thần Phản Xạ', icon: '⚡' },
    { id: 'title_legend', name: 'Danh hiệu: Huyền Thoại Ngôn Ngữ', desc: 'Danh hiệu tối thượng minh chứng cho người sở hữu vốn học thức cao thâm.', cost: 200, type: 'TITLE', value: 'Huyền Thoại Ngôn Ngữ', icon: '👑' },
    { id: 'title_vocab', name: 'Danh hiệu: Kẻ Diệt Từ Vựng', desc: 'Xưng hiệu cực chất dành cho các bậc thầy chinh phục kho flashcard.', cost: 100, type: 'TITLE', value: 'Kẻ Diệt Từ Vựng', icon: '⚔️' },
    { id: 'title_grammar', name: 'Danh hiệu: Dũng Sĩ Ngữ Pháp', desc: 'Danh hiệu kiêu hãnh của những người nắm vững cấu trúc mệnh đề câu.', cost: 120, type: 'TITLE', value: 'Dũng Sĩ Ngữ Pháp', icon: '📜' },

    // Buffs (Streak Freeze)
    { id: 'buff_streak_freeze', name: 'Bảo Bối Đóng Băng Streak', desc: 'Đóng băng chuỗi streak học tập (Tăng lập tức +1 Ngày Streak như một bảo hiểm giữ chuỗi).', cost: 100, type: 'STREAK_FREEZE', value: 'STREAK_FREEZE', icon: '❄️' }
  ];

  ngOnInit(): void {
    this.loadPlayerData();
  }

  loadPlayerData(): void {
    // Coins and profile details
    this.studyService.getProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.coins.set(profile.coins);
          this.streak.set(profile.streak);
        }
      },
      error: () => {
        const localUser = this.authService.getUser();
        if (localUser) {
          this.coins.set(localUser.coins || 0);
          this.streak.set(localUser.streak || 0);
        }
      }
    });

    // Character details
    this.characterService.getMyCharacter().subscribe({
      next: (char) => this.character.set(char),
      error: () => this.character.set(null)
    });
  }

  filteredItems = computed(() => {
    const tab = this.activeTab();
    return this.shopCatalog.filter(item => {
      if (tab === 'outfit') return item.type === 'OUTFIT';
      if (tab === 'hair_style') return item.type === 'HAIR_STYLE';
      if (tab === 'hair_color') return item.type === 'HAIR_COLOR';
      if (tab === 'title') return item.type === 'TITLE';
      if (tab === 'buff') return item.type === 'STREAK_FREEZE';
      return false;
    });
  });

  getCategoryLabel(type: string): string {
    switch (type) {
      case 'OUTFIT': return 'Trang phục';
      case 'HAIR_STYLE': return 'Kiểu tóc';
      case 'HAIR_COLOR': return 'Màu tóc';
      case 'TITLE': return 'Danh hiệu';
      case 'STREAK_FREEZE': return 'Hỗ trợ';
      default: return '';
    }
  }

  canPreviewItem(type: string): boolean {
    return ['OUTFIT', 'HAIR_STYLE', 'HAIR_COLOR'].includes(type);
  }

  getPreviewCharacter(): Character | null {
    const char = this.character();
    if (!char) return null;

    return {
      ...char,
      outfitStyle: this.previewOutfit() || char.outfitStyle,
      hairStyle: this.previewHairStyle() || char.hairStyle,
      hairColor: this.previewHairColor() || char.hairColor
    };
  }

  hasPreviewChanges(): boolean {
    return this.previewOutfit() !== null ||
           this.previewHairStyle() !== null ||
           this.previewHairColor() !== null;
  }

  resetPreview(): void {
    this.previewOutfit.set(null);
    this.previewHairStyle.set(null);
    this.previewHairColor.set(null);
  }

  isPreviewing(item: ShopItem): boolean {
    if (item.type === 'OUTFIT' && this.previewOutfit() === item.value) return true;
    if (item.type === 'HAIR_STYLE' && this.previewHairStyle() === item.value) return true;
    if (item.type === 'HAIR_COLOR' && this.previewHairColor() === item.value) return true;
    return false;
  }

  previewItem(item: ShopItem): void {
    if (item.type === 'OUTFIT') {
      this.previewOutfit.set(item.value);
    } else if (item.type === 'HAIR_STYLE') {
      this.previewHairStyle.set(item.value);
    } else if (item.type === 'HAIR_COLOR') {
      this.previewHairColor.set(item.value);
    }
  }

  isEquipped(item: ShopItem): boolean {
    const char = this.character();
    if (!char) return false;

    if (item.type === 'OUTFIT') return char.outfitStyle === item.value;
    if (item.type === 'HAIR_STYLE') return char.hairStyle === item.value;
    if (item.type === 'HAIR_COLOR') return char.hairColor === item.value;
    if (item.type === 'TITLE') return char.title === item.value;
    return false;
  }

  purchase(item: ShopItem): void {
    if (this.coins() < item.cost) {
      this.feedbackMsg.set('❌ Bạn không đủ Xu để mua vật phẩm này!');
      this.isSuccess.set(false);
      return;
    }

    this.http.post<any>('http://localhost:8080/api/shop/purchase', {
      itemType: item.type,
      itemId: item.id,
      itemValue: item.value,
      cost: item.cost
    }).subscribe({
      next: (res) => {
        this.feedbackMsg.set(`✓ Chúc mừng! Bạn đã mua thành công "${item.name}"!`);
        this.isSuccess.set(true);
        this.coins.set(res.newCoins);
        this.streak.set(res.streak);

        // Update local character properties
        const currentChar = this.character();
        if (currentChar) {
          const updated: Character = {
            ...currentChar,
            outfitStyle: res.outfitStyle || currentChar.outfitStyle,
            hairStyle: res.hairStyle || currentChar.hairStyle,
            hairColor: res.hairColor || currentChar.hairColor,
            title: res.title || currentChar.title
          };
          this.character.set(updated);
          
          // Clear matches from temporary previews
          if (item.type === 'OUTFIT' && this.previewOutfit() === item.value) this.previewOutfit.set(null);
          if (item.type === 'HAIR_STYLE' && this.previewHairStyle() === item.value) this.previewHairStyle.set(null);
          if (item.type === 'HAIR_COLOR' && this.previewHairColor() === item.value) this.previewHairColor.set(null);
        }

        // Save updated coin count back to auth local user details if cached
        const user = this.authService.getUser();
        if (user) {
          user.coins = res.newCoins;
          user.streak = res.streak;
          this.authService.saveUser(user);
          this.authService.currentUser.set(user);
        }
      },
      error: (err) => {
        console.error('Error during purchase', err);
        const errMsg = err.error?.message || 'Có lỗi xảy ra khi thực hiện mua vật phẩm.';
        this.feedbackMsg.set(`❌ Lỗi: ${errMsg}`);
        this.isSuccess.set(false);
      }
    });
  }
}
