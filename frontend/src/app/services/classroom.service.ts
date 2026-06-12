import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClassRoomSummary {
  id: number;
  name: string;
  description: string;
  inviteCode: string;
  createdByEmail: string;
  createdAt: string;
  memberCount: number;
  quizCount: number;
  isOwner: boolean;
}

export interface ClassMemberDto {
  userId: number;
  email: string;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string;
}

export interface ClassQuizQuestionDto {
  id: number;
  questionNumber: number;
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK';
  questionText: string;
  optionA?: string | null;
  optionB?: string | null;
  optionC?: string | null;
  optionD?: string | null;
  correctAnswer: string;
  explanation?: string | null;
}

export interface ClassQuizDto {
  id: number;
  title: string;
  description?: string;
  createdByEmail: string;
  isActive: boolean;
  createdAt: string;
  questionCount: number;
  questions: ClassQuizQuestionDto[];
}

export interface ClassRoomDetails extends ClassRoomSummary {
  members: ClassMemberDto[];
  quizzes: ClassQuizDto[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  email: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/classes';

  getMyClasses(): Observable<ClassRoomSummary[]> {
    return this.http.get<ClassRoomSummary[]>(this.baseUrl);
  }

  getClassDetails(id: number): Observable<ClassRoomDetails> {
    return this.http.get<ClassRoomDetails>(`${this.baseUrl}/${id}`);
  }

  createClass(name: string, description: string): Observable<ClassRoomSummary> {
    return this.http.post<ClassRoomSummary>(this.baseUrl, { name, description });
  }

  joinClass(inviteCode: string): Observable<ClassRoomSummary> {
    return this.http.post<ClassRoomSummary>(`${this.baseUrl}/join`, { inviteCode });
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  removeMember(classId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${classId}/members/${userId}`);
  }

  createQuiz(classId: number, title: string, description: string, questions: Partial<ClassQuizQuestionDto>[]): Observable<ClassQuizDto> {
    return this.http.post<ClassQuizDto>(`${this.baseUrl}/${classId}/quizzes`, { title, description, questions });
  }

  updateQuiz(classId: number, quizId: number, title: string, description: string, questions: Partial<ClassQuizQuestionDto>[]): Observable<ClassQuizDto> {
    return this.http.put<ClassQuizDto>(`${this.baseUrl}/${classId}/quizzes/${quizId}`, { title, description, questions });
  }

  deleteQuiz(classId: number, quizId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${classId}/quizzes/${quizId}`);
  }

  submitQuiz(classId: number, quizId: number, answers: Record<string, string>): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${classId}/quizzes/${quizId}/submit`, { answers });
  }

  getLeaderboard(classId: number, quizId: number): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.baseUrl}/${classId}/quizzes/${quizId}/leaderboard`);
  }
}
