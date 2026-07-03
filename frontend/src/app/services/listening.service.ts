import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';

export interface ListeningTopic {
  id: number;
  title: string;
  category: string;
  description: string;
  sectionsCount: number;
  questionsCount: number;
  completedCount: number;
  mediaUrl?: string;
}

export interface ListeningQuestion {
  id: number;
  questionNumber: number;
  text: string;
  translation: string;
  audioUrl: string | null;
  isCompleted: boolean;
  options?: { key: string; value: string }[];
  correctOption?: string;
}

export interface ListeningSection {
  id: number;
  title: string;
  orderIndex: number;
  questionsCount: number;
  isCompleted: boolean;
  questions: ListeningQuestion[];
}

export interface RewardResult {
  xpGained: number;
  coinsGained: number;
  newXp: number;
  newLevel: number;
  newCoins: number;
  leveledUp: boolean;
  previousLevel: number;
  newTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class ListeningService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/listening`;

  getTopics(): Observable<ListeningTopic[]> {
    return this.http.get<ListeningTopic[]>(`${this.baseUrl}/topics`);
  }

  getTopicSections(topicId: number): Observable<ListeningSection[]> {
    return this.http.get<ListeningSection[]>(`${this.baseUrl}/topics/${topicId}/sections`);
  }

  completeQuestion(questionId: number): Observable<RewardResult> {
    return this.http.post<RewardResult>(`${this.baseUrl}/questions/${questionId}/complete`, {});
  }

  completeSection(sectionId: number): Observable<RewardResult> {
    return this.http.post<RewardResult>(`${this.baseUrl}/sections/${sectionId}/complete`, {});
  }
}
