import { createAction, props } from '@ngrx/store';

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: any;
  room: any;
}

// Setzt die komplette Nachrichtenliste
export const setMessages = createAction(
  '[Chat] Set Messages',
  props<{ messages: Message[] }>()
);

// Fügt eine neue Nachricht hinzu (als Objekt, nicht nur als String!)
export const addMessage = createAction(
  '[Chat] Add Message',
  props<{ message: Message }>()  // 🔥 Korrekt typisiert
);

