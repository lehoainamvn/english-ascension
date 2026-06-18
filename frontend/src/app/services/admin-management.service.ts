import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';

export interface AdminVocabTopic {
  id?: number | null;
  title: string;
  category: string;
  description: string;
  orderIndex?: number;
  status?: string;
}

export interface AdminVocabWord {
  id?: number | null;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  definition: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface AdminGrammarLesson {
  id?: number | null;
  title: string;
  category: string; // Tên tiếng Việt
  bodyText: string; // Lý thuyết
  type?: string;
  questionsCount?: number;
}

export interface AdminQuestion {
  id?: number | null;
  parentId?: number | null;
  sourceType?: string;
  questionNumber: number;
  questionText: string;
  options: string; // "A|B|C|D"
  correctAnswer?: string;
  correctOption?: string;
  explanation: string;
  audioUrl?: string; // dùng cho listening
  difficulty?: string; // dùng cho listening lưu tên section/part
}

export interface AdminListeningTopic {
  id?: number | null;
  title: string;
  category: string;
  description: string;
  type?: string;
  questionsCount?: number;
}

export interface AdminUser {
  id: number;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  exp: number;
  level: number;
  coins: number;
  characterTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {
  private readonly http = inject(HttpClient);
  private readonly vocabUrl = `${API_BASE_URL}/api/admin/vocabulary`;
  private readonly grammarUrl = `${API_BASE_URL}/api/admin/grammar`;
  private readonly listeningUrl = `${API_BASE_URL}/api/admin/listening`;
  private readonly usersUrl = `${API_BASE_URL}/api/admin/users`;

  // === VOCABULARY CRUD ===
  getVocabTopics(): Observable<AdminVocabTopic[]> {
    return this.http.get<AdminVocabTopic[]>(`${this.vocabUrl}/topics`);
  }
  createVocabTopic(request: Partial<AdminVocabTopic>): Observable<AdminVocabTopic> {
    return this.http.post<AdminVocabTopic>(`${this.vocabUrl}/topics`, request);
  }
  updateVocabTopic(id: number, request: Partial<AdminVocabTopic>): Observable<AdminVocabTopic> {
    return this.http.put<AdminVocabTopic>(`${this.vocabUrl}/topics/${id}`, request);
  }
  deleteVocabTopic(id: number): Observable<any> {
    return this.http.delete<any>(`${this.vocabUrl}/topics/${id}`);
  }
  getVocabWords(topicId: number): Observable<AdminVocabWord[]> {
    return this.http.get<AdminVocabWord[]>(`${this.vocabUrl}/topics/${topicId}/words`);
  }
  createVocabWord(topicId: number, request: Partial<AdminVocabWord>): Observable<AdminVocabWord> {
    return this.http.post<AdminVocabWord>(`${this.vocabUrl}/topics/${topicId}/words`, request);
  }
  updateVocabWord(wordId: number, request: Partial<AdminVocabWord>): Observable<AdminVocabWord> {
    return this.http.put<AdminVocabWord>(`${this.vocabUrl}/words/${wordId}`, request);
  }
  deleteVocabWord(wordId: number): Observable<any> {
    return this.http.delete<any>(`${this.vocabUrl}/words/${wordId}`);
  }

  // === GRAMMAR CRUD ===
  getGrammarLessons(): Observable<AdminGrammarLesson[]> {
    return this.http.get<AdminGrammarLesson[]>(`${this.grammarUrl}/lessons`);
  }
  createGrammarLesson(request: Partial<AdminGrammarLesson>): Observable<AdminGrammarLesson> {
    return this.http.post<AdminGrammarLesson>(`${this.grammarUrl}/lessons`, request);
  }
  updateGrammarLesson(id: number, request: Partial<AdminGrammarLesson>): Observable<AdminGrammarLesson> {
    return this.http.put<AdminGrammarLesson>(`${this.grammarUrl}/lessons/${id}`, request);
  }
  deleteGrammarLesson(id: number): Observable<any> {
    return this.http.delete<any>(`${this.grammarUrl}/lessons/${id}`);
  }
  getGrammarQuestions(lessonId: number): Observable<AdminQuestion[]> {
    return this.http.get<AdminQuestion[]>(`${this.grammarUrl}/lessons/${lessonId}/questions`);
  }
  createGrammarQuestion(lessonId: number, request: any): Observable<AdminQuestion> {
    return this.http.post<AdminQuestion>(`${this.grammarUrl}/lessons/${lessonId}/questions`, request);
  }
  updateGrammarQuestion(questionId: number, request: any): Observable<AdminQuestion> {
    return this.http.put<AdminQuestion>(`${this.grammarUrl}/questions/${questionId}`, request);
  }
  deleteGrammarQuestion(questionId: number): Observable<any> {
    return this.http.delete<any>(`${this.grammarUrl}/questions/${questionId}`);
  }

  // === LISTENING CRUD ===
  getListeningTopics(): Observable<AdminListeningTopic[]> {
    return this.http.get<AdminListeningTopic[]>(`${this.listeningUrl}/topics`);
  }
  createListeningTopic(request: Partial<AdminListeningTopic>): Observable<AdminListeningTopic> {
    return this.http.post<AdminListeningTopic>(`${this.listeningUrl}/topics`, request);
  }
  updateListeningTopic(id: number, request: Partial<AdminListeningTopic>): Observable<AdminListeningTopic> {
    return this.http.put<AdminListeningTopic>(`${this.listeningUrl}/topics/${id}`, request);
  }
  deleteListeningTopic(id: number): Observable<any> {
    return this.http.delete<any>(`${this.listeningUrl}/topics/${id}`);
  }
  getListeningQuestions(topicId: number): Observable<AdminQuestion[]> {
    return this.http.get<AdminQuestion[]>(`${this.listeningUrl}/topics/${topicId}/questions`);
  }
  createListeningQuestion(topicId: number, request: any): Observable<AdminQuestion> {
    return this.http.post<AdminQuestion>(`${this.listeningUrl}/topics/${topicId}/questions`, request);
  }
  updateListeningQuestion(questionId: number, request: any): Observable<AdminQuestion> {
    return this.http.put<AdminQuestion>(`${this.listeningUrl}/questions/${questionId}`, request);
  }
  deleteListeningQuestion(questionId: number): Observable<any> {
    return this.http.delete<any>(`${this.listeningUrl}/questions/${questionId}`);
  }

  // === USERS CRUD ===
  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(this.usersUrl);
  }
  updateUser(id: number, request: Partial<AdminUser>): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.usersUrl}/${id}`, request);
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.usersUrl}/${id}`);
  }
}
