import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserWord {
  id: number;
  word: string;
  partOfSpeech: string;
  phonetic?: string;
  definition: string;
  notes?: string;
  savedDate: string;
  efactor?: number;
  interval?: number;
  repetitions?: number;
}

import { API_BASE_URL } from '../api-config';

@Injectable({
  providedIn: 'root'
})
export class UserWordService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/user-words`;

  getUserWords(): Observable<UserWord[]> {
    return this.http.get<UserWord[]>(this.baseUrl);
  }

  saveUserWord(data: {
    word: string;
    partOfSpeech: string;
    definition: string;
    phonetic?: string;
    notes?: string;
  }): Observable<UserWord> {
    return this.http.post<UserWord>(this.baseUrl, data);
  }

  updateUserWord(id: number, data: Partial<UserWord>): Observable<UserWord> {
    return this.http.put<UserWord>(`${this.baseUrl}/${id}`, data);
  }

  deleteUserWord(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  deleteUserWordByText(wordText: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/word/${encodeURIComponent(wordText)}`);
  }
}
