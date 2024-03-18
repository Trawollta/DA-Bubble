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



  updateChannel(channelId:string, item: any){
    //debugger;
    const docRef = doc(this.firestore, 'channels', channelId);
    return updateDoc(docRef, item);
  }
  
}
