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
import { FormsModule } from '@angular/forms';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import {
  Firestore,
  arrayRemove,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';

@Component({
  selector: 'app-reactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reactions.component.html',
  styleUrl: './reactions.component.scss',
})
export class ReactionsComponent {
  firestore: Firestore = inject(Firestore);
  globaleVariables = inject(GlobalVariablesService);
  globaleFunction = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  @Output() newEmoji = new EventEmitter<string>();
  @Input() message: any;

  originalMessage = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: '', iconId: '' }],
  };

  // Variable für das ausgewählte Emoji
  choosedEmoji: string = '';
  editMessage: boolean = false;

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
    console.log(emoji);
    this.newEmoji.emit(emoji);
    if (this.message.emoji[0].icon === '') {
      this.message.emoji[0].icon = emoji.character;
      this.message.emoji[0].userId = this.globaleVariables.activeID;
      this.message.emoji[0].iconId = emoji.codePoint;
    } else {
      let existingEmoji = this.message.emoji.find(
        (e: any) => e.iconId === emoji.codePoint
      );
      if (existingEmoji) {
        existingEmoji.userId += ', ' + this.globaleVariables.activeID;
      } else {
        this.message.emoji.push({
          icon: emoji.character,
          userId: this.globaleVariables.activeID,
          iconId: emoji.codePoint,
        });
      }
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
    console.log('Das ist die Nachricht die hochgeladen wird: ', this.message);
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
        iconId: element.iconId,
      });
    });
    console.log('in reactions original Message: ', this.originalMessage);
  
    this.remove(this.globaleVariables.openChannel.chatId);
  }

  remove(chatId: string) {
    return updateDoc(doc(this.firestore, 'chatchannels', chatId), {
      messages: arrayRemove(this.originalMessage),
    });
  }

  editOpen() {
    this.globaleVariables.editMessage = true;
    this.originalMessage.message = this.message.message;
    this.originalMessage.answerto = this.message.answerto;
    this.originalMessage.timestamp = this.message.timestamp;
    this.originalMessage.userId = this.message.userId;
    this.originalMessage.emoji = [];

    this.message.emoji.forEach((element: any) => {
      this.originalMessage.emoji.push({
        icon: element.icon,
        userId: element.userId,
        iconId: element.iconId,
      });
    });
  }

  editClose() {
    this.globaleVariables.editMessage = false;
  }

  editSave() {
    this.globaleVariables.editMessage = false;
    this.globaleVariables.messageData = this.message;
    this.firebaseChatService.sendMessage(
      this.globaleVariables.openChannel.chatId
    );
    if (this.originalMessage.message !== this.message.message)
      this.remove(this.globaleVariables.openChannel.chatId);
  }
}
