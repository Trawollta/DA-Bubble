import {
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UiStateService } from 'app/services/uistate.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { ReactionsComponent } from 'app/shared/reactions/reactions.component';
import { FormsModule } from '@angular/forms';
import { User } from 'app/models/user.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-current-user-message',
  standalone: true,
  imports: [
    ReactionsComponent,
    CommonModule,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './current-user-message.component.html',
  styleUrl: './current-user-message.component.scss',
})
export class CurrentUserMessageComponent implements OnDestroy {
  public uiStateService = inject(UiStateService);
  public globalFunctions = inject(GlobalFunctionsService);

  @Input() message: any;
  @Input() index: any;
  @Input() isThread: boolean = false;

  @ViewChild('messageTextareaBubble', { static: false }) messageTextarea!: ElementRef<HTMLTextAreaElement>;

  postingTime: string | null = null;
  user: User = new User();
  messageInfo = { hasUrl: false, message: '', textAfterUrl: '', messageImgUrl: '' };
  originalMessage: any = {};
  
  openReaction: boolean = false;
  localEditMessage: boolean = false;
  hoverUser: string = '';

  answercount: number = 0;
  lastAnswerTime: number = 0;
  hoverIndex: number = 0;

  count: number = 0;
  activeID: string = ''; // 🟢 Variable für activeID
  private subscription: Subscription = new Subscription(); // 🟢 Subscription speichern

  ngOnInit() {
    // 🟢 Richtiges Abonnieren von `activeID$`
    this.subscription = this.uiStateService.activeID$.subscribe(id => {
      this.activeID = id ?? '';
    });

    if (!this.message || !this.message.content) {
      console.warn("⚠️ `message` ist nicht definiert oder hat keinen `content`.");
      return;
    }
    this.messageInfo = this.globalFunctions.checkMessage(this.message.content);
    this.cloneOriginalMessage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // 🟢 Speicher freigeben und Memory Leaks vermeiden
  }

  cloneOriginalMessage() {
    this.originalMessage = { ...this.message };
  }

  openAnswers() {
    this.uiStateService.setShowThread(true);
  }

  onSelectMessage() {
    this.openReaction = true;
  }

  onLeaveMessage() {
    this.openReaction = false;
    this.localEditMessage = false;
  }

  isMessageEdit(check: boolean) {
    this.localEditMessage = check;
    if (check) setTimeout(() => this.setFocusOnTextarea(), 100);
  }

  setFocusOnTextarea() {
    if (this.messageTextarea) {
      const textareaElement = this.messageTextarea.nativeElement;
      if (textareaElement) textareaElement.focus();
    }
  }

  showMessageBeforeImg(): boolean {
    return !!this.messageInfo.message && !this.localEditMessage;
  }

  showMessageImage(): boolean {
    return !!this.messageInfo.hasUrl && !this.localEditMessage;
  }

  showMessageAfterImage(): boolean {
    return !!this.messageInfo.textAfterUrl && !this.localEditMessage;
  }

  onMouseOver(index: number) {
    this.hoverIndex = index;
    this.hoverUser = this.message.emoji[index]?.userId?.[0] || 'Unbekannt';
  }

  onMouseOut() {
    this.hoverIndex = -1;
  }

  addUserIdToEmoji(emoji: any, index: number) {
    if (!emoji.userId.includes(this.activeID)) {
      emoji.userId.push(this.activeID);
    } else {
      emoji.userId = emoji.userId.filter((id: string) => id !== this.activeID);
    }
  }
}
