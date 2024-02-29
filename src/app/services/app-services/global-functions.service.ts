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
  editChannelOverlayOpen: boolean = false;
  editChannel:boolean= false;

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
    // console.log(`Vorher - channel: ${this.channel}, adduser: ${this.adduser}`);
    this.channel = false;
    this.adduser = true;
    // console.log('input feld Channel: ', this.globalVariables.newChannel);
    // console.log(`Nachher - channel: ${this.channel}, adduser: ${this.adduser}`);
    document.body.style.overflow = 'hidden';
  }

  openEditChannelOverlay() {
 
    this.editChannelOverlayOpen = !this.editChannelOverlayOpen;
    console.log('Overlay open state:', this.editChannelOverlayOpen);
    if (this.editChannelOverlayOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    
  }

  closeEditOverlay() {
    this.editChannelOverlayOpen = false;
    this.globalVariables.showProfile = false; 
    document.body.style.overflow = 'auto';
  }
  

  openDirectMessageUser(user: any) {
    let userToChatWith = [user];
    this.globalVariables.userToChatWith = userToChatWith[0];
    this.globalVariables.isChatVisable = true;
  }

  openChannelList(channel: any) {
    this.globalVariables.openChannel = channel.channelName;
    this.globalVariables.isChannelVisible = true;
  }

  stopPropagation(e: Event) {
    e.stopPropagation();
  }


  constructor(private firestore: Firestore) { }

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

  // hab die Funktion geänder 26.2, Alex
  // function to add data to a Collection you choose
  addData(goalCollection: string, input: any) { /* desc: string, , description: string */
    //let toGo = description;
    let data = input;
    let dataCollection = collection(this.firestore, goalCollection);
    return addDoc(dataCollection, data);
  }
}
