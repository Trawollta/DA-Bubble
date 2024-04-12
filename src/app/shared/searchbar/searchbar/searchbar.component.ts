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
  SIMILARITY_THRESHOLD = 0.5;
  /**
   * main function to direct the value to various function and save relatedChats of msg
   * @param value input string
   */
  handleInputChange(event: string): void {
    if (!event.trim()) {
      this.bestMatches = [];
    } else {
      this.searchForWord(event);
    }
  }

  log(data: any) {
    console.log(data);
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

    await Promise.all([
      setTimeout(() => {
        this.getChatMessages();
      }, 2000),
    ]);
    console.log(this.allMessages);
  }

  /**
   * all function which are connected with searching in the database for the msg and or channel and or Member
   * @param word
   */
  async searchForWord(word: string) {
    /* await Promise.all([this.getChats(), this.connectChannelWithChannelMsg()]); */
    await this.compareInputWithChannelMessages(word);
  }

  getRelatedChats() {
    this.relatedChats = this.globalVariables.currentUser.relatedChats;
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
    this.getCleanNames();
    this.getCleanChannels();
    console.log('Alle Msg:', this.allMessages);
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
    this.result = this.compareMsg(input);
  }

  newCompare(input: string) {
    this.compareMsg(input);
  }

  compareMsg(input: string) {
    this.bestMatches = [];
    for (let i = 0; i < this.allMessages.length; i++) {
      for (let j = 0; j < this.allMessages[i].messages.length; j++) {
        const message = this.allMessages[i].messages[j].message;
        if (message && message.includes(input)) {
          this.bestMatches.push({
            message: message,
            userId: this.allMessages[i].messages[j].userId,
            docId: this.allMessages[i].messages[j].relatedChannelId,
            timestamp: this.allMessages[i].messages[j].timestamp,
            name: this.allMessages[i].messages[j].name,
            channelName: this.allMessages[i].messages[j].channelName,
          });
        }
      }
      console.log(this.bestMatches);
    }
  }

  /**
   * Vergleicht den Eingabestring mit den Nachrichten im Array und gibt die am besten übereinstimmenden Nachrichten zurück.
   * @param {string} input - Der Eingabestring, der mit den Nachrichten verglichen werden soll.
   * @returns {object[]} - Ein Array mit den am besten übereinstimmenden Nachrichten.
   */
  async compareMsgFromInput(input: string) {
    const inputWords = this.preprocess(input);
    const allWords: string[] = [];
    for (let messageGroup of this.allMessages) {
      for (let message of messageGroup.messages) {
        const messageWords = this.preprocess(message.message);
        allWords.push(...messageWords);
      }
    }
    const uniqueWords = Array.from(new Set(allWords));
    const inputVector = this.getFeatureVector(inputWords, uniqueWords);
    this.bestMatches = [];
    for (let messageGroup of this.allMessages) {
      for (let message of messageGroup.messages) {
        const messageWords = this.preprocess(message.message);
        const messageVector = this.getFeatureVector(messageWords, uniqueWords);
        const similarity = this.calculateSimilarity(inputVector, messageVector);
        if (similarity > this.SIMILARITY_THRESHOLD) {
          this.bestMatches.push({
            message: message.message,
            userId: message.userId,
            docId: messageGroup.relatedChannelId,
            timestamp: message.timestamp,
            name: message.name,
            channelName: message.channelName,
            similarity: similarity,
          });
        }
      }
    }
    return this.bestMatches;
  }

  /**
   * Führt die Vorverarbeitung des Textes durch, indem Satzzeichen entfernt und der Text in Kleinbuchstaben konvertiert wird.
   * @param {string} text - Der zu verarbeitende Text.
   * @returns {string[]} - Ein Array mit den vorverarbeiteten Wörtern.
   */
  preprocess(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]|_/g, '') // Entfernt Satzzeichen und Unterstriche
      .replace(/\n/g, '') // Entfernt Zeilenumbrüche
      .split(' ');
  }

  /**
   * Erstellt den Feature-Vektor für eine Liste von Wörtern basierend auf einem Satz von einzigartigen Wörtern.
   * @param {string[]} words - Die Liste der Wörter, für die der Feature-Vektor erstellt werden soll.
   * @param {string[]} allWords - Ein Satz von einzigartigen Wörtern.
   * @returns {number[]} - Der Feature-Vektor für die Liste der Wörter.
   */
  getFeatureVector(words: string[], allWords: string[]): number[] {
    const featureVector: number[] = [];
    for (const word of allWords) {
      featureVector.push(words.filter((w) => w === word).length);
    }
    return featureVector;
  }

  /**
   * calculate the cosine similarity between two vectors
   * @param {number[]} vector1 - first vector
   * @param {number[]} vector2 - second vector
   * @returns {number} - the consine similarity between the two vectors
   */
  calculateSimilarity(vector1: number[], vector2: number[]): number {
    const dotProduct = vector1.reduce(
      (acc, val, i) => acc + val * vector2[i],
      0
    );
    const magnitude1 = Math.sqrt(
      vector1.reduce((acc, val) => acc + val ** 2, 0)
    );
    const magnitude2 = Math.sqrt(
      vector2.reduce((acc, val) => acc + val ** 2, 0)
    );
    return dotProduct / (magnitude1 * magnitude2);
  }

  addUserToMessage(messageArray: any) {
    console.log(messageArray.userId);
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
      console.log(this.allMessages);
    }
  }
}
