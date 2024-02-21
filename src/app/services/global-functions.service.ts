import { Injectable, inject } from '@angular/core';
import { GlobalVariablesService } from './global-variables.service';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class GlobalFunctionsService {
  globalVariables = inject(GlobalVariablesService);


  channel: boolean = false;
  adduser: boolean = false;

  menuClicked() {
    this.globalVariables.showMenu = !this.globalVariables.showMenu;
    if (this.globalVariables.showMenu) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  openOverlay() {
    this.channel = !this.channel;
    if (this.channel) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  closeOverlay() {
    this.globalVariables.showProfile = false; 
    this.channel = false; 
    
  }

  closeUserOverlay() {
    this.globalVariables.showProfile = false; 
    this.adduser = false; 
    
  }

  openUserOverlay() {
    this.adduser = !this.adduser;
    if (this.adduser) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  toggleOverlays() {
    console.log(`Vorher - channel: ${this.channel}, adduser: ${this.adduser}`);
    this.channel = false;
    this.adduser = true;
    console.log(`Nachher - channel: ${this.channel}, adduser: ${this.adduser}`);
    document.body.style.overflow = 'hidden';
  }

  openDirectMessageUser(user: any) {
    let userToChatWith = [user];
    this.globalVariables.userToChatWith = userToChatWith[0];
    this.globalVariables.isChatVisable = true;
    console.log(this.globalVariables.userToChatWith);
}

  stopPropagation(e: Event) {
    e.stopPropagation();
  }
  constructor(private firestore: Firestore) {}

  // simple function to get data from firestore returns a collection
  getData(item: string) {
    let dataCollection = collection(this.firestore, item);
    console.log(dataCollection);
    return collectionData(dataCollection, { idField: 'id' });
  }


  // function to get data from firebase and save it into an local Array
  getCollection(item: string, targetArray: any) {
    const collectionReference = collection(this.firestore, item);
    onSnapshot(collectionReference, (querySnapshot) => {
      targetArray.length = 0;
      querySnapshot.forEach((doc) => {
        let docData = doc.data();
        docData['id'] = doc.id;
        targetArray.push(docData);
      });
    });
  }

  // function to add data to a Collection you choose
  addData(desc: string, goalCollection: string, description: string) {
    let toGo = description;
    let data = { channelName: desc };
    let dataCollection = collection(this.firestore, goalCollection);
    return addDoc(dataCollection, data);
  }
}
