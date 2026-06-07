import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_URL = 'http://localhost:8080/api/auth/';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  
  // Signal to check log-in state reactively
  readonly currentUser = signal<any>(this.getUserFromStorage());

  register(email: string, password: string): Observable<any> {
    return this.http.post(API_URL + 'register', { email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(API_URL + 'login', { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveToken(response.token);
          this.saveUser(response);
          this.currentUser.set(response);
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
}
