import { Component, inject, OnInit, signal, computed, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacementTestService, LearningRoadmap, LearningModule } from '../../../services/placement-test.service';
import { CharacterService, Character } from '../../../services/character.service';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar';
import { AuthService } from '../../../services/auth.service';
import { StudyService } from '../../../services/study.service';
import { PresetRoadmapService, PresetRoadmap } from '../../../services/preset-roadmap.service';
import { ToastService } from '../../../services/toast.service';

export interface WorldMapItem {
  type: 'HEADER' | 'NODE';
  chapterNum?: number;
  title?: string;
  description?: string;
  module?: any;
  nodeType?: 'THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_READING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ';
  nodeIndex?: number;
  top?: number;
  centerX?: number;
  centerY?: number;
}

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule, RouterLink, CharacterAvatarComponent],
  template: `
    <div [class]="embedded ? 'w-full flex flex-col relative py-2' : 'min-h-screen bg-bg-main text-text-main p-4 md:p-6 flex flex-col relative overflow-hidden transition-colors duration-300'">
      <!-- Decorative Glows -->
      @if (!embedded) {
        <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none"></div>
      }

      <!-- Player Stats Bar -->
      @if (playerInfo() && !embedded) {
        <div class="max-w-2xl w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-bg-card border border-border-main rounded-xl p-3 text-xs backdrop-blur-md transition-colors duration-300">
          <div class="flex items-center gap-2.5 pl-2">
            <div class="w-8 h-8 rounded-lg border border-border-main bg-bg-input overflow-hidden shrink-0">
              <app-character-avatar [character]="character()"></app-character-avatar>
            </div>
            <div>
              <p class="font-bold text-text-main truncate max-w-[100px]">{{ character()?.name || 'Người Hùng' }}</p>
              <p class="text-[9px] text-brand-accent font-semibold uppercase tracking-wider">{{ character()?.title || 'Novice' }}</p>
            </div>
          </div>
          <div class="flex flex-col justify-center px-2 border-l border-border-main/50">
            <div class="flex justify-between items-center font-semibold mb-1">
              <span>Cấp {{ playerInfo()?.level }}</span>
              <span class="text-text-muted text-[9px]">{{ playerInfo()?.exp }} / {{ playerInfo()?.level! * 100 }} EXP</span>
            </div>
            <div class="w-full h-1 bg-bg-input rounded-full overflow-hidden border border-border-main/30">
              <div
                [style.width.%]="(playerInfo()?.exp! / (playerInfo()?.level! * 100)) * 100"
                class="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
              ></div>
            </div>
          </div>
          <div class="flex items-center gap-2 px-2 border-l border-border-main/50 justify-center md:justify-start">
            <span class="text-base">🪙</span>
            <div>
              <p class="font-bold text-text-main">{{ playerInfo()?.coins }} Xu</p>
              <p class="text-[8px] text-text-muted uppercase tracking-wider font-semibold">Tài sản</p>
            </div>
          </div>
          <div class="flex items-center gap-2 px-2 border-l border-border-main/50 justify-center md:justify-start">
            <span class="text-base">🔥</span>
            <div>
              <p class="font-bold text-text-main">{{ playerInfo()?.streak }} Ngày</p>
              <p class="text-[8px] text-text-muted uppercase tracking-wider font-semibold">Streak</p>
            </div>
          </div>
        </div>
      }

      @if (isLoading()) {
        <div class="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
          <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-sm text-text-muted font-medium">Đang tải bản đồ tiến trình...</p>
        </div>
      } @else if (errorState()) {
        <div class="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 py-10">
          <div class="text-4xl">🎒</div>
          <h3 class="text-lg font-bold text-text-main">Chưa khởi tạo Lộ Trình</h3>
          <p class="text-text-muted text-xs leading-relaxed">
            Bạn chưa làm bài kiểm tra đánh giá trình độ đầu vào. Vui lòng làm Placement Test để AI xây dựng lộ trình học tập và mở khóa bản đồ.
          </p>
          <a
            routerLink="/placement-test"
            class="bg-brand-primary hover:bg-brand-secondary text-bg-card font-bold px-5 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md cursor-pointer text-xs"
          >
            Làm bài Placement Test ngay
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      } @else {
        <!-- Control Header for Drawer Toggle -->
        <div class="flex justify-between items-center w-full mb-4 shrink-0 px-2">
          <span class="text-xs text-text-muted font-black tracking-wider uppercase">BẢN ĐỒ TIẾN TRÌNH AI (TOEIC)</span>
          <button
            (click)="isRoadmapDrawerOpen.set(true)"
            class="px-3 py-1.5 bg-brand-primary hover:bg-brand-secondary text-bg-card text-[11px] font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 active:scale-98 border-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list shrink-0"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Xem Tóm Tắt Lộ Trình
          </button>
        </div>

        <!-- Scrollable Map Frame -->
        <div class="relative w-full border border-border-main/60 rounded-2xl bg-bg-card/30 shadow-inner flex flex-col h-[580px] overflow-hidden">
          <!-- Sticky Stage Indicator Header -->
          @if (currentStage()) {
            <div class="absolute top-0 left-0 right-0 z-20 mx-4 my-2.5 px-4 py-2.5 bg-bg-card/95 backdrop-blur border border-border-main/60 rounded-xl flex items-center justify-between shadow-sm animate-fade-in pointer-events-none">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-accent animate-bounce shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p class="text-[9px] font-black text-brand-primary uppercase tracking-widest leading-none">Đang ở chặng {{ currentStage()?.chapterNum }}</p>
                  <h4 class="text-xs font-black text-text-main mt-0.5 leading-tight truncate max-w-[200px]">
                    {{ currentStage()?.title }}
                  </h4>
                </div>
              </div>
              <button
                (click)="isRoadmapDrawerOpen.set(true)"
                class="pointer-events-auto px-2.5 py-1 bg-bg-input border border-border-main hover:bg-bg-card text-brand-primary text-[9px] font-black rounded-lg transition-all cursor-pointer border-none shadow-xs shrink-0 flex items-center gap-1 active:scale-98"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                Tóm Tắt
              </button>
            </div>
          }

          <!-- Scrollable area -->
          <div 
            #scrollContainer
            (scroll)="onScroll($event)"
            class="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-16 relative scroll-smooth scrollbar-thin bg-bg-main/5"
            style="z-index: 1;"
          >
            <!-- Serpentine Map Container -->
            <div 
              class="relative mx-auto w-[360px] overflow-visible mt-2" 
              [style.height.px]="totalHeight()"
            >
              <!-- Background Connection Line SVG -->
              <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 0;">
                <path
                  [attr.d]="getPathD()"
                  fill="none"
                  stroke="var(--border-main)"
                  stroke-width="3"
                  stroke-dasharray="6,6"
                  stroke-linecap="round"
                />
                <!-- Active Path Overlay (Highlighted completed and in-progress segments) -->
                <path
                  [attr.d]="getPathDActive()"
                  fill="none"
                  stroke="var(--brand-accent)"
                  stroke-width="3"
                  stroke-dasharray="6,6"
                  stroke-linecap="round"
                  class="opacity-80"
                />
              </svg>

              <!-- Render items (Headers and Nodes) -->
              @for (item of items(); track $index) {
                @if (item.type === 'HEADER') {
                  <!-- Chapter Header Divider -->
                  <div class="absolute w-full flex items-center justify-center gap-4 px-2" [style.top.px]="item.top">
                    <div class="flex-1 h-px bg-border-main/50 max-w-[50px]"></div>
                    <div class="text-center bg-bg-card px-3 py-1.5 border border-border-main/40 rounded-xl shadow-sm">
                      <span class="text-[9px] font-black text-brand-primary uppercase tracking-widest block">
                        Chặng {{ item.chapterNum }}
                      </span>
                      <span class="text-xs font-black text-text-main mt-0.5 block leading-tight">
                        {{ item.title }}
                      </span>
                      @if (item.description) {
                        <span class="text-[9px] text-text-muted mt-1 block font-medium max-w-[200px] mx-auto leading-normal">
                          {{ item.description }}
                        </span>
                      }
                    </div>
                    <div class="flex-1 h-px bg-border-main/50 max-w-[50px]"></div>
                  </div>
                } @else {
                  <!-- Character Avatar bouncing above active module's active node -->
                  @if (character() && getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS') {
                    <div 
                      class="absolute pointer-events-none w-8 h-8 animate-bounce z-10"
                      [style.top.px]="item.top! - 26"
                      [style.left.px]="164 + getDx(item.nodeIndex!)"
                    >
                      <app-character-avatar [character]="character()"></app-character-avatar>
                    </div>
                  }

                  <!-- Module Node Pill Card -->
                  <div
                    [style.top.px]="item.top"
                    [style.left.px]="60 + getDx(item.nodeIndex!)"
                    class="absolute w-[240px] h-[86px] rounded-2xl flex items-center gap-3 px-3.5 py-2.5 transition-all duration-300 select-none"
                    [class]="getSubNodeStatus(item.module, item.nodeType!) === 'COMPLETED'
                      ? 'bg-bg-card border-2 border-green-500 shadow-[0_4px_0_rgba(34,197,94,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(34,197,94,0.25)] cursor-pointer'
                      : getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS'
                      ? 'bg-bg-card border-2 border-brand-accent shadow-[0_4px_12px_rgba(59,130,246,0.18)] active-glow cursor-pointer'
                      : 'bg-bg-card border-2 border-border-main/80 opacity-65 cursor-not-allowed'"
                    (click)="getSubNodeStatus(item.module, item.nodeType!) !== 'LOCKED' && clickNode(item.module, item.nodeType!, item.centerX!, item.top!, $event)"
                  >
                    <!-- Node Left Icon in dashed circle -->
                    <div 
                      class="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-xl shrink-0 transition-colors"
                      [class]="getSubNodeStatus(item.module, item.nodeType!) === 'COMPLETED'
                        ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
                        : getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS'
                        ? 'border-brand-accent/50 bg-brand-accent/5 dark:bg-brand-accent/15'
                        : 'border-border-main bg-bg-main'"
                    >
                      @if (item.nodeType === 'THEORY_GRAMMAR') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open text-blue-500 shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      } @else if (item.nodeType === 'THEORY_VOCABULARY') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers text-emerald-500 shrink-0"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                      } @else if (item.nodeType === 'THEORY_LISTENING') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones text-purple-500 shrink-0"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                      } @else if (item.nodeType === 'THEORY_READING') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open text-orange-500 shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      } @else if (item.nodeType === 'THEORY_PRONUNCIATION') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic text-orange-500 shrink-0"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                      } @else if (item.nodeType === 'BATTLE') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords text-rose-500 shrink-0"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><polyline points="9.5 6.5 21 18 21 21 18 21 6.5 9.5"/><line x1="11" y1="5" x2="5" y2="11"/><line x1="8" y1="8" x2="4" y2="4"/><line x1="5" x2="3" y1="3" y2="5"/></svg>
                      } @else if (item.nodeType === 'QUIZ') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy text-yellow-500 shrink-0"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                      }
                    </div>

                    <!-- Node Info -->
                    <div class="flex-1 min-w-0 pr-1">
                      <h3 
                        class="text-[11px] font-black leading-tight truncate"
                        [class]="getSubNodeStatus(item.module, item.nodeType!) === 'LOCKED' ? 'text-text-muted' : 'text-text-main'"
                        [title]="item.module.title"
                      >
                        {{ item.module.title }}
                      </h3>
                      <div class="flex items-center gap-1.5 mt-0.5">
                        <span class="text-[8px] font-extrabold px-1 py-0.5 rounded bg-brand-primary/10 text-brand-primary shrink-0">
                          {{ getEstimatedToeic(item.module) }}
                        </span>
                        <p class="text-[9px] text-text-muted leading-normal truncate flex-1">
                          {{ item.module.description || getNodeDesc(item.nodeType!) }}
                        </p>
                      </div>
                    </div>

                    <!-- Node Status Indicator -->
                    <div class="shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-text-main">
                      @if (getSubNodeStatus(item.module, item.nodeType!) === 'COMPLETED') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                      } @else if (getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target text-brand-accent animate-pulse"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock text-text-muted opacity-60"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      }
                    </div>
                  </div>

                  <!-- Floating Popover bubble inside chapter box (centered relative to the clicked node) -->
                  @if (activePopover(); as pop) {
                    @if (pop.moduleId === item.module?.id && pop.type === item.nodeType) {
                      <div
                        [style.top.px]="pop.y + 92"
                        class="absolute left-1/2 -translate-x-1/2 z-30 bg-bg-card border border-border-main rounded-2xl p-4 shadow-xl w-60 text-left animate-fade-in flex flex-col space-y-3"
                      >
                        <!-- Title & Description -->
                        <div>
                          <span class="text-[9px] font-black text-brand-primary uppercase tracking-wider">Chi Tiết Bài Học</span>
                          <h4 class="text-xs font-black text-text-main mt-0.5 leading-snug">{{ pop.title }}</h4>
                          <p class="text-[10px] text-text-muted mt-1 leading-normal font-medium">{{ pop.description }}</p>
                        </div>
                        
                        <!-- Estimated TOEIC -->
                        <div class="p-2 bg-bg-input rounded-xl border border-border-main/40 text-[10px] flex items-center justify-between font-bold">
                          <span class="text-text-muted">TOEIC tương đương:</span>
                          <span class="text-brand-secondary font-black">{{ pop.estimatedToeic }}</span>
                        </div>

                        <!-- Status -->
                        <div class="flex items-center justify-between text-[10px] font-bold">
                          <span class="text-text-muted">Trạng thái:</span>
                          @if (pop.status === 'COMPLETED') {
                            <span class="text-green-500 font-extrabold flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check shrink-0"><polyline points="20 6 9 17 4 12"/></svg>Đã Hoàn Thành</span>
                          } @else if (pop.status === 'IN_PROGRESS') {
                            <span class="text-brand-primary font-extrabold animate-pulse flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target shrink-0"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>Đang Học</span>
                          } @else {
                            <span class="text-text-muted font-extrabold flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock shrink-0"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Đang Khóa</span>
                          }
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex gap-2 pt-1">
                          @if (pop.status !== 'LOCKED') {
                            <button
                              (click)="startStudyNode(pop)"
                              class="flex-1 text-center bg-brand-primary hover:bg-brand-secondary text-bg-card text-[10px] font-black py-2 rounded-xl transition-all cursor-pointer shadow-md border-none flex items-center justify-center gap-1 active:scale-98"
                            >
                              Học Ngay
                              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play shrink-0"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                            </button>
                          } @else {
                            <button
                              disabled
                              class="flex-1 bg-bg-input text-text-muted text-[10px] font-bold py-2 rounded-xl cursor-default border border-border-main opacity-50"
                            >
                              Bị Khóa
                            </button>
                          }
                          <button
                            (click)="activePopover.set(null)"
                            class="px-2.5 bg-bg-input border border-border-main hover:bg-bg-card text-text-muted hover:text-text-main rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Đóng
                          </button>
                        </div>
                      </div>
                    }
                  }
                }
              }
            </div>
          </div>
        </div>
      }

      <!-- ========================================== -->
      <!-- SLIDE-OUT PANEL: DETAILED AI ROADMAP LIST  -->
      <!-- ========================================== -->
      @if (isRoadmapDrawerOpen()) {
        <!-- Drawer Backdrop -->
        <div 
          (click)="isRoadmapDrawerOpen.set(false)"
          class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300"
        ></div>

        <!-- Drawer Body -->
        <div class="fixed top-0 right-0 w-full max-w-md h-full bg-bg-card border-l border-border-main shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-slide-in-right transition-colors duration-300">
          <div class="space-y-6">
            
            <!-- Drawer Header -->
            <div class="flex items-center justify-between border-b border-border-main/50 pb-4">
              <div>
                <span class="bg-brand-primary/10 text-brand-primary text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border border-brand-primary/15">
                  Lộ Trình Học AI
                </span>
                <h3 class="text-lg font-black text-text-main mt-1.5">CHI TIẾT LỘ TRÌNH</h3>
              </div>
              <button
                (click)="isRoadmapDrawerOpen.set(false)"
                class="w-8 h-8 rounded-lg border border-border-main/60 flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer"
              >
                ✕
              </button>
            </div>

            <!-- CEFR & TOEIC Summary Badge -->
            <div class="bg-bg-input/60 border border-border-main/50 p-4 rounded-xl space-y-2.5 transition-colors duration-300">
              <div class="flex justify-between items-center font-bold">
                <div>
                  <p class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold">CEFR Level</p>
                  <p class="text-sm font-black text-brand-primary">{{ roadmap()?.cefrLevel || 'N/A' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold">Tương đương TOEIC</p>
                  <p class="text-sm font-black text-brand-secondary">{{ roadmap()?.toeicEquivalent || 'N/A' }}</p>
                </div>
              </div>
              <div class="h-px bg-border-main/50"></div>
              <div>
                <p class="text-[9px] text-text-muted uppercase tracking-wider font-extrabold mb-1">Đánh giá của AI</p>
                <p class="text-[11px] text-text-main leading-relaxed italic font-medium">
                  "{{ roadmap()?.overallEvaluation || 'Đang lập lộ trình...' }}"
                </p>
              </div>
            </div>

            <!-- Module Steps Timeline -->
            <div class="space-y-4">
              <p class="text-[10px] font-black text-text-muted uppercase tracking-wider">Các Chương Học Tập (Modules):</p>
              
              <div class="space-y-3.5 relative pl-4 border-l border-border-main/80 ml-2">
                @for (mod of roadmap()?.modules; track mod.id) {
                  <div class="relative group">
                    <!-- Timeline Dot -->
                    <div 
                      [class.bg-green-500]="mod.status === 'COMPLETED'"
                      [class.bg-brand-primary]="mod.status === 'IN_PROGRESS'"
                      [class.bg-bg-input]="mod.status === 'LOCKED'"
                      [class.border-brand-primary]="mod.status === 'IN_PROGRESS'"
                      class="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-bg-card transition-all"
                    ></div>

                    <!-- Module Info Card -->
                    <div 
                      [class.border-brand-primary/20]="mod.status === 'IN_PROGRESS'"
                      [class.bg-brand-primary/5]="mod.status === 'IN_PROGRESS'"
                      class="bg-bg-input/20 border border-border-main/50 rounded-xl p-3.5 space-y-2 transition-all hover:border-border-main"
                    >
                      <div class="flex justify-between items-start gap-2">
                        <h4 class="font-extrabold text-[11px] text-text-main group-hover:text-brand-primary transition-colors uppercase leading-tight">
                          Bài {{ mod.orderIndex }}: {{ mod.title }}
                        </h4>
                        
                        <!-- Status tag -->
                        @if (mod.status === 'COMPLETED') {
                          <span class="text-[8px] bg-green-500/10 text-green-500 border border-green-500/20 px-1.5 py-0.5 rounded font-black uppercase shrink-0">Đã xong</span>
                        } @else if (mod.status === 'IN_PROGRESS') {
                          <span class="text-[8px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-1.5 py-0.5 rounded font-black uppercase shrink-0 animate-pulse">Học tiếp</span>
                        } @else {
                          <span class="text-[8px] bg-bg-input text-text-muted border border-border-main px-1.5 py-0.5 rounded font-black uppercase shrink-0">Khóa</span>
                        }
                      </div>

                      <p class="text-[10px] text-text-muted leading-relaxed font-normal">
                        {{ mod.description || 'Chương học tập số ' + mod.orderIndex + ' theo tiến trình AI.' }}
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .animate-slide-in-right {
      animation: slideInRight 0.28s ease-out forwards;
    }
    .animate-fade-in {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95) translateY(4px); left: 50%; }
      to { opacity: 1; transform: scale(1) translateY(0); left: 50%; }
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .active-glow {
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.18), 0 0 0 2px var(--brand-accent);
      animation: activePulse 2s infinite ease-in-out;
    }
    @keyframes activePulse {
      0%, 100% {
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.18), 0 0 0 2px var(--brand-accent);
        transform: translateY(0);
      }
      50% {
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35), 0 0 0 4px var(--brand-accent);
        transform: translateY(-2px);
      }
    }
    .scrollbar-thin::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: var(--border-main);
      border-radius: 99px;
    }
  `]
})
export class WorldMapComponent implements OnInit {
  private readonly placementService = inject(PlacementTestService);
  private readonly characterService = inject(CharacterService);
  private readonly authService = inject(AuthService);
  private readonly studyService = inject(StudyService);
  private readonly presetService = inject(PresetRoadmapService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  roadmap = signal<any>(null);
  @Input() embedded = false;
  @Input() isPreset = false;
  @Input() enrolled = false;
  @Output() enrollToggled = new EventEmitter<void>();

  @Input() set presetRoadmap(val: any) {
    this._presetRoadmap = val;
    if (this.isPreset && val) {
      this.roadmap.set(val);
      this.buildMapItems(val);
      this.scrollToActiveNode();
    }
  }
  get presetRoadmap(): any {
    return this._presetRoadmap;
  }
  private _presetRoadmap: any = null;

  character = signal<Character | null>(null);
  playerInfo = signal<any>(null);

  isLoading = signal(true);
  errorState = signal(false);

  // Roadmap list drawer state toggle
  isRoadmapDrawerOpen = signal<boolean>(false);

  // Active popover details card
  activePopover = signal<any>(null);

  // Flat serpentine list items
  items = signal<WorldMapItem[]>([]);
  totalHeight = signal(400);

  // Current stage sticky bar
  currentStage = signal<{ chapterNum: number; title: string; description?: string } | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorState.set(false);

    // Fetch user details for exp, level, coins dynamically
    this.studyService.getProfile().subscribe({
      next: (profile) => this.playerInfo.set(profile),
      error: () => this.playerInfo.set(this.authService.getUser())
    });

    // Fetch character
    this.characterService.getMyCharacter().subscribe({
      next: (char) => this.character.set(char),
      error: () => this.character.set(null)
    });

    if (this.isPreset) {
      this.isLoading.set(false);
      if (this.presetRoadmap) {
        this.roadmap.set(this.presetRoadmap);
        this.buildMapItems(this.presetRoadmap);
        this.scrollToActiveNode();
      }
    } else {
      // Fetch roadmap
      this.placementService.getRoadmap().subscribe({
        next: (rm) => {
          this.isLoading.set(false);
          if (rm) {
            this.roadmap.set(rm);
            this.buildMapItems(rm);
            this.scrollToActiveNode();
          } else {
            this.errorState.set(true);
          }
        },
        error: (err) => {
          console.error('Error loading roadmap in map', err);
          this.isLoading.set(false);
          this.errorState.set(true);
        }
      });
    }
  }

