import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReadingArticle {
  id: number;
  title: string;
  category?: string;
  level: any;
  questionsCount: number;
  articleCompleted: boolean;
  practiceCompleted: boolean;
  isCompleted: boolean;
}

export interface ReadingQuestion {
  id: number;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  isCorrect: boolean;
  selectedAnswer?: string; // local client side tracking
  isSubmitted?: boolean; // local client side tracking
}

export interface ReadingArticleDetails {
  id: number;
  title: string;
  category?: string;
  content: string;
  vietnameseContent: string;
  level: any;
  questionsCount: number;
  vocabularyJson: string;
  isCompleted: boolean;
  questions: ReadingQuestion[];
}

export interface SubmitAnswerResult {
  isCorrect: boolean;
  correctOption: string;
  explanation: string;
  xpGained: number;
  coinsGained: number;
  newXp: number;
  newLevel: number;
  newCoins: number;
  leveledUp: boolean;
  previousLevel: number;
  newTitle: string;
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

import { API_BASE_URL } from '../api-config';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/reading`;

  getArticles(): Observable<ReadingArticle[]> {
    return this.http.get<ReadingArticle[]>(`${this.baseUrl}/articles`);
  }

  getArticleDetails(articleId: number): Observable<ReadingArticleDetails> {
    return this.http.get<ReadingArticleDetails>(`${this.baseUrl}/articles/${articleId}`);
  }

  submitAnswer(questionId: number, selectedOption: string): Observable<SubmitAnswerResult> {
    return this.http.post<SubmitAnswerResult>(
      `${this.baseUrl}/questions/${questionId}/submit?selectedOption=${selectedOption}`,
      {}
    );
  }

  completeArticle(articleId: number): Observable<RewardResult> {
    return this.http.post<RewardResult>(`${this.baseUrl}/articles/${articleId}/complete`, {});
  }
}
