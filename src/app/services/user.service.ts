import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  img: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/auth/users/';  // Endpoint zum Abrufen aller Benutzer

  constructor(private http: HttpClient) {}

  // Lädt alle Benutzer
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error("❌ Fehler beim Abrufen der Benutzer:", error);
        return throwError(() => new Error('Fehler beim Abrufen der Benutzer'));
      })
    );
  }

  // Filtert den gewünschten Benutzer anhand der ID
  getUserById(userId: string): Observable<User> {
    return this.getUsers().pipe(
      map(users => {
        const user = users.find(u => u.id.toString() === userId);
        if (!user) {
          throw new Error('Benutzer nicht gefunden');
        }
        return user;
      })
    );
  }
}
