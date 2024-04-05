import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  arrayUnion,
  where,
  query,
  getDocs,
  deleteDoc,
} from '@angular/fire/firestore';
import { GlobalVariablesService } from '../app-services/global-variables.service';
import { FirebaseChatService } from './firebase-chat.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChannelService {
  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  firebaseChatService = inject(FirebaseChatService)

  constructor() {}

  // async getChannelById(channelId: string): Promise<any> {
  //   const docRef = doc(this.firestore, 'channels', channelId);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     console.log("Dokumentdaten:", docSnap.data());
  //     return docSnap.data();
  //   } else {
  //     console.log("Kein Dokument gefunden!");
  //     return null;
  //   }
  // }

  addData(goalCollection: string, input: any) {
    let data = input;
    let dataCollection = collection(this.firestore, goalCollection);
    return addDoc(dataCollection, data);
  }

  updateChannel(channelId: string, item: any) {
    console.log(`Aktualisiere Kanal ${channelId} mit `, item);
    const docRef = doc(this.firestore, 'channels', channelId);
    return updateDoc(docRef, item)
      .then(() => console.log('Daten erfolgreich aktualisiert'))
      .catch((error) =>
        console.error('Fehler beim Aktualisieren der Daten', error)
      );
  }

  updateChannelName(channelId: string, newName: string) {
    return this.updateChannel(channelId, { name: newName });
  }

  updateChannelDescription(channelId: string, newDescription: string) {
    return this.updateChannel(channelId, { description: newDescription });
  }

  async loadChannelData(docId: string) {
    const docRef = doc(this.firestore, 'channels', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Dokumentdaten:', docSnap.data());
      return docSnap.data();
    } else {
      console.log('Kein Dokument gefunden!');
      return null;
    }
  }

  listenToChannelData(channelId: string) {
    const docRef = doc(this.firestore, 'channels', channelId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        console.log('Aktuelle Kanaldaten:', doc.data());
        // Behandle die aktualisierten Daten, z.B. durch Aktualisierung des UI
      } else {
        console.log('Kein Dokument gefunden!');
      }
    });
  }

  /**
   * this funktion updates the element
   * @param data -Json
   */
  async updateDataChannel(data: { [x: string]: any }, docId: string) {
    await updateDoc(doc(this.firestore, 'channels', docId), data);
  }

  updateChannelTitle(channelId: string, newTitle: string): void {
    // Aktualisiere den Kanal im Backend, zum Beispiel in Firebase oder einer anderen Datenbank
    this.updateChannel(channelId, { titel: newTitle }).then(() => {
      // Aktualisiere den lokalen Zustand direkt nach dem erfolgreichen Backend-Update
      if (
        this.globalVariables.openChannel &&
        this.globalVariables.openChannel.id === channelId
      ) {
        this.globalVariables.openChannel.titel = newTitle;
      }
    });
  }

  async addUserToChannel(channelId: string, userId: string): Promise<void> {
    const channelRef = doc(this.firestore, 'channels', channelId);
    try {
      await updateDoc(channelRef, {
        members: arrayUnion(userId),
      });
      console.log('Benutzer erfolgreich zum Kanal hinzugefügt');
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Benutzers zum Kanal:', error);
    }
  }

  async deleteChanel(channelId: string) {
    const docId = await this.getDocId(channelId);
    await this.deleteChannelIdFromUsers(channelId);
    const channelDocRef = doc(this.firestore, 'channels', docId[0]);
    await deleteDoc(channelDocRef);
    this.firebaseChatService.changeActiveChannel();
  }

  async getDocId(chatId: string): Promise<string[]> {
    const usersCollectionRef = collection(this.firestore, 'channels');
    const q = query(usersCollectionRef, where('chatId', '==', chatId));
    const querySnapshot = await getDocs(q);
    const docIds: string[] = [];
    querySnapshot.forEach((doc) => {
      docIds.push(doc.id);
      console.log(doc.id, ' => ', doc.data());
    });
    return docIds;
  }

  async deleteChannelIdFromUsers(chatId : string) {
    debugger;
    let usersCollectionRef = collection(this.firestore, 'users');
    const querySnapshot = await getDocs(usersCollectionRef);
    querySnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      if (
        userData &&
        userData['relatedChats'] &&
        userData['relatedChats'].includes(chatId)
      ) {
        const updatedRelatedChats = userData['relatedChats'].filter(
          (id: any) => id !== chatId
        );
        const userDocRef = doc(this.firestore, 'users', userDoc.id);
        await updateDoc(userDocRef, { relatedChats: updatedRelatedChats });
        console.log(`Chat ID removed from user ${userDoc.id}`);
      }
    });
  }
}
