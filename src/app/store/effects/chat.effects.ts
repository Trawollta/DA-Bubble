import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { setMessages } from '../actions/chat.actions';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ChatEffects {
  constructor(private actions$: Actions) {}

  logMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setMessages), // Reagiere auf `setMessages`
        tap((action) => console.log('Neue Nachricht erhalten:', action.messages))
      ),
    { dispatch: false } // Da es nur ein Log ist, wird nichts weitergegeben
  );
}
