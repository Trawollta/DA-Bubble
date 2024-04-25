import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputfieldComponent } from '../../inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { ChatChannel } from 'app/models/chatChannel.class';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
  imports: [InputfieldComponent, CommonModule, ClickedOutsideDirective],
})
export class SearchbarComponent {
  @Input() imgName: string = 'search';
  @Input() classes: string | string[] = [];
  globalVariables = inject(GlobalVariablesService);
  firebaseUserService = inject(FirebaseUserService);
  firebaseChannelService = inject(FirebaseChannelService);
  result: any;
  allDataWithCurrentId: any;
  allChannels: any = [];
  allMessages: any = [];
  relatedChats: any = [];
  allRelatedChatMsgs: any = [];
  info: any = [];
  bestMatches: any = [];
  inputOptionClasses: string[] = ['search-icon'];
  allMessagesLoaded: boolean = false;

  /**
   * main function to direct the value to various function and save relatedChats of msg
   * @param value input string
   */
  async handleInputChange(event: string) {
    if (!this.allMessagesLoaded) {
      return;
    }
    if (!event.trim()) {
      this.bestMatches = [];
    } else {
      this.searchForWord(event);
    }
  }

  closeUser() {
    this.bestMatches = [];
  }

  openChannelWhereMsgIs(data: any) {
    this.firebaseChannelService
      .loadChannelData(data.docId)
      .then((result) => {
        if (result !== null) {
          this.globalVariables.openChannel.chatId = result['chatId'];
          this.globalVariables.openChannel.creator = result['creator'];
          this.globalVariables.openChannel.desc = result['description'];
          this.globalVariables.openChannel.titel = result['channelName'];
          this.overwriteChannel();
        } else {
          console.error('Das Ergebnis der Kanaldaten ist null.');
        }
      })
      .catch((error) => {
        console.error('Fehler beim Laden der Kanaldaten:', error);
      });

    this.bestMatches = [];
  }

  overwriteChannel() {
    this.firebaseChannelService
      .getChannelMessages(this.globalVariables.openChannel.chatId)
      .then((ergebnis) => {
        this.globalVariables.chatChannel = new ChatChannel(ergebnis);
      })
      .catch((error) => {
        console.error('Fehler beim Laden der Kanalnachrichten:', error);
      });
  }


  /**
   * init function which get data and convert them (name/chatId etc.)
   */
  async ngOnInit() {
    await this.getRelatedChats();
    await this.getChatMessages();
  }

  /**
   * all function which are connected with searching in the database for the msg and or channel and or Member
   * @param word
   */
  async searchForWord(word: string) {
    await this.compareInputWithChannelMessages(word);
  }

  /**
   * related chats get initialized with currentUser relatedChats
   */
  async getRelatedChats() {
    this.relatedChats = this.globalVariables.currentUser.relatedChats;
  }

  /**
   * here for channels to get the messages inside channels
   */
  async getChatMessages() {
    for (let i = 0; i < this.relatedChats.length; i++) {
      let messages = await this.firebaseChannelService.getChannelMessages(
        this.relatedChats[i]
      );
      this.allMessages.push(messages);
    }
    this.getCleanNames();
    this.getCleanChannels();
    this.allMessagesLoaded = true;
  }

  /**
   * functions convert all data to docIds
   */
  async getChats() {
    if (this.allMessages == 0) {
      for (let i = 0; i < this.relatedChats.length; i++) {
        let channels =
          await this.firebaseChannelService.loadChannelDataWithChatID(
            this.relatedChats[i]
          );
        this.allChannels.push(channels);
      }
    }
    this.getEachChannelWithDocID();
  }

  /**
   * functions saves all connected chats in this.info
   */
  getEachChannelWithDocID() {
    for (let i = 0; i < this.allChannels.length; i++) {
      this.firebaseChannelService
        .loadChannelData(this.allChannels[i][0])
        .then((data) => {
          this.info.push(data);
        });
    }
  }

  /**
   * functions connect the channel with the channel messages
   */
  async connectChannelWithChannelMsg() {
    if (
      this.allChannels &&
      this.allChannels.length > 0 &&
      this.allChannels.chatId
    ) {
      this.allChannels.chatId.forEach((id: any) => {
        this.firebaseChannelService.getConnectionOfChannel(id).then((data) => {
          this.allRelatedChatMsgs.push(data);
        });
      });
    } else {
      console.log('Keine Kanäle gefunden oder ungültige Daten');
    }
  }

  /**
   * compare function
   * @param input
   */
  async compareInputWithChannelMessages(input: string) {
    this.result = this.compareMsg(input);
  }

  newCompare(input: string) {
    this.compareMsg(input);
  }

  /**
   * initilize bestMatches and push all data which include the input to bestMatches
   * @param input from inputfield
   */
  compareMsg(input: string) {
    this.bestMatches = [];
    for (let i = 0; i < this.allMessages.length; i++) {
      for (let j = 0; j < this.allMessages[i].messages.length; j++) {
        const message = this.allMessages[i].messages[j].message;
        if (message && message.includes(input)) {
          this.bestMatches.push({
            message: message,
            userId: this.allMessages[i].messages[j].userId,
            docId: this.allMessages[i].relatedChannelId,
            timestamp: this.allMessages[i].messages[j].timestamp,
            name: this.allMessages[i].messages[j].name,
            channelName: this.allMessages[i].messages[j].channelName,
          });
        }
      }
    }
  }

  /**
   * convert live bestmatches.userId into best matches.name, firebase connection to revert the original name depended on id
   */
  async getCleanNames() {
    if (Array.isArray(this.allMessages) && this.allMessages.length > 0) {
      for (let i = 0; i < this.allMessages.length; i++) {
        if (
          this.allMessages[i] &&
          Array.isArray(this.allMessages[i].messages) &&
          this.allMessages[i].messages.length > 0
        ) {
          for (let j = 0; j < this.allMessages[i].messages.length; j++) {
            if (
              this.allMessages[i].messages[j] &&
              this.allMessages[i].messages[j].userId
            ) {
              await this.firebaseUserService
                .getUserData(this.allMessages[i].messages[j].userId)
                .then((data: any) => {
                  if (data && data.name) {
                    this.allMessages[i].messages[j].name = data.name;
                  }
                })
                .catch((error: any) => {
                  console.log(error);
                });
            }
          }
        }
      }
    }
  }

  /**
   * convert channels in real channel names
   */
  async getCleanChannels() {
    if (Array.isArray(this.allMessages) && this.allMessages.length > 0) {
      for (let i = 0; i < this.allMessages.length; i++) {
        if (
          this.allMessages[i] &&
          Array.isArray(this.allMessages[i].messages) &&
          this.allMessages[i].messages.length > 0
        ) {
          for (let j = 0; j < this.allMessages[i].messages.length; j++) {
            if (
              this.allMessages[i].messages[j] &&
              this.allMessages[i].relatedChannelId // Assuming relatedChannelId exists
            ) {
              await this.firebaseChannelService
                .getChannelData(this.allMessages[i].relatedChannelId)
                .then((data: any) => {
                  if (data && data.channelName) {
                    this.allMessages[i].messages[j].channelName =
                      data.channelName;
                  }
                })
                .catch((error: any) => {
                  console.error(error);
                });
            }
          }
        }
      }
    }
  }
}
