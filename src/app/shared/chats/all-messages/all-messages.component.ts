import {
  Component,
  inject,
  ChangeDetectorRef,
  Input,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';  // ✅ NGRX Store importieren
import { AppState } from 'app/store/state/app.state';  // ✅ AppState importieren
import { OtherUserMessageComponent } from 'app/shared/chats/other-user-message/other-user-message.component';
import { CurrentUserMessageComponent } from 'app/shared/chats/current-user-message/current-user-message.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-all-messages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './all-messages.component.html',
  styleUrl: './all-messages.component.scss',
  imports: [
    CommonModule,
    OtherUserMessageComponent,
    CurrentUserMessageComponent,
    DatePipe,
  ]
})
export class AllMessagesComponent implements AfterViewChecked, OnInit, OnChanges {
  globalVariablesService = inject(GlobalVariablesService);
  globalFunctionsService = inject(GlobalFunctionsService); 
  authService = inject(AuthService);
  messages$ = this.store.select(state => state.chat.messages); 
  currentUserId: number = Number(localStorage.getItem('userId')) || 0;
  
  lastDisplayedDate: Date = new Date();

  @Input() isChat: boolean = false;
  @Input() isThread: boolean = false;
  @Input() messages: any[] = [];
  @ViewChild('scrolldown') scrollDownElement!: ElementRef;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private store: Store<AppState>  // ✅ Store injizieren
  ) {
    console.log("🟢 AllMessagesComponent wurde geladen!");
  }

  ngOnInit() {
    this.store.select(state => state.chat.messages).subscribe(messages => {
      console.log("🟢 Store-Nachrichten in `AllMessagesComponent` aktualisiert:", messages);
      this.messages = messages; // ❌ Hier fehlt eine neue Referenz
      this.changeDetector.detectChanges();  // ⬅️ UI zwingend aktualisieren
    });
  }
  
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) { 
      console.log("🔄 Neue Nachrichten in `AllMessagesComponent`:", changes['messages'].currentValue);
  
      this.messages = [...changes['messages'].currentValue]; 
      this.changeDetector.detectChanges();
    }
  }
  

  ngAfterViewChecked() {
    if (!this.globalVariablesService.scrolledToBottom) {
      setTimeout(() => {
        this.scrollToElement();
        this.globalVariablesService.scrolledToBottom = true;
      }, 400);
    }
  }

  scrollToElement() {
    if (this.scrollDownElement) {
      this.scrollDownElement.nativeElement.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
    }
  }

  filterMessages() {
    return this.messages ? this.messages.filter(message => message?.content) : [];
  }

  getWeekDay(timestamp: string | number): string {
    const date = new Date(typeof timestamp === 'string' ? Date.parse(timestamp) : timestamp);
    
    if (isNaN(date.getTime())) return 'Unbekannt'; // Falls ungültiges Datum
    
    const today = date.toDateString() === new Date().toDateString();
    return today ? 'Heute' : date.toLocaleDateString('de-DE', { weekday: 'long' });
  }
  

  showDateBar(messageTimestamp: number, index: number, message: string): boolean {
    if (!message) return false;

    let displayDate = false;
    if (this.isChat || this.isThread) {
      if (index === 0) {
        displayDate = true;
      } else {
        displayDate = (this.lastDisplayedDate.toLocaleDateString() !== new Date(messageTimestamp).toLocaleDateString());
      }
    }
    if (displayDate && messageTimestamp !== 0) {
      this.lastDisplayedDate = new Date(messageTimestamp);
    }
    return displayDate;
  }

  meetConditionsCurrentUser(userId?: number) {
    return userId !== undefined && userId === Number(this.globalVariablesService.activeID);
  }

  meetConditionsOtherUser(userId?: number) {
    return userId !== undefined && userId !== Number(this.globalVariablesService.activeID);
  }
}
