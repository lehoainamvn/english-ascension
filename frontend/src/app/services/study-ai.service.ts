import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flashcard, QuizQuestion } from './study.service';

export interface UserDocListItem {
  id: number;
  fileName: string;
  createdAt: string;
  flashcardCount: number;
  quizCount: number;
}

export interface UserDocDetails {
  id: number;
  fileName: string;
  extractedText: string;
  createdAt: string;
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
}

export interface MentorChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudyAiService {
  private readonly http = inject(HttpClient);
  private readonly docBaseUrl = 'http://localhost:8080/api/documents';
  private readonly mentorBaseUrl = 'http://localhost:8080/api/mentor';

  // AI Document Learning APIs
  listDocuments(): Observable<UserDocListItem[]> {
    return this.http.get<UserDocListItem[]>(this.docBaseUrl);
  }

  getDocumentDetails(id: number): Observable<UserDocDetails> {
    return this.http.get<UserDocDetails>(`${this.docBaseUrl}/${id}`);
  }

  uploadDocument(file: File, flashcardCount: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('flashcardCount', flashcardCount.toString());
    return this.http.post<any>(`${this.docBaseUrl}/upload`, formData);
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete<any>(`${this.docBaseUrl}/${id}`);
  }

  addFlashcardToDocument(docId: number, flashcard: any): Observable<any> {
    return this.http.post<any>(`${this.docBaseUrl}/${docId}/flashcards`, flashcard);
  }

  deleteFlashcardFromDocument(docId: number, flashcardId: number): Observable<any> {
    return this.http.delete<any>(`${this.docBaseUrl}/${docId}/flashcards/${flashcardId}`);
  }

  regenerateQuiz(docId: number, questionCount: number, questionType: string): Observable<any> {
    return this.http.post<any>(
      `${this.docBaseUrl}/${docId}/regenerate-quiz?questionCount=${questionCount}&questionType=${questionType}`,
      {}
    );
  }

  // AI Mentor Chat APIs
  chatWithMentor(message: string): Observable<MentorChatResponse> {
    return this.http.post<MentorChatResponse>(`${this.mentorBaseUrl}/chat`, { message });
  }
}
