import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, setDoc, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseChannelService {

  firestore: Firestore = inject(Firestore);

  constructor() { }


  updateChannel(channelId:string, item: any){
    //debugger;
    const docRef = doc(this.firestore, 'channels', channelId);
    return updateDoc(docRef, item);
  }
  
}
