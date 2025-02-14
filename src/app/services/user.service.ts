// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8000/api/auth/users/';  // API-URL anpassen

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    console.log("API wird aufgerufen...");
    return this.http.get<User[]>(this.apiUrl);
  }
}
