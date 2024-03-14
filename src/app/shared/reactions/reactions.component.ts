import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import {
  Firestore,
  arrayRemove,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
/* import { CurrentUserMessageComponent } from '../chats/current-user-message/current-user-message.component'; */

@Component({
  selector: 'app-reactions',
  standalone: true,
  imports: [CommonModule /* CurrentUserMessageComponent */],
  templateUrl: './reactions.component.html',
  styleUrl: './reactions.component.scss',
})
export class ReactionsComponent {
  firestore: Firestore = inject(Firestore);
  globaleVariables = inject(GlobalVariablesService);
  firebaseChatService = inject(FirebaseChatService);
  editMessage() {}
  @Output() newEmoji = new EventEmitter<string>();
  @Input() message: any;

  originalMessage = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: '' }],
  };

  // Variable für das ausgewählte Emoji
  choosedEmoji: string = '';

  emojiList: Array<any> = [];
  allEmojis: Array<any> = [];

  url =
    'https://emoji-api.com/emojis?access_key=60ede231f07183acd1dbb4bdd7dde0797f62e95e';

  /**
   * Fetch on init of the API.
   */
  ngOnInit(): void {
    this.getEmojis();
  }

  /**
   * Emoji fetch from API
   */
  getEmojis() {
    fetch(this.url)
      .then((res) => res.json())
      .then((data) => this.loadEmoji(data));
  }

  /**
   * Load all Emojis from API into both Arrays
   * @param {[]} data - The data got info about emojis from the API.
   */
  loadEmoji(data: []) {
    data.forEach((emoji) => {
      this.emojiList.push(emoji);
      this.allEmojis.push(emoji);
    });
  }

  /**
   * Put the Emoji into the choosedEmoji array
   * @param {string} emoji - The selected emoji.
   */
  public showInInput(emoji: any): void {
    this.copyHelper();
    this.newEmoji.emit(emoji);
    if (this.message.emoji[0].icon === '') {
      this.message.emoji[0].icon = emoji.character;
      this.message.emoji[0].userId = this.globaleVariables.activeID;
    } else {
      this.message.emoji.push({
        icon: emoji.character,
        userId: this.globaleVariables.activeID,
      });
    }
    this.addEmoji();
  }

  /**
   * Open and close Emoji Picker depend on style value.
   */
  openEmojis() {
    const emojiDiv = document.getElementById('emoji-selector');
    if (emojiDiv) {
      if (emojiDiv.style.display === 'none') {
        emojiDiv.style.display = 'flex';
      } else {
        emojiDiv.style.display = 'none';
      }
    }
  }

  addEmoji() {
    this.globaleVariables.messageData = this.message;
    console.log('messageData: ', this.message);
    console.log(
      'Globale Message Data info: ',
      this.globaleVariables.messageData
    );
    this.firebaseChatService.sendMessage(
      this.globaleVariables.openChannel.chatId
    );
    this.remove(this.globaleVariables.openChannel.chatId);
  }

  copyHelper() {
    this.originalMessage.message = this.message.message;
    this.originalMessage.answerto = this.message.answerto;
    this.originalMessage.timestamp = this.message.timestamp;
    this.originalMessage.userId = this.message.userId;
    this.originalMessage.emoji = [];

    this.message.emoji.forEach((element: any) => {
      this.originalMessage.emoji.push({
        icon: element.icon,
        userId: element.userId,
      });
    });
    console.log('originalMessage vom CopyHelper: ', this.originalMessage);
    this.remove(this.globaleVariables.openChannel.chatId);
  }

  remove(chatId: string) {
    console.log('remove: ', this.originalMessage);
    return updateDoc(doc(this.firestore, 'chatchannels', chatId), {
      messages: arrayRemove(this.originalMessage),
    });
  }

}
