import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError, map, forkJoin } from 'rxjs';
import { API_BASE_URL } from '../api-config';

const API_URL = `${API_BASE_URL}/api/auth/`;
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  
  // Signal to check log-in state reactively
  readonly currentUser = signal<any>(this.getUserFromStorage());

  // Signal caches for character and roadmap presence
  readonly hasCharacterState = signal<boolean | null>(null);
  readonly hasRoadmapState = signal<boolean | null>(null);

  register(email: string, password: string): Observable<any> {
    return this.http.post(API_URL + 'register', { email, password });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(API_URL + 'change-password', { oldPassword, newPassword });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(API_URL + 'forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(API_URL + 'reset-password', { token, newPassword });
  }

  googleLogin(idToken: string): Observable<any> {
    return this.http.post<any>(API_URL + 'google', { idToken }).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveToken(response.token);
          this.saveUser(response);
          this.currentUser.set(response);
          this.hasCharacterState.set(response.hasCharacter);
        }
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(API_URL + 'login', { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveToken(response.token);
          this.saveUser(response);
          this.currentUser.set(response);
          this.hasCharacterState.set(response.hasCharacter);
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
    this.currentUser.set(null);
    this.hasCharacterState.set(null);
    this.hasRoadmapState.set(null);
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  saveUser(user: any): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): any {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  private getUserFromStorage(): any {
    if (typeof window !== 'undefined') {
      const user = window.localStorage.getItem(USER_KEY);
      if (user) {
        try {
          return JSON.parse(user);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  // Check onboarding status (character & roadmap presence)
  checkOnboardingStatus(forceRefresh = false): Observable<{ hasCharacter: boolean; hasRoadmap: boolean }> {
    if (!this.isLoggedIn()) {
      return of({ hasCharacter: false, hasRoadmap: false });
    }

    if (
      !forceRefresh &&
      this.hasCharacterState() !== null &&
      this.hasRoadmapState() !== null
    ) {
      return of({
        hasCharacter: this.hasCharacterState()!,
        hasRoadmap: this.hasRoadmapState()!
      });
    }

    const charObs = this.http.get(`${API_BASE_URL}/api/characters/me`).pipe(
      map(() => true),
      catchError(() => of(false))
    );

    const roadmapObs = this.http.get(`${API_BASE_URL}/api/placement-test/roadmap`).pipe(
      map(() => true),
      catchError(() => of(false))
    );

    return forkJoin({ hasCharacter: charObs, hasRoadmap: roadmapObs }).pipe(
      tap(status => {
        this.hasCharacterState.set(status.hasCharacter);
        this.hasRoadmapState.set(status.hasRoadmap);
      })
    );
  }
}
