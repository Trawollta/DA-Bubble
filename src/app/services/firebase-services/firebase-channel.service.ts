import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, setDoc, onSnapshot, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseChannelService {

  firestore: Firestore = inject(Firestore);

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

  async loadChannelData() {
    // Beispiel, wie man Kanaldaten aus Firebase abruft
    const docRef = doc(this.firestore, 'channels', 'nu2dor7D33hTQUXYIssO');
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

}
