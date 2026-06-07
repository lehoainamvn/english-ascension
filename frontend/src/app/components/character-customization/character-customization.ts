import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CharacterService, Character } from '../../services/character.service';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar';

@Component({
  selector: 'app-character-customization',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, CharacterAvatarComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main glass container -->
      <div class="relative w-full max-w-4xl backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-2xl p-6 md:p-8 transition-colors duration-300">
        
        <!-- Top Bar -->
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-border-main">
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
              ENGLISH ASCENSION
            </h2>
            <span class="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Tùy Chỉnh
            </span>
          </div>
          <button
            (click)="onLogout()"
            class="bg-bg-input hover:bg-red-500/10 border border-border-main hover:border-red-500/30 text-text-muted hover:text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-text-muted font-medium">Đang tải thông tin nhân vật...</p>
          </div>
        } @else {
          <!-- Split Layout -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <!-- Column 1: Live Preview (5 cols) -->
            <div class="md:col-span-5 flex flex-col items-center">
              <div class="w-full bg-bg-input border border-border-main rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden transition-colors duration-300">
                <!-- Background pattern or accent -->
                <div class="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none"></div>
                
                <!-- Character Title/Badge -->
                <div class="mb-4 z-10">
                  <span class="bg-brand-secondary/15 text-brand-secondary text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
                    {{ isEditMode() ? 'Người Hùng' : 'Tân Binh' }}
                  </span>
                </div>

                <!-- Dynamic SVG Live Preview -->
                <div class="relative w-48 h-48 md:w-60 md:h-60 flex items-center justify-center bg-bg-card rounded-2xl border border-border-main shadow-inner p-4 mb-4 z-10 transition-colors duration-300">
                  <app-character-avatar [character]="getCharacterPreviewObject()" class="w-full h-full drop-shadow-xl" />
                </div>

                <!-- Name and Subtitle -->
                <div class="z-10 w-full px-4">
                  <h3 class="text-xl font-extrabold text-text-main tracking-tight truncate min-h-[1.75rem]">
                    {{ name.trim() || 'Vô Danh' }}
                  </h3>
                  <p class="text-xs text-brand-accent font-semibold tracking-wider uppercase mt-1">
                    Danh hiệu: Novice (Cấp 1)
                  </p>
                </div>
              </div>
              
              <!-- Instructions / Tips -->
              <div class="w-full mt-4 p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
                <h4 class="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">💡 Hướng dẫn RPG</h4>
                <p class="text-xs text-text-muted leading-relaxed">
                  Nhân vật này sẽ là đại diện của bạn trên chặng đường chinh phục đỉnh cao tiếng Anh. EXP và Huy chương sẽ giúp bạn nâng cấp ngoại hình và danh hiệu!
                </p>
              </div>
            </div>

            <!-- Column 2: Controls Form (7 cols) -->
            <div class="md:col-span-7 space-y-6">
              
              <!-- Messages -->
              @if (errorMessage()) {
                <div class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl flex items-center gap-2">
                  <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>{{ errorMessage() }}</span>
                </div>
              }
              @if (successMessage()) {
                <div class="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-xl flex items-center gap-2">
                  <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ successMessage() }}</span>
                </div>
              }

              <!-- Character Name Input -->
              <div>
                <label class="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Tên nhân vật</label>
                <input
                  type="text"
                  [(ngModel)]="name"
                  placeholder="Nhập tên người hùng..."
                  maxlength="20"
                  class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-text-main placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all font-semibold"
                />
              </div>

              <!-- Gender Selection -->
              <div>
                <label class="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Giới tính</label>
                <div class="grid grid-cols-2 gap-3">
                  @for (g of genders; track g.id) {
                    <button
                      (click)="gender = g.id"
                      [class.border-brand-primary]="gender === g.id"
                      [class.bg-brand-primary/5]="gender === g.id"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/50 rounded-xl py-3 px-4 font-bold text-sm text-center transition-all cursor-pointer"
                    >
                      {{ g.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Hair Style Selection -->
              <div>
                <label class="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Kiểu tóc</label>
                <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  @for (h of hairStyles; track h.id) {
                    <button
                      (click)="hairStyle = h.id"
                      [class.border-brand-primary]="hairStyle === h.id"
                      [class.bg-brand-primary/5]="hairStyle === h.id"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/50 rounded-xl py-2 px-1 text-xs font-bold text-center transition-all cursor-pointer truncate"
                      [title]="h.label"
                    >
                      {{ h.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Hair Color Selection -->
              <div>
                <label class="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Màu tóc</label>
                <div class="flex items-center gap-3">
                  @for (c of hairColors; track c.id) {
                    <button
                      (click)="hairColor = c.id"
                      [style.backgroundColor]="c.hex"
                      [class.ring-2]="hairColor === c.id"
                      [class.ring-offset-2]="hairColor === c.id"
                      [class.ring-brand-primary]="hairColor === c.id"
                      class="w-10 h-10 rounded-full border border-white/20 transition-all cursor-pointer relative"
                      [title]="c.label"
                    >
                      @if (hairColor === c.id) {
                        <span class="absolute inset-0 flex items-center justify-center text-white text-xs shadow-inner">
                          ✓
                        </span>
                      }
                    </button>
                  }
                </div>
              </div>

              <!-- Face Style Selection -->
              <div>
                <label class="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Biểu cảm gương mặt</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  @for (f of faceStyles; track f.id) {
                    <button
                      (click)="faceStyle = f.id"
                      [class.border-brand-primary]="faceStyle === f.id"
                      [class.bg-brand-primary/5]="faceStyle === f.id"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/50 rounded-xl py-2.5 px-2 text-xs font-bold text-center transition-all cursor-pointer"
                    >
                      {{ f.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Outfit Selection -->
              <div>
                <label class="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Trang phục (Outfit)</label>
                <div class="grid grid-cols-2 gap-3">
                  @for (o of outfits; track o.id) {
                    <button
                      (click)="outfitStyle = o.id"
                      [class.border-brand-primary]="outfitStyle === o.id"
                      [class.bg-brand-primary/5]="outfitStyle === o.id"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/50 rounded-xl p-3 flex flex-col items-start transition-all cursor-pointer text-left"
                    >
                      <span class="font-bold text-sm text-text-main">{{ o.label }}</span>
                      <span class="text-[10px] text-text-muted mt-0.5">{{ o.desc }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4 border-t border-border-main">
                <button
                  (click)="onSave()"
                  [disabled]="isSaving() || !name.trim()"
                  class="flex-1 relative overflow-hidden group bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-brand-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  
                  <div class="relative flex items-center justify-center gap-2">
                    @if (isSaving()) {
                      <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang lưu...</span>
                    } @else {
                      <span>{{ isEditMode() ? 'Cập Nhật Nhân Vật 💾' : 'Lưu & Bắt Đầu Hành Trình 🚀' }}</span>
                    }
                  </div>
                </button>
                
                <a
                  routerLink="/dashboard"
                  class="bg-bg-input border border-border-main hover:bg-bg-card text-text-muted hover:text-text-main font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                >
                  Hủy bỏ
                </a>
              </div>

            </div>
            
          </div>
        }
      </div>
    </div>
  `,
})
export class CharacterCustomizationComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly characterService = inject(CharacterService);
  private readonly router = inject(Router);

  // Form Fields
  name = '';
  gender = 'MALE';
  hairStyle = 'SHORT';
  hairColor = 'BLACK';
  faceStyle = 'SMILEY';
  outfitStyle = 'WARRIOR';

  // UI state
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  isEditMode = signal(false);

  // Option lists
  genders = [
    { id: 'MALE', label: 'Nam ♂️' },
    { id: 'FEMALE', label: 'Nữ ♀️' }
  ];

  hairStyles = [
    { id: 'SHORT', label: 'Ngắn' },
    { id: 'LONG', label: 'Dài' },
    { id: 'CURLY', label: 'Xoăn' },
    { id: 'SPIKY', label: 'Dựng' },
    { id: 'BALD', label: 'Trọc' }
  ];

  hairColors = [
    { id: 'BLACK', label: 'Đen', hex: '#111827' },
    { id: 'BROWN', label: 'Nâu', hex: '#78350f' },
    { id: 'BLONDE', label: 'Vàng', hex: '#eab308' },
    { id: 'RED', label: 'Đỏ', hex: '#dc2626' },
    { id: 'SILVER', label: 'Bạc', hex: '#94a3b8' }
  ];

  faceStyles = [
    { id: 'SMILEY', label: 'Vui vẻ 😊' },
    { id: 'SERIOUS', label: 'Nghiêm túc 😐' },
    { id: 'COOL', label: 'Ngầu 😎' },
    { id: 'EXCITED', label: 'Hào hứng 🤩' }
  ];

  outfits = [
    { id: 'WARRIOR', label: 'Chiến binh ⚔️', desc: 'Giáp sắt kiên cố' },
    { id: 'MAGE', label: 'Pháp sư 🔮', desc: 'Áo choàng phép' },
    { id: 'ROGUE', label: 'Sát thủ 🗡️', desc: 'Đồ da lén lút' },
    { id: 'CASUAL', label: 'Thường dân 👕', desc: 'Thường phục thoải mái' }
  ];

  ngOnInit(): void {
    this.loadCharacter();
  }

  loadCharacter(): void {
    this.isLoading.set(true);
    this.characterService.getMyCharacter().subscribe({
      next: (char) => {
        this.isLoading.set(false);
        if (char) {
          this.name = char.name;
          this.gender = char.gender || 'MALE';
          this.hairStyle = char.hairStyle || 'SHORT';
          this.hairColor = char.hairColor || 'BLACK';
          this.faceStyle = char.faceStyle || 'SMILEY';
          this.outfitStyle = char.outfitStyle || 'WARRIOR';
          this.isEditMode.set(true);
        }
      },
      error: () => {
        // 404/not found is fine (meaning first-time customization)
        this.isLoading.set(false);
      }
    });
  }

  getCharacterPreviewObject(): Character {
    return {
      name: this.name,
      gender: this.gender,
      hairStyle: this.hairStyle,
      hairColor: this.hairColor,
      faceStyle: this.faceStyle,
      outfitStyle: this.outfitStyle
    };
  }

  onSave(): void {
    if (!this.name.trim()) {
      this.errorMessage.set('Vui lòng nhập tên nhân vật.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const characterData: Character = {
      name: this.name.trim(),
      gender: this.gender,
      hairStyle: this.hairStyle,
      hairColor: this.hairColor,
      faceStyle: this.faceStyle,
      outfitStyle: this.outfitStyle
    };

    this.characterService.saveCharacter(characterData).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Nhân vật đã được lưu thành công! Đang chuyển hướng...');
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message || 'Không thể lưu nhân vật. Vui lòng thử lại.');
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
