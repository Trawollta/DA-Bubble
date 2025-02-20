import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Channel } from 'app/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChatChannelService {
  // Basis-URL deines Django-Backends (anpassen!)
  private baseUrl = 'http://localhost:8000/api/chat';

  constructor(private http: HttpClient) { }

  public updateMessages(messages: any[]): void {
    this.messagesSubject.next(messages);
  }
  
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  selectedChannel$ = this.selectedChannelSubject.asObservable();

  // Setzt den ausgewählten Channel
  setSelectedChannel(channel: Channel) {
    console.log("✅ setSelectedChannel() wird aufgerufen mit:", channel); // 🔥 Debug-Log
    this.selectedChannelSubject.next(channel);
  }
  

  // Channels abrufen (GET /chatrooms/)
  getChannels(): Observable<any> {
    return this.http.get(`${this.baseUrl}/chatrooms/`);
  }

  // Neuen Chat-Raum erstellen (POST /chatrooms/)
  createChannel(channelData: { name: string; participants: number[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/channels/`, channelData).pipe(
      tap((response: any) => console.log('✅ Channel erfolgreich erstellt:', response)), // Debugging
      catchError(error => {
        console.error('❌ Fehler beim Erstellen des Channels:', error);
        return throwError(() => new Error('Fehler beim Erstellen des Channels'));
      })
    );
  }

    // Alle Benutzer abrufen (GET /users/)
    getUsers(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/users/`).pipe(
        tap(users => console.log("✅ Benutzerliste erhalten:", users)), // Debugging
        catchError(error => {
          console.error("❌ Fehler beim Abrufen der Benutzer:", error);
          return throwError(() => new Error('Fehler beim Abrufen der Benutzer'));
        })
      );
    }
  
  

  // Einen existierenden Chat-Raum abrufen (GET /chatrooms/:id/)
  getChannel(channelId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/chatrooms/${channelId}/`);
  }

  // Chat-Raum aktualisieren (PUT /chatrooms/:id/)
  updateChannel(channelId: number, updateData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/chatrooms/${channelId}/`, updateData);
  }

  // Chat-Raum löschen (DELETE /chatrooms/:id/)
  deleteChannel(channelId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/chatrooms/${channelId}/`);
  }

  // Nachrichten in einem Chat-Raum abrufen (GET /chatrooms/:room_id/messages/)
  getMessages(roomId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/chatrooms/${roomId}/messages/`);
  }


  // Neue Nachricht in einem Chat-Raum senden (POST /chatrooms/:room_id/messages/)
  sendMessage(roomId: number, content: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chatrooms/${roomId}/messages/`, { content });
  }

  // Automatische Chat-Zusammenfassung abrufen (GET /chatrooms/:room_id/summarize/)
  getChatSummary(roomId: number): Observable<{ summary: string }> {
    return this.http.get<{ summary: string }>(`${this.baseUrl}/chatrooms/${roomId}/summarize/`);
  }

  // Antwortvorschläge abrufen (POST /ai/suggest_replies/)
  getSmartReplies(message: string): Observable<{ suggestions: string[] }> {
    return this.http.post<{ suggestions: string[] }>(`${this.baseUrl}/ai/suggest_replies/`, { message });
  }
}
