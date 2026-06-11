import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CharacterService, Character } from '../../services/character.service';
import { StudyService } from '../../services/study.service';
import { PlacementTestService } from '../../services/placement-test.service';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar';

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
              class="bg-bg-card border border-border-main hover:bg-bg-input px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-text-muted hover:text-text-main"
            >
              &larr; Về trang chủ
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
                        <span class="bg-brand-secondary/15 text-brand-secondary text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border border-brand-secondary/20">
                          ⚔️ {{ character()?.title || 'Novice' }} ⚔️
                        </span>
                        <h2 class="text-xl font-black text-text-main mt-2 truncate">{{ character()?.name || 'Học viên chưa tạo tên' }}</h2>
                        <p class="text-xs text-text-muted mt-0.5">{{ userEmail }}</p>
                      </div>

                      <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span class="bg-bg-input px-2.5 py-1 rounded-lg text-xxs font-bold text-text-main">
                          Trình độ: {{ roadmap()?.cefrLevel || 'A1' }}
                        </span>
                        <span class="bg-bg-input px-2.5 py-1 rounded-lg text-xxs font-bold text-orange-500">
                          🔥 Streak: {{ playerInfo()?.streak || 0 }} Ngày
                        </span>
                        <span class="bg-bg-input px-2.5 py-1 rounded-lg text-xxs font-bold text-yellow-500">
                          🪙 Vàng: {{ playerInfo()?.coins || 0 }} xu
                        </span>
                      </div>

                      <button
                        (click)="startEditing()"
                        class="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 mx-auto sm:mx-0 shadow-sm"
                      >
                        ✏️ Chỉnh sửa hồ sơ & diện mạo
                      </button>
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
                    <h3 class="text-sm font-black text-text-main uppercase tracking-wider mb-4 border-b border-border-main/40 pb-2">
                      ✏️ Cập Nhật Diện Mạo Nhân Vật
                    </h3>

                    <!-- Messages -->
                    @if (errorMessage()) {
                      <div class="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4">
                        <span>⚠️ {{ errorMessage() }}</span>
                      </div>
                    }
                    @if (successMessage()) {
                      <div class="bg-green-500/10 border border-green-500/20 text-green-500 text-xs p-3 rounded-xl mb-4">
                        <span>✓ {{ successMessage() }}</span>
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
                          <span>Lưu thay đổi 💾</span>
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
                <h3 class="text-sm font-black text-text-main uppercase tracking-wider mb-4 border-b border-border-main/40 pb-2">
                  📈 Lộ Trình & Tiến Độ Học Tập AI
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

                    <!-- Compact Modules progress list -->
                    <div class="space-y-2">
                      <h4 class="text-xxs font-black text-text-muted uppercase tracking-wider mb-2.5">Danh sách chương học:</h4>
                      
                      @for (mod of roadmap()?.modules; track mod.id) {
                        <div
                          class="flex items-center justify-between p-2.5 bg-bg-input/20 border border-border-main/30 rounded-xl text-xxs group hover:border-brand-primary/30 transition-colors"
                        >
                          <div class="flex items-center gap-2.5 min-w-0">
                            <!-- Status Indicator Icon -->
                            @if (mod.status === 'COMPLETED') {
                              <span class="w-5 h-5 flex items-center justify-center rounded-full bg-green-500/20 text-green-500 font-bold">✓</span>
                            } @else if (mod.status === 'IN_PROGRESS') {
                              <span class="w-5 h-5 flex items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary font-bold animate-pulse">▶</span>
                            } @else {
                              <span class="w-5 h-5 flex items-center justify-center rounded-full bg-bg-input text-text-muted font-semibold text-[8px]">🔒</span>
                            }
                            
                            <div class="min-w-0">
                              <p class="font-extrabold text-text-main truncate">Chương {{ mod.orderIndex }}: {{ mod.title }}</p>
                              <p class="text-[9px] text-text-muted truncate mt-0.5">{{ mod.description }}</p>
                            </div>
                          </div>
                          
                          <span
                            [class.text-green-500]="mod.status === 'COMPLETED'"
                            [class.text-brand-primary]="mod.status === 'IN_PROGRESS'"
                            [class.text-text-muted]="mod.status === 'LOCKED'"
                            class="font-black text-[9px] uppercase tracking-wider shrink-0 bg-bg-input/40 px-2 py-0.5 rounded border border-border-main/40"
                          >
                            {{ mod.status === 'COMPLETED' ? 'Đã xong' : mod.status === 'IN_PROGRESS' ? 'Đang học' : 'Khóa' }}
                          </span>
                        </div>
                      }
                    </div>
                  </div>
                } @else {
                  <div class="text-center py-10 text-text-muted text-xxs space-y-2">
                    <span class="text-3xl">📝</span>
                    <p>Bạn chưa khởi tạo lộ trình học tập. Vui lòng hoàn thành bài đánh giá đầu vào.</p>
                    <a routerLink="/placement-test" class="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl mt-2 inline-block">Làm bài Placement Test</a>
                  </div>
                }
              </div>

            </div>

            <!-- RIGHT COLUMN: Weekly Activity Heatmap & Leaderboard (5 cols) -->
            <div class="lg:col-span-5 flex flex-col gap-6">
              
              <!-- Weekly activity heatmap -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-xl rounded-2xl p-4">
                <div class="flex justify-between items-center border-b border-border-main/40 pb-2 mb-3">
                  <h4 class="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tần suất học tuần này 📅</h4>
                  <span class="text-[9px] text-brand-primary font-bold">Lịch sử chuyên cần</span>
                </div>
                
                <div class="grid grid-cols-7 gap-1.5 text-center text-[10px]">
                  @for (day of mockWeeklyActivity; track day.name) {
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
                        @if (day.active) { ✓ } @else { - }
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Leaderboard panel -->
              <div class="backdrop-blur-xl bg-bg-card border border-border-main shadow-xl rounded-2xl p-4 flex-1">
                <div class="flex justify-between items-center border-b border-border-main/40 pb-2 mb-3">
                  <h4 class="text-[10px] font-bold text-text-muted uppercase tracking-widest">Đua Top Anh Hùng 🏆</h4>
                  <span class="text-[9px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded font-extrabold uppercase">Silver League</span>
                </div>
                
                <div class="space-y-2">
                  @for (user of mockLeaderboard; track user.rank) {
                    <div
                      class="flex items-center justify-between p-2 rounded-xl transition-colors border text-xxs"
                      [class.bg-brand-primary/5]="user.isUser"
                      [class.border-brand-primary/30]="user.isUser"
                      [class.border-transparent]="!user.isUser"
                    >
                      <div class="flex items-center gap-2.5">
                        <span
                          class="w-5 h-5 flex items-center justify-center rounded-full font-black text-[9px]"
                          [class.bg-yellow-500/20]="user.rank === 1"
                          [class.text-yellow-500]="user.rank === 1"
                          [class.bg-slate-400/20]="user.rank === 2"
                          [class.text-slate-400]="user.rank === 2"
                          [class.bg-amber-700/20]="user.rank === 3"
                          [class.text-amber-700]="user.rank === 3"
                          [class.text-text-muted]="user.rank > 3"
                        >
                          {{ user.rank }}
                        </span>
                        <span class="text-base shrink-0">{{ user.avatar }}</span>
                        <span class="font-extrabold truncate max-w-[100px] text-text-main" [class.text-brand-primary]="user.isUser">
                          {{ user.name }} {{ user.isUser ? '(Bạn)' : '' }}
                        </span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <span class="bg-bg-input px-2 py-0.5 rounded text-[8px] font-bold text-text-muted">Lv.{{ user.level }}</span>
                        <span class="font-bold text-text-main">{{ user.exp }} EXP</span>
                      </div>
                    </div>
                  }
                </div>
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
  private readonly router = inject(Router);

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
  isEditing = signal(false); // view mode by default

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
    { id: 'WARRIOR', label: 'Chiến binh', desc: 'Giáp sắt' },
    { id: 'MAGE', label: 'Pháp sư', desc: 'Áo choàng' },
    { id: 'ROGUE', label: 'Sát thủ', desc: 'Đồ da' },
    { id: 'CASUAL', label: 'Thường dân', desc: 'Áo thun' }
  ];

  // Mock structures
  mockWeeklyActivity = [
    { name: 'T2', active: true },
    { name: 'T3', active: true },
    { name: 'T4', active: false },
    { name: 'T5', active: true },
    { name: 'T6', active: false },
    { name: 'T7', active: true },
    { name: 'CN', active: false }
  ];

  mockLeaderboard = [
    { rank: 1, name: 'Arthur Pendragon', avatar: '🧙‍♂️', level: 42, exp: 4200, isUser: false },
    { rank: 2, name: 'Hermione Granger', avatar: '🧝‍♀️', level: 38, exp: 3850, isUser: false },
    { rank: 3, name: 'Người Hùng', avatar: '🛡️', level: 1, exp: 0, isUser: true },
    { rank: 4, name: 'Tony Stark', avatar: '🦾', level: 25, exp: 2560, isUser: false },
    { rank: 5, name: 'Bob Ross', avatar: '🎨', level: 12, exp: 1200, isUser: false }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    
    // 1. Fetch profile stats
    this.studyService.getProfile().subscribe({
      next: (profile) => {
        this.playerInfo.set(profile);
        this.updateLeaderboardStats(profile);
        this.setupWeeklyActivityToday(profile);
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
          this.successMessage.set('Khởi tạo nhân vật thành công! Đang chuyển hướng sang bài kiểm tra đầu vào...');
          this.isEditing.set(false);
          
          setTimeout(() => {
            this.successMessage.set('');
            this.router.navigate(['/placement-test']);
          }, 2000);
        } else {
          this.successMessage.set('Đã lưu diện mạo nhân vật thành công!');
          this.isEditing.set(false);
          
          setTimeout(() => {
            this.successMessage.set('');
          }, 3000);
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message || 'Không thể lưu nhân vật. Vui lòng thử lại.');
      }
    });
  }

  updateLeaderboardUser(char: Character | null): void {
    if (char) {
      const userRank = this.mockLeaderboard.find(u => u.isUser);
      if (userRank) {
        userRank.name = char.name;
        userRank.avatar = char.gender === 'FEMALE' ? '👧' : '👦';
      }
    }
  }

  updateLeaderboardStats(profile: any): void {
    if (profile) {
      const userRank = this.mockLeaderboard.find(u => u.isUser);
      if (userRank) {
        userRank.level = profile.level || 1;
        userRank.exp = profile.exp || 0;
      }
      this.mockLeaderboard.sort((a, b) => b.exp - a.exp);
      this.mockLeaderboard.forEach((user, index) => {
        user.rank = index + 1;
      });
    }
  }

  setupWeeklyActivityToday(profile: any): void {
    if (typeof window !== 'undefined') {
      const today = new Date().getDay();
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const currentDayName = dayNames[today];

      this.mockWeeklyActivity = this.mockWeeklyActivity.map(day => {
        if (day.name === currentDayName) {
          return { ...day, active: true };
        }
        return day;
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

  get userEmail(): string {
    return this.authService.getUser()?.email || 'N/A';
  }
}
