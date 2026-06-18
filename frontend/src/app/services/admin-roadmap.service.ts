import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import { PresetRoadmap } from './preset-roadmap.service';

export interface AdminModuleRequest {
  id?: number | null;
  title: string;
  description: string;
  category?: string;
  orderIndex: number;
}

export interface AdminRoadmapRequest {
  cefrLevel: string;
  toeicEquivalent: string;
  overallEvaluation: string;
  thumbnailEmoji: string;
  difficultyLabel: string;
  modules: AdminModuleRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminRoadmapService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/admin/roadmaps`;

  getAllRoadmaps(): Observable<PresetRoadmap[]> {
    return this.http.get<PresetRoadmap[]>(this.baseUrl);
  }

  getRoadmapById(id: number): Observable<PresetRoadmap> {
    return this.http.get<PresetRoadmap>(`${this.baseUrl}/${id}`);
  }

  createRoadmap(request: AdminRoadmapRequest): Observable<PresetRoadmap> {
    return this.http.post<PresetRoadmap>(this.baseUrl, request);
  }

  updateRoadmap(id: number, request: AdminRoadmapRequest): Observable<PresetRoadmap> {
    return this.http.put<PresetRoadmap>(`${this.baseUrl}/${id}`, request);
  }

  deleteRoadmap(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
