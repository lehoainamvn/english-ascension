import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  type: 'VOCABULARY' | 'GRAMMAR' | 'LISTENING' | 'READING';
  difficulty: string;
  questionText: string;
  audioUrl?: string;
  imageUrl?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption?: string;
  explanation?: string;
}

export interface LearningModule {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  status: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface LearningRoadmap {
  id: number;
  cefrLevel: string;
  toeicEquivalent: string;
  overallEvaluation: string;
  modules: LearningModule[];
}

@Injectable({
  providedIn: 'root'
})
export class PlacementTestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/placement-test';

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions`);
  }

  submitTest(answers: { questionId: number; selectedOption: string }[]): Observable<LearningRoadmap> {
    return this.http.post<LearningRoadmap>(`${this.baseUrl}/submit`, { answers });
  }

  getRoadmap(): Observable<LearningRoadmap> {
    return this.http.get<LearningRoadmap>(`${this.baseUrl}/roadmap`);
  }
}
