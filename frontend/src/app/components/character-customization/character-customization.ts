import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CharacterService, Character } from '../../services/character.service';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-character-customization',
  standalone: true,
  imports: [FormsModule, CommonModule, CharacterAvatarComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      <!-- Background glowing circles -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main card -->
      <div class="relative w-full max-w-4xl backdrop-blur-xl bg-bg-card border border-border-main shadow-2xl rounded-2xl p-6 md:p-8 transition-colors duration-300">
        
        <!-- Header -->
        <div class="text-center mb-8 border-b border-border-main pb-4">
          <span class="bg-brand-primary/10 text-brand-primary text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-widest">
            Khởi Đầu Hành Trình
          </span>
          <h2 class="text-3xl font-extrabold text-text-main tracking-tight mt-3">
            KHỞI TẠO NHÂN VẬT RPG MỚI
          </h2>
          <p class="text-xs text-text-muted mt-1 max-w-md mx-auto">
            Thiết kế diện mạo đại diện độc quyền của bạn để bắt đầu cuộc phiêu lưu học tiếng Anh đầy thú vị.
          </p>
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-text-muted font-medium">Đang kiểm tra thông tin nhân vật...</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <!-- Preview Column (5 cols) -->
            <div class="md:col-span-5 flex flex-col items-center">
              <div class="w-full bg-bg-input border border-border-main rounded-xl p-6 flex flex-col items-center text-center shadow-inner">
                <span class="bg-brand-secondary/15 text-brand-secondary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-4">
                  DIỆN MẠO CỦA BẠN
                </span>
                
                <div class="relative w-48 h-48 flex items-center justify-center bg-bg-card rounded-2xl border border-border-main shadow-lg p-4 mb-4">
                  <app-character-avatar [character]="getCharacterPreviewObject()" class="w-full h-full drop-shadow-2xl" />
                </div>

                <h3 class="text-lg font-black text-text-main truncate w-full px-2 min-h-[1.75rem]">
                  {{ name.trim() || 'Vô Danh Hiệp Sĩ' }}
                </h3>
                <span class="text-xxs font-black text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2.5 py-0.5 rounded-full mt-1.5 border border-brand-primary/20">
                  ⚔️ Novice ⚔️
                </span>
              </div>
            </div>

            <!-- Control Fields Column (7 cols) -->
            <div class="md:col-span-7 space-y-5">
              
              <!-- Messages -->
              @if (errorMessage()) {
                <div class="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                  <span>⚠️ {{ errorMessage() }}</span>
                </div>
              }
              @if (successMessage()) {
                <div class="bg-green-500/10 border border-green-500/20 text-green-500 text-xs p-3 rounded-xl">
                  <span>✓ {{ successMessage() }}</span>
                </div>
              }

              <!-- Tên nhân vật -->
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Tên người hùng</label>
                <input
                  type="text"
                  [(ngModel)]="name"
                  placeholder="Nhập tên nhân vật của bạn..."
                  maxlength="20"
                  class="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary font-semibold transition-all"
                />
              </div>

              <!-- Giới tính -->
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Giới tính</label>
                <div class="grid grid-cols-2 gap-3">
                  @for (g of genders; track g.id) {
                    <button
                      (click)="gender = g.id"
                      [class.border-brand-primary]="gender === g.id"
                      [class.bg-brand-primary/10]="gender === g.id"
                      [class.text-brand-primary]="gender === g.id"
                      class="bg-bg-input border border-border-main hover:border-brand-primary/50 rounded-xl py-3 px-4 text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      {{ g.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Kiểu tóc -->
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Kiểu tóc</label>
                <div class="grid grid-cols-5 gap-2">
                  @for (h of hairStyles; track h.id) {
                    <button
                      (click)="hairStyle = h.id"
                      [class.border-brand-primary]="hairStyle === h.id"
                      [class.bg-brand-primary/10]="hairStyle === h.id"
                      [class.text-brand-primary]="hairStyle === h.id"
                      class="bg-bg-input border border-border-main rounded-lg py-2 text-[11px] font-bold transition-all cursor-pointer truncate text-center"
                      [title]="h.label"
                    >
                      {{ h.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Màu tóc -->
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Màu tóc</label>
                <div class="flex items-center gap-3">
                  @for (c of hairColors; track c.id) {
                    <button
                      (click)="hairColor = c.id"
                      [style.backgroundColor]="c.hex"
                      [class.ring-2]="hairColor === c.id"
                      [class.ring-offset-2]="hairColor === c.id"
                      [class.ring-offset-bg-card]="hairColor === c.id"
                      [class.ring-brand-primary]="hairColor === c.id"
                      class="w-7 h-7 rounded-full border border-white/20 transition-all cursor-pointer relative"
                      [title]="c.label"
                    >
                      @if (hairColor === c.id) {
                        <span class="absolute inset-0 flex items-center justify-center text-white text-xs">✓</span>
                      }
                    </button>
                  }
                </div>
              </div>

              <!-- Gương mặt -->
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Biểu cảm gương mặt</label>
                <div class="grid grid-cols-2 gap-2">
                  @for (f of faceStyles; track f.id) {
                    <button
                      (click)="faceStyle = f.id"
                      [class.border-brand-primary]="faceStyle === f.id"
                      [class.bg-brand-primary/10]="faceStyle === f.id"
                      [class.text-brand-primary]="faceStyle === f.id"
                      class="bg-bg-input border border-border-main rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer"
                    >
                      {{ f.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Trang phục -->
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Trang phục (Outfit)</label>
                <div class="grid grid-cols-2 gap-3">
                  @for (o of outfits; track o.id) {
                    <button
                      (click)="outfitStyle = o.id"
                      [class.border-brand-primary]="outfitStyle === o.id"
                      [class.bg-brand-primary/10]="outfitStyle === o.id"
                      class="bg-bg-input border border-border-main rounded-xl p-3 flex flex-col transition-all cursor-pointer text-left hover:border-brand-primary/50"
                    >
                      <span class="font-extrabold text-xs text-text-main" [class.text-brand-primary]="outfitStyle === o.id">{{ o.label }}</span>
                      <span class="text-[9px] text-text-muted mt-0.5">{{ o.desc }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-4 border-t border-border-main/50 mt-8 flex flex-col gap-3">
                <button
                  (click)="onSave()"
                  [disabled]="isSaving() || !name.trim()"
                  class="w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:shadow-brand-primary/20 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-98 transition-all disabled:opacity-50 cursor-pointer text-sm text-center"
                >
                  @if (isSaving()) {
                    <span>Đang hoàn thành khởi tạo...</span>
                  } @else {
                    <span>Khởi Tạo Nhân Vật & Bắt Đầu Học 🚀</span>
                  }
                </button>
                <button
                  (click)="onLogout()"
                  class="w-full bg-transparent border border-border-main hover:bg-bg-input/60 text-text-muted hover:text-text-main font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs text-center"
                >
                  Thoát & Đăng xuất 🚪
                </button>
              </div>

            </div>

          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class CharacterCustomizationComponent implements OnInit {
  private readonly characterService = inject(CharacterService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  gender = 'MALE';
  hairStyle = 'SHORT';
  hairColor = 'BLACK';
  faceStyle = 'SMILEY';
  outfitStyle = 'WARRIOR';

  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

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
    { id: 'WARRIOR', label: 'Chiến binh', desc: 'Giáp sắt bảo vệ' },
    { id: 'MAGE', label: 'Pháp sư', desc: 'Áo choàng phép thuật' },
    { id: 'ROGUE', label: 'Sát thủ', desc: 'Đồ da bóng đêm' },
    { id: 'CASUAL', label: 'Thường dân', desc: 'Áo thun năng động' }
  ];

  ngOnInit(): void {
    this.checkExistingCharacter();
  }

  checkExistingCharacter(): void {
    this.isLoading.set(true);
    this.characterService.getMyCharacter().subscribe({
      next: (char) => {
        this.isLoading.set(false);
        if (char) {
          // If character already exists, redirect to dashboard
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        // If error (or 404), they don't have a character, which is correct for this page
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
        this.successMessage.set('Khởi tạo nhân vật thành công! Đang chuyển hướng sang bài kiểm tra đầu vào...');
        this.authService.hasCharacterState.set(true);
        
        setTimeout(() => {
          this.successMessage.set('');
          this.router.navigate(['/placement-test']);
        }, 2000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message || 'Không thể lưu nhân vật. Vui lòng thử lại.');
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/intro']);
  }
}
