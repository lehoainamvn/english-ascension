import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PresetModule {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  status: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
  category?: string;
}

export interface PresetRoadmap {
  id: number;
  cefrLevel: string;
  toeicEquivalent: string;
  overallEvaluation: string;
  isPreset: boolean;
  thumbnailEmoji: string;  // e.g. 'flag', 'star', 'trophy', 'diamond', 'briefcase'
  difficultyLabel: string;
  modulesCount: number;
  modules: PresetModule[];
}

export interface PresetRoadmapDetail {
  roadmap: PresetRoadmap;
  enrolled: boolean;
}

export interface Enrollment {
  id: number;
  userId: number;
  roadmap: PresetRoadmap;
  status: string;
  enrolledAt: string;
  lastAccessedAt: string;
}

@Injectable({ providedIn: 'root' })
export class PresetRoadmapService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/preset-roadmaps';

  /** Lấy tất cả preset roadmaps */
  getAllPresets(): Observable<PresetRoadmap[]> {
    return this.http.get<PresetRoadmap[]>(this.baseUrl);
  }

  /** Lấy chi tiết 1 preset roadmap */
  getPresetById(id: number): Observable<PresetRoadmapDetail> {
    return this.http.get<PresetRoadmapDetail>(`${this.baseUrl}/${id}`);
  }

  /** Đăng ký học lộ trình */
  enroll(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/enroll`, {});
  }

  /** Lấy danh sách lộ trình đang học */
  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/my-enrollments`);
  }

  /** Hủy đăng ký học */
  unenroll(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/unenroll`);
  }

  /** Helper: emoji string → SVG/text icon */
  getEmojiIcon(key: string): string {
    const map: Record<string, string> = {
      'flag': '🎌',
      'star': '⭐',
      'trophy': '🏆',
      'diamond': '💎',
      'briefcase': '💼',
      'book': '📚',
    };
    return map[key] ?? '📖';
  }

  /** Helper: difficultyLabel → màu badge */
  getDifficultyColor(label: string): string {
    const map: Record<string, string> = {
      'Co ban': 'text-text-muted bg-bg-input border border-border-main/50',
      'Trung cap': 'text-text-main bg-bg-input border border-text-muted/20',
      'TOEIC': 'text-text-main bg-bg-input border border-text-main/40 font-bold',
      'IELTS': 'text-text-main font-bold bg-bg-input border border-text-main',
      'Business': 'text-text-main font-extrabold bg-bg-card border-2 border-text-main',
      'Basic': 'text-text-muted bg-bg-input border border-border-main/50',
    };
    return map[label] ?? 'text-text-muted bg-bg-input border border-border-main/50';
  }
}

