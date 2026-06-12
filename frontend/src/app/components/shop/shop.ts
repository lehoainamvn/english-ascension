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
    <div class="min-h-screen bg-bg-main text-text-main transition-colors duration-300 relative overflow-hidden">
      
      <!-- Background glowing gradient circles -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-5xl mx-auto px-4 py-6 z-10 relative space-y-6">
        
        <!-- Header / Banner -->
        <div class="bg-bg-card border border-border-main rounded-2xl p-5 shadow-xs transition-colors duration-300">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="space-y-1">
              <span class="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border border-yellow-500/20 inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins"><circle cx="8" cy="8" r="6"/><circle cx="18" cy="18" r="6"/><path d="M12 18a6 6 0 0 0-6-6"/></svg>
                Cửa hàng RPG
              </span>
              <h1 class="text-lg font-black text-text-main leading-tight mt-1">
                Tiệm Tạp Hóa Ascension
              </h1>
              <p class="text-xs text-text-muted max-w-xl leading-relaxed">
                Sử dụng Xu (Coins) kiếm được từ học tập để mở khóa trang phục, kiểu tóc, danh hiệu hoặc mua Thẻ Đóng Băng Streak!
              </p>
            </div>

            <!-- Currency Board -->
            <div class="flex items-center gap-4 text-xs font-bold text-text-muted bg-bg-input/50 px-4 py-2 rounded-xl border border-border-main/40 shrink-0">
              <div class="flex items-center gap-1.5">
                <span>Xu:</span>
                <span class="text-yellow-500 font-black flex items-center gap-0.5">🪙 {{ coins() }}</span>
              </div>
              <span class="text-border-main/40">|</span>
              <div class="flex items-center gap-1.5">
                <span>Streak:</span>
                <span class="text-red-500 font-black">🔥 {{ streak() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Body Grid (Preview + Shop items) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Live Preview Character Column (4 cols) -->
          <div class="lg:col-span-4 space-y-4">
            <div class="bg-bg-card border border-border-main rounded-2xl p-5 flex flex-col items-center text-center shadow-xs transition-colors duration-300">
              <span class="bg-brand-primary/10 text-brand-primary text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider mb-4 border border-brand-primary/15">
                Xem trước đại diện
              </span>

              <!-- Avatar Viewport -->
              <div class="relative w-44 h-44 flex items-center justify-center bg-bg-input/50 rounded-2xl border border-border-main shadow-inner p-4 mb-4">
                <app-character-avatar [character]="getPreviewCharacter()" class="w-full h-full drop-shadow-xl animate-bounce-slow" />
              </div>

              <!-- Name & Title -->
              <h3 class="text-sm font-black text-text-main truncate w-full px-2 min-h-[1.25rem]">
                {{ character()?.name || 'Hiệp Sĩ Tập Sự' }}
              </h3>
              
              <span class="text-[9px] font-black text-brand-secondary uppercase tracking-widest bg-brand-secondary/10 px-2.5 py-0.5 rounded-full mt-1.5 border border-brand-secondary/20 inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown"><path d="M2 4 5 12h14l3-8-7 4-3-6-3 6-7-4z"/><path d="M3 20h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1z"/></svg>
                {{ character()?.title || 'Novice' }}
              </span>

              <!-- Reset Preview buttons if changed -->
              @if (hasPreviewChanges()) {
                <button
                  (click)="resetPreview()"
                  class="mt-4 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest cursor-pointer bg-transparent border-none"
                >
                  ✕ Hủy Xem Trước
                </button>
              }
            </div>

            <!-- AI Quote Box -->
            <div class="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4 shadow-xs text-center flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles text-brand-primary/80"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              <p class="text-[10px] text-brand-primary/95 italic font-medium leading-relaxed mt-2">
                "Diện mạo hào hoa tăng cao sĩ khí! Hãy chọn trang phục thật ngầu trước khi tham gia cuộc thi đấu chữ."
              </p>
            </div>
          </div>

          <!-- Shop Catalog Column (8 cols) -->
          <div class="lg:col-span-8 space-y-5">
            
            <!-- Category Tabs -->
            <div class="flex p-1 bg-bg-input/60 border border-border-main/50 rounded-2xl overflow-x-auto scrollbar-none shadow-inner max-w-xl">
              @for (tab of tabs; track tab.id) {
                <button
                  (click)="activeTab.set(tab.id)"
                  [class.bg-bg-card]="activeTab() === tab.id"
                  [class.text-text-main]="activeTab() === tab.id"
                  [class.shadow-xs]="activeTab() === tab.id"
                  [class.text-text-muted]="activeTab() !== tab.id"
                  class="flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer text-center border-none shrink-0 flex items-center justify-center gap-1.5"
                >
                  @if (tab.id === 'outfit') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shirt shrink-0"><path d="M20.38 3.46 16 1.7a2 2 0 0 0-2 0l-4 1.76a2 2 0 0 1-1.48 0L4.8 1.7a2 2 0 0 0-2.3 2.19l.79 10.38a2 2 0 0 0 1.94 1.85H7v5.5A2.5 2.5 0 0 0 9.5 22h5a2.5 2.5 0 0 0 2.5-2.5V16h1.77a2 2 0 0 0 1.94-1.85l.79-10.38a2 2 0 0 0-1.12-2.31Z"/><path d="M6 16H4"/><path d="M20 16h-2"/></svg>
                  } @else if (tab.id === 'hair_style') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors shrink-0"><circle cx="6" cy="6" r="3"/><path d="M8.12 9.58 12 15"/><circle cx="6" cy="18" r="3"/><path d="M9.83 13.9 12 11"/><path d="M14.8 9.85 20 6"/><path d="m14 14.83 6 5.17"/></svg>
                  } @else if (tab.id === 'hair_color') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palette shrink-0"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.01345 19.1558 5.0931 19.3734 5.07452 19.5902C5.03158 20.0917 5.08867 20.6127 5.24921 21.087C5.37894 21.4704 5.76182 21.7224 6.16611 21.6885C6.91571 21.6256 7.62529 21.3197 8.19641 20.8251C8.36109 20.6825 8.58785 20.6384 8.79093 20.7067C9.7997 21.0456 10.8787 21.2215 12 22Z"/><circle cx="7.5" cy="10.5" r="1.5"/><circle cx="11.5" cy="7.5" r="1.5"/><circle cx="16.5" cy="9.5" r="1.5"/><circle cx="15.5" cy="14.5" r="1.5"/></svg>
                  } @else if (tab.id === 'title') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award shrink-0"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>
                  } @else if (tab.id === 'buff') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap shrink-0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  }
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
                  class="bg-bg-card border border-border-main hover:border-brand-primary/40 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group duration-300 relative overflow-hidden"
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
                      <div class="w-12 h-12 rounded-xl bg-bg-input border border-border-main/50 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                        @if (item.icon === 'shield') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield text-brand-primary"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6Z"/></svg>
                        } @else if (item.icon === 'wand-2') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-2 text-brand-primary"><path d="m21.66 2.34-5.66 5.66a5 5 0 0 0-1.41 3.54v0a5 5 0 0 0 3.54 1.41h0a5 5 0 0 0 3.54-1.41l5.66-5.66a2 2 0 0 0 0-2.83l-.83-.83a2 2 0 0 0-2.83 0Z"/><path d="m14 14-9 9"/><path d="M6 16H3"/><path d="M8 18v3"/><path d="M11 11h.01"/></svg>
                        } @else if (item.icon === 'sword') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sword text-brand-primary"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/></svg>
                        } @else if (item.icon === 'shirt') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shirt text-brand-primary"><path d="M20.38 3.46 16 1.7a2 2 0 0 0-2 0l-4 1.76a2 2 0 0 1-1.48 0L4.8 1.7a2 2 0 0 0-2.3 2.19l.79 10.38a2 2 0 0 0 1.94 1.85H7v5.5A2.5 2.5 0 0 0 9.5 22h5a2.5 2.5 0 0 0 2.5-2.5V16h1.77a2 2 0 0 0 1.94-1.85l.79-10.38a2 2 0 0 0-1.12-2.31Z"/><path d="M6 16H4"/><path d="M20 16h-2"/></svg>
                        } @else if (item.icon === 'scissors') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors text-brand-primary"><circle cx="6" cy="6" r="3"/><path d="M8.12 9.58 12 15"/><circle cx="6" cy="18" r="3"/><path d="M9.83 13.9 12 11"/><path d="M14.8 9.85 20 6"/><path d="m14 14.83 6 5.17"/></svg>
                        } @else if (item.icon === 'paint-bucket') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paint-bucket text-brand-primary"><path d="m19 11-8-8-1.15 1.15a.5.5 0 0 0-.08.63L11.14 7c.57.97.29 2.27-.66 2.9l-.68.46c-.6.4-1.49.34-2.02-.17l-.82-.82c-.52-.52-.46-1.4.16-2l.3-.3a.5.5 0 0 0-.07-.76L5.8 5.1c-.5-.33-1.18-.21-1.54.27l-2.11 2.8a1.5 1.5 0 0 0 .23 2.06l10.38 8.63a1.5 1.5 0 0 0 2.07-.15L19 11Z"/><path d="M8 15v.01"/><path d="M22 20a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v2h7v-2Z"/></svg>
                        } @else if (item.icon === 'zap') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap text-brand-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        } @else if (item.icon === 'crown') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crown text-brand-primary"><path d="M2 4 5 12h14l3-8-7 4-3-6-3 6-7-4z"/><path d="M3 20h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1z"/></svg>
                        } @else if (item.icon === 'swords') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords text-brand-primary"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="9.5 17.5 21 6 21 3 18 3 6.5 14.5"/><line x1="11" x2="5" y1="19" y2="13"/><line x1="8" x2="4" y1="16" y2="20"/><line x1="5" x2="3" y1="21" y2="19"/></svg>
                        } @else if (item.icon === 'book-open') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open text-brand-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        } @else if (item.icon === 'snowflake') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-snowflake text-brand-primary"><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles text-brand-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        }
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
                          class="px-3 py-1.5 rounded-xl border border-border-main/50 text-[10px] font-black cursor-pointer uppercase transition-all"
                        >
                          Xem thử
                        </button>
                      }

                      <!-- Buy Button -->
                      @if (isEquipped(item)) {
                        <button
                          disabled
                          class="px-4 py-1.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-black border-none"
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
                          class="px-4 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all shadow-xs border-none"
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
              <div class="text-center py-12 bg-bg-card border border-border-main rounded-2xl flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-open text-text-muted/60"><path d="M12 22v-9"/><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2z"/><path d="M10.4 10.4 12 12l1.6-1.6"/></svg>
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
    .animate-bounce-slow {
      animation: bounceSlow 3s ease-in-out infinite;
    }
    @keyframes bounceSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
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
    { id: 'outfit', label: 'Trang Phục' },
    { id: 'hair_style', label: 'Kiểu Tóc' },
    { id: 'hair_color', label: 'Màu Tóc' },
    { id: 'title', label: 'Danh Hiệu' },
    { id: 'buff', label: 'Hỗ Trợ' }
  ];

  // Static shop catalog
  shopCatalog: ShopItem[] = [
    // Outfits
    { id: 'outfit_warrior', name: 'Giáp Chiến Binh Hoàng Kim', desc: 'Bộ chiến giáp mạ vàng rực rỡ, biểu trưng cho sự bền bỉ chiến đấu.', cost: 80, type: 'OUTFIT', value: 'WARRIOR', icon: 'shield' },
    { id: 'outfit_mage', name: 'Áo Choàng Pháp Sư Tối Thượng', desc: 'Trang phục thêu tơ tím quý phái chứa linh lực ngôn từ sâu thẳm.', cost: 100, type: 'OUTFIT', value: 'MAGE', icon: 'wand-2' },
    { id: 'outfit_rogue', name: 'Mũ Trùm Sát Thủ Bóng Đêm', desc: 'Y phục gọn gàng tàng hình trong bóng đêm giúp phản xạ chớp nhoáng.', cost: 120, type: 'OUTFIT', value: 'ROGUE', icon: 'sword' },
    { id: 'outfit_casual', name: 'Y Phục Casual Năng Động', desc: 'Trang phục thoải mái, trẻ trung giúp tinh thần thoải mái tiếp thu từ vựng.', cost: 50, type: 'OUTFIT', value: 'CASUAL', icon: 'shirt' },

    // Hair Styles
    { id: 'hair_short', name: 'Kiểu Tóc Ngắn Cá Tính', desc: 'Tóc ngắn gọn gàng năng động cho các đấu sĩ từ vựng.', cost: 25, type: 'HAIR_STYLE', value: 'SHORT', icon: 'scissors' },
    { id: 'hair_long', name: 'Mái Tóc Dài Lãng Tử', desc: 'Mái tóc dài thướt tha mang phong vị tri thức cao quý.', cost: 35, type: 'HAIR_STYLE', value: 'LONG', icon: 'sparkles' },
    { id: 'hair_curly', name: 'Tóc Xoăn Nghệ Sĩ', desc: 'Những lọn tóc xoăn bồng bềnh đậm chất nghệ thuật sáng tạo.', cost: 40, type: 'HAIR_STYLE', value: 'CURLY', icon: 'sparkles' },
    { id: 'hair_spiky', name: 'Kiểu Tóc Dựng Chiến Sĩ', desc: 'Kiểu tóc dựng đứng gai góc tràn đầy nhuệ khí phiêu lưu.', cost: 45, type: 'HAIR_STYLE', value: 'SPIKY', icon: 'zap' },

    // Hair Colors
    { id: 'color_black', name: 'Màu Đen Huyền Bí', desc: 'Màu đen nguyên bản tinh tế và thanh lịch truyền thống.', cost: 15, type: 'HAIR_COLOR', value: 'BLACK', icon: 'paint-bucket' },
    { id: 'color_brown', name: 'Màu Nâu Lịch Lãm', desc: 'Nâu hạt dẻ ấm áp tạo cảm giác gần gũi tinh tế.', cost: 20, type: 'HAIR_COLOR', value: 'BROWN', icon: 'paint-bucket' },
    { id: 'color_blonde', name: 'Màu Vàng Rực Rỡ', desc: 'Vàng kim bắt mắt làm bừng sáng mọi vùng đất trên bản đồ.', cost: 30, type: 'HAIR_COLOR', value: 'BLONDE', icon: 'paint-bucket' },
    { id: 'color_red', name: 'Màu Đỏ Hỏa Ngục', desc: 'Sắc đỏ rực cháy bốc lửa sẵn sàng thiêu rụi mọi thử thách.', cost: 35, type: 'HAIR_COLOR', value: 'RED', icon: 'paint-bucket' },
    { id: 'color_silver', name: 'Màu Bạc Bạch Kim', desc: 'Màu trắng bạc hoàng gia tượng trưng cho trí tuệ lỗi lạc.', cost: 40, type: 'HAIR_COLOR', value: 'SILVER', icon: 'paint-bucket' },

    // Titles
    { id: 'title_reflex', name: 'Danh hiệu: Chiến Thần Phản Xạ', desc: 'Hiển thị danh hiệu đặc sắc này cạnh nhân vật và trên bảng xếp hạng.', cost: 150, type: 'TITLE', value: 'Chiến Thần Phản Xạ', icon: 'zap' },
    { id: 'title_legend', name: 'Danh hiệu: Huyền Thoại Ngôn Ngữ', desc: 'Danh hiệu tối thượng minh chứng cho người sở hữu vốn học thức cao thâm.', cost: 200, type: 'TITLE', value: 'Huyền Thoại Ngôn Ngữ', icon: 'crown' },
    { id: 'title_vocab', name: 'Danh hiệu: Kẻ Diệt Từ Vựng', desc: 'Xưng hiệu cực chất dành cho các bậc thầy chinh phục kho flashcard.', cost: 100, type: 'TITLE', value: 'Kẻ Diệt Từ Vựng', icon: 'swords' },
    { id: 'title_grammar', name: 'Danh hiệu: Dũng Sĩ Ngữ Pháp', desc: 'Danh hiệu kiêu hãnh của những người nắm vững cấu trúc mệnh đề câu.', cost: 120, type: 'TITLE', value: 'Dũng Sĩ Ngữ Pháp', icon: 'book-open' },

    // Buffs (Streak Freeze)
    { id: 'buff_streak_freeze', name: 'Bảo Bối Đóng Băng Streak', desc: 'Đóng băng chuỗi streak học tập (Tăng lập tức +1 Ngày Streak như một bảo hiểm giữ chuỗi).', cost: 100, type: 'STREAK_FREEZE', value: 'STREAK_FREEZE', icon: 'snowflake' }
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
