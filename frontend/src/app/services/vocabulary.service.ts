import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VocabTopic {
  id: number;
  title: string;
  category: string;
  wordsCount: number;
  learnedCount: number;
  isCompleted: boolean;
}

export interface VocabWord {
  id: number;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  definition: string;
  exampleSentence: string;
  exampleTranslation: string;
  isLearned: boolean;
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
export class VocabularyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/vocabulary';

  getTopics(): Observable<VocabTopic[]> {
    return this.http.get<VocabTopic[]>(`${this.baseUrl}/topics`);
  }

  getTopicWords(topicId: number): Observable<VocabWord[]> {
    return this.http.get<VocabWord[]>(`${this.baseUrl}/topics/${topicId}/words`);
  }

  markWordLearned(wordId: number): Observable<RewardResult> {
    return this.http.post<RewardResult>(`${this.baseUrl}/words/${wordId}/mark-learned`, {});
  }

  completeTopic(topicId: number): Observable<RewardResult> {
    return this.http.post<RewardResult>(`${this.baseUrl}/topics/${topicId}/complete`, {});
  }
}