  buildMapItems(roadmap: any): void {
    if (this.isPreset) {
      if (!roadmap || !roadmap.modules || roadmap.modules.length === 0) {
        this.items.set([]);
        return;
      }

      const mapItems: WorldMapItem[] = [];
      let nodeCount = 0;

      for (let i = 0; i < roadmap.modules.length; i++) {
        const mod = roadmap.modules[i];
        const partNum = i + 1;

        mapItems.push({
          type: 'HEADER',
          chapterNum: partNum,
          title: mod.title,
          description: mod.description
        });

        const subTypes: ('THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_PRONUNCIATION' | 'QUIZ')[] = [
          'THEORY_GRAMMAR',
          'THEORY_VOCABULARY',
          'THEORY_LISTENING',
          'THEORY_PRONUNCIATION',
          'QUIZ'
        ];

        const subLabels = [
          'Lý thuyết ngữ pháp',
          'Học từ vựng flashcard',
          'Luyện nghe hiểu hội thoại',
          'Luyện phát âm AI',
          'Bài test qua màn'
        ];

        for (let j = 0; j < subTypes.length; j++) {
          mapItems.push({
            type: 'NODE',
            module: mod,
            nodeIndex: nodeCount++,
            nodeType: subTypes[j],
            title: subLabels[j]
          });
        }
      }

      let currentY = 15;
      for (const item of mapItems) {
        item.top = currentY;
        if (item.type === 'HEADER') {
          item.top = currentY + 10;
          currentY += item.description ? 95 : 75;
        } else {
          item.centerY = currentY + 43;
          item.centerX = 180 + this.getDx(item.nodeIndex!);
          currentY += 130;
        }
      }

      this.items.set(mapItems);
      this.totalHeight.set(currentY + 20);

      const headers = mapItems.filter(item => item.type === 'HEADER');
      if (headers.length > 0) {
        this.currentStage.set({
          chapterNum: headers[0].chapterNum!,
          title: headers[0].title!,
          description: headers[0].description
        });
      }
      return;
    }

    if (!roadmap || !roadmap.modules || roadmap.modules.length === 0) {
      this.items.set([]);
      return;
    }

    const mapItems: WorldMapItem[] = [];
    let nodeCount = 0;

    for (let idx = 0; idx < roadmap.modules.length; idx++) {
      const mod = roadmap.modules[idx];

      // Add a Header divider for every 5 lessons to visually structure the map
      if (idx % 5 === 0) {
        const startNum = idx + 1;
        const endNum = Math.min(idx + 5, roadmap.modules.length);
        mapItems.push({
          type: 'HEADER',
          chapterNum: Math.floor(idx / 5) + 1,
          title: `Bài học ${startNum} - ${endNum}`,
          description: `Rèn luyện kỹ năng và nâng cao kiến thức`
        });
      }

      // Map category to nodeType
      let nodeType: 'THEORY_GRAMMAR' | 'THEORY_VOCABULARY' | 'THEORY_LISTENING' | 'THEORY_READING' | 'THEORY_PRONUNCIATION' | 'BATTLE' | 'QUIZ' = 'THEORY_GRAMMAR';
      const category = (mod as any).category || '';
      if (category === 'VOCABULARY') {
        nodeType = 'THEORY_VOCABULARY';
      } else if (category === 'GRAMMAR') {
        nodeType = 'THEORY_GRAMMAR';
      } else if (category === 'LISTENING') {
        nodeType = 'THEORY_LISTENING';
      } else if (category === 'READING') {
        nodeType = 'THEORY_READING';
      }

      mapItems.push({
        type: 'NODE',
        module: mod,
        nodeType,
        nodeIndex: nodeCount++
      });
    }

    // Compute Y positions and centers
    let currentY = 15;
    for (const item of mapItems) {
      item.top = currentY;
      if (item.type === 'HEADER') {
        item.top = currentY + 10;
        currentY += item.description ? 95 : 75;
      } else {
        item.centerY = currentY + 43;
        item.centerX = 180 + this.getDx(item.nodeIndex!);
        currentY += 130;
      }
    }

    this.items.set(mapItems);
    this.totalHeight.set(currentY + 20);

    // Set initial stage
    const headers = mapItems.filter(item => item.type === 'HEADER');
    if (headers.length > 0) {
      this.currentStage.set({
        chapterNum: headers[0].chapterNum!,
        title: headers[0].title!,
        description: headers[0].description
      });
    }
  }

