import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Flashcard {
  id: number;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  definition: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface BattleWord {
  id: number;
  word: string;
  definition: string;
  partOfSpeech: string;
  phonetic: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'WORD_MATCHING';
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}

export interface StudyContent {
  moduleTitle?: string;
  moduleDescription?: string;
  lessonType?: string;
  bodyText?: string;
  mediaUrl?: string;
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
}

export interface CompletionResult {
  xpGained: number;
  coinsGained: number;
  newXp: number;
  newLevel: number;
  newCoins: number;
  leveledUp: boolean;
  previousLevel: number;
  newTitle: string;
  nextModuleId?: number;
}

import { API_BASE_URL } from '../api-config';

@Injectable({
  providedIn: 'root'
})
export class StudyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/study`;

  getModuleContent(moduleId: string | number, category?: string): Observable<StudyContent> {
    let url = `${this.baseUrl}/modules/${moduleId}/content`;
    if (category) {
      url += `?category=${category}`;
    }
    return this.http.get<StudyContent>(url);
  }

  completeModule(moduleId: string | number, correctAnswers: number): Observable<CompletionResult> {
    return this.http.post<CompletionResult>(`${this.baseUrl}/modules/${moduleId}/complete`, { correctAnswers });
  }

  completeStep(moduleId: string | number, step: string): Observable<CompletionResult> {
    return this.http.post<CompletionResult>(`${this.baseUrl}/modules/${moduleId}/complete-step`, { step });
  }

  completeBattle(moduleId: string | number): Observable<CompletionResult> {
    return this.http.post<CompletionResult>(`${this.baseUrl}/modules/${moduleId}/battle-complete`, {});
  }

  getBattleWords(moduleId: string | number): Observable<BattleWord[]> {
    return this.http.get<BattleWord[]>(`${this.baseUrl}/modules/${moduleId}/battle-words`);
  }

  analyzePronunciation(targetWord: string, transcribedText: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pronunciation/analyze`, { targetWord, transcribedText });
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profile`);
  }
}
