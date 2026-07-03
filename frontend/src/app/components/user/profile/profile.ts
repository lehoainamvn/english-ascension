import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { CharacterService, Character } from '../../../services/character.service';
import { StudyService } from '../../../services/study.service';
import { PlacementTestService } from '../../../services/placement-test.service';
import { CharacterAvatarComponent } from '../../common/character-avatar/character-avatar';
import { ToastService } from '../../../services/toast.service';
import { API_BASE_URL } from '../../../api-config';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, CharacterAvatarComponent],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <!-- Main container -->
      <div class="max-w-6xl mx-auto relative z-10 space-y-6">
        
        <div class="border-b border-border-main pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-black tracking-tight text-text-main">
              HỒ SƠ CÁ NHÂN & TIẾN ĐỘ
            </h1>
            <p class="text-xs text-text-muted mt-1">
              Quản lý tên nhân vật, theo dõi các chỉ số và tiến trình học tập của bạn.
            </p>
          </div>
          @if (character()) {
            <a
              routerLink="/dashboard"
              class="btn-back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left shrink-0"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Về trang chủ
            </a>
          }
        </div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-text-muted font-medium">Đang tải thông tin hồ sơ...</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- LEFT COLUMN: Profile info / Customizer & Learning Progress (4 cols) -->
            <div class="lg:col-span-4 flex flex-col gap-6">
              
              <!-- PROFILE VIEW OR EDIT CARD -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-[16px] p-[20px] relative overflow-hidden transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none"></div>

                @if (!isEditing()) {
                  <!-- ========================================== -->
                  <!-- VIEW MODE                                  -->
                  <!-- ========================================== -->
                  <div class="flex flex-col items-center">
                    <!-- Left: Avatar Preview with League of Legends inspired Border Frame -->
                    <div class="relative shrink-0 mb-4">
                      <div 
                        [class]="avatarBorderClass()"
                        class="w-28 h-28 flex items-center justify-center bg-bg-input rounded-full p-2 transition-all duration-300 relative overflow-hidden"
                      >
                        <!-- Avatar inside -->
                        <app-character-avatar [character]="character()" class="w-full h-full drop-shadow-xl z-10" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-0"></div>
                      </div>
                      
                      <!-- Circular Level badge overlapping bottom right of avatar border -->
                      <span class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center border-2 border-bg-card shadow-sm z-20">
                        Lv{{ playerInfo()?.level || 1 }}
                      </span>
                    </div>

                    <!-- Right: Info Summary -->
                    <div class="w-full text-center">
                      <h2 class="text-base font-semibold text-text-main mt-1 truncate">{{ character()?.name || 'Học viên chưa tạo tên' }}</h2>
                      <p class="text-xxs text-text-muted mt-0.5 mb-3">{{ userEmail }}</p>

                      <div class="flex gap-2 justify-center w-full mb-4">
                        <span class="bg-bg-input border border-border-main/50 px-2 py-0.5 rounded-full text-[10px] font-semibold text-text-muted flex items-center gap-1">
                          CEFR: {{ roadmap()?.cefrLevel || 'A1' }}
                        </span>
                        <span class="bg-bg-input border border-border-main/50 px-2 py-0.5 rounded-full text-[10px] font-semibold text-text-muted flex items-center gap-1">
                          Streak: {{ playerInfo()?.streak || 0 }} ngày
                        </span>
                      </div>

                      <div class="flex gap-2 w-full mb-5">
                        <button
                          (click)="startEditing()"
                          class="flex-1 bg-bg-input border border-border-main hover:bg-bg-card text-text-main py-2 rounded-[10px] text-xxs font-semibold transition-all cursor-pointer shadow-sm text-center"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          (click)="openChangePasswordModal()"
                          class="flex-1 bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] py-2 rounded-[10px] text-xxs font-semibold transition-all cursor-pointer shadow-sm text-center border-none"
                        >
                          Đổi mật khẩu
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Exp bar in View Mode -->
                  <div class="w-full space-y-1.5 text-[10px] pt-4 border-t border-border-main/40">
                    <div class="flex justify-between items-center font-semibold text-text-muted">
                      <span>Tiến độ cấp độ Cấp {{ playerInfo()?.level || 1 }}</span>
                      <span class="text-text-main font-bold">{{ playerInfo()?.exp || 0 }} / {{ (playerInfo()?.level || 1) * 100 }} XP</span>
                    </div>
                    <div class="w-full h-2.5 bg-bg-input rounded-full overflow-hidden border border-border-main/20 p-[1px]">
                      <div
                        [style.width.%]="((playerInfo()?.exp || 0) / ((playerInfo()?.level || 1) * 100)) * 100"
                        class="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-500"
                      ></div>
                    </div>
                  </div>

                } @else {
                  <!-- ========================================== -->
                  <!-- EDIT MODE                                  -->
                  <!-- ========================================== -->
                  <div class="space-y-4">
                    <h3 class="text-xs font-bold text-text-main uppercase tracking-wider mb-3 border-b border-border-main/40 pb-2">
                      Cập Nhật Diện Mạo
                    </h3>

                    <!-- Messages -->
                    @if (errorMessage()) {
                      <div class="mb-3 bg-rose-500/10 text-rose-600 dark:text-rose-200 text-xxs p-2.5 rounded-xl font-bold animate-fade-in">
                        <span>{{ errorMessage() }}</span>
                      </div>
                    }
                    @if (successMessage()) {
                      <div class="mb-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-200 text-xxs p-2.5 rounded-xl font-bold animate-fade-in">
                        <span>{{ successMessage() }}</span>
                      </div>
                    }

                    <div class="flex flex-col gap-4">
                      
                      <!-- Preview Column -->
                      <div class="flex flex-col items-center p-3 bg-bg-input/20 border border-border-main/30 rounded-xl">
                        <span class="bg-brand-secondary/15 text-brand-secondary text-[8px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest mb-3">
                          Xem Trước
                        </span>
                        
                        <div class="relative group mb-2">
                          <div 
                            [class]="avatarBorderClass()"
                            class="w-24 h-24 flex items-center justify-center bg-bg-card rounded-full p-2 transition-all duration-300 relative overflow-hidden"
                          >
                            <app-character-avatar [character]="getCharacterPreviewObject()" class="w-full h-full drop-shadow-xl z-10" />
                          </div>
                          <!-- Tier badge floating at bottom -->
                          <span 
                            [class]="tierBadgeColor()"
                            class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold px-2 py-0.5 rounded-full border shadow-sm z-20 whitespace-nowrap bg-bg-card"
                          >
                            {{ tierName() }}
                          </span>
                        </div>

                        <h4 class="text-xs font-semibold text-text-main truncate w-full text-center min-h-[1.2rem]">
                          {{ name.trim() || 'Vô Danh' }}
                        </h4>
                      </div>

                      <!-- Control Fields Column -->
                      <div class="space-y-4">
                        <!-- Tên nhân vật -->
                        <div>
                          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Tên nhân vật</label>
                          <input
                            type="text"
                            [(ngModel)]="name"
                            placeholder="Nhập tên..."
                            maxlength="20"
                            class="w-full bg-bg-input border border-border-main rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                          />
                        </div>

                        <!-- Avatar Selection Grid -->
                        <div>
                          <label class="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Chọn đại diện</label>
                          <div class="grid grid-cols-2 gap-2">
                            @for (av of avatarPresets; track av.id) {
                              <button
                                (click)="selectAvatarPreset(av.id)"
                                [class.border-brand-primary]="avatarStyle === av.id"
                                [class.bg-brand-primary/5]="avatarStyle === av.id"
                                class="bg-bg-input border border-border-main hover:border-brand-primary/50 rounded-lg p-2 flex flex-col items-center transition-all cursor-pointer text-center relative"
                              >
                                @if (avatarStyle === av.id) {
                                  <span class="absolute top-1 right-1 bg-brand-primary text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">✓</span>
                                }
                                <div class="w-10 h-10 bg-bg-card rounded-md border border-border-main/50 p-1 flex items-center justify-center mb-1">
                                  <app-character-avatar [character]="av.preview" class="w-full h-full drop-shadow-sm" />
                                </div>
                                <span class="font-bold text-[9px] text-text-main leading-none">{{ av.label }}</span>
                              </button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Edit Actions -->
                    <div class="flex gap-2 pt-4 border-t border-border-main/50 mt-4 text-xs font-bold">
                      <button
                        (click)="onSave()"
                        [disabled]="isSaving() || !name.trim()"
                        class="flex-1 bg-brand-primary hover:bg-brand-secondary text-white py-2 rounded-lg active:scale-98 transition-all disabled:opacity-50 cursor-pointer border-none"
                      >
                        @if (isSaving()) {
                          <span>Đang lưu...</span>
                        } @else {
                          <span>Lưu thay đổi</span>
                        }
                      </button>
                      @if (character()) {
                        <button
                          (click)="cancelEditing()"
                          [disabled]="isSaving()"
                          class="flex-1 bg-bg-input border border-border-main text-text-muted py-2 rounded-lg hover:bg-bg-card transition-all cursor-pointer"
                        >
                          Hủy bỏ
                        </button>
                      }
                    </div>
                  </div>
                }

              </div>

              <!-- Weekly activity heatmap -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-[16px] p-[20px]">
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-xxs font-bold text-text-main uppercase tracking-wider">
                    Hoạt động học tuần này
                  </h4>
                  <span class="text-[10px] text-text-muted hover:text-text-main transition-colors cursor-pointer font-medium">Xem tháng này &rarr;</span>
                </div>
                
                <!-- Bar chart vertical bars style -->
                <div class="flex justify-between items-end gap-1.5 h-16 px-1">
                  @for (day of weeklyActivity(); track day.name) {
                    <div class="flex flex-col items-center flex-1 gap-2">
                      <div class="h-10 w-full flex items-end justify-center">
                        @if (day.active) {
                          <!-- Active status vertical bar -->
                          <div class="w-3.5 h-10 bg-[#0F1729] dark:bg-white rounded-[4px] animate-fade-in"></div>
                        } @else {
                          <!-- Inactive dot stub -->
                          <div class="w-2.5 h-2.5 rounded-full bg-bg-input border border-border-main/30"></div>
                        }
                      </div>
                      <span class="text-[9px] font-bold text-text-muted uppercase tracking-wider">{{ day.name }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Leaderboard panel (Real data) -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-[16px] p-[20px]">
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-xxs font-bold text-text-main uppercase tracking-wider">
                    Bảng Xếp Hạng EXP
                  </h4>
                  <span class="text-[10px] text-text-muted hover:text-text-main transition-colors cursor-pointer font-medium">Xem tất cả &rarr;</span>
                </div>
                
                @if (isLoadingRealLeaderboard()) {
                  <div class="flex justify-center py-6">
                    <svg class="animate-spin h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  </div>
                } @else {
                  <div class="space-y-1.5">
                    @for (entry of realLeaderboard().slice(0, 3); track entry.rank) {
                      <div
                        class="flex items-center justify-between p-2 rounded-[10px] border transition-colors text-xxs font-semibold"
                        [class.bg-[#0F1729]]="entry.email === userEmail"
                        [class.text-white]="entry.email === userEmail"
                        [class.border-transparent]="entry.email === userEmail"
                        [class.border-border-main/50]="entry.email !== userEmail"
                        [class.bg-bg-input/20]="entry.email !== userEmail"
                      >
                        <div class="flex items-center gap-2.5 min-w-0">
                          <span
                            class="w-5 h-5 flex items-center justify-center rounded-full font-bold text-[9px] shrink-0"
                            [class.bg-yellow-500]="entry.rank === 1 && entry.email !== userEmail"
                            [class.text-white]="entry.rank === 1 && entry.email !== userEmail"
                            [class.bg-slate-400/30]="entry.rank === 2 && entry.email !== userEmail"
                            [class.text-slate-400]="entry.rank === 2 && entry.email !== userEmail"
                            [class.bg-amber-700/20]="entry.rank === 3 && entry.email !== userEmail"
                            [class.text-amber-600]="entry.rank === 3 && entry.email !== userEmail"
                            [class.bg-bg-input]="entry.rank > 3 && entry.email !== userEmail"
                            [class.text-text-muted]="entry.rank > 3 && entry.email !== userEmail"
                            [class.bg-white/20]="entry.email === userEmail"
                            [class.text-white]="entry.email === userEmail"
                          >
                            #{{ entry.rank }}
                          </span>
                          
                          <!-- Circular avatar with initial -->
                          <div 
                            class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border"
                            [class.bg-white/10]="entry.email === userEmail"
                            [class.border-white/20]="entry.email === userEmail"
                            [class.text-white]="entry.email === userEmail"
                            [class.bg-bg-input]="entry.email !== userEmail"
                            [class.border-border-main]="entry.email !== userEmail"
                            [class.text-text-main]="entry.email !== userEmail"
                          >
                            {{ entry.name ? entry.name.charAt(0).toUpperCase() : 'U' }}
                          </div>
                          
                          <div class="min-w-0">
                            <span class="font-semibold truncate max-w-[100px] block" [class.text-white]="entry.email === userEmail">
                              {{ entry.name }} @if (entry.email === userEmail) { <span class="text-white/60 text-[8px]">(tôi)</span> }
                            </span>
                          </div>
                        </div>
                        <span class="font-bold text-[10px] shrink-0" [class.text-white/80]="entry.email === userEmail">{{ entry.exp }} EXP</span>
                      </div>
                    }
                    @if (realLeaderboard().length === 0) {
                      <div class="text-center py-4 text-text-muted text-[10px]">Chưa có dữ liệu xếp hạng</div>
                    }
                  </div>
                }
              </div>

            </div>

            <!-- RIGHT COLUMN: AI roadmap, Skill progress, Modules list (8 cols) -->
            <div class="lg:col-span-8 flex flex-col gap-6">
              
              <!-- AI Roadmap summary -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-[16px] p-[20px] space-y-4">
                <div class="flex justify-between items-center border-b border-border-main/40 pb-2.5">
                  <h3 class="text-xs font-bold text-text-main uppercase tracking-wider">
                    Lộ Trình & Tiến Độ Học Tập AI
                  </h3>
                  <!-- Percent Progress Badge floating right -->
                  <span class="text-xs font-semibold bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] px-2.5 py-0.5 rounded-full shadow-sm">
                    {{ getProgressPercentage() }}%
                  </span>
                </div>

                @if (roadmap()) {
                  <div class="space-y-4">
                    <!-- stats columns -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <!-- widget 1: Star icon, KHÓA HỌC / CEFR A1 -->
                      <div class="flex items-center gap-3 bg-bg-input/20 border border-border-main/30 p-3 rounded-xl">
                        <div class="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div>
                          <p class="text-[9px] font-bold text-text-muted uppercase tracking-wider">Khóa học</p>
                          <h4 class="text-xs font-semibold text-text-main mt-0.5">CEFR {{ roadmap()?.cefrLevel || 'A1' }}</h4>
                        </div>
                      </div>

                      <!-- widget 2: bar chart, TRÌNH ĐỘ / Sơ cấp - 100/300 -->
                      <div class="flex items-center gap-3 bg-bg-input/20 border border-border-main/30 p-3 rounded-xl">
                        <div class="w-8 h-8 rounded-lg bg-slate-200 dark:bg-bg-input border border-border-main/50 text-text-main flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                        </div>
                        <div>
                          <p class="text-[9px] font-bold text-text-muted uppercase tracking-wider">Trình độ</p>
                          <h4 class="text-xs font-semibold text-text-main mt-0.5">Sơ cấp - {{ roadmap()?.toeicEquivalent || '100/300' }}</h4>
                        </div>
                      </div>
                    </div>

                    <!-- AI Overall evaluation description -->
                    <p class="text-xs text-text-muted leading-relaxed font-medium bg-bg-input/10 p-3.5 rounded-xl border border-border-main/20">
                      <span class="font-bold text-text-main text-[10px] block uppercase tracking-wider mb-1">Đánh giá chương trình học:</span>
                      {{ roadmap()?.overallEvaluation || 'Lộ trình học tập cá nhân hóa, giúp bạn nắm vững từ vựng, ngữ pháp cơ bản và các kỹ năng giao tiếp thiết thực để nâng cao năng lực.' }}
                    </p>
                  </div>
                } @else {
                  <div class="text-center py-10 text-text-muted text-xxs space-y-3 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="opacity-30"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <p>Bạn chưa khởi tạo lộ trình học tập. Vui lòng hoàn thành bài đánh giá đầu vào.</p>
                    <a routerLink="/placement-test" class="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl mt-2 inline-flex items-center gap-1.5">Làm bài Placement Test</a>
                  </div>
                }
              </div>

              <!-- Skill Progress Details -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-[16px] p-[20px] space-y-4">
                <h3 class="text-xs font-bold text-text-main uppercase tracking-wider border-b border-border-main/40 pb-2.5">
                  Chi tiết tiến độ kỹ năng
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (stat of categoryStats(); track stat.code) {
                    <div class="space-y-1.5 p-3 bg-bg-input/10 border border-border-main/20 rounded-xl">
                      <div class="flex justify-between items-center text-xs font-semibold">
                        <!-- Skill name & custom icon -->
                        <div class="flex items-center gap-1.5 text-text-main">
                          @if (stat.code === 'VOCABULARY') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open text-blue-500 shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                          } @else if (stat.code === 'GRAMMAR') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-square text-emerald-500 shrink-0"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
                          } @else if (stat.code === 'LISTENING') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones text-purple-500 shrink-0"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                          } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book text-amber-500 shrink-0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                          }
                          <span class="text-xxs font-bold text-text-main">{{ stat.name }}</span>
                        </div>
                        <span class="font-bold text-[11px]" [class]="stat.colorClass">{{ stat.percent }}%</span>
                      </div>
                      
                      <!-- progress bar -->
                      <div class="w-full h-2 bg-bg-input rounded-full overflow-hidden border border-border-main/20 p-[1px]">
                        <div
                          [style.width.%]="stat.percent"
                          class="h-full bg-gradient-to-r rounded-full transition-all duration-500"
                          [class]="stat.barClass"
                        ></div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Modules chapter list -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-[16px] p-[20px] space-y-4">
                <div class="flex justify-between items-center border-b border-border-main/40 pb-2.5">
                  <h3 class="text-xs font-bold text-text-main uppercase tracking-wider">
                    Danh sách chương học
                  </h3>
                  <span class="text-[10px] text-text-muted hover:text-text-main transition-colors cursor-pointer font-medium">Bấm vào để học / ôn tập</span>
                </div>

                <div class="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  @for (mod of roadmap()?.modules; track mod.id) {
                    <div
                      [routerLink]="mod.status !== 'LOCKED' ? ['/study', mod.id] : null"
                      [class.cursor-pointer]="mod.status !== 'LOCKED'"
                      [class.hover:border-brand-primary/40]="mod.status !== 'LOCKED'"
                      [class.hover:bg-bg-input/20]="mod.status !== 'LOCKED'"
                      [class.opacity-60]="mod.status === 'LOCKED'"
                      class="group flex flex-col p-3.5 bg-bg-input/20 border border-border-main/30 rounded-xl transition-all duration-200 gap-2"
                    >
                      <!-- Top Row: title and badge -->
                      <div class="flex items-start justify-between min-w-0">
                        <div class="flex items-center gap-2.5 min-w-0">
                          <!-- Custom Chapter Icon/Box -->
                          <div class="w-8 h-8 rounded-lg bg-bg-input border border-border-main/40 flex items-center justify-center shrink-0">
                            @if (mod.status === 'COMPLETED') {
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                            } @else if (mod.status === 'IN_PROGRESS') {
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" class="text-brand-primary animate-pulse"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            } @else {
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-text-muted"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                            }
                          </div>

                          <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                              <p class="text-xs font-semibold text-text-main truncate">Chương {{ mod.orderIndex }}: {{ mod.title }}</p>
                              
                              <!-- Status badge -->
                              <span 
                                class="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0"
                                [class]="mod.status === 'COMPLETED'
                                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                                  : mod.status === 'IN_PROGRESS'
                                  ? 'bg-[#0F1729] dark:bg-white text-white dark:text-black border-transparent'
                                  : 'bg-bg-input text-text-muted border-border-main/50'"
                              >
                                {{ mod.status === 'COMPLETED' ? 'Đã xong' : mod.status === 'IN_PROGRESS' ? 'Đang học' : 'Chưa học' }}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span class="text-text-muted group-hover:text-text-main transition-colors text-xs font-bold shrink-0 self-center pl-2">
                          &rarr;
                        </span>
                      </div>

                      <!-- Bottom Progress row inside card (Only for non-locked) -->
                      @if (mod.status !== 'LOCKED') {
                        <div class="space-y-1">
                          <!-- progress bar -->
                          <div class="w-full h-1.5 bg-bg-input rounded-full overflow-hidden border border-border-main/10 p-[1px]">
                            <div
                              [style.width.%]="mod.status === 'COMPLETED' ? 100 : 30"
                              class="h-full bg-[#0F1729] dark:bg-white rounded-full transition-all duration-500"
                            ></div>
                          </div>
                          <div class="flex justify-between items-center text-[9px] text-text-muted font-medium">
                            <span>12 bài học</span>
                            <span>{{ mod.status === 'COMPLETED' ? '100%' : '30%' }}</span>
                          </div>
                        </div>
                      } @else {
                        <div class="flex justify-between items-center text-[9px] text-text-muted font-medium">
                          <span>10 bài học</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>

            </div>

          </div>
        }

        <!-- Change Password Modal -->
        @if (isChangePasswordModalOpen()) {
          <div 
            (click)="closeChangePasswordModal()"
            class="fixed inset-0 bg-black/60 backdrop-blur-xs z-[110] flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in"
          >
            <div 
              (click)="$event.stopPropagation()"
              class="w-full max-w-sm bg-bg-card border border-border-main rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-left relative"
            >
              <div class="flex justify-between items-center border-b border-border-main/40 pb-3">
                <h3 class="text-xs font-bold text-text-main uppercase tracking-wider">
                  Đổi Mật Khẩu
                </h3>
                <button
                  (click)="closeChangePasswordModal()"
                  class="w-7 h-7 rounded-lg hover:bg-bg-input/60 border border-transparent hover:border-border-main flex items-center justify-center text-text-muted hover:text-text-main cursor-pointer transition-all"
                >
                  ✕
                </button>
              </div>

              <!-- Fields -->
              <div class="space-y-3">
                <div>
                  <label class="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    [(ngModel)]="oldPassword"
                    placeholder="••••••••"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                  />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    [(ngModel)]="newPassword"
                    placeholder="••••••••"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                  />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    [(ngModel)]="confirmPassword"
                    placeholder="••••••••"
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                  />
                </div>
              </div>

              @if (changePasswordError()) {
                <div class="bg-rose-500/10 text-rose-600 dark:text-rose-200 text-[10px] p-2.5 rounded-xl flex items-center gap-2 font-bold animate-fade-in">
                  <span>{{ changePasswordError() }}</span>
                </div>
              }

              <!-- Actions -->
              <div class="flex gap-2.5 pt-2 border-t border-border-main/40 font-bold text-xs">
                <button
                  (click)="onChangePasswordSubmit()"
                  [disabled]="isChangingPassword() || !oldPassword || !newPassword || !confirmPassword"
                  class="flex-1 bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-98 border-none"
                >
                  @if (isChangingPassword()) {
                    Đang xử lý...
                  } @else {
                    Lưu mật khẩu
                  }
                </button>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly characterService = inject(CharacterService);
  private readonly studyService = inject(StudyService);
  private readonly placementService = inject(PlacementTestService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  // Form Fields
  name = '';
  gender = 'MALE';
  hairStyle = 'SHORT';
  hairColor = 'BLACK';
  faceStyle = 'SMILEY';
  outfitStyle = 'WARRIOR';
 
  avatarStyle = 'warrior_male';
 
  avatarPresets = [
    {
      id: 'warrior_male',
      label: 'Warrior (Nam)',
      role: 'Chiến Binh',
      preview: { name: 'Warrior', gender: 'MALE', hairStyle: 'SHORT', hairColor: 'BLACK', faceStyle: 'SMILEY', outfitStyle: 'WARRIOR' }
    },
    {
      id: 'mage_female',
      label: 'Mage (Nữ)',
      role: 'Pháp Sư',
      preview: { name: 'Mage', gender: 'FEMALE', hairStyle: 'LONG', hairColor: 'BLONDE', faceStyle: 'EXCITED', outfitStyle: 'MAGE' }
    },
    {
      id: 'rogue_male',
      label: 'Rogue (Nam)',
      role: 'Sát Thủ',
      preview: { name: 'Rogue', gender: 'MALE', hairStyle: 'SPIKY', hairColor: 'RED', faceStyle: 'COOL', outfitStyle: 'ROGUE' }
    },
    {
      id: 'casual_female',
      label: 'Casual (Nữ)',
      role: 'Học Viên',
      preview: { name: 'Casual', gender: 'FEMALE', hairStyle: 'CURLY', hairColor: 'BROWN', faceStyle: 'SMILEY', outfitStyle: 'CASUAL' }
    }
  ];
 
  selectAvatarPreset(presetId: string): void {
    this.avatarStyle = presetId;
    const preset = this.avatarPresets.find(p => p.id === presetId);
    if (preset) {
      this.gender = preset.preview.gender;
      this.hairStyle = preset.preview.hairStyle;
      this.hairColor = preset.preview.hairColor;
      this.faceStyle = preset.preview.faceStyle;
      this.outfitStyle = preset.preview.outfitStyle;
    }
  }

  // State Signals
  character = signal<Character | null>(null);
  roadmap = signal<any>(null);
  playerInfo = signal<any>(null);

  avatarBorderClass = computed(() => {
    const lvl = this.playerInfo()?.level || 1;
    if (lvl >= 30) {
      // Challenger: Glowing rose gradient border
      return 'border-4 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] ring-2 ring-purple-600/30';
    } else if (lvl >= 20) {
      // Diamond: Glowing cyan border
      return 'border-4 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-2 ring-cyan-400/20';
    } else if (lvl >= 10) {
      // Gold: Glowing amber/gold border
      return 'border-2 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]';
    } else if (lvl >= 5) {
      // Silver: Sleek silver border
      return 'border-2 border-slate-300 shadow-[0_0_6px_rgba(203,213,225,0.3)]';
    } else {
      // Bronze: Simple bronze border
      return 'border-2 border-amber-800/80';
    }
  });

  tierName = computed(() => {
    const lvl = this.playerInfo()?.level || 1;
    if (lvl >= 30) return 'Thách Đấu';
    if (lvl >= 20) return 'Kim Cương';
    if (lvl >= 10) return 'Cao Thủ';
    if (lvl >= 5) return 'Tinh Anh';
    return 'Tân Thủ';
  });

  tierBadgeColor = computed(() => {
    const lvl = this.playerInfo()?.level || 1;
    if (lvl >= 30) return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
    if (lvl >= 20) return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30';
    if (lvl >= 10) return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    if (lvl >= 5) return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
    return 'bg-amber-900/10 text-amber-800 border-amber-900/20';
  });
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  isEditing = signal(false);
  realLeaderboard = signal<any[]>([]);
  isLoadingRealLeaderboard = signal(true);

  // Change Password State
  isChangePasswordModalOpen = signal(false);
  isChangingPassword = signal(false);
  changePasswordError = signal('');
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Option lists
  genders = [
    { id: 'MALE', label: 'Nam' },
    { id: 'FEMALE', label: 'Nữ' }
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
    { id: 'SMILEY', label: 'Vui vẻ' },
    { id: 'SERIOUS', label: 'Nghiêm túc' },
    { id: 'COOL', label: 'Ngầu' },
    { id: 'EXCITED', label: 'Hào hứng' }
  ];

  outfits = [
    { id: 'WARRIOR', label: 'Chiến binh', desc: 'Giáp sắt' },
    { id: 'MAGE', label: 'Pháp sư', desc: 'Áo choàng' },
    { id: 'ROGUE', label: 'Sát thủ', desc: 'Đồ da' },
    { id: 'CASUAL', label: 'Thường dân', desc: 'Áo thun' }
  ];

  // Mock structures — weekly activity, will be updated from profile streak
  weeklyActivity = signal([
    { name: 'T2', active: false },
    { name: 'T3', active: false },
    { name: 'T4', active: false },
    { name: 'T5', active: false },
    { name: 'T6', active: false },
    { name: 'T7', active: false },
    { name: 'CN', active: false }
  ]);

  categoryStats = computed(() => {
    const rm = this.roadmap();
    if (!rm || !rm.modules) return [];
    
    const categories = ['VOCABULARY', 'GRAMMAR', 'LISTENING', 'READING'];
    const names: Record<string, string> = {
      VOCABULARY: 'Từ Vựng',
      GRAMMAR: 'Ngữ Pháp',
      LISTENING: 'Luyện Nghe',
      READING: 'Luyện Đọc'
    };
    
    return categories.map(cat => {
      const modulesOfCat = rm.modules.filter((m: any) => m.category === cat);
      const total = modulesOfCat.length;
      const completed = modulesOfCat.filter((m: any) => m.status === 'COMPLETED').length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      // Determine colors and icons
      let colorClass = 'text-blue-500';
      let barClass = 'from-blue-500 to-indigo-500';
      if (cat === 'GRAMMAR') {
        colorClass = 'text-emerald-500';
        barClass = 'from-emerald-500 to-teal-500';
      } else if (cat === 'LISTENING') {
        colorClass = 'text-purple-500';
        barClass = 'from-purple-500 to-pink-500';
      } else if (cat === 'READING') {
        colorClass = 'text-amber-500';
        barClass = 'from-amber-500 to-orange-500';
      }
      
      return {
        code: cat,
        name: names[cat] || cat,
        completed,
        total,
        percent,
        colorClass,
        barClass
      };
    });
  });

  ngOnInit(): void {
    this.loadData();
    this.loadRealLeaderboard();
  }

  loadData(): void {
    this.isLoading.set(true);
    
    // 1. Fetch profile stats
    this.studyService.getProfile().subscribe({
      next: (profile) => {
        this.playerInfo.set(profile);
        this.updateLeaderboardStats(profile);
        this.checkLoadingState();
      },
      error: () => {
        this.playerInfo.set(null);
        this.checkLoadingState();
      }
    });

    // 2. Fetch character details
    this.characterService.getMyCharacter().subscribe({
      next: (char) => {
        this.character.set(char);
        if (char) {
          this.name = char.name;
          this.gender = char.gender || 'MALE';
          this.hairStyle = char.hairStyle || 'SHORT';
          this.hairColor = char.hairColor || 'BLACK';
          this.faceStyle = char.faceStyle || 'SMILEY';
          this.outfitStyle = char.outfitStyle || 'WARRIOR';
          
          if (this.gender === 'FEMALE' && this.outfitStyle === 'MAGE') this.avatarStyle = 'mage_female';
          else if (this.gender === 'MALE' && this.outfitStyle === 'ROGUE') this.avatarStyle = 'rogue_male';
          else if (this.gender === 'FEMALE' && this.outfitStyle === 'CASUAL') this.avatarStyle = 'casual_female';
          else this.avatarStyle = 'warrior_male';
 
          this.updateLeaderboardUser(char);
          this.checkLoadingState();
        } else {
          this.checkLoadingState();
        }
      },
      error: () => {
        this.character.set(null);
        this.checkLoadingState();
      }
    });

    // 3. Fetch roadmap level
    this.placementService.getRoadmap().subscribe({
      next: (rm) => {
        this.roadmap.set(rm);
        this.checkLoadingState();
      },
      error: () => {
        this.roadmap.set(null);
        this.checkLoadingState();
      }
    });
  }

  checkLoadingState(): void {
    this.isLoading.set(false);
  }

  loadRealLeaderboard(): void {
    this.isLoadingRealLeaderboard.set(true);
    this.http.get<any[]>(`${API_BASE_URL}/api/community/leaderboard`).subscribe({
      next: (data) => { this.realLeaderboard.set(data); this.isLoadingRealLeaderboard.set(false); },
      error: () => this.isLoadingRealLeaderboard.set(false)
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

  startEditing(): void {
    this.isEditing.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelEditing(): void {
    const char = this.character();
    if (char) {
      this.name = char.name;
      this.gender = char.gender || 'MALE';
      this.hairStyle = char.hairStyle || 'SHORT';
      this.hairColor = char.hairColor || 'BLACK';
      this.faceStyle = char.faceStyle || 'SMILEY';
      this.outfitStyle = char.outfitStyle || 'WARRIOR';
      
      if (this.gender === 'FEMALE' && this.outfitStyle === 'MAGE') this.avatarStyle = 'mage_female';
      else if (this.gender === 'MALE' && this.outfitStyle === 'ROGUE') this.avatarStyle = 'rogue_male';
      else if (this.gender === 'FEMALE' && this.outfitStyle === 'CASUAL') this.avatarStyle = 'casual_female';
      else this.avatarStyle = 'warrior_male';
 
      this.isEditing.set(false);
    } else {
      this.isEditing.set(false);
    }
  }

  onSave(): void {
    if (!this.name.trim()) {
      this.errorMessage.set('Vui lòng nhập tên nhân vật.');
      this.toastService.error('Vui lòng nhập tên nhân vật.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const isNewCharacter = !this.character();

    const characterData: Character = {
      name: this.name.trim(),
      gender: this.gender,
      hairStyle: this.hairStyle,
      hairColor: this.hairColor,
      faceStyle: this.faceStyle,
      outfitStyle: this.outfitStyle
    };

    this.characterService.saveCharacter(characterData).subscribe({
      next: (char) => {
        this.isSaving.set(false);
        this.character.set(char);
        this.updateLeaderboardUser(char);
        
        if (isNewCharacter) {
          this.toastService.success('Khởi tạo nhân vật thành công!');
          this.successMessage.set('Khởi tạo nhân vật thành công! Đang chuyển hướng sang bài kiểm tra đầu vào...');
          this.isEditing.set(false);
          
          setTimeout(() => {
            this.successMessage.set('');
            this.router.navigate(['/placement-test']);
          }, 2000);
        } else {
          this.toastService.success('Cập nhật hồ sơ thành công!');
          this.successMessage.set('Đã lưu diện mạo nhân vật thành công!');
          this.isEditing.set(false);
          
          setTimeout(() => {
            this.successMessage.set('');
          }, 3000);
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        const errMsg = err.error?.message || 'Không thể lưu nhân vật. Vui lòng thử lại.';
        this.errorMessage.set(errMsg);
        this.toastService.error(errMsg);
      }
    });
  }

  updateLeaderboardUser(char: Character | null): void {
    // No longer needed for mock; kept for potential future use
  }

  updateLeaderboardStats(profile: any): void {
    if (profile) {
      this.setupWeeklyActivityFromStreak(profile);
    }
  }

  setupWeeklyActivityFromStreak(profile: any): void {
    if (typeof window !== 'undefined') {
      const today = new Date().getDay(); // 0=Sun, 1=Mon,...
      const streak = profile?.streak || 0;
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const currentDayName = dayNames[today];
      // Mark as active today and back-fill streak days
      this.weeklyActivity.update(days => {
        return days.map((day, idx) => {
          // Mark today active; additionally mark previous 'streak-1' days if streak > 1
          if (day.name === currentDayName) return { ...day, active: true };
          // Calculate how many days ago this slot represents
          const dayOfWeekIndex = dayNames.indexOf(day.name);
          let daysAgo = (today - dayOfWeekIndex + 7) % 7;
          if (daysAgo === 0) daysAgo = 7;
          return { ...day, active: streak > daysAgo };
        });
      });
    }
  }

  // Helpers for learning progress calculation
  getCompletedModulesCount(): number {
    const rm = this.roadmap();
    if (!rm || !rm.modules) return 0;
    return rm.modules.filter((m: any) => m.status === 'COMPLETED').length;
  }

  getProgressPercentage(): number {
    const rm = this.roadmap();
    if (!rm || !rm.modules || rm.modules.length === 0) return 0;
    const completed = this.getCompletedModulesCount();
    return Math.round((completed / rm.modules.length) * 100);
  }

  openChangePasswordModal(): void {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.changePasswordError.set('');
    this.isChangePasswordModalOpen.set(true);
  }

  closeChangePasswordModal(): void {
    this.isChangePasswordModalOpen.set(false);
  }

  onChangePasswordSubmit(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.changePasswordError.set('Mật khẩu mới không trùng khớp!');
      return;
    }
    if (this.newPassword.length < 6) {
      this.changePasswordError.set('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    this.isChangingPassword.set(true);
    this.changePasswordError.set('');

    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.isChangePasswordModalOpen.set(false);
        this.toastService.success('Đổi mật khẩu thành công!');
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        const errMsg = err.error?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
        this.changePasswordError.set(errMsg);
      }
    });
  }

  get userEmail(): string {
    return this.authService.getUser()?.email || 'N/A';
  }
}
