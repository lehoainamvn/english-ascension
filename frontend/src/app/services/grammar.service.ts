import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GrammarLesson {
  id: number;
  title: string;
  vietnameseTitle: string;
  questionsCount: number;
  theoryContent?: string;
  xpRewardLesson: number;
  coinRewardLesson: number;
  xpRewardPractice: number;
  coinRewardPractice: number;
  lessonCompleted: boolean;
  practiceCompleted: boolean;
  score?: number;
}

export interface GrammarQuestion {
  id: number;
  questionText: string;
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK';
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation: string;
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
export class GrammarService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/grammar';

  getLessons(): Observable<GrammarLesson[]> {
    return this.http.get<GrammarLesson[]>(`${this.baseUrl}/lessons`);
  }

  getLesson(lessonId: number): Observable<GrammarLesson> {
    return this.http.get<GrammarLesson>(`${this.baseUrl}/lessons/${lessonId}`);
  }

  getQuestions(lessonId: number): Observable<GrammarQuestion[]> {
    return this.http.get<GrammarQuestion[]>(`${this.baseUrl}/lessons/${lessonId}/questions`);
  }

  completeLesson(lessonId: number): Observable<RewardResult> {
    return this.http.post<RewardResult>(`${this.baseUrl}/lessons/${lessonId}/complete-lesson`, {});
  }

  completePractice(lessonId: number, score: number): Observable<RewardResult> {
    return this.http.post<RewardResult>(`${this.baseUrl}/lessons/${lessonId}/complete-practice`, { score });
  }
}
