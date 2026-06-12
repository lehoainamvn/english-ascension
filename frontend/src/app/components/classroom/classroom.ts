import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import {
  ClassroomService,
  ClassRoomSummary,
  ClassRoomDetails,
  ClassQuizDto,
  ClassQuizQuestionDto,
  LeaderboardEntry
} from '../../services/classroom.service';

type ClassTab = 'members' | 'quizzes' | 'leaderboard';
type QuizModalMode = 'create' | 'edit';

interface QuizFormQuestion {
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK';
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}

@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-4 md:p-6 relative overflow-hidden">
      <!-- Decorative Glows -->
      <div class="absolute top-0 left-1/3 w-96 h-96 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/8 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Page Header -->
      <div class="max-w-7xl mx-auto mb-6 relative z-10">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span class="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2.5 py-0.5 rounded-full">Learning Together</span>
            <h1 class="text-2xl font-black text-text-main mt-1">Lớp Học Thử Thách</h1>
            <p class="text-xs text-text-muted mt-0.5">Tạo lớp học, mời thành viên và tổ chức thi đua bảng xếp hạng</p>
          </div>
          <div class="flex gap-2">
            <button (click)="openJoinModal()" class="px-4 py-2 bg-bg-card border border-border-main hover:border-brand-primary/50 text-text-main text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              Tham Gia Lớp
            </button>
            <button (click)="openCreateModal()" class="px-4 py-2 bg-brand-primary hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-brand-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              Tạo Lớp Mới
            </button>
          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

        <!-- Left: Class List -->
        <div class="lg:col-span-4 flex flex-col gap-4">
          <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-4 shadow-xl">
            <h3 class="text-xs font-black text-text-main uppercase tracking-wider border-b border-border-main/40 pb-2 mb-3 flex justify-between items-center">
              <span>Lớp Của Tôi</span>
              <span class="bg-bg-input px-2 py-0.5 rounded text-[10px] font-bold text-text-muted">{{ classes().length }} lớp</span>
            </h3>

            @if (isLoadingClasses()) {
              <div class="flex justify-center py-8">
                <svg class="animate-spin h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            } @else if (classes().length === 0) {
              <div class="text-center py-10 text-text-muted text-xxs flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted/40"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <p>Bạn chưa có lớp học nào.<br>Hãy tạo hoặc tham gia một lớp!</p>
              </div>
            } @else {
              <div class="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                @for (cls of classes(); track cls.id) {
                  <div
                    (click)="selectClass(cls.id)"
                    [class.border-brand-primary]="selectedClassId() === cls.id"
                    [class.bg-brand-primary/5]="selectedClassId() === cls.id"
                    [class.border-border-main]="selectedClassId() !== cls.id"
                    class="p-3 border rounded-xl cursor-pointer hover:border-brand-primary/40 transition-all group relative overflow-hidden"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-1.5 mb-0.5">
                          @if (cls.isOwner) {
                            <span class="text-[8px] font-black bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded uppercase">Owner</span>
                          } @else {
                            <span class="text-[8px] font-bold bg-bg-input text-text-muted px-1.5 py-0.5 rounded uppercase">Member</span>
                          }
                        </div>
                        <p class="font-black text-xs text-text-main truncate" [class.text-brand-primary]="selectedClassId() === cls.id">{{ cls.name }}</p>
                        <p class="text-[9px] text-text-muted mt-0.5 truncate">{{ cls.description || 'Không có mô tả' }}</p>
                      </div>
                      <div class="shrink-0 text-right">
                        <p class="text-[9px] text-text-muted">{{ cls.memberCount }} thành viên</p>
                        <p class="text-[9px] text-text-muted">{{ cls.quizCount }} quiz</p>
                      </div>
                    </div>
                    @if (cls.isOwner) {
                      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button (click)="confirmDeleteClass($event, cls)" class="p-1 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Right: Class Details -->
        <div class="lg:col-span-8">
          @if (isLoadingDetails()) {
            <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-12 shadow-xl flex items-center justify-center">
              <svg class="animate-spin h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          } @else if (selectedClass(); as cls) {
            <!-- Class Header -->
            <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 shadow-xl mb-4">
              <div class="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-border-main/40 pb-4 mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h2 class="text-lg font-black text-text-main">{{ cls.name }}</h2>
                    @if (cls.isOwner) {
                      <span class="text-[9px] font-black bg-yellow-500/15 text-yellow-500 px-2 py-0.5 rounded-full">Chủ Lớp</span>
                    }
                  </div>
                  <p class="text-xs text-text-muted">{{ cls.description || 'Không có mô tả' }}</p>
                </div>
                <!-- Invite Code Badge -->
                <div class="shrink-0 text-right">
                  <p class="text-[9px] text-text-muted uppercase tracking-wider mb-1">Mã mời</p>
                  <div class="flex items-center gap-2 bg-bg-input border border-border-main rounded-xl px-3 py-2">
                    <span class="text-base font-black text-brand-primary tracking-[0.2em]">{{ cls.inviteCode }}</span>
                    <button (click)="copyCode(cls.inviteCode)" class="text-text-muted hover:text-brand-primary transition-colors cursor-pointer" title="Sao chép">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                  @if (codeCopied()) {
                    <p class="text-[9px] text-green-500 font-bold mt-1 animate-pulse">✓ Đã sao chép!</p>
                  }
                </div>
              </div>

              <!-- Tabs -->
              <div class="flex border border-border-main rounded-xl p-1 bg-bg-input/30 text-xxs font-bold w-fit">
                <button (click)="activeTab = 'members'" [class.bg-brand-primary]="activeTab === 'members'" [class.text-white]="activeTab === 'members'" [class.text-text-muted]="activeTab !== 'members'" class="px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Thành Viên
                </button>
                <button (click)="activeTab = 'quizzes'; loadSelectedQuizLeaderboard()" [class.bg-brand-primary]="activeTab === 'quizzes'" [class.text-white]="activeTab === 'quizzes'" [class.text-text-muted]="activeTab !== 'quizzes'" class="px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
                  Bộ Đề Thi
                </button>
                <button (click)="activeTab = 'leaderboard'; loadSelectedQuizLeaderboard()" [class.bg-brand-primary]="activeTab === 'leaderboard'" [class.text-white]="activeTab === 'leaderboard'" [class.text-text-muted]="activeTab !== 'leaderboard'" class="px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                  Bảng Xếp Hạng
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 shadow-xl">

              <!-- MEMBERS TAB -->
              @if (activeTab === 'members') {
                <div class="space-y-3">
                  <h3 class="text-xs font-black uppercase text-text-main border-b border-border-main/40 pb-2">Danh Sách Thành Viên ({{ cls.members.length }})</h3>
                  @for (m of cls.members; track m.userId; let idx = $index) {
                    <div class="flex items-center justify-between p-3 bg-bg-input/30 rounded-xl border border-border-main/30 hover:border-border-main transition-all">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
                             [class.bg-yellow-500]="m.role === 'OWNER'"
                             [class.text-black]="m.role === 'OWNER'"
                             [class.bg-brand-primary/15]="m.role === 'MEMBER'"
                             [class.text-brand-primary]="m.role === 'MEMBER'">
                          {{ m.email.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <p class="text-xs font-bold text-text-main">{{ m.email }}</p>
                          <p class="text-[9px] text-text-muted">Tham gia {{ m.joinedAt | date:'dd/MM/yyyy' }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                              [class.bg-yellow-500/15]="m.role === 'OWNER'"
                              [class.text-yellow-500]="m.role === 'OWNER'"
                              [class.bg-bg-input]="m.role === 'MEMBER'"
                              [class.text-text-muted]="m.role === 'MEMBER'">
                          {{ m.role === 'OWNER' ? 'Chủ lớp' : 'Thành viên' }}
                        </span>
                        @if (cls.isOwner && m.role !== 'OWNER') {
                          <button (click)="kickMember(m.userId, m.email)" class="p-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all cursor-pointer" title="Xóa thành viên">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- QUIZZES TAB -->
              @if (activeTab === 'quizzes') {
                <div class="space-y-4">
                  <div class="flex justify-between items-center border-b border-border-main/40 pb-2">
                    <h3 class="text-xs font-black uppercase text-text-main">Bộ Đề Thi ({{ cls.quizzes.length }})</h3>
                    @if (cls.isOwner) {
                      <button (click)="openQuizModal('create')" class="px-3 py-1.5 bg-brand-primary hover:opacity-90 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                        Tạo Quiz Mới
                      </button>
                    }
                  </div>

                  @if (cls.quizzes.length === 0) {
                    <div class="text-center py-12 text-text-muted text-xs">
                      Chưa có bộ đề thi nào. {{ cls.isOwner ? 'Hãy tạo quiz đầu tiên!' : 'Chờ chủ lớp tạo quiz nhé!' }}
                    </div>
                  }

                  @for (quiz of cls.quizzes; track quiz.id) {
                    <div class="p-4 bg-bg-input/20 border border-border-main/40 rounded-2xl hover:border-brand-primary/30 transition-all">
                      <div class="flex justify-between items-start mb-2">
                        <div class="flex-1 min-w-0 pr-2">
                          <h4 class="text-sm font-black text-text-main">{{ quiz.title }}</h4>
                          @if (quiz.description) {
                            <p class="text-xs text-text-muted mt-0.5">{{ quiz.description }}</p>
                          }
                          <div class="flex items-center gap-3 mt-1.5 text-[10px] text-text-muted">
                            <span class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3L14.5 4z"/><circle cx="12" cy="13" r="3"/></svg>
                              {{ quiz.questionCount }} câu
                            </span>
                            <span>{{ quiz.createdAt | date:'dd/MM/yyyy' }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                          @if (cls.isOwner) {
                            <button (click)="openQuizModal('edit', quiz)" class="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all cursor-pointer" title="Sửa quiz">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button (click)="confirmDeleteQuiz(quiz)" class="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer" title="Xóa quiz">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          }
                          <button (click)="startQuiz(quiz)" class="px-3 py-1.5 bg-brand-primary hover:opacity-90 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer">
                            Thi Ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- LEADERBOARD TAB -->
              @if (activeTab === 'leaderboard') {
                <div class="space-y-4">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-main/40 pb-2">
                    <h3 class="text-xs font-black uppercase text-text-main">Bảng Xếp Hạng</h3>
                    @if (cls.quizzes.length > 0) {
                      <select [(ngModel)]="selectedQuizIdForLB" (ngModelChange)="loadSelectedQuizLeaderboard()" class="bg-bg-input border border-border-main rounded-xl px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand-primary">
                        <option [value]="0">-- Chọn Quiz --</option>
                        @for (quiz of cls.quizzes; track quiz.id) {
                          <option [value]="quiz.id">{{ quiz.title }}</option>
                        }
                      </select>
                    }
                  </div>

                  @if (selectedQuizIdForLB === 0) {
                    <div class="text-center py-12 text-text-muted text-xs">Chọn một quiz để xem bảng xếp hạng</div>
                  } @else if (isLoadingLB()) {
                    <div class="flex justify-center py-8">
                      <svg class="animate-spin h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  } @else if (leaderboard().length === 0) {
                    <div class="text-center py-12 text-text-muted text-xs">Chưa có ai nộp bài cho quiz này</div>
                  } @else {
                    <div class="space-y-2">
                      @for (entry of leaderboard(); track entry.rank) {
                        <div class="flex items-center gap-4 p-3 rounded-xl border transition-all"
                             [class.bg-yellow-500/10]="entry.rank === 1"
                             [class.border-yellow-500/30]="entry.rank === 1"
                             [class.bg-slate-400/5]="entry.rank === 2"
                             [class.border-slate-400/20]="entry.rank === 2"
                             [class.bg-orange-500/5]="entry.rank === 3"
                             [class.border-orange-500/20]="entry.rank === 3"
                             [class.bg-bg-input/20]="entry.rank > 3"
                             [class.border-border-main/30]="entry.rank > 3">
                          <!-- Rank badge -->
                          <div class="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                               [class.bg-yellow-500]="entry.rank === 1"
                               [class.text-black]="entry.rank === 1"
                               [class.bg-slate-400]="entry.rank === 2"
                               [class.text-black]="entry.rank === 2"
                               [class.bg-orange-500]="entry.rank === 3"
                               [class.text-white]="entry.rank === 3"
                               [class.bg-bg-input]="entry.rank > 3"
                               [class.text-text-muted]="entry.rank > 3">
                            @if (entry.rank === 1) { 🥇 }
                            @else if (entry.rank === 2) { 🥈 }
                            @else if (entry.rank === 3) { 🥉 }
                            @else { {{ entry.rank }} }
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="font-bold text-xs text-text-main truncate">{{ entry.email }}</p>
                            <p class="text-[9px] text-text-muted">{{ entry.completedAt | date:'dd/MM/yyyy HH:mm' }}</p>
                          </div>
                          <div class="text-right shrink-0">
                            <p class="font-black text-sm" [class.text-yellow-500]="entry.rank === 1" [class.text-text-main]="entry.rank > 1">{{ entry.percentage }}%</p>
                            <p class="text-[9px] text-text-muted">{{ entry.score }}/{{ entry.totalQuestions }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>

          } @else {
            <div class="backdrop-blur-xl bg-bg-card border border-border-main rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center min-h-96">
              <div class="w-16 h-16 rounded-2xl bg-bg-input border border-border-main flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 class="text-lg font-black text-text-main">Chọn Một Lớp Học</h3>
              <p class="text-text-muted text-xs max-w-xs mt-1.5">Chọn một lớp từ danh sách bên trái, hoặc tạo/tham gia lớp học mới để bắt đầu.</p>
            </div>
          }
        </div>
      </div>

      <!-- ========== QUIZ TAKING MODAL ========== -->
      @if (isQuizTakingOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div class="bg-bg-card border border-border-main rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-bg-card border-b border-border-main/40 p-4 flex justify-between items-center z-10">
              <div>
                <h3 class="text-sm font-black text-text-main">{{ activeQuiz?.title }}</h3>
                <p class="text-[10px] text-text-muted">{{ activeQuiz?.questionCount }} câu hỏi</p>
              </div>
              <button (click)="closeQuizTaking()" class="text-text-muted hover:text-text-main p-2 rounded-lg cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>

            @if (!quizSubmitted()) {
              <div class="p-5 space-y-5">
                @for (q of activeQuiz?.questions; track q.id; let idx = $index) {
                  <div class="p-4 bg-bg-input/20 border border-border-main/40 rounded-2xl space-y-3">
                    <div class="flex justify-between items-start">
                      <span class="text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Câu {{ idx + 1 }}</span>
                      <span class="text-[9px] text-text-muted font-semibold">{{ q.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : 'Điền vào chỗ trống' }}</span>
                    </div>
                    <p class="text-sm font-bold text-text-main leading-relaxed">{{ q.questionText }}</p>

                    @if (q.type === 'MULTIPLE_CHOICE') {
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        @for (opt of [
                          {key:'A', val:q.optionA},
                          {key:'B', val:q.optionB},
                          {key:'C', val:q.optionC},
                          {key:'D', val:q.optionD}
                        ]; track opt.key) {
                          <button
                            (click)="setTakingAnswer(q.id, opt.key)"
                            [class.border-brand-primary]="quizTakingAnswers[q.id] === opt.key"
                            [class.bg-brand-primary/10]="quizTakingAnswers[q.id] === opt.key"
                            [class.text-brand-primary]="quizTakingAnswers[q.id] === opt.key"
                            class="p-3 text-left border border-border-main hover:border-brand-primary/40 rounded-xl transition-all cursor-pointer flex items-center gap-2 text-xs"
                          >
                            <span class="w-6 h-6 flex items-center justify-center bg-bg-input border border-border-main/50 rounded-full font-black text-[10px] shrink-0">{{ opt.key }}</span>
                            <span>{{ opt.val }}</span>
                          </button>
                        }
                      </div>
                    } @else {
                      <input
                        type="text"
                        [(ngModel)]="quizTakingAnswers[q.id]"
                        placeholder="Nhập câu trả lời..."
                        class="w-full bg-bg-input border border-border-main rounded-xl p-3 text-xs focus:outline-none focus:border-brand-primary text-text-main"
                      />
                    }
                  </div>
                }
                <button
                  (click)="submitQuizTaking()"
                  [disabled]="isSubmittingQuiz()"
                  class="w-full bg-brand-primary hover:opacity-90 text-white text-sm font-bold py-3.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  @if (isSubmittingQuiz()) {
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Đang nộp...
                  } @else {
                    Nộp Bài Thi
                  }
                </button>
              </div>
            } @else {
              <!-- Quiz Results -->
              <div class="p-6 space-y-5">
                <div class="text-center p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl space-y-3">
                  <div class="text-5xl font-black" [class.text-green-500]="(quizResult()?.percentage || 0) >= 70" [class.text-yellow-500]="(quizResult()?.percentage || 0) >= 40 && (quizResult()?.percentage || 0) < 70" [class.text-red-500]="(quizResult()?.percentage || 0) < 40">
                    {{ quizResult()?.percentage }}%
                  </div>
                  <h3 class="text-base font-black text-text-main">
                    @if ((quizResult()?.percentage || 0) >= 80) { 🏆 Xuất sắc! }
                    @else if ((quizResult()?.percentage || 0) >= 60) { 👏 Tốt lắm! }
                    @else if ((quizResult()?.percentage || 0) >= 40) { 💪 Cố gắng thêm! }
                    @else { 📚 Cần ôn tập thêm! }
                  </h3>
                  <p class="text-sm text-text-muted">Đúng <strong class="text-text-main">{{ quizResult()?.score }}</strong> / {{ quizResult()?.totalQuestions }} câu</p>
                  
                  @if (quizResult()?.xpGained) {
                    <div class="flex justify-center gap-6 text-xs font-black py-2 bg-bg-input/30 border border-border-main/20 rounded-xl max-w-xs mx-auto my-3">
                      <span class="text-brand-primary flex items-center gap-1">⚡ +{{ quizResult()?.xpGained }} EXP</span>
                      <span class="text-yellow-500 flex items-center gap-1">🪙 +{{ quizResult()?.coinsGained }} Xu</span>
                    </div>
                  }
                  
                  @if (quizResult()?.leveledUp) {
                    <div class="text-xs font-black text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl max-w-xs mx-auto my-2 animate-bounce">
                      🎉 LÊN CẤP: Cấp {{ quizResult()?.newLevel }} ({{ quizResult()?.newTitle }})!
                    </div>
                  }

                  <button (click)="closeQuizTaking(); activeTab = 'leaderboard'; loadSelectedQuizLeaderboard()" class="px-5 py-2 bg-brand-primary hover:opacity-90 text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                    Xem Bảng Xếp Hạng
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- ========== CREATE/EDIT QUIZ MODAL ========== -->
      @if (isQuizModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div class="bg-bg-card border border-border-main rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-bg-card border-b border-border-main/40 p-4 flex justify-between items-center z-10">
              <h3 class="text-sm font-black text-text-main">{{ quizModalMode === 'create' ? 'Tạo Quiz Mới' : 'Sửa Quiz' }}</h3>
              <button (click)="closeQuizModal()" class="text-text-muted hover:text-text-main p-2 rounded-lg cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>

            <div class="p-5 space-y-4">
              <!-- Quiz Info -->
              <div class="space-y-3">
                <div>
                  <label class="block text-[10px] text-text-muted uppercase font-bold mb-1">Tiêu đề Quiz *</label>
                  <input type="text" [(ngModel)]="quizForm.title" placeholder="VD: Kiểm tra chương 1 - Grammar" class="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary text-text-main font-semibold" />
                </div>
                <div>
                  <label class="block text-[10px] text-text-muted uppercase font-bold mb-1">Mô tả</label>
                  <input type="text" [(ngModel)]="quizForm.description" placeholder="Mô tả ngắn về quiz..." class="w-full bg-bg-input border border-border-main rounded-xl p-3 text-xs focus:outline-none focus:border-brand-primary text-text-main" />
                </div>
              </div>

              <!-- Questions -->
              <div class="border-t border-border-main/40 pt-4">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-xs font-black uppercase text-text-main">Câu Hỏi ({{ quizForm.questions.length }})</h4>
                  <button (click)="addQuestion()" class="px-3 py-1.5 bg-bg-input hover:bg-bg-card border border-border-main text-text-main text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                    Thêm Câu Hỏi
                  </button>
                </div>

                @if (quizForm.questions.length === 0) {
                  <div class="text-center py-8 text-text-muted text-xs border-2 border-dashed border-border-main/40 rounded-xl">
                    Chưa có câu hỏi. Nhấn "+ Thêm Câu Hỏi" để bắt đầu.
                  </div>
                }

                <div class="space-y-4">
                  @for (q of quizForm.questions; track $index; let idx = $index) {
                    <div class="p-4 bg-bg-input/20 border border-border-main/40 rounded-2xl space-y-3">
                      <div class="flex justify-between items-center">
                        <span class="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Câu {{ idx + 1 }}</span>
                        <div class="flex items-center gap-2">
                          <select [(ngModel)]="q.type" class="bg-bg-input border border-border-main rounded-lg px-2 py-1 text-[10px] text-text-main font-bold focus:outline-none focus:border-brand-primary">
                            <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                            <option value="FILL_IN_BLANK">Điền vào chỗ trống</option>
                          </select>
                          <button (click)="removeQuestion(idx)" class="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label class="block text-[9px] text-text-muted uppercase font-bold mb-1">Câu hỏi *</label>
                        <textarea [(ngModel)]="q.questionText" rows="2" placeholder="Nhập nội dung câu hỏi..." class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary text-text-main resize-none"></textarea>
                      </div>

                      @if (q.type === 'MULTIPLE_CHOICE') {
                        <div class="grid grid-cols-2 gap-2">
                          @for (opt of ['A','B','C','D']; track opt) {
                            <div class="relative">
                              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted">{{ opt }}.</span>
                              <input
                                type="text"
                                [placeholder]="'Phương án ' + opt"
                                [ngModel]="getOptionValue(q, opt)"
                                (ngModelChange)="setOptionValue(q, opt, $event)"
                                class="w-full bg-bg-input border border-border-main rounded-xl pl-7 pr-2.5 py-2 text-xs focus:outline-none focus:border-brand-primary text-text-main"
                              />
                            </div>
                          }
                        </div>
                        <div>
                          <label class="block text-[9px] text-text-muted uppercase font-bold mb-1">Đáp án đúng</label>
                          <div class="flex gap-2">
                            @for (opt of ['A','B','C','D']; track opt) {
                              <button
                                (click)="q.correctAnswer = opt"
                                [class.bg-green-500]="q.correctAnswer === opt"
                                [class.text-white]="q.correctAnswer === opt"
                                [class.border-green-500]="q.correctAnswer === opt"
                                [class.bg-bg-input]="q.correctAnswer !== opt"
                                [class.text-text-muted]="q.correctAnswer !== opt"
                                [class.border-border-main]="q.correctAnswer !== opt"
                                class="px-3 py-1 border rounded-lg text-xs font-bold cursor-pointer transition-all"
                              >{{ opt }}</button>
                            }
                          </div>
                        </div>
                      } @else {
                        <div>
                          <label class="block text-[9px] text-text-muted uppercase font-bold mb-1">Đáp án đúng *</label>
                          <input type="text" [(ngModel)]="q.correctAnswer" placeholder="Từ/cụm từ đúng..." class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 text-xs focus:outline-none focus:border-green-500 text-text-main" />
                        </div>
                      }

                      <div>
                        <label class="block text-[9px] text-text-muted uppercase font-bold mb-1">Giải thích (tùy chọn)</label>
                        <input type="text" [(ngModel)]="q.explanation" placeholder="Giải thích đáp án..." class="w-full bg-bg-input border border-border-main rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-primary text-text-main" />
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Error / Submit -->
              @if (quizModalError()) {
                <div class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
                  {{ quizModalError() }}
                </div>
              }

              <div class="flex gap-3 pt-2">
                <button (click)="closeQuizModal()" class="flex-1 py-3 bg-bg-input hover:bg-bg-card border border-border-main text-text-main text-xs font-bold rounded-xl cursor-pointer transition-all">Hủy</button>
                <button
                  (click)="saveQuiz()"
                  [disabled]="isSavingQuiz()"
                  class="flex-1 py-3 bg-brand-primary hover:opacity-90 text-white text-xs font-bold rounded-xl cursor-pointer transition-all disabled:opacity-50"
                >
                  @if (isSavingQuiz()) { Đang lưu... } @else { {{ quizModalMode === 'create' ? 'Tạo Quiz' : 'Lưu Thay Đổi' }} }
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ========== CREATE CLASS MODAL ========== -->
      @if (isCreateModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div class="bg-bg-card border border-border-main rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-black text-text-main">Tạo Lớp Học Mới</h3>
              <button (click)="closeCreateModal()" class="text-text-muted hover:text-text-main p-1 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>
            <div class="space-y-3">
              <div>
                <label class="block text-[10px] text-text-muted uppercase font-bold mb-1">Tên lớp *</label>
                <input type="text" [(ngModel)]="createForm.name" placeholder="VD: Lớp Anh Văn B1 2024" class="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary text-text-main font-semibold" />
              </div>
              <div>
                <label class="block text-[10px] text-text-muted uppercase font-bold mb-1">Mô tả</label>
                <textarea [(ngModel)]="createForm.description" placeholder="Mô tả về lớp học..." rows="3" class="w-full bg-bg-input border border-border-main rounded-xl p-3 text-xs focus:outline-none focus:border-brand-primary text-text-main resize-none"></textarea>
              </div>
              @if (createError()) {
                <div class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">{{ createError() }}</div>
              }
              <div class="flex gap-2 pt-1">
                <button (click)="closeCreateModal()" class="flex-1 py-2.5 bg-bg-input border border-border-main text-text-main text-xs font-bold rounded-xl cursor-pointer">Hủy</button>
                <button (click)="createClass()" [disabled]="isCreating()" class="flex-1 py-2.5 bg-brand-primary hover:opacity-90 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50">
                  {{ isCreating() ? 'Đang tạo...' : 'Tạo Lớp' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ========== JOIN CLASS MODAL ========== -->
      @if (isJoinModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div class="bg-bg-card border border-border-main rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-black text-text-main">Tham Gia Lớp Học</h3>
              <button (click)="closeJoinModal()" class="text-text-muted hover:text-text-main p-1 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>
            <div class="space-y-3">
              <div>
                <label class="block text-[10px] text-text-muted uppercase font-bold mb-1">Mã Mời</label>
                <input type="text" [(ngModel)]="joinCode" placeholder="VD: ABC123" maxlength="6"
                       class="w-full bg-bg-input border border-border-main rounded-xl p-3 text-xl font-black tracking-[0.3em] text-center uppercase focus:outline-none focus:border-brand-primary text-text-main" />
              </div>
              @if (joinError()) {
                <div class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">{{ joinError() }}</div>
              }
              <div class="flex gap-2 pt-1">
                <button (click)="closeJoinModal()" class="flex-1 py-2.5 bg-bg-input border border-border-main text-text-main text-xs font-bold rounded-xl cursor-pointer">Hủy</button>
                <button (click)="joinClass()" [disabled]="isJoining()" class="flex-1 py-2.5 bg-brand-primary hover:opacity-90 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50">
                  {{ isJoining() ? 'Đang tham gia...' : 'Tham Gia' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes slide-in-right {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
  `]
})
export class ClassroomComponent implements OnInit {
  private classroomService = inject(ClassroomService);
  private toastService = inject(ToastService);

  classes = signal<ClassRoomSummary[]>([]);
  selectedClassId = signal<number | null>(null);
  selectedClass = signal<ClassRoomDetails | null>(null);
  leaderboard = signal<LeaderboardEntry[]>([]);

  isLoadingClasses = signal(false);
  isLoadingDetails = signal(false);
  isLoadingLB = signal(false);

  activeTab: ClassTab = 'members';
  selectedQuizIdForLB = 0;

  // Toast
  toast = signal<string | null>(null);
  codeCopied = signal(false);

  // Create Class
  isCreateModalOpen = signal(false);
  isCreating = signal(false);
  createError = signal<string | null>(null);
  createForm = { name: '', description: '' };

  // Join Class
  isJoinModalOpen = signal(false);
  isJoining = signal(false);
  joinError = signal<string | null>(null);
  joinCode = '';

  // Quiz Modal (create/edit)
  isQuizModalOpen = signal(false);
  isSavingQuiz = signal(false);
  quizModalMode: QuizModalMode = 'create';
  quizModalError = signal<string | null>(null);
  editingQuizId: number | null = null;
  quizForm: { title: string; description: string; questions: QuizFormQuestion[] } = {
    title: '', description: '', questions: []
  };

  // Quiz Taking
  isQuizTakingOpen = signal(false);
  isSubmittingQuiz = signal(false);
  quizSubmitted = signal(false);
  activeQuiz: ClassQuizDto | null = null;
  quizTakingAnswers: Record<number, string> = {};
  quizResult = signal<any>(null);

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.isLoadingClasses.set(true);
    this.classroomService.getMyClasses().subscribe({
      next: (data) => {
        this.classes.set(data);
        this.isLoadingClasses.set(false);
      },
      error: () => this.isLoadingClasses.set(false)
    });
  }

  selectClass(id: number) {
    this.selectedClassId.set(id);
    this.isLoadingDetails.set(true);
    this.selectedClass.set(null);
    this.activeTab = 'members';
    this.selectedQuizIdForLB = 0;
    this.leaderboard.set([]);
    this.classroomService.getClassDetails(id).subscribe({
      next: (data) => {
        this.selectedClass.set(data);
        this.isLoadingDetails.set(false);
      },
      error: () => this.isLoadingDetails.set(false)
    });
  }

  // ========== Create Modal ==========
  openCreateModal() {
    this.createForm = { name: '', description: '' };
    this.createError.set(null);
    this.isCreateModalOpen.set(true);
  }
  closeCreateModal() { this.isCreateModalOpen.set(false); }

  createClass() {
    if (!this.createForm.name.trim()) { this.createError.set('Tên lớp không được để trống!'); return; }
    this.isCreating.set(true);
    this.createError.set(null);
    this.classroomService.createClass(this.createForm.name, this.createForm.description).subscribe({
      next: (cls) => {
        this.classes.update(list => [cls, ...list]);
        this.isCreating.set(false);
        this.closeCreateModal();
        this.showToast('Tạo lớp học thành công!');
        this.selectClass(cls.id);
      },
      error: (err) => {
        this.createError.set(err.error?.error || 'Đã có lỗi xảy ra.');
        this.isCreating.set(false);
      }
    });
  }

  // ========== Join Modal ==========
  openJoinModal() {
    this.joinCode = '';
    this.joinError.set(null);
    this.isJoinModalOpen.set(true);
  }
  closeJoinModal() { this.isJoinModalOpen.set(false); }

  joinClass() {
    if (!this.joinCode.trim()) { this.joinError.set('Vui lòng nhập mã mời.'); return; }
    this.isJoining.set(true);
    this.joinError.set(null);
    this.classroomService.joinClass(this.joinCode.toUpperCase()).subscribe({
      next: (cls) => {
        this.classes.update(list => [cls, ...list]);
        this.isJoining.set(false);
        this.closeJoinModal();
        this.showToast('Tham gia lớp học thành công!');
        this.selectClass(cls.id);
      },
      error: (err) => {
        this.joinError.set(err.error?.error || 'Mã mời không hợp lệ.');
        this.isJoining.set(false);
      }
    });
  }

  // ========== Delete Class ==========
  confirmDeleteClass(event: Event, cls: ClassRoomSummary) {
    event.stopPropagation();
    if (!confirm(`Bạn có chắc muốn xóa lớp "${cls.name}"? Tất cả dữ liệu sẽ bị xóa vĩnh viễn!`)) return;
    this.classroomService.deleteClass(cls.id).subscribe({
      next: () => {
        this.classes.update(list => list.filter(c => c.id !== cls.id));
        if (this.selectedClassId() === cls.id) {
          this.selectedClassId.set(null);
          this.selectedClass.set(null);
        }
        this.showToast('Đã xóa lớp học!');
      }
    });
  }

  // ========== Kick Member ==========
  kickMember(userId: number, email: string) {
    if (!confirm(`Xóa thành viên "${email}" khỏi lớp?`)) return;
    const cls = this.selectedClass();
    if (!cls) return;
    this.classroomService.removeMember(cls.id, userId).subscribe({
      next: () => {
        this.selectedClass.update(c => c ? {
          ...c,
          members: c.members.filter(m => m.userId !== userId),
          memberCount: c.memberCount - 1
        } : null);
        this.showToast('Đã xóa thành viên!');
      }
    });
  }

  // ========== Copy Code ==========
  copyCode(code: string) {
    navigator.clipboard.writeText(code);
    this.codeCopied.set(true);
    setTimeout(() => this.codeCopied.set(false), 2000);
  }

  // ========== Quiz Modal ==========
  openQuizModal(mode: QuizModalMode, quiz?: ClassQuizDto) {
    this.quizModalMode = mode;
    this.quizModalError.set(null);
    if (mode === 'create') {
      this.editingQuizId = null;
      this.quizForm = { title: '', description: '', questions: [] };
    } else if (quiz) {
      this.editingQuizId = quiz.id;
      this.quizForm = {
        title: quiz.title,
        description: quiz.description || '',
        questions: quiz.questions.map(q => ({
          type: q.type,
          questionText: q.questionText,
          optionA: q.optionA || '',
          optionB: q.optionB || '',
          optionC: q.optionC || '',
          optionD: q.optionD || '',
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || ''
        }))
      };
    }
    this.isQuizModalOpen.set(true);
  }

  closeQuizModal() { this.isQuizModalOpen.set(false); }

  addQuestion() {
    this.quizForm.questions.push({
      type: 'MULTIPLE_CHOICE',
      questionText: '',
      optionA: '', optionB: '', optionC: '', optionD: '',
      correctAnswer: 'A',
      explanation: ''
    });
  }

  removeQuestion(idx: number) {
    this.quizForm.questions.splice(idx, 1);
  }

  getOptionValue(q: QuizFormQuestion, opt: string): string {
    return (q as any)['option' + opt] || '';
  }
  setOptionValue(q: QuizFormQuestion, opt: string, val: string) {
    (q as any)['option' + opt] = val;
  }

  saveQuiz() {
    if (!this.quizForm.title.trim()) { this.quizModalError.set('Tiêu đề quiz không được để trống.'); return; }
    if (this.quizForm.questions.length === 0) { this.quizModalError.set('Quiz cần có ít nhất 1 câu hỏi.'); return; }

    const cls = this.selectedClass();
    if (!cls) return;

    this.isSavingQuiz.set(true);
    this.quizModalError.set(null);

    const questionsPayload = this.quizForm.questions.map(q => ({
      type: q.type,
      questionText: q.questionText,
      optionA: q.optionA || null,
      optionB: q.optionB || null,
      optionC: q.optionC || null,
      optionD: q.optionD || null,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || null
    }));

    const obs = this.quizModalMode === 'create'
      ? this.classroomService.createQuiz(cls.id, this.quizForm.title, this.quizForm.description, questionsPayload)
      : this.classroomService.updateQuiz(cls.id, this.editingQuizId!, this.quizForm.title, this.quizForm.description, questionsPayload);

    obs.subscribe({
      next: (quiz) => {
        this.isSavingQuiz.set(false);
        this.closeQuizModal();
        if (this.quizModalMode === 'create') {
          this.selectedClass.update(c => c ? { ...c, quizzes: [quiz, ...c.quizzes], quizCount: c.quizCount + 1 } : null);
        } else {
          this.selectedClass.update(c => c ? {
            ...c,
            quizzes: c.quizzes.map(q => q.id === quiz.id ? quiz : q)
          } : null);
        }
        this.showToast(this.quizModalMode === 'create' ? 'Tạo quiz thành công!' : 'Cập nhật quiz thành công!');
      },
      error: (err) => {
        this.quizModalError.set(err.error?.error || 'Đã có lỗi xảy ra.');
        this.isSavingQuiz.set(false);
      }
    });
  }

  // ========== Delete Quiz ==========
  confirmDeleteQuiz(quiz: ClassQuizDto) {
    if (!confirm(`Xóa quiz "${quiz.title}"?`)) return;
    const cls = this.selectedClass();
    if (!cls) return;
    this.classroomService.deleteQuiz(cls.id, quiz.id).subscribe({
      next: () => {
        this.selectedClass.update(c => c ? {
          ...c,
          quizzes: c.quizzes.filter(q => q.id !== quiz.id),
          quizCount: c.quizCount - 1
        } : null);
        this.showToast('Đã xóa quiz!');
      }
    });
  }

  // ========== Quiz Taking ==========
  startQuiz(quiz: ClassQuizDto) {
    this.activeQuiz = quiz;
    this.quizTakingAnswers = {};
    this.quizSubmitted.set(false);
    this.quizResult.set(null);
    this.isQuizTakingOpen.set(true);
  }

  closeQuizTaking() {
    this.isQuizTakingOpen.set(false);
    this.activeQuiz = null;
  }

  setTakingAnswer(questionId: number, answer: string) {
    this.quizTakingAnswers[questionId] = answer;
  }

  submitQuizTaking() {
    const cls = this.selectedClass();
    if (!cls || !this.activeQuiz) return;
    this.isSubmittingQuiz.set(true);
    const answersStr: Record<string, string> = {};
    Object.entries(this.quizTakingAnswers).forEach(([k, v]) => answersStr[k] = v);

    this.classroomService.submitQuiz(cls.id, this.activeQuiz.id, answersStr).subscribe({
      next: (result) => {
        this.quizResult.set(result);
        this.quizSubmitted.set(true);
        this.isSubmittingQuiz.set(false);
        // Auto-select quiz for leaderboard
        this.selectedQuizIdForLB = this.activeQuiz!.id;
      },
      error: (err) => {
        alert(err.error?.error || 'Lỗi khi nộp bài.');
        this.isSubmittingQuiz.set(false);
      }
    });
  }

  // ========== Leaderboard ==========
  loadSelectedQuizLeaderboard() {
    const cls = this.selectedClass();
    if (!cls || !this.selectedQuizIdForLB) return;
    this.isLoadingLB.set(true);
    this.classroomService.getLeaderboard(cls.id, this.selectedQuizIdForLB).subscribe({
      next: (data) => {
        this.leaderboard.set(data);
        this.isLoadingLB.set(false);
      },
      error: () => this.isLoadingLB.set(false)
    });
  }

  // ========== Toast ==========
  private showToast(msg: string) {
    this.toastService.success(msg);
  }
}
