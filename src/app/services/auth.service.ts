import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    img: string;
    related_chats: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';

  private userIdSource = new BehaviorSubject<number | null>(null);
  userId$ = this.userIdSource.asObservable(); // Observable, das die ID überwacht

  constructor(private http: HttpClient) {
    this.loadUserId(); // Falls bereits eingeloggt, ID laden
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return new Observable(observer => {
      this.http.post<LoginResponse>(`${this.apiUrl}/login/`, { email, password }).subscribe(response => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Speichert Token
          localStorage.setItem('userId', response.user.id.toString()); // Speichert die Benutzer-ID
          this.userIdSource.next(response.user.id); // Aktualisiert die ID global
        }
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  setUserId(userId: number) {
    localStorage.setItem('userId', userId.toString());
}

getUserId(): number {
    return Number(localStorage.getItem('userId')) || 0;
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.userIdSource.next(null); // Setzt die ID zurück
  }

  getCurrentUserId(): number | null {
    return Number(localStorage.getItem('userId')) || null;
  }

  private loadUserId() {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      this.userIdSource.next(Number(storedId));
    }
  }
}
