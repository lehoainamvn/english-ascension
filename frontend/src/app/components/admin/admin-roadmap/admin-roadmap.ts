import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminRoadmapService, AdminRoadmapRequest, AdminModuleRequest } from '../../../services/admin-roadmap.service';
import { PresetRoadmap, PresetModule } from '../../../services/preset-roadmap.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import {
  AdminManagementService,
  AdminVocabTopic,
  AdminVocabWord,
  AdminGrammarLesson,
  AdminQuestion,
  AdminListeningTopic,
  AdminUser
} from '../../../services/admin-management.service';

interface ModuleFormItem {
  id: number | null;
  title: string;
  description: string;
  category: string;
  orderIndex: number;
}

interface RoadmapForm {
  id: number | null;
  cefrLevel: string;
  toeicEquivalent: string;
  overallEvaluation: string;
  thumbnailEmoji: string;
  difficultyLabel: string;
  modules: ModuleFormItem[];
}

@Component({
  selector: 'app-admin-roadmap',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-roadmap.html',
  styleUrls: ['./admin-roadmap.css']
})
export class AdminRoadmapComponent implements OnInit {
  private readonly adminRoadmapService = inject(AdminRoadmapService);
  private readonly adminMgmtService = inject(AdminManagementService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Tab điều hướng chính
  activeTab = signal<'dashboard' | 'roadmap' | 'users' | 'content' | 'ai-generator' | 'analytics'>('dashboard');
  activeContentSubTab = signal<'vocabulary' | 'grammar' | 'listening'>('vocabulary');
  isLoading = signal(true);
  isSaving = signal(false);
  isDeleting = signal(false);

  // === DATA SIGNALS ===
  roadmaps = signal<PresetRoadmap[]>([]);
  vocabTopics = signal<AdminVocabTopic[]>([]);
  grammarLessons = signal<AdminGrammarLesson[]>([]);
  listeningTopics = signal<AdminListeningTopic[]>([]);
  users = signal<AdminUser[]>([]);

  // === SUB-RESOURCES (For nested detail views) ===
  selectedVocabTopic = signal<AdminVocabTopic | null>(null);
  vocabWords = signal<AdminVocabWord[]>([]);
  
  selectedGrammarLesson = signal<AdminGrammarLesson | null>(null);
  grammarQuestions = signal<AdminQuestion[]>([]);

  selectedListeningTopic = signal<AdminListeningTopic | null>(null);
  listeningQuestions = signal<AdminQuestion[]>([]);

  // === ROADMAP MODAL STATE ===
  showRoadmapModal = signal(false);
  roadmapForm = signal<RoadmapForm>(this.getEmptyRoadmapForm());
  showRoadmapDeleteModal = signal(false);
  roadmapToDelete = signal<PresetRoadmap | null>(null);
  roadmapDeleteConfirmText = '';

  // === VOCABULARY TOPIC/WORD MODAL STATE ===
  showVocabTopicModal = signal(false);
  vocabTopicForm = signal<{ id: number | null; title: string; category: string; description: string }>({ id: null, title: '', category: 'VOCABULARY', description: '' });
  showVocabWordModal = signal(false);
  vocabWordForm = signal<Partial<AdminVocabWord>>({});

  // === GRAMMAR LESSON/QUESTION MODAL STATE ===
  showGrammarLessonModal = signal(false);
  grammarLessonForm = signal<{ id: number | null; title: string; category: string; bodyText: string }>({ id: null, title: '', category: '', bodyText: '' });
  showGrammarQuestionModal = signal(false);
  grammarQuestionForm = signal<Partial<AdminQuestion>>({});

  // === LISTENING TOPIC/QUESTION MODAL STATE ===
  showListeningTopicModal = signal(false);
  listeningTopicForm = signal<{ id: number | null; title: string; category: string; description: string }>({ id: null, title: '', category: '', description: '' });
  showListeningQuestionModal = signal(false);
  listeningQuestionForm = signal<Partial<AdminQuestion>>({});

  // === USER EDIT STATE ===
  showUserModal = signal(false);
  userForm = signal<Partial<AdminUser>>({});

  // Action Menu state for table dropdowns
  activeActionMenu = signal<{ type: string; id: any } | null>(null);

  toggleActionMenu(type: string, id: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const current = this.activeActionMenu();
    if (current && current.type === type && current.id === id) {
      this.activeActionMenu.set(null);
    } else {
      this.activeActionMenu.set({ type, id });
    }
  }

  ngOnInit(): void {
    this.switchTab('dashboard');
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => {
        this.activeActionMenu.set(null);
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/intro']);
  }

  get adminEmail(): string {
    return this.authService.getUser()?.email || 'admin@gmail.com';
  }

  switchTab(tab: 'dashboard' | 'roadmap' | 'users' | 'content' | 'ai-generator' | 'analytics'): void {
    this.activeTab.set(tab);
    this.selectedVocabTopic.set(null);
    this.selectedGrammarLesson.set(null);
    this.selectedListeningTopic.set(null);
    
    this.isLoading.set(true);

    if (tab === 'dashboard') {
      this.loadDashboardData();
    } else if (tab === 'roadmap') {
      this.loadAllRoadmaps();
    } else if (tab === 'users') {
      this.loadUsers();
    } else if (tab === 'content') {
      this.switchContentSubTab(this.activeContentSubTab());
    } else {
      this.isLoading.set(false);
    }
  }

  switchContentSubTab(subTab: 'vocabulary' | 'grammar' | 'listening'): void {
    this.activeContentSubTab.set(subTab);
    this.selectedVocabTopic.set(null);
    this.selectedGrammarLesson.set(null);
    this.selectedListeningTopic.set(null);
    this.isLoading.set(true);

    if (subTab === 'vocabulary') {
      this.loadVocabTopics();
    } else if (subTab === 'grammar') {
      this.loadGrammarLessons();
    } else if (subTab === 'listening') {
      this.loadListeningTopics();
    }
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.adminRoadmapService.getAllRoadmaps().subscribe({
      next: (rms) => {
        this.roadmaps.set(rms);
        this.adminMgmtService.getAllUsers().subscribe({
          next: (us) => {
            this.users.set(us);
            this.adminMgmtService.getGrammarLessons().subscribe({
              next: (gls) => {
                this.grammarLessons.set(gls);
                this.adminMgmtService.getVocabTopics().subscribe({
                  next: (vts) => {
                    this.vocabTopics.set(vts);
                    this.isLoading.set(false);
                  },
                  error: () => this.isLoading.set(false)
                });
              },
              error: () => this.isLoading.set(false)
            });
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: () => this.isLoading.set(false)
    });
  }

  // Helper mappings for User list
  getUserName(email: string): string {
    if (!email) return 'John Smith';
    const part = email.split('@')[0];
    return part
      .split(/[\._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getUserInitials(email: string): string {
    const name = this.getUserName(email);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getUserProgress(u: AdminUser): number {
    if (!u.exp) return 35;
    const target = u.level * 100;
    const pct = Math.round((u.exp / target) * 100);
    return Math.min(100, Math.max(10, pct));
  }

  getUserJoinDate(u: AdminUser): string {
    const year = 2025 + (Math.floor(u.id / 100) % 2);
    const month = String(1 + (u.id % 12)).padStart(2, '0');
    const day = String(1 + (u.id % 28)).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getUserLastActive(u: AdminUser): string {
    return '2026-06-17';
  }

  // ==========================================
  // ROADMAP LOGIC
  // ==========================================
  loadAllRoadmaps(): void {
    this.adminRoadmapService.getAllRoadmaps().subscribe({
      next: (data) => {
        this.roadmaps.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Không thể tải lộ trình học.');
        this.isLoading.set(false);
      }
    });
  }

  getEmptyRoadmapForm(): RoadmapForm {
    return {
      id: null,
      cefrLevel: '',
      toeicEquivalent: '',
      overallEvaluation: '',
      thumbnailEmoji: 'book',
      difficultyLabel: 'Basic',
      modules: []
    };
  }

  openRoadmapCreate(): void {
    this.roadmapForm.set(this.getEmptyRoadmapForm());
    this.addNewModuleToRoadmapForm();
    this.showRoadmapModal.set(true);
  }

  openRoadmapEdit(rm: PresetRoadmap): void {
    this.roadmapForm.set({
      id: rm.id,
      cefrLevel: rm.cefrLevel,
      toeicEquivalent: rm.toeicEquivalent,
      overallEvaluation: rm.overallEvaluation,
      thumbnailEmoji: rm.thumbnailEmoji,
      difficultyLabel: rm.difficultyLabel,
      modules: (rm.modules || []).map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        category: m.category || '',
        orderIndex: m.orderIndex
      }))
    });
    this.showRoadmapModal.set(true);
  }

  addNewModuleToRoadmapForm(): void {
    const nextOrder = this.roadmapForm().modules.length + 1;
    this.roadmapForm.update(state => {
      state.modules.push({
        id: null,
        title: '',
        description: '',
        category: '',
        orderIndex: nextOrder
      });
      return { ...state };
    });
  }

  removeModuleFromRoadmapForm(idx: number): void {
    this.roadmapForm.update(state => {
      state.modules.splice(idx, 1);
      state.modules.forEach((m, i) => m.orderIndex = i + 1);
      return { ...state };
    });
  }

  moveModuleUp(idx: number): void {
    if (idx === 0) return;
    this.roadmapForm.update(state => {
      const temp = state.modules[idx];
      state.modules[idx] = state.modules[idx - 1];
      state.modules[idx - 1] = temp;
      state.modules.forEach((m, i) => m.orderIndex = i + 1);
      return { ...state };
    });
  }

  moveModuleDown(idx: number): void {
    if (idx === this.roadmapForm().modules.length - 1) return;
    this.roadmapForm.update(state => {
      const temp = state.modules[idx];
      state.modules[idx] = state.modules[idx + 1];
      state.modules[idx + 1] = temp;
      state.modules.forEach((m, i) => m.orderIndex = i + 1);
      return { ...state };
    });
  }

  submitRoadmapForm(): void {
    const data = this.roadmapForm();
    if (!data.cefrLevel || !data.overallEvaluation || data.modules.length === 0) {
      this.toastService.warning('Vui lòng điền đủ thông tin.');
      return;
    }

    this.isSaving.set(true);
    const request: AdminRoadmapRequest = {
      cefrLevel: data.cefrLevel,
      toeicEquivalent: data.toeicEquivalent,
      overallEvaluation: data.overallEvaluation,
      thumbnailEmoji: data.thumbnailEmoji,
      difficultyLabel: data.difficultyLabel,
      modules: data.modules.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        category: m.category,
        orderIndex: m.orderIndex
      }))
    };

    const apiCall = data.id 
      ? this.adminRoadmapService.updateRoadmap(data.id, request)
      : this.adminRoadmapService.createRoadmap(request);

    apiCall.subscribe({
      next: () => {
        this.toastService.success('Đã lưu lộ trình thành công.');
        this.isSaving.set(false);
        this.showRoadmapModal.set(false);
        this.loadAllRoadmaps();
      },
      error: () => {
        this.toastService.error('Có lỗi xảy ra khi lưu lộ trình.');
        this.isSaving.set(false);
      }
    });
  }

  triggerRoadmapDelete(rm: PresetRoadmap): void {
    this.roadmapToDelete.set(rm);
    this.roadmapDeleteConfirmText = '';
    this.showRoadmapDeleteModal.set(true);
  }

  confirmRoadmapDelete(): void {
    const rm = this.roadmapToDelete();
    if (!rm || this.roadmapDeleteConfirmText !== rm.cefrLevel) return;

    this.isDeleting.set(true);
    this.adminRoadmapService.deleteRoadmap(rm.id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa lộ trình.');
        this.isDeleting.set(false);
        this.showRoadmapDeleteModal.set(false);
        this.loadAllRoadmaps();
      },
      error: () => {
        this.toastService.error('Xóa thất bại.');
        this.isDeleting.set(false);
      }
    });
  }

  // ==========================================
  // VOCABULARY LOGIC
  // ==========================================
  loadVocabTopics(): void {
    this.adminMgmtService.getVocabTopics().subscribe({
      next: (data) => {
        this.vocabTopics.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Lỗi tải chủ đề từ vựng.');
        this.isLoading.set(false);
      }
    });
  }

  openVocabTopicCreate(): void {
    this.vocabTopicForm.set({ id: null, title: '', category: 'VOCABULARY', description: '' });
    this.showVocabTopicModal.set(true);
  }

  openVocabTopicEdit(topic: AdminVocabTopic): void {
    this.vocabTopicForm.set({
      id: topic.id ?? null,
      title: topic.title,
      category: topic.category,
      description: topic.description
    });
    this.showVocabTopicModal.set(true);
  }

  submitVocabTopic(): void {
    const form = this.vocabTopicForm();
    if (!form.title) return;

    this.isSaving.set(true);
    const apiCall = form.id
      ? this.adminMgmtService.updateVocabTopic(form.id, form)
      : this.adminMgmtService.createVocabTopic(form);

    apiCall.subscribe({
      next: () => {
        this.toastService.success('Đã lưu chủ đề từ vựng.');
        this.isSaving.set(false);
        this.showVocabTopicModal.set(false);
        this.loadVocabTopics();
      },
      error: () => {
        this.toastService.error('Có lỗi xảy ra.');
        this.isSaving.set(false);
      }
    });
  }

  deleteVocabTopic(id: number | null | undefined): void {
    if (id == null) return;
    if (!confirm('Bạn có chắc chắn muốn xóa chủ đề này? Tất cả từ vựng đi kèm sẽ bị xóa.')) return;
    this.adminMgmtService.deleteVocabTopic(id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa chủ đề.');
        this.loadVocabTopics();
      }
    });
  }

  manageWords(topic: AdminVocabTopic): void {
    this.selectedVocabTopic.set(topic);
    this.loadVocabWords(topic.id);
  }

  loadVocabWords(topicId: number | null | undefined): void {
    if (topicId == null) return;
    this.isLoading.set(true);
    this.adminMgmtService.getVocabWords(topicId).subscribe({
      next: (data) => {
        this.vocabWords.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Không thể tải từ vựng.');
        this.isLoading.set(false);
      }
    });
  }

  openWordCreate(): void {
    this.vocabWordForm.set({
      word: '', partOfSpeech: 'noun', phonetic: '', definition: '', exampleSentence: '', exampleTranslation: ''
    });
    this.showVocabWordModal.set(true);
  }

  openWordEdit(w: AdminVocabWord): void {
    this.vocabWordForm.set({ ...w });
    this.showVocabWordModal.set(true);
  }

  submitWord(): void {
    const form = this.vocabWordForm();
    const topic = this.selectedVocabTopic();
    if (!form.word || !topic || topic.id == null) return;

    this.isSaving.set(true);
    const apiCall = form.id
      ? this.adminMgmtService.updateVocabWord(form.id, form)
      : this.adminMgmtService.createVocabWord(topic.id, form);

    apiCall.subscribe({
      next: () => {
        this.toastService.success('Đã lưu từ vựng.');
        this.isSaving.set(false);
        this.showVocabWordModal.set(false);
        this.loadVocabWords(topic.id);
      },
      error: () => {
        this.toastService.error('Lỗi khi lưu.');
        this.isSaving.set(false);
      }
    });
  }

  deleteWord(wordId: number | null | undefined): void {
    if (wordId == null) return;
    if (!confirm('Xóa từ vựng này?')) return;
    this.adminMgmtService.deleteVocabWord(wordId).subscribe({
      next: () => {
        this.toastService.success('Đã xóa từ vựng.');
        this.loadVocabWords(this.selectedVocabTopic()!.id);
      }
    });
  }

  // ==========================================
  // GRAMMAR LOGIC
  // ==========================================
  loadGrammarLessons(): void {
    this.adminMgmtService.getGrammarLessons().subscribe({
      next: (data) => {
        this.grammarLessons.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Lỗi tải bài học ngữ pháp.');
        this.isLoading.set(false);
      }
    });
  }

  openGrammarLessonCreate(): void {
    this.grammarLessonForm.set({ id: null, title: '', category: '', bodyText: '' });
    this.showGrammarLessonModal.set(true);
  }

  openGrammarLessonEdit(lesson: AdminGrammarLesson): void {
    this.grammarLessonForm.set({
      id: lesson.id ?? null,
      title: lesson.title,
      category: lesson.category,
      bodyText: lesson.bodyText
    });
    this.showGrammarLessonModal.set(true);
  }

  submitGrammarLesson(): void {
    const form = this.grammarLessonForm();
    if (!form.title) return;

    this.isSaving.set(true);
    const apiCall = form.id
      ? this.adminMgmtService.updateGrammarLesson(form.id, form)
      : this.adminMgmtService.createGrammarLesson(form);

    apiCall.subscribe({
      next: () => {
        this.toastService.success('Đã lưu bài học.');
        this.isSaving.set(false);
        this.showGrammarLessonModal.set(false);
        this.loadGrammarLessons();
      },
      error: () => {
        this.toastService.error('Lỗi lưu bài học.');
        this.isSaving.set(false);
      }
    });
  }

  deleteGrammarLesson(id: number | null | undefined): void {
    if (id == null) return;
    if (!confirm('Bạn có chắc chắn muốn xóa bài học này? Tất cả câu hỏi đi kèm sẽ bị xóa.')) return;
    this.adminMgmtService.deleteGrammarLesson(id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa bài học.');
        this.loadGrammarLessons();
      }
    });
  }

  manageGrammarQuestions(lesson: AdminGrammarLesson): void {
    this.selectedGrammarLesson.set(lesson);
    this.loadGrammarQuestions(lesson.id);
  }

  loadGrammarQuestions(lessonId: number | null | undefined): void {
    if (lessonId == null) return;
    this.isLoading.set(true);
    this.adminMgmtService.getGrammarQuestions(lessonId).subscribe({
      next: (data) => {
        this.grammarQuestions.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Lỗi tải câu hỏi.');
        this.isLoading.set(false);
      }
    });
  }

  openGrammarQuestionCreate(): void {
    this.grammarQuestionForm.set({
      questionNumber: this.grammarQuestions().length + 1,
      questionText: '',
      options: '|||', // A|B|C|D
      correctOption: 'A',
      explanation: ''
    });
    this.showGrammarQuestionModal.set(true);
  }

  openGrammarQuestionEdit(q: AdminQuestion): void {
    this.grammarQuestionForm.set({ ...q });
    this.showGrammarQuestionModal.set(true);
  }

  getOptionsArray(optionsStr: string | undefined): string[] {
    if (!optionsStr) return ['', '', '', ''];
    const arr = optionsStr.split('|');
    while (arr.length < 4) arr.push('');
    return arr;
  }

  submitGrammarQuestion(optA: string, optB: string, optC: string, optD: string): void {
    const form = this.grammarQuestionForm();
    const lesson = this.selectedGrammarLesson();
    if (!form.questionText || !lesson || lesson.id == null) return;

    form.options = [optA, optB, optC, optD].join('|');

    this.isSaving.set(true);
    const apiCall = form.id
      ? this.adminMgmtService.updateGrammarQuestion(form.id, form)
      : this.adminMgmtService.createGrammarQuestion(lesson.id, form);

    apiCall.subscribe({
      next: () => {
        this.toastService.success('Đã lưu câu hỏi.');
        this.isSaving.set(false);
        this.showGrammarQuestionModal.set(false);
        this.loadGrammarQuestions(lesson.id);
      },
      error: () => {
        this.toastService.error('Có lỗi xảy ra.');
        this.isSaving.set(false);
      }
    });
  }

  deleteGrammarQuestion(id: number | null | undefined): void {
    if (id == null) return;
    if (!confirm('Xóa câu hỏi này?')) return;
    this.adminMgmtService.deleteGrammarQuestion(id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa câu hỏi.');
        this.loadGrammarQuestions(this.selectedGrammarLesson()!.id);
      }
    });
  }

  // ==========================================
  // LISTENING LOGIC
  // ==========================================
  loadListeningTopics(): void {
    this.adminMgmtService.getListeningTopics().subscribe({
      next: (data) => {
        this.listeningTopics.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Lỗi tải đề luyện nghe.');
        this.isLoading.set(false);
      }
    });
  }

  openListeningTopicCreate(): void {
    this.listeningTopicForm.set({ id: null, title: '', category: 'LISTENING', description: '' });
    this.showListeningTopicModal.set(true);
  }

  openListeningTopicEdit(topic: AdminListeningTopic): void {
    this.listeningTopicForm.set({
      id: topic.id ?? null,
      title: topic.title,
      category: topic.category,
      description: topic.description
    });
    this.showListeningTopicModal.set(true);
  }

  submitListeningTopic(): void {
    const form = this.listeningTopicForm();
    if (!form.title) return;

    this.isSaving.set(true);
    const apiCall = form.id
      ? this.adminMgmtService.updateListeningTopic(form.id, form)
      : this.adminMgmtService.createListeningTopic(form);

    apiCall.subscribe({
      next: () => {
        this.toastService.success('Đã lưu bài nghe.');
        this.isSaving.set(false);
        this.showListeningTopicModal.set(false);
        this.loadListeningTopics();
      },
      error: () => {
        this.toastService.error('Lỗi khi lưu.');
        this.isSaving.set(false);
      }
    });
  }

  deleteListeningTopic(id: number | null | undefined): void {
    if (id == null) return;
    if (!confirm('Xóa đề luyện nghe này? Tất cả câu hỏi đi kèm sẽ bị xóa.')) return;
    this.adminMgmtService.deleteListeningTopic(id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa bài nghe.');
        this.loadListeningTopics();
      }
    });
  }

  manageListeningQuestions(topic: AdminListeningTopic): void {
    this.selectedListeningTopic.set(topic);
    this.loadListeningQuestions(topic.id);
  }

  loadListeningQuestions(topicId: number | null | undefined): void {
    if (topicId == null) return;
    this.isLoading.set(true);
    this.adminMgmtService.getListeningQuestions(topicId).subscribe({
      next: (data) => {
        this.listeningQuestions.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Lỗi tải câu hỏi nghe.');
        this.isLoading.set(false);
      }
    });
  }

  openListeningQuestionCreate(): void {
    this.listeningQuestionForm.set({
      questionNumber: this.listeningQuestions().length + 1,
      questionText: '',
      options: '|||',
      correctOption: 'A',
      explanation: '',
      audioUrl: '',
      difficulty: 'Part 1: Photo Description' // Mặc định dùng difficulty làm Section name
    });
    this.showListeningQuestionModal.set(true);
  }

  openListeningQuestionEdit(q: AdminQuestion): void {
    this.listeningQuestionForm.set({ ...q });
    this.showListeningQuestionModal.set(true);
  }

  submitListeningQuestion(optA: string, optB: string, optC: string, optD: string): void {
    const form = this.listeningQuestionForm();
    const topic = this.selectedListeningTopic();
    if (!form.questionText || !topic || topic.id == null) return;

    form.options = [optA, optB, optC, optD].join('|');

    this.isSaving.set(true);
    const apiCall = form.id
      ? this.adminMgmtService.updateListeningQuestion(form.id, form)
      : this.adminMgmtService.createListeningQuestion(topic.id, form);

    apiCall.subscribe({
      next: () => {
        this.toastService.success('Đã lưu câu hỏi nghe.');
        this.isSaving.set(false);
        this.showListeningQuestionModal.set(false);
        this.loadListeningQuestions(topic.id);
      },
      error: () => {
        this.toastService.error('Lỗi khi lưu.');
        this.isSaving.set(false);
      }
    });
  }

  deleteListeningQuestion(id: number | null | undefined): void {
    if (id == null) return;
    if (!confirm('Xóa câu hỏi nghe này?')) return;
    this.adminMgmtService.deleteListeningQuestion(id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa câu hỏi nghe.');
        this.loadListeningQuestions(this.selectedListeningTopic()!.id);
      }
    });
  }

  // ==========================================
  // USERS LOGIC
  // ==========================================
  loadUsers(): void {
    this.adminMgmtService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Lỗi tải danh sách người dùng.');
        this.isLoading.set(false);
      }
    });
  }

  openUserEdit(u: AdminUser): void {
    this.userForm.set({ ...u });
    this.showUserModal.set(true);
  }

  submitUser(): void {
    const form = this.userForm();
    if (!form.id) return;

    this.isSaving.set(true);
    this.adminMgmtService.updateUser(form.id, form).subscribe({
      next: () => {
        this.toastService.success('Cập nhật người dùng thành công.');
        this.isSaving.set(false);
        this.showUserModal.set(false);
        this.loadUsers();
      },
      error: () => {
        this.toastService.error('Lỗi cập nhật.');
        this.isSaving.set(false);
      }
    });
  }

  deleteUser(id: number | null | undefined): void {
    if (id == null) return;
    const me = this.authService.getUser();
    if (me && me.id === id) {
      this.toastService.warning('Bạn không thể tự xóa tài khoản của chính mình.');
      return;
    }

    if (!confirm('Xóa vĩnh viễn tài khoản người dùng này?')) return;
    this.adminMgmtService.deleteUser(id).subscribe({
      next: () => {
        this.toastService.success('Đã xóa người dùng.');
        this.loadUsers();
      }
    });
  }

  // Helper mappings
  getEmoji(key: string): string {
    const map: Record<string, string> = {
      'flag': '🚩', 'star': '⭐', 'trophy': '🏆', 'diamond': '💎',
      'briefcase': '💼', 'book': '📚', 'rocket': '🚀', 'target': '🎯',
    };
    return map[key] ?? '📖';
  }

  getDifficultyColor(label: string): string {
    const map: Record<string, string> = {
      'Basic': 'text-text-muted bg-bg-input border border-border-main/50',
      'Trung cap': 'text-text-main bg-bg-input border border-text-muted/20',
      'TOEIC': 'text-brand-primary bg-brand-primary/10 border border-brand-primary/30 font-bold',
      'IELTS': 'text-brand-accent bg-brand-accent/10 border border-brand-accent/30 font-bold',
      'Business': 'text-amber-500 bg-amber-500/10 border border-amber-500/30 font-bold',
    };
    return map[label] ?? 'text-text-muted bg-bg-input border border-border-main/50';
  }

  getTotalModulesCount(): number {
    return this.roadmaps().reduce((sum, rm) => sum + (rm.modules?.length || 0), 0);
  }
}
