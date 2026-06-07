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

@Injectable({
  providedIn: 'root'
})
export class StudyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/study';

  getModuleContent(moduleId: number): Observable<StudyContent> {
    return this.http.get<StudyContent>(`${this.baseUrl}/modules/${moduleId}/content`);
  }

  completeModule(moduleId: number, correctAnswers: number): Observable<CompletionResult> {
    return this.http.post<CompletionResult>(`${this.baseUrl}/modules/${moduleId}/complete`, { correctAnswers });
  }

  completeBattle(moduleId: number): Observable<CompletionResult> {
    return this.http.post<CompletionResult>(`${this.baseUrl}/modules/${moduleId}/battle-complete`, {});
  }
}
