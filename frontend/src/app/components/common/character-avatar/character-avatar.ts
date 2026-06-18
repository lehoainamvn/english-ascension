import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../../services/character.service';

@Component({
  selector: 'app-character-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-xl filter">
      <defs>
        <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--brand-primary)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="var(--brand-primary)" stop-opacity="0" />
        </radialGradient>

        <!-- Bronze Gradient -->
        <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b45309" />
          <stop offset="50%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#78350f" />
        </linearGradient>

        <!-- Silver Gradient -->
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="50%" stop-color="#f1f5f9" />
          <stop offset="100%" stop-color="#475569" />
        </linearGradient>

        <!-- Gold Gradient -->
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d97706" />
          <stop offset="50%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#a16207" />
        </linearGradient>

        <!-- Platinum Gradient -->
        <linearGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0284c7" />
          <stop offset="50%" stop-color="#e0f2fe" />
          <stop offset="100%" stop-color="#075985" />
        </linearGradient>

        <!-- VIP/Amethyst Gradient -->
        <linearGradient id="vipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7c3aed" />
          <stop offset="50%" stop-color="#f5d0fe" />
          <stop offset="100%" stop-color="#4c1d95" />
        </linearGradient>

        <!-- Legend Gradient -->
        <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e11d48" />
          <stop offset="30%" stop-color="#facc15" />
          <stop offset="70%" stop-color="#db2777" />
          <stop offset="100%" stop-color="#7f1d1d" />
        </linearGradient>
      </defs>

      <!-- Avatar circular glow behind the model -->
      <circle cx="50" cy="50" r="45" fill="url(#avatarGlow)" />
      <circle cx="50" cy="50" r="40" fill="var(--bg-input)" stroke="var(--border-main)" stroke-width="1.5" />

      <!-- BASE BODY & SHIELD/PLATE -->
      <!-- Neck -->
      <rect x="47" y="55" width="6" height="8" fill="#e5a975" rx="1" />

      <!-- Head Base -->
      <circle cx="50" cy="44" r="14" fill="#f3c197" />

      <!-- Eyebrows -->
      @if (gender === 'MALE') {
        <!-- Strong eyebrows -->
        <line x1="41" y1="36" x2="47" y2="38" stroke="#27272a" stroke-width="1.5" stroke-linecap="round" />
        <line x1="59" y1="36" x2="53" y2="38" stroke="#27272a" stroke-width="1.5" stroke-linecap="round" />
      } @else {
        <!-- Soft arched eyebrows -->
        <path d="M40 37 Q 43 34 47 37" stroke="#27272a" stroke-width="1" fill="none" stroke-linecap="round" />
        <path d="M60 37 Q 57 34 53 37" stroke="#27272a" stroke-width="1" fill="none" stroke-linecap="round" />
      }

      <!-- Eyes depending on expression -->
      @if (faceStyle === 'SMILEY') {
        <path d="M41 42 Q 44 39 47 42" stroke="#18181b" stroke-width="1.5" fill="none" stroke-linecap="round" />
        <path d="M53 42 Q 56 39 59 42" stroke="#18181b" stroke-width="1.5" fill="none" stroke-linecap="round" />
        <circle cx="39" cy="46" r="2" fill="#fb7185" opacity="0.5" />
        <circle cx="61" cy="46" r="2" fill="#fb7185" opacity="0.5" />
        <path d="M47 49 Q 50 53 53 49" stroke="#18181b" stroke-width="1.5" fill="none" stroke-linecap="round" />
      } @else if (faceStyle === 'SERIOUS') {
        <line x1="41" y1="41" x2="47" y2="41" stroke="#18181b" stroke-width="2" stroke-linecap="round" />
        <line x1="53" y1="41" x2="59" y2="41" stroke="#18181b" stroke-width="2" stroke-linecap="round" />
        <line x1="46" y1="49" x2="54" y2="49" stroke="#18181b" stroke-width="1.5" stroke-linecap="round" />
      } @else if (faceStyle === 'COOL') {
        <path d="M38 39 L 48 39 L 46 44 L 40 44 Z" fill="#18181b" />
        <path d="M52 39 L 62 39 L 60 44 L 54 44 Z" fill="#18181b" />
        <line x1="48" y1="40" x2="52" y2="40" stroke="#18181b" stroke-width="1.5" />
        <path d="M48 49 Q 52 48 53 50" stroke="#18181b" stroke-width="1.5" fill="none" stroke-linecap="round" />
      } @else if (faceStyle === 'EXCITED') {
        <circle cx="44" cy="41" r="2.5" fill="#18181b" />
        <circle cx="43.2" cy="40.2" r="0.8" fill="#ffffff" />
        <circle cx="56" cy="41" r="2.5" fill="#18181b" />
        <circle cx="55.2" cy="40.2" r="0.8" fill="#ffffff" />
        <path d="M46 48 Q 50 56 54 48 Z" fill="#b91c1c" stroke="#18181b" stroke-width="1" />
        <path d="M48 51 Q 50 49 52 51 Q 50 53 48 51" fill="#f472b6" />
        <circle cx="38" cy="45" r="2.5" fill="#fb7185" opacity="0.6" />
        <circle cx="62" cy="45" r="2.5" fill="#fb7185" opacity="0.6" />
      }

      <!-- BACK HAIR (if long hair style is selected) -->
      @if (hairStyle === 'LONG') {
        <path d="M36 44 C 30 50, 32 68, 32 68 C 32 68, 37 60, 38 48 Z" [attr.fill]="getHairColorHex()" />
        <path d="M64 44 C 70 50, 68 68, 68 68 C 68 68, 63 60, 62 48 Z" [attr.fill]="getHairColorHex()" />
      }

      <!-- Torso (Outfit) -->
      @if (outfitStyle === 'WARRIOR') {
        <path d="M30 63 C 30 55, 34 53, 50 53 C 66 53, 70 55, 70 63 L 72 80 L 28 80 Z" fill="#64748b" stroke="#475569" stroke-width="1.5" />
        <path d="M30 63 L 50 72 L 70 63" stroke="#fbbf24" stroke-width="1.5" fill="none" />
        <polygon points="50,60 54,65 50,70 46,65" fill="#ef4444" />
        <path d="M26 62 C 26 53, 36 53, 38 62 Z" fill="#475569" />
        <path d="M74 62 C 74 53, 64 53, 62 62 Z" fill="#475569" />
      } @else if (outfitStyle === 'MAGE') {
        <path d="M30 63 C 30 55, 34 53, 50 53 C 66 53, 70 55, 70 63 L 72 80 L 28 80 Z" fill="#6d28d9" stroke="#4c1d95" stroke-width="1.5" />
        <path d="M30 63 L 50 75 L 70 63 C 62 58, 38 58, 30 63 Z" fill="#fbbf24" />
        <circle cx="50" cy="69" r="2.5" fill="#06b6d4" />
      } @else if (outfitStyle === 'ROGUE') {
        <path d="M30 63 C 30 55, 34 53, 50 53 C 66 53, 70 55, 70 63 L 72 80 L 28 80 Z" fill="#1f2937" stroke="#111827" stroke-width="1.5" />
        <path d="M33 63 L 50 76 L 67 63" stroke="#10b981" stroke-width="2.5" fill="none" />
        <line x1="36" y1="63" x2="38" y2="80" stroke="#374151" stroke-width="3" />
        <line x1="64" y1="63" x2="62" y2="80" stroke="#374151" stroke-width="3" />
      } @else if (outfitStyle === 'CASUAL') {
        <path d="M30 63 C 30 55, 34 53, 50 53 C 66 53, 70 55, 70 63 L 72 80 L 28 80 Z" fill="#0ea5e9" stroke="#0284c7" stroke-width="1.5" />
        <polygon points="45,63 50,69 55,63" fill="#f3c197" />
        <rect x="42" y="70" width="16" height="3" fill="#f43f5e" rx="1" />
      }

      <!-- FRONT HAIR LAYER -->
      @if (hairStyle === 'SHORT') {
        <path d="M34 39 C 32 30, 42 22, 50 22 C 58 22, 68 30, 66 39 C 62 36, 58 35, 50 38 C 42 35, 38 36, 34 39 Z" [attr.fill]="getHairColorHex()" />
        <path d="M34 38 L 36 43 L 38 39 Z" [attr.fill]="getHairColorHex()" />
        <path d="M66 38 L 64 43 L 62 39 Z" [attr.fill]="getHairColorHex()" />
      } @else if (hairStyle === 'LONG') {
        <path d="M34 39 C 32 28, 42 20, 50 20 C 58 20, 68 28, 66 39 C 64 39, 61 46, 61 46 C 61 46, 58 40, 50 42 C 42 40, 39 46, 39 46 C 39 46, 36 39, 34 39 Z" [attr.fill]="getHairColorHex()" />
      } @else if (hairStyle === 'CURLY') {
        <path d="M35 37 C 30 35, 31 28, 36 28 C 38 23, 44 21, 48 23 C 52 21, 58 23, 60 28 C 65 28, 66 35, 61 37 C 62 40, 58 43, 50 41 C 42 43, 38 40, 35 37 Z" [attr.fill]="getHairColorHex()" />
        <circle cx="34" cy="32" r="3" [attr.fill]="getHairColorHex()" />
        <circle cx="40" cy="25" r="4.5" [attr.fill]="getHairColorHex()" />
        <circle cx="48" cy="23" r="5" [attr.fill]="getHairColorHex()" />
        <circle cx="56" cy="25" r="4.5" [attr.fill]="getHairColorHex()" />
        <circle cx="62" cy="32" r="3" [attr.fill]="getHairColorHex()" />
      } @else if (hairStyle === 'SPIKY') {
        <path d="M32 38 L 35 32 L 39 34 L 42 24 L 47 28 L 50 16 L 53 28 L 58 24 L 61 34 L 65 32 L 68 38 L 62 39 L 58 42 L 50 40 L 42 42 L 38 39 Z" [attr.fill]="getHairColorHex()" />
      } @else if (hairStyle === 'BALD') {
        <ellipse cx="50" cy="34" rx="6" ry="2" fill="#ffffff" opacity="0.15" />
      }

      <!-- ROGUE HOOD OVERLAY (renders over hair) -->
      @if (outfitStyle === 'ROGUE') {
        <path d="M33 32 C 33 22, 67 22, 67 32 C 67 36, 61 31, 50 35 C 39 31, 33 36, 33 32 Z" fill="#111827" opacity="0.6" />
        <path d="M31 32 C 31 18, 69 18, 69 32 C 69 38, 65 42, 64 45 L 70 65 L 30 65 L 36 45 C 35 42, 31 38, 31 32 Z" fill="#374151" stroke="#1f2937" stroke-width="1.5" fill-opacity="0.95" />
        <path d="M33 55 Q 50 63 67 55 Q 60 67 50 67 Q 40 67 33 55 Z" fill="#10b981" />
      }

      <!-- VIP Border/Frame based on level -->
      @if (level >= 60) {
        <!-- Legend Tier: Fiery Crown and Ornate Golden-Rose Frame -->
        <circle cx="50" cy="50" r="41.5" fill="none" stroke="url(#legendGrad)" stroke-width="4" />
        <!-- Crown/Spikes at top -->
        <path d="M40 9 L 45 14 L 50 4 L 55 14 L 60 9 L 55 17 L 45 17 Z" fill="url(#legendGrad)" stroke="#db2777" stroke-width="0.5" />
        <circle cx="50" cy="4" r="1.5" fill="#fef08a" />
        <circle cx="40" cy="9" r="1" fill="#fef08a" />
        <circle cx="60" cy="9" r="1" fill="#fef08a" />
        <!-- Corner wings or accents -->
        <path d="M8 50 Q 15 45 12 35 Q 18 42 12 55 Z" fill="url(#legendGrad)" />
        <path d="M92 50 Q 85 45 88 35 Q 82 42 88 55 Z" fill="url(#legendGrad)" />
      } @else if (level >= 40) {
        <!-- VIP Tier: Deep Glowing Purple with Amethyst Gems -->
        <circle cx="50" cy="50" r="41.5" fill="none" stroke="url(#vipGrad)" stroke-width="3.5" />
        <polygon points="50,6 54,12 50,18 46,12" fill="#d946ef" stroke="#701a75" stroke-width="0.5" />
        <circle cx="50" cy="12" r="1.5" fill="#fae8ff" />
        <!-- Side studs -->
        <circle cx="8" cy="50" r="3" fill="url(#vipGrad)" stroke="#701a75" stroke-width="0.5" />
        <circle cx="92" cy="50" r="3" fill="url(#vipGrad)" stroke="#701a75" stroke-width="0.5" />
      } @else if (level >= 20) {
        <!-- Platinum Tier: Clean dual ring with cyan gems -->
        <circle cx="50" cy="50" r="41.5" fill="none" stroke="url(#platGrad)" stroke-width="3" />
        <circle cx="50" cy="50" r="43.5" fill="none" stroke="#0ea5e9" stroke-width="0.5" opacity="0.7" />
        <!-- Crest at top -->
        <polygon points="50,8 53,13 50,16 47,13" fill="#38bdf8" />
        <circle cx="10" cy="50" r="2" fill="#38bdf8" />
        <circle cx="90" cy="50" r="2" fill="#38bdf8" />
      } @else if (level >= 10) {
        <!-- Gold Tier: Golden Ring with crest -->
        <circle cx="50" cy="50" r="41" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" />
        <!-- Small Gold Diamond at top -->
        <polygon points="50,9 52.5,13 50,17 47.5,13" fill="url(#goldGrad)" />
      } @else if (level >= 5) {
        <!-- Silver Tier: Clean Silver Ring with 4 studs -->
        <circle cx="50" cy="50" r="41" fill="none" stroke="url(#silverGrad)" stroke-width="2" />
        <circle cx="50" cy="9" r="1.5" fill="#f8fafc" />
        <circle cx="50" cy="91" r="1.5" fill="#f8fafc" />
        <circle cx="9" cy="50" r="1.5" fill="#f8fafc" />
        <circle cx="91" cy="50" r="1.5" fill="#f8fafc" />
      } @else {
        <!-- Bronze Tier: Simple Bronze Ring -->
        <circle cx="50" cy="50" r="41" fill="none" stroke="url(#bronzeGrad)" stroke-width="1.5" />
      }
    </svg>
  `,
  styles: []
})
export class CharacterAvatarComponent {
  private _character: Character | null = null;

  @Input() set character(val: Character | null) {
    this._character = val;
  }

  get character(): Character | null {
    return this._character;
  }

  get level(): number {
    return this.character?.level || 1;
  }

  get gender(): string {
    return this.character?.gender || 'MALE';
  }

  get hairStyle(): string {
    return this.character?.hairStyle || 'SHORT';
  }

  get hairColor(): string {
    return this.character?.hairColor || 'BLACK';
  }

  get faceStyle(): string {
    return this.character?.faceStyle || 'SMILEY';
  }

  get outfitStyle(): string {
    return this.character?.outfitStyle || 'WARRIOR';
  }

  hairColors = [
    { id: 'BLACK', hex: '#111827' },
    { id: 'BROWN', hex: '#78350f' },
    { id: 'BLONDE', hex: '#eab308' },
    { id: 'RED', hex: '#dc2626' },
    { id: 'SILVER', hex: '#94a3b8' }
  ];

  getHairColorHex(): string {
    const color = this.hairColors.find(c => c.id === this.hairColor);
    return color ? color.hex : '#111827';
  }
}
