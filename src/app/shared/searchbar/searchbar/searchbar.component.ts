import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputfieldComponent } from '../../inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
  imports: [InputfieldComponent, CommonModule],
})
export class SearchbarComponent {
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
  bestMatchesArray: any = [];
  /**
   * main function to direct the value to various function and save relatedChats of msg
   * @param value input string
   */
  async handleInputChange(value: string) {
    let user = await this.getDataConnectedWithID(
      this.globalVariables.currentUser.name
    ); // this will be all User Data
    if (user) {
      this.saveRelatedChats(user['relatedChats']);
      this.searchForWord(value);
    } else {
      console.log('Benutzer nicht gefunden oder fehlerhafte Daten');
    }
  }

  /**
   *
   * @param data
   */
  async saveRelatedChats(data: any) {
    this.relatedChats = data;
  }

  /**
   * gives me the docID of the user to give better workflow and get data of him
   * @param id user id
   * @returns
   */
  async getDataConnectedWithID(id: string) {
    let docID = await this.firebaseUserService.getUserDocIdWithName(id);
    let data = this.firebaseUserService.getUserData(docID[0]);
    return data;
  }

  async ngOnInit() {
    setTimeout(() => {
      this.getRelatedChats(); 
    }, 600);

    setTimeout(() => {
      this.getChatMessages();
    }, 2000);
    
  }
  /**
   * all function which are connected with searching in the database for the msg and or channel and or Member
   * @param word
   */
  async searchForWord(word: string) {
    await this.getChats();
    await this.connectChannelWithChannelMsg();
    this.jsonConvert();
    this.getCleanNames();
    this.getCleanChannels();
    await this.compareInputWithChannelMessages(word);
    this.clearPreviousResult();
  }

  getRelatedChats() {
    console.log('MNoin', this.globalVariables.currentUser.relatedChats);
    this.relatedChats = this.globalVariables.currentUser.relatedChats;
    console.log(this.relatedChats)
  }

  /**
   * convert the object into a array to work with
   */
  async jsonConvert() {
    let jsonstring = JSON.stringify(this.bestMatches);
    this.bestMatchesArray = await JSON.parse(jsonstring);
  }

  clearPreviousResult() {
    this.result = [];
  }

  /**
   * here for chahnnels to get the messages inside channels
   */
  async getChatMessages() {
    console.log('getChatMessages', this.relatedChats);
    for (let i = 0; i < this.relatedChats.length; i++) {
      let messages = await this.firebaseChannelService.getChannelMessages(
        this.relatedChats[i]
      );
      this.allMessages.push(messages);
    }
    console.log('init?', this.allMessages);
  }

  /**
   * functions convert all data to docIds
   */
  async getChats() {
    for (let i = 0; i < this.relatedChats.length; i++) {
      let channels =
        await this.firebaseChannelService.loadChannelDataWithChatID(
          this.relatedChats[i]
        );
      this.allChannels.push(channels);
    }
    console.log(this.allChannels);
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
   *
   * @param input
   */
  async compareInputWithChannelMessages(input: string) {
    this.result = await this.compareMsgFromInput(input);
  }

  /**
   * search in all messages.message for the input signs, second one is getting the similarity of message and input
   * @param input
   * @returns matched msges with input
   */
  async compareMsgFromInput(input: string) {
    let highestSimilarity = -1;
    for (let messageGroup of this.allMessages) {
      for (let message of messageGroup.messages) {
        let similarity = this.similarityScore(input, message.message);
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          this.bestMatches = [
            {
              message: message.message,
              userId: message.userId,
              docId: messageGroup.relatedChannelId,
              timestamp: message.timestamp,
            },
          ];
        } else if (similarity === highestSimilarity) {
          let existingMatchIndex = this.bestMatches.findIndex(
            (match: any) => match.message === message.message
          );
          if (existingMatchIndex === -1) {
            this.bestMatches.push({
              message: message.message,
              userId: message.userId,
              docId: messageGroup.relatedChannelId,
              timestamp: message.timestamp,
            });
          }
        }
      }
    }
    return this.bestMatches;
  }

  /**
   * returns the score of the similarity of two strings(as number)
   * @param str1
   * @param str2
   * @returns
   */
  similarityScore(str1: string, str2: string): number {
    const set1 = new Set(str1.split(''));
    const set2 = new Set(str2.split(''));
    const intersection = new Set([...set1].filter((char) => set2.has(char)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  addUserToMessage(messageArray: any) {
    console.log(messageArray.userId);
  }

  /**
   * convert live bestmatches.userId into best matches.name, firebase connection to revert the original name depended on id
   */
  async getCleanNames() {
    console.log(this.bestMatchesArray);
    if (this.bestMatchesArray && this.bestMatchesArray.length > 0) {
      for (let i = 0; i < this.bestMatchesArray.length; i++) {
        if (this.bestMatchesArray[i] && this.bestMatchesArray[i].userId) {
          await this.firebaseUserService
            .getUserData(this.bestMatchesArray[i].userId)
            .then((data: any) => {
              if (data && data.name) {
                this.bestMatchesArray[i].name = data.name;
              }
            })
            .catch((error: any) => {
              console.error('Error fetching user data:', error);
            });
        } else {
          console.error('Invalid entry in bestMatchesArray at index', i);
        }
      }
    } else {
      console.warn('bestMatchesArray is empty or not defined.');
    }
  }

  async getCleanChannels() {
    console.log(this.bestMatchesArray);
    if (this.bestMatchesArray && this.bestMatchesArray.length > 0) {
      for (let i = 0; i < this.bestMatchesArray.length; i++) {
        if (this.bestMatchesArray[i] && this.bestMatchesArray[i].docId) {
          await this.firebaseChannelService
            .getChannelData(this.bestMatchesArray[i].docId)
            .then((data: any) => {
              if (data && data.channelName) {
                this.bestMatchesArray[i].channelName = data.channelName;
              }
            })
            .catch((error: any) => {
              console.error('Error fetching user data:', error);
            });
        } else {
          console.error('Invalid entry in bestMatchesArray at index', i);
        }
      }
    } else {
      console.warn('bestMatchesArray is empty or not defined.');
    }
  }
}
