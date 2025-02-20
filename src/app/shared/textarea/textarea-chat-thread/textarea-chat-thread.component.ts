import { CommonModule } from '@angular/common';
import { Component, Input, inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UiStateService } from 'app/services/uistate.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { ChatChannelService } from 'app/services/chat-channel.service';
import { ShowContactsComponent } from 'app/dashboard/channel-menu/show-contacts/show-contacts.component';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';
import { EmojiContainerComponent } from 'app/shared/reactions/emoji-container/emoji-container.component';
import { addMessage } from 'app/store/actions/chat.actions';

@Component({
  selector: 'app-textarea-chat-thread',
  standalone: true,
  imports: [
    CommonModule,
    ShowContactsComponent,
    FormsModule,
    EmojiContainerComponent,
    ClickedOutsideDirective,
  ],
  templateUrl: './textarea-chat-thread.component.html',
  styleUrl: './textarea-chat-thread.component.scss',
})
export class TextareaChatThreadComponent implements OnInit {
  @Input() chatId!: number; 
  @Input() areaType: string = '';
  @Input() messages: any[] = [];

  @ViewChild('messageTextarea') messageTextarea!: ElementRef<HTMLTextAreaElement>;
  
  public uiStateService = inject(UiStateService);
  private chatChannelService = inject(ChatChannelService);
  private store = inject(Store);
  // private chatChannelService = inject(ChatChannelService);

  isUserChat: boolean = false;
  showChannelList: boolean = false;
  showMemberList: boolean = false;
  newMessage: string = '';
  selectedFile: File | null = null;
  isEmojiContainerOpen: boolean = false;
  isMemberContainerOpen: boolean = false;
  isPopupOpen: boolean = false;
  showErrorPopup: boolean = false;
  showValidationPopup: boolean = false;
  fileSize: string = '';
  forbiddenChars: string = '';

  memberlist: boolean = false;
  headerShowMembers: boolean = false;

  private focusSubscription!: Subscription;

  ngOnInit() {
    this.store.select(state => state.chat.messages).subscribe(messages => {
      console.log("🟢 Store-Nachrichten in `TextareaChatThreadComponent` aktualisiert:", messages);
      this.messages = messages;
    });
  }
  

  sendMessage() {
    if (!this.newMessage.trim() || !this.chatId) return;
    const currentUserId = '';
    const newMessage = {
      id: Date.now(), // Temporäre ID
      content: this.newMessage,
      timestamp: new Date().toISOString(),
      sender: { id: currentUserId, name: 'Ich' }, // Sender setzen!
      room: { id: this.chatId }
    };
    // Füge die Nachricht dem UI hinzu und update den Store:
    this.messages = [...this.messages, newMessage];
    this.store.dispatch(addMessage({ message: newMessage }));
    // Sende die Nachricht an den Server:
    this.chatChannelService.sendMessage(this.chatId, this.newMessage).subscribe({
      next: (message) => {
        // Falls der Server die Nachricht zurückgibt, aktualisiere sie
        this.messages = this.messages.map(msg =>
          msg.id === newMessage.id ? message : msg
        );
        this.store.dispatch(addMessage({ message }));
      },
      error: (error) => {
        console.error("Fehler beim Senden der Nachricht:", error);
      }
    });
    this.newMessage = '';
  }
  
  
  

  

  showEmojiContainer() {
    this.isEmojiContainerOpen = true;
  }

  closeEmoji() {
    this.isEmojiContainerOpen = false;
  }

  showMembers() {
    this.isMemberContainerOpen = true;
  }

  closeMembers() {
    this.isMemberContainerOpen = false;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile && this.selectedFile.size > 500000) {
      this.showErrorPopup = true;
      this.fileSize = `${Math.round(this.selectedFile.size / 1000)} KB`;
      this.selectedFile = null;
    }
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }

  closeValidationPopup() {
    this.showValidationPopup = false;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  addName(name: string) {
    this.newMessage += ` @${name} `;
    this.showChannelList = false;
    this.showMemberList = false;
  }
  
  onMessageUpdated(updatedMessage: string) {
    console.log("🔄 Nachricht aktualisiert:", updatedMessage);
    this.newMessage = updatedMessage;
  }
  
  popUpClosed() {
    console.log("❌ Popup geschlossen.");
    this.isMemberContainerOpen = false;
  }
  
  addEmoji(emoji: string) {
    this.newMessage += emoji;
    this.isEmojiContainerOpen = false;
  }
  
}

