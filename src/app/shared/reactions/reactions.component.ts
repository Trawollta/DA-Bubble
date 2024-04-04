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
  @Input() originalMessage: any;

  // Variable für das ausgewählte Emoji
  choosedEmoji: string = '';
  editMessage: boolean = false;
  showValidatePopup=false;
  forbiddenChars: string = '';

  emojiList: Array<any> = [];
  allEmojis: Array<any> = []; // wo wird das gebraucht? 

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

    this.newEmoji.emit(emoji);
    if (this.message.emoji[0].icon === '') {
      this.message.emoji[0].icon = emoji.character;
      this.message.emoji[0].userId = [this.globaleVariables.activeID];
      this.message.emoji[0].iconId = emoji.codePoint;
    } else {
      let existingEmoji = this.message.emoji.find(
        (e: any) => e.iconId === emoji.codePoint
      );
      if (existingEmoji) {
        if (!Array.isArray(existingEmoji.userId)) {
          existingEmoji.userId = [existingEmoji.userId];
        }
        existingEmoji.userId.push(this.globaleVariables.activeID);
      } else {
        this.message.emoji.push({
          icon: emoji.character,
          userId: [this.globaleVariables.activeID],
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
    let chatFamiliy = this.globaleVariables.isUserChat ? 'chatusers' : 'chatchannels';
    this.firebaseChatService.sendMessage(this.globaleVariables.openChannel.chatId, chatFamiliy);
    this.remove(this.globaleVariables.openChannel.chatId, chatFamiliy);
  }


  remove(chatId: string, chatFamiliy: string) {
    return updateDoc(doc(this.firestore, chatFamiliy, chatId), {
      messages: arrayRemove(this.originalMessage),
    });
  }

  editOpen() {
    this.globaleVariables.editMessage = true;
  }

  /**
   * diese funktion sollte vergleichen, hinzufügen
   * @param element
   * @returns
   */
/*   helper(element: any): any {
    if (element) {
      const activeID = this.globaleVariables.activeID;
      if (!element.userId.includes(activeID)) {
        element.userId.push(activeID);
      }
    }
    return {
      icon: element.icon,
      userId: element.userId,
      iconId: element.iconId
    };
  }
 */

  getEmojiUserId(element: any, userIdAsArray: any[]) {
    let userIds = element.userId;
    if (Array.isArray(userIds)) {
      userIds.forEach((userId: any) => {
        // check if ID is already inside
        const index = userIdAsArray.indexOf(userId);
        if (index !== -1) {
          // on exist delete
          userIdAsArray.splice(index, 1);
        } else {
          // when not add
          userIdAsArray.push(userId);
        }
      });
    } else {
      // check if ID is already inside
      const index = userIdAsArray.indexOf(userIds);
      if (index !== -1) {
        // on exist delete
        userIdAsArray.splice(index, 1);
      } else {
        // on exist delete
        userIdAsArray.push(userIds);
      }
    }
  }

  editClose() {
    this.globaleVariables.editMessage = false;
    this.message.message = this.originalMessage.message;
  }

  editSave() {
    this.forbiddenChars = this.globaleFunction.isMessageValid(this.message.message); 
    if (this.forbiddenChars.length === 0) {
      this.globaleVariables.editMessage = false;
      this.globaleVariables.messageData = this.message;
      let chatFamiliy = this.globaleVariables.isUserChat ? 'chatusers' : 'chatchannels';
      this.firebaseChatService.sendMessage(
        this.globaleVariables.openChannel.chatId, chatFamiliy
      );
      if (this.originalMessage.message !== this.message.message)
        this.remove(this.globaleVariables.openChannel.chatId, chatFamiliy);
    }
    else{
      this.showValidatePopup=true; 
    }
  }
  
  closeValidatePopup(){   
    this.showValidatePopup=false;
  }
}
