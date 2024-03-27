import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, setDoc, onSnapshot, getDoc } from '@angular/fire/firestore';
import { GlobalVariablesService } from '../app-services/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseChannelService {

  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);

  constructor() { }

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

  updateChannel(channelId: string, item: any) {
    console.log(`Aktualisiere Kanal ${channelId} mit `, item);
    const docRef = doc(this.firestore, 'channels', channelId);
    return updateDoc(docRef, item)
      .then(() => console.log("Daten erfolgreich aktualisiert"))
      .catch(error => console.error("Fehler beim Aktualisieren der Daten", error));
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
      console.log("Dokumentdaten:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("Kein Dokument gefunden!");
      return null;
    }
  }

  listenToChannelData(channelId: string) {
    const docRef = doc(this.firestore, 'channels', channelId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        console.log("Aktuelle Kanaldaten:", doc.data());
        // Behandle die aktualisierten Daten, z.B. durch Aktualisierung des UI
      } else {
        console.log("Kein Dokument gefunden!");
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
        if (this.globalVariables.openChannel && this.globalVariables.openChannel.id === channelId) {
          this.globalVariables.openChannel.titel = newTitle;
        }
      });
    }


}
