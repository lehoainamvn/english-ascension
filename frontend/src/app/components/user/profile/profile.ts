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
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <!-- Main container -->
      <div class="max-w-7xl mx-auto relative z-10 space-y-6">
        
        <div class="border-b border-border-main pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-black tracking-tight text-text-main">
              {{ character() ? 'HỒ SƠ CÁ NHÂN & TIẾN ĐỘ' : 'KHỞI TẠO NHÂN VẬT RPG MỚI' }}
            </h1>
            <p class="text-xs text-text-muted mt-1">
              {{ character() ? 'Quản lý diện mạo, theo dõi các chỉ số và tiến trình học tập của bạn.' : 'Thiết kế diện mạo đại diện độc quyền của bạn để bắt đầu hành trình học tiếng Anh.' }}
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
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT COLUMN: Profile info / Customizer & Learning Progress (7 cols) -->
            <div class="lg:col-span-7 flex flex-col gap-6">
              
              <!-- PROFILE VIEW OR EDIT CARD -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-xl rounded-2xl p-6 relative overflow-hidden transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none"></div>

                @if (!isEditing()) {
                  <!-- ========================================== -->
                  <!-- VIEW MODE                                  -->
                  <!-- ========================================== -->
                  <div class="flex flex-col sm:flex-row items-center gap-6">
                    <!-- Left: Avatar Preview -->
                    <div class="relative w-36 h-36 flex items-center justify-center bg-bg-input rounded-xl border border-border-main/50 p-2 shrink-0">
                      <app-character-avatar [character]="character()" class="w-full h-full drop-shadow-xl" />
                    </div>

                    <!-- Right: Info Summary -->
                    <div class="flex-1 text-center sm:text-left space-y-3">
                      <div>
                        <span class="bg-brand-secondary/15 text-brand-secondary text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border border-brand-secondary/20 flex items-center gap-1 w-fit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="m2 22 7.5-7.5"/><path d="M17.5 2.5 22 7l-1 1-4.5-4.5"/></svg>
                          {{ character()?.title || 'Novice' }}
                          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="m2 22 7.5-7.5"/><path d="M17.5 2.5 22 7l-1 1-4.5-4.5"/></svg>
                        </span>
                        <h2 class="text-xl font-black text-text-main mt-2 truncate">{{ character()?.name || 'Học viên chưa tạo tên' }}</h2>
                        <p class="text-xs text-text-muted mt-0.5">{{ userEmail }}</p>
                      </div>

                      <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span class="bg-bg-input px-2.5 py-1 rounded-lg text-xxs font-bold text-text-main flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                          {{ roadmap()?.cefrLevel || 'A1' }}
                        </span>
                        <span class="bg-bg-input px-2.5 py-1 rounded-lg text-xxs font-bold text-orange-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                          Streak: {{ playerInfo()?.streak || 0 }} ngày
                        </span>
                        <span class="bg-bg-input px-2.5 py-1 rounded-lg text-xxs font-bold text-yellow-500 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="14.5" y1="12" y2="12"/></svg>
                          Xu: {{ playerInfo()?.coins || 0 }}
                        </span>
                      </div>

                      <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <button
                          (click)="startEditing()"
                          class="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 mx-auto sm:mx-0 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Chỉnh sửa hồ sơ & diện mạo
                        </button>
                        <button
                          (click)="openChangePasswordModal()"
                          class="bg-bg-input border border-border-main text-text-muted hover:text-text-main hover:bg-bg-card px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 mx-auto sm:mx-0 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></svg>
                          Đổi mật khẩu
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Exp bar in View Mode -->
                  <div class="w-full space-y-1.5 text-xs mt-6 pt-4 border-t border-border-main/40">
                    <div class="flex justify-between items-center font-bold text-[10px]">
                      <span>Tiến độ cấp độ (Cấp {{ playerInfo()?.level || 1 }})</span>
                      <span class="text-text-muted">{{ playerInfo()?.exp || 0 }} / {{ (playerInfo()?.level || 1) * 100 }} EXP</span>
                    </div>
                    <div class="w-full h-2.5 bg-bg-input rounded-full overflow-hidden border border-border-main/40 p-0.5">
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
                    <h3 class="text-sm font-black text-text-main uppercase tracking-wider mb-4 border-b border-border-main/40 pb-2 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-cog text-brand-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><circle cx="19" cy="8" r="1"/><circle cx="20" cy="12" r="1"/><circle cx="17" cy="14" r="1"/><path d="M16 11h.01"/><path d="M18 10h.01"/></svg>
                      Cập Nhật Diện Mạo Nhân Vật
                    </h3>

                    <!-- Messages -->
                    @if (errorMessage()) {
                      <div class="mb-4 bg-rose-500/10 border border-border-main border-l-4 border-l-rose-500 text-rose-600 dark:text-rose-200 text-xs p-3.5 rounded-xl flex items-center gap-2.5 font-bold animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-rose-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                        <span>{{ errorMessage() }}</span>
                      </div>
                    }
                    @if (successMessage()) {
                      <div class="mb-4 bg-emerald-500/10 border border-border-main border-l-4 border-l-emerald-500 text-emerald-600 dark:text-emerald-200 text-xs p-3.5 rounded-xl flex items-center gap-2.5 font-bold animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-500 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 15.01 9 12.01"/></svg>
                        <span>{{ successMessage() }}</span>
                      </div>
                    }

                    <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                      
                      <!-- Preview Column -->
                      <div class="sm:col-span-5 flex flex-col items-center">
                        <div class="w-full bg-bg-input border border-border-main rounded-xl p-4 flex flex-col items-center text-center">
                          <span class="bg-brand-secondary/15 text-brand-secondary text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest mb-3">
                            Xem Trước
                          </span>
                          
                          <div class="relative w-40 h-40 flex items-center justify-center bg-bg-card rounded-xl border border-border-main shadow-inner p-3 mb-3">
                            <app-character-avatar [character]="getCharacterPreviewObject()" class="w-full h-full drop-shadow-xl" />
                          </div>

                          <h4 class="text-base font-extrabold text-text-main truncate w-full px-2 min-h-[1.5rem]">
                            {{ name.trim() || 'Vô Danh' }}
                          </h4>
                          <p class="text-[9px] text-text-muted font-bold tracking-widest uppercase mt-0.5">Cấp độ {{ playerInfo()?.level || 1 }}</p>
                        </div>
                      </div>

                      <!-- Control Fields Column -->
                      <div class="sm:col-span-7 space-y-3.5">
                        <!-- Tên nhân vật -->
                        <div>
                          <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Tên nhân vật</label>
                          <input
                            type="text"
                            [(ngModel)]="name"
                            placeholder="Nhập tên người hùng..."
                            maxlength="20"
                            class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                          />
                        </div>

                        <!-- Giới tính -->
                        <div>
                          <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Giới tính</label>
                          <div class="grid grid-cols-2 gap-2">
                            @for (g of genders; track g.id) {
                              <button
                                (click)="gender = g.id"
                                [class.border-brand-primary]="gender === g.id"
                                [class.bg-brand-primary/5]="gender === g.id"
                                class="bg-bg-input border border-border-main hover:border-brand-primary/50 rounded-xl py-1.5 px-3 text-xs font-bold transition-all cursor-pointer"
                              >
                                {{ g.label }}
                              </button>
                            }
                          </div>
                        </div>

                        <!-- Kiểu tóc -->
                        <div>
                          <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Kiểu tóc</label>
                          <div class="grid grid-cols-3 gap-1">
                            @for (h of hairStyles; track h.id) {
                              <button
                                (click)="hairStyle = h.id"
                                [class.border-brand-primary]="hairStyle === h.id"
                                [class.bg-brand-primary/5]="hairStyle === h.id"
                                class="bg-bg-input border border-border-main rounded-lg py-1 px-0.5 text-[10px] font-bold transition-all cursor-pointer truncate"
                                [title]="h.label"
                              >
                                {{ h.label }}
                              </button>
                            }
                          </div>
                        </div>

                        <!-- Màu tóc -->
                        <div>
                          <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Màu tóc</label>
                          <div class="flex items-center gap-2">
                            @for (c of hairColors; track c.id) {
                              <button
                                (click)="hairColor = c.id"
                                [style.backgroundColor]="c.hex"
                                [class.ring-2]="hairColor === c.id"
                                [class.ring-offset-2]="hairColor === c.id"
                                [class.ring-brand-primary]="hairColor === c.id"
                                class="w-6 h-6 rounded-full border border-white/20 transition-all cursor-pointer relative"
                                [title]="c.label"
                              >
                                @if (hairColor === c.id) {
                                  <span class="absolute inset-0 flex items-center justify-center text-white text-[8px]">✓</span>
                                }
                              </button>
                            }
                          </div>
                        </div>

                        <!-- Gương mặt -->
                        <div>
                          <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Biểu cảm gương mặt</label>
                          <div class="grid grid-cols-2 gap-1">
                            @for (f of faceStyles; track f.id) {
                              <button
                                (click)="faceStyle = f.id"
                                [class.border-brand-primary]="faceStyle === f.id"
                                [class.bg-brand-primary/5]="faceStyle === f.id"
                                class="bg-bg-input border border-border-main rounded-xl py-1 px-2 text-[10px] font-bold transition-all cursor-pointer"
                              >
                                {{ f.label }}
                              </button>
                            }
                          </div>
                        </div>

                        <!-- Trang phục -->
                        <div>
                          <label class="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Trang phục (Outfit)</label>
                          <div class="grid grid-cols-2 gap-1.5">
                            @for (o of outfits; track o.id) {
                              <button
                                (click)="outfitStyle = o.id"
                                [class.border-brand-primary]="outfitStyle === o.id"
                                [class.bg-brand-primary/5]="outfitStyle === o.id"
                                class="bg-bg-input border border-border-main rounded-xl p-1.5 flex flex-col transition-all cursor-pointer text-left"
                              >
                                <span class="font-bold text-[10px] text-text-main">{{ o.label }}</span>
                                <span class="text-[8px] text-text-muted">{{ o.desc }}</span>
                              </button>
                            }
                          </div>
                        </div>
                      </div>

                    </div>

                    <!-- Edit Actions -->
                    <div class="flex gap-3 pt-4 border-t border-border-main/50 mt-6 text-xs font-bold">
                      <button
                        (click)="onSave()"
                        [disabled]="isSaving() || !name.trim()"
                        class="flex-1 bg-brand-primary hover:bg-brand-secondary text-white py-2 rounded-xl active:scale-98 transition-all disabled:opacity-50"
                      >
                        @if (isSaving()) {
                          <span>Đang lưu...</span>
                        } @else {
                          <span class="flex items-center justify-center gap-1.5">
                            Lưu thay đổi
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                          </span>
                        }
                      </button>
                      @if (character()) {
                        <button
                          (click)="cancelEditing()"
                          [disabled]="isSaving()"
                          class="flex-1 bg-bg-input border border-border-main text-text-muted py-2 rounded-xl hover:bg-bg-card transition-all"
                        >
                          Hủy bỏ
                        </button>
                      }
                    </div>
                  </div>
                }

              </div>

              <!-- ==================================================================== -->
              <!-- TIẾN ĐỘ HỌC TẬP (LEARNING PROGRESS SECTION)                          -->
              <!-- ==================================================================== -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-xl rounded-2xl p-6 relative overflow-hidden transition-all duration-300">
                <h3 class="text-sm font-black text-text-main uppercase tracking-wider mb-4 border-b border-border-main/40 pb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-primary"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Lộ Trình & Tiến Độ Học Tập AI
                </h3>

                @if (roadmap()) {
                  <div class="space-y-5">
                    <!-- Progress summary box -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-bg-input/20 border border-border-main/40 p-4 rounded-xl text-xxs font-bold">
                      <div>
                        <p class="text-text-muted uppercase text-[8px] tracking-wider">Trình độ đánh giá đầu vào</p>
                        <p class="text-base text-brand-primary font-black mt-1">CEFR {{ roadmap()?.cefrLevel }}</p>
                        <p class="text-[10px] text-text-muted font-normal mt-0.5">Tương đương TOEIC: {{ roadmap()?.toeicEquivalent }}</p>
                      </div>

                      <div class="flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-border-main/50 pt-3 sm:pt-0 sm:pl-4">
                        <div class="flex justify-between items-center text-[10px] mb-1.5">
                          <span class="text-text-muted">TIẾN TRÌNH LỘ TRÌNH</span>
                          <span class="text-brand-secondary">{{ getProgressPercentage() }}%</span>
                        </div>
                        <div class="w-full h-2 bg-bg-input rounded-full overflow-hidden border border-border-main/30 p-0.5">
                          <div
                            [style.width.%]="getProgressPercentage()"
                            class="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500"
                          ></div>
                        </div>
                        <p class="text-[9px] text-text-muted font-normal mt-1">Hoàn thành {{ getCompletedModulesCount() }}/{{ roadmap()?.modules?.length || 0 }} Chương học</p>
                      </div>
                    </div>

                    <!-- AI overall comment -->
                    <div class="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-3.5 text-xxs leading-relaxed">
                      <h4 class="font-extrabold text-brand-primary uppercase text-[9px] mb-1">Đánh giá chung của AI Mentor:</h4>
                      <p class="text-text-muted text-xs italic">"{{ roadmap()?.overallEvaluation }}"</p>
                    </div>

                    <!-- Detailed skill breakdown -->
                    <div class="space-y-2">
                      <h4 class="text-xxs font-black text-text-muted uppercase tracking-wider mb-1">Chi tiết Tiến Độ Kỹ Năng:</h4>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        @for (stat of categoryStats(); track stat.code) {
                          <div class="bg-bg-input/20 border border-border-main/30 rounded-xl p-3 flex flex-col justify-between space-y-2 shadow-sm">
                            <div class="flex justify-between items-start">
                              <span class="font-black text-[10px] text-text-main">{{ stat.name }}</span>
                              @if (stat.code === 'VOCABULARY') {
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-blue-500 shrink-0"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                              } @else if (stat.code === 'GRAMMAR') {
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-500 shrink-0"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                              } @else if (stat.code === 'LISTENING') {
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-purple-500 shrink-0"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z"/></svg>
                              } @else if (stat.code === 'READING') {
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-amber-500 shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                              }
                            </div>
                            
                            <div class="space-y-1">
                              <div class="flex justify-between items-center text-[9px] font-bold">
                                <span class="text-text-muted">{{ stat.completed }}/{{ stat.total }} bài</span>
                                <span class="font-black" [class]="stat.colorClass">{{ stat.percent }}%</span>
                              </div>
                              <div class="w-full h-1.5 bg-bg-input rounded-full overflow-hidden border border-border-main/20 p-[1px]">
                                <div
                                  [style.width.%]="stat.percent"
                                  class="h-full bg-gradient-to-r rounded-full transition-all duration-500"
                                  [class]="stat.barClass"
                                ></div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Compact Modules progress list with scroll -->
                    <div class="space-y-2">
                      <h4 class="text-xxs font-black text-text-muted uppercase tracking-wider mb-2.5">Danh sách chương học (Bấm vào để học/ôn tập):</h4>
                      
                      <div class="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        @for (mod of roadmap()?.modules; track mod.id) {
                          <div
                            [routerLink]="mod.status !== 'LOCKED' ? ['/study', mod.id] : null"
                            [class.cursor-pointer]="mod.status !== 'LOCKED'"
                            [class.hover:border-brand-primary/40]="mod.status !== 'LOCKED'"
                            [class.hover:bg-bg-input/30]="mod.status !== 'LOCKED'"
                            [class.hover:shadow-sm]="mod.status !== 'LOCKED'"
                            [class.opacity-60]="mod.status === 'LOCKED'"
                            class="flex items-center justify-between p-2.5 bg-bg-input/20 border border-border-main/30 rounded-xl text-xxs group transition-all duration-200"
                          >
                            <div class="flex items-center gap-2.5 min-w-0">
                              <!-- Status Indicator Icon -->
                              @if (mod.status === 'COMPLETED') {
                                <span class="w-5 h-5 flex items-center justify-center rounded-full bg-green-500/20 text-green-500 font-bold shrink-0">✓</span>
                              } @else if (mod.status === 'IN_PROGRESS') {
                                <span class="w-5 h-5 flex items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary font-bold animate-pulse shrink-0">▶</span>
                              } @else {
                                <span class="w-5 h-5 flex items-center justify-center rounded-full bg-bg-input text-text-muted font-semibold text-[8px] shrink-0">🔒</span>
                              }
                              
                              <div class="min-w-0">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                  <p class="font-extrabold text-text-main truncate">Chương {{ mod.orderIndex }}: {{ mod.title }}</p>
                                  <span 
                                    class="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 scale-90"
                                    [class.bg-blue-500/10]="mod.category === 'VOCABULARY'"
                                    [class.text-blue-500]="mod.category === 'VOCABULARY'"
                                    [class.border-blue-500/20]="mod.category === 'VOCABULARY'"
                                    [class.bg-emerald-500/10]="mod.category === 'GRAMMAR'"
                                    [class.text-emerald-500]="mod.category === 'GRAMMAR'"
                                    [class.border-emerald-500/20]="mod.category === 'GRAMMAR'"
                                    [class.bg-purple-500/10]="mod.category === 'LISTENING'"
                                    [class.text-purple-500]="mod.category === 'LISTENING'"
                                    [class.border-purple-500/20]="mod.category === 'LISTENING'"
                                    [class.bg-amber-500/10]="mod.category === 'READING'"
                                    [class.text-amber-500]="mod.category === 'READING'"
                                    [class.border-amber-500/20]="mod.category === 'READING'"
                                  >
                                    {{ mod.category === 'VOCABULARY' ? 'Từ vựng' : mod.category === 'GRAMMAR' ? 'Ngữ pháp' : mod.category === 'LISTENING' ? 'Nghe hiểu' : 'Đọc hiểu' }}
                                  </span>
                                </div>
                                <p class="text-[9px] text-text-muted truncate mt-0.5">{{ mod.description }}</p>
                              </div>
                            </div>
                            
                            <div class="flex items-center gap-1.5 shrink-0">
                              <span
                                [class.text-green-500]="mod.status === 'COMPLETED'"
                                [class.text-brand-primary]="mod.status === 'IN_PROGRESS'"
                                [class.text-text-muted]="mod.status === 'LOCKED'"
                                class="font-black text-[9px] uppercase tracking-wider bg-bg-input/40 px-2 py-0.5 rounded border border-border-main/40"
                              >
                                {{ mod.status === 'COMPLETED' ? 'Đã xong' : mod.status === 'IN_PROGRESS' ? 'Đang học' : 'Khóa' }}
                              </span>
                              @if (mod.status !== 'LOCKED') {
                                <span class="text-brand-primary text-xs font-black group-hover:translate-x-0.5 transition-transform duration-200">
                                  &rarr;
                                </span>
                              }
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="text-center py-10 text-text-muted text-xxs space-y-3 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="opacity-30"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <p>Bạn chưa khởi tạo lộ trình học tập. Vui lòng hoàn thành bài đánh giá đầu vào.</p>
                    <a routerLink="/placement-test" class="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl mt-2 inline-flex items-center gap-1.5">Làm bài Placement Test</a>
                  </div>
                }
              </div>

            </div>

            <!-- RIGHT COLUMN: Weekly Activity Heatmap & Leaderboard (5 cols) -->
            <div class="lg:col-span-5 flex flex-col gap-6">
              
              <!-- Weekly activity heatmap -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-xl rounded-2xl p-4">
                <div class="flex justify-between items-center border-b border-border-main/40 pb-2 mb-3">
                  <h4 class="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    Hoạt động học tuần này
                  </h4>
                  <span class="text-[9px] text-brand-primary font-bold">Lịch sử chuyên cần</span>
                </div>
                
                <div class="grid grid-cols-7 gap-1.5 text-center text-[10px]">
                  @for (day of weeklyActivity(); track day.name) {
                    <div class="flex flex-col items-center gap-1">
                      <span class="text-text-muted font-semibold text-[8px] uppercase">{{ day.name }}</span>
                      <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-all"
                        [class.bg-green-500/20]="day.active"
                        [class.border-green-500/40]="day.active"
                        [class.text-green-500]="day.active"
                        [class.bg-bg-input]="!day.active"
                        [class.border-border-main/50]="!day.active"
                        [class.text-text-muted]="!day.active"
                        [title]="day.active ? 'Học viên chăm chỉ!' : 'Chưa học'"
                      >
                        @if (day.active) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        } @else {
                          <span class="text-[9px]">-</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Leaderboard panel (Real data) -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-xl rounded-2xl p-4 flex-1">
                <div class="flex justify-between items-center border-b border-border-main/40 pb-2 mb-3">
                  <h4 class="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    Bảng Xếp Hạng EXP
                  </h4>
                  <span class="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded font-extrabold uppercase">Top Anh Hùng</span>
                </div>
                
                @if (isLoadingRealLeaderboard()) {
                  <div class="flex justify-center py-6">
                    <svg class="animate-spin h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  </div>
                } @else {
                  <div class="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                    @for (entry of realLeaderboard().slice(0, 5); track entry.rank) {
                      <div
                        class="flex items-center justify-between p-2 rounded-xl transition-colors border text-xxs"
                        [class.bg-brand-primary/5]="entry.email === userEmail"
                        [class.border-brand-primary/30]="entry.email === userEmail"
                        [class.border-transparent]="entry.email !== userEmail"
                      >
                        <div class="flex items-center gap-2">
                          <span
                            class="w-5 h-5 flex items-center justify-center rounded-full font-black text-[9px] shrink-0"
                            [class.bg-yellow-500]="entry.rank === 1"
                            [class.text-white]="entry.rank === 1"
                            [class.bg-slate-400/30]="entry.rank === 2"
                            [class.text-slate-400]="entry.rank === 2"
                            [class.bg-amber-700/20]="entry.rank === 3"
                            [class.text-amber-600]="entry.rank === 3"
                            [class.bg-bg-input]="entry.rank > 3"
                            [class.text-text-muted]="entry.rank > 3"
                          >
                            {{ entry.rank }}
                          </span>
                          <div class="min-w-0">
                            <span class="font-extrabold truncate max-w-[110px] text-text-main block" [class.text-brand-primary]="entry.email === userEmail">
                              {{ entry.name }} @if (entry.email === userEmail) { <span class="text-brand-primary text-[8px]">(Bạn)</span> }
                            </span>
                            <span class="text-[8px] text-text-muted">Lv.{{ entry.level }}</span>
                          </div>
                        </div>
                        <span class="font-black text-[10px] text-text-main shrink-0">{{ entry.exp }} EXP</span>
                      </div>
                    }
                    @if (realLeaderboard().length === 0) {
                      <div class="text-center py-6 text-text-muted text-[10px]">Chưa có dữ liệu xếp hạng</div>
                    }
                  </div>
                }
              </div>

            </div>

          </div>
        }

        <!-- Change Password Modal -->
        @if (isChangePasswordModalOpen()) {
          <div 
            (click)="closeChangePasswordModal()"
            class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          >
            <div 
              (click)="$event.stopPropagation()"
              class="w-full max-w-sm bg-bg-card border border-border-main rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-left relative z-50 animate-fade-in text-xxs font-bold"
            >
              <div class="flex justify-between items-center border-b border-border-main/40 pb-3">
                <h3 class="text-xs font-black text-text-main uppercase tracking-wider flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock text-brand-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
                    placeholder="Nhập mật khẩu cũ..."
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                  />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    [(ngModel)]="newPassword"
                    placeholder="Nhập mật khẩu mới..."
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                  />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    [(ngModel)]="confirmPassword"
                    placeholder="Nhập lại mật khẩu mới..."
                    class="w-full bg-bg-input border border-border-main rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold"
                  />
                </div>
              </div>

              @if (changePasswordError()) {
                <div class="bg-rose-500/10 border border-border-main border-l-4 border-l-rose-500 text-rose-600 dark:text-rose-200 text-[10px] p-2.5 rounded-xl flex items-center gap-2 font-bold animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-rose-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  <span>{{ changePasswordError() }}</span>
                </div>
              }

              <!-- Actions -->
              <div class="flex gap-2.5 pt-2 border-t border-border-main/40 font-bold text-xs">
                <button
                  (click)="onChangePasswordSubmit()"
                  [disabled]="isChangingPassword() || !oldPassword || !newPassword || !confirmPassword"
                  class="flex-1 bg-brand-primary hover:bg-brand-secondary text-white py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-98"
                >
                  @if (isChangingPassword()) {
                    Đang xử lý...
                  } @else {
                    Lưu mật khẩu
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 15.01 9 12.01"/></svg>
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

  // State Signals
  character = signal<Character | null>(null);
  roadmap = signal<any>(null);
  playerInfo = signal<any>(null);
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
          this.updateLeaderboardUser(char);
          this.checkLoadingState();
        } else {
          this.router.navigate(['/character-customization']);
        }
      },
      error: () => {
        this.character.set(null);
        this.router.navigate(['/character-customization']);
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
      this.isEditing.set(false);
    } else {
      // If no character exists yet, they can't cancel out of creation
      this.errorMessage.set('Vui lòng hoàn tất khởi tạo nhân vật.');
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
          // Mark today active; additionally mark previous `streak-1` days if streak > 1
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