  scrollToActiveNode(): void {
    setTimeout(() => {
      if (!this.scrollContainer) return;
      
      const activeNode = this.items().find(
        item => item.type === 'NODE' && this.getSubNodeStatus(item.module, item.nodeType!) === 'IN_PROGRESS'
      );
      
      if (activeNode && activeNode.top != null) {
        const containerHeight = this.scrollContainer.nativeElement.clientHeight || 580;
        const targetScroll = activeNode.top - (containerHeight / 2) + 43;
        this.scrollContainer.nativeElement.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  onScroll(event: Event): void {
    const container = event.target as HTMLElement;
    const scrollTop = container.scrollTop;

    // Find the header closest to the top of the container
    const headers = this.items().filter(item => item.type === 'HEADER');
    let activeHeader = null;

    for (const header of headers) {
      if (header.top != null && header.top <= scrollTop + 60) {
        activeHeader = header;
      } else {
        break;
      }
    }

    if (activeHeader) {
      this.currentStage.set({
        chapterNum: activeHeader.chapterNum!,
        title: activeHeader.title!,
        description: activeHeader.description
      });
    } else if (headers.length > 0) {
      this.currentStage.set({
        chapterNum: headers[0].chapterNum!,
        title: headers[0].title!,
        description: headers[0].description
      });
    }
  }

  getSubNodeStatus(module: any, nodeType: string): 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED' {
    if (this.isPreset) {
      if (module.status === 'COMPLETED') return 'COMPLETED';
      if (module.status === 'LOCKED') return 'LOCKED';
      
      const progressKey = `progress_module_${module.id}`;
      let currentProgress = 'GRAMMAR';
      if (typeof window !== 'undefined' && window.localStorage) {
        currentProgress = localStorage.getItem(progressKey) || 'GRAMMAR';
      }
      
      const order = ['THEORY_GRAMMAR', 'THEORY_VOCABULARY', 'THEORY_LISTENING', 'THEORY_PRONUNCIATION', 'QUIZ'];
      const progressMap: Record<string, string> = {
        'GRAMMAR': 'THEORY_GRAMMAR',
        'VOCABULARY': 'THEORY_VOCABULARY',
        'LISTENING': 'THEORY_LISTENING',
        'PRONUNCIATION': 'THEORY_PRONUNCIATION',
        'TEST': 'QUIZ'
      };
      const currentProgressType = progressMap[currentProgress] || 'THEORY_GRAMMAR';
      
      const orderIdx = order.indexOf(currentProgressType);
      const itemIdx = order.indexOf(nodeType);
      
      if (itemIdx < orderIdx) {
        return 'COMPLETED';
      } else if (itemIdx === orderIdx) {
        return 'IN_PROGRESS';
      } else {
        return 'LOCKED';
      }
    }
    return module?.status || 'LOCKED';
  }

  // Draw background serpentine path segments
  getDx(i: number): number {
    return Math.sin(i * 1.5) * 50;
  }

  getPathD(): string {
    const nodes = this.items().filter(item => item.type === 'NODE');
    if (nodes.length <= 1) return '';
    let d = '';
    for (let i = 0; i < nodes.length; i++) {
      const pt = nodes[i];
      if (i === 0) {
        d += `M ${pt.centerX} ${pt.centerY}`;
      } else {
        const prev = nodes[i - 1];
        const dy = pt.centerY! - prev.centerY!;
        const controlOffset = dy * 0.45;
        d += ` C ${prev.centerX} ${prev.centerY! + controlOffset}, ${pt.centerX} ${pt.centerY! - controlOffset}, ${pt.centerX} ${pt.centerY}`;
      }
    }
    return d;
  }

  getPathDActive(): string {
    const nodes = this.items().filter(item => item.type === 'NODE');
    let lastActiveIndex = -1;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const status = this.getSubNodeStatus(node.module!, node.nodeType!);
      if (status !== 'LOCKED') {
        lastActiveIndex = i;
      }
    }
    if (lastActiveIndex <= 0) return '';

    let d = '';
    for (let i = 0; i <= lastActiveIndex; i++) {
      const pt = nodes[i];
      if (i === 0) {
        d += `M ${pt.centerX} ${pt.centerY}`;
      } else {
        const prev = nodes[i - 1];
        const dy = pt.centerY! - prev.centerY!;
        const controlOffset = dy * 0.45;
        d += ` C ${prev.centerX} ${prev.centerY! + controlOffset}, ${pt.centerX} ${pt.centerY! - controlOffset}, ${pt.centerX} ${pt.centerY}`;
      }
    }
    return d;
  }

  getNodeEmoji(type: string): string {
    const map: any = { 
      THEORY_GRAMMAR: '📘', 
      THEORY_VOCABULARY: '📚', 
      THEORY_LISTENING: '🎧', 
      THEORY_READING: '📖',
      THEORY_PRONUNCIATION: '🗣️', 
      BATTLE: '⚔️', 
      QUIZ: '🏆' 
    };
    return map[type] ?? '📘';
  }

  getNodeTitle(type: string): string {
    const map: any = { 
      THEORY_GRAMMAR: 'Lý thuyết ngữ pháp', 
      THEORY_VOCABULARY: 'Từ vựng flashcard', 
      THEORY_LISTENING: 'Luyện nghe hiểu', 
      THEORY_READING: 'Luyện đọc hiểu',
      THEORY_PRONUNCIATION: 'Luyện phát âm AI', 
      BATTLE: 'Quyết đấu Từ vựng', 
      QUIZ: 'Bài Kiểm Tra Chặng' 
    };
    return map[type] ?? '';
  }

  getNodeDesc(type: string): string {
    const map: any = {
      THEORY_GRAMMAR: 'Học lý thuyết cấu trúc và mẫu câu.',
      THEORY_VOCABULARY: 'Ghi nhớ từ mới qua thẻ thông minh.',
      THEORY_LISTENING: 'Luyện nghe audio hội thoại thực tế.',
      THEORY_READING: 'Đọc hiểu đoạn văn và làm bài kiểm tra.',
      THEORY_PRONUNCIATION: 'Luyện phát âm chuẩn xác với AI.',
      BATTLE: 'Quyết đấu từ vựng phản xạ thời gian thực.',
      QUIZ: 'Bài kiểm tra tổng hợp để qua chặng.'
    };
    return map[type] ?? '';
  }

  getEstimatedToeic(mod: any): string {
    if (!mod) return 'Nền tảng';
    if (mod.title && mod.title.includes('TOEIC')) {
      const match = mod.title.match(/(\d+\+?\s*TOEIC|TOEIC\s*\d+\+?)/i);
      if (match) {
        return match[0];
      }
    }
    const scores = ['100-200', '200-300', '350-400', '400-500', '500-600', '600+'];
    const idx = mod.orderIndex != null ? mod.orderIndex : 1;
    return 'TOEIC ' + (scores[Math.floor((idx - 1) / 4)] || '600+');
  }

  clickNode(mod: any, type: string, x: number, y: number, event: MouseEvent): void {
    event.stopPropagation();
    
    let estimatedToeic = this.getEstimatedToeic(mod);
    let title = this.isPreset ? this.getNodeTitle(type) : mod.title;
    let description = this.isPreset ? this.getNodeDesc(type) : (mod.description || this.getNodeDesc(type));
    let link = ['/study', mod.id];
    let queryParams: any = { mode: 'study' };

    if (this.isPreset) {
      const typeMapRev: Record<string, string> = {
        'THEORY_GRAMMAR': 'GRAMMAR',
        'THEORY_VOCABULARY': 'VOCABULARY',
        'THEORY_LISTENING': 'LISTENING',
        'THEORY_PRONUNCIATION': 'PRONUNCIATION',
        'QUIZ': 'TEST'
      };
      const subType = typeMapRev[type] || 'GRAMMAR';
      if (subType === 'TEST') {
        queryParams.mode = 'test';
      } else {
        queryParams.tab = subType.toLowerCase();
        queryParams.mode = 'study';
      }

      const order = ['GRAMMAR', 'VOCABULARY', 'LISTENING', 'PRONUNCIATION', 'TEST'];
      const idx = order.indexOf(subType);
      if (idx !== -1 && idx < order.length - 1) {
        queryParams.next = order[idx + 1];
      }
    }

    const subNodeStatus = this.getSubNodeStatus(mod, type);

    this.activePopover.set({
      moduleId: mod.id,
      type,
      title,
      description,
      estimatedToeic,
      status: subNodeStatus,
      link,
      queryParams,
      x,
      y
    });
  }

  startStudyNode(pop: any): void {
    const navigateAction = () => {
      this.router.navigate(pop.link, { queryParams: pop.queryParams });
    };

    if (this.isPreset && !this.enrolled) {
      this.presetService.enroll(this.presetRoadmap!.id).subscribe({
        next: () => {
          this.toastService.success('Đã thêm lộ trình học thành công!');
          this.enrollToggled.emit();
          navigateAction();
        },
        error: () => {
          this.toastService.error('Thêm lộ trình thất bại.');
          navigateAction();
        }
      });
    } else {
      navigateAction();
    }
  }
}
