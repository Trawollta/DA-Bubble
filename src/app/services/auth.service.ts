import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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

export interface User {
  id: number;
  email: string;
  name: string;
  img: string;
  related_chats: string[];
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  img: string;
  related_chats: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';

  private userIdSource = new BehaviorSubject<number | null>(null);
  userId$ = this.userIdSource.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserId();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.user.id.toString());
          this.userIdSource.next(response.user.id);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }
  
  guestLogin(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/guest-login/`, {}).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.user.id.toString());
          this.userIdSource.next(response.user.id);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }
  

  register(formData: FormData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register/`, formData).pipe(
      tap(response => {
        console.log("Registrierung erfolgreich:", response);
      }),
      catchError((error) => this.handleError(error))
    );
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
    this.userIdSource.next(null);
    this.currentUserSubject.next(null);
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


  // Definiere hier die handleError Methode:
  private handleError(error: HttpErrorResponse) {
    console.error('AuthService error', error);
    return throwError(() => new Error('AuthService error'));
  }


}
