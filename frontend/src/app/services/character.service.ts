import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Character {
  id?: number;
  name: string;
  gender: string;
  hairStyle: string;
  hairColor: string;
  faceStyle: string;
  outfitStyle: string;
  title?: string;
  level?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/characters';

  saveCharacter(character: Character): Observable<any> {
    return this.http.post(this.baseUrl, character);
  }

  getMyCharacter(): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/me`);
  }
}
