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
  openReaction: boolean = false;
  editChannelOverlayOpen: boolean = false;
  editChannel:boolean= false;
  showContacts: boolean= false;
  memberlist: boolean = false;

  menuProfileClicked() {
    this.globalVariables.showProfileMenu = !this.globalVariables.showProfileMenu;
    if (this.globalVariables.showProfileMenu) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  openProfile(ownProfile:boolean, userId:string) {
    this.globalVariables.profileUserId = userId;
    this.globalVariables.ownprofile = ownProfile ? true : false;
    this.globalVariables.showProfile = true;
    console.log('this.globalVariables.ownprofile: ',this.globalVariables.ownprofile)
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

  openUserOverlay() {
    this.adduser = !this.adduser;
    if (this.adduser) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  closeReactionDialog() {
    this.globalVariables.showProfile = false;
    this.adduser = false;

  }

  openReactionDialog() {
    this.openReaction = !this.openReaction;
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
 
    this.editChannelOverlayOpen = true;//!this.editChannelOverlayOpen;
    //console.log('Overlay open state:', this.editChannelOverlayOpen);
    if (this.editChannelOverlayOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    
  }

  showMembers() {
    this.memberlist = !this.memberlist;
    if (this.memberlist) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  closeMembers() {
    this.memberlist = false;
    if (this.memberlist) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }



  openAddContactsOverlay() {
    this.showContacts = true;
    console.log('Overlay should open now. showContacts:', this.showContacts);
    if (this.showContacts) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
}

  closeAddContactsOverlay() {
    this.showContacts = false;
    document.body.style.overflow = 'auto'; 
    console.log('Overlay closed');
  }


  closeEditOverlay() {
    this.editChannelOverlayOpen = false;
    this.globalVariables.showProfile = false; 
    document.body.style.overflow = 'auto';
  }


  
  

  stopPropagation(e: Event) {
    e.stopPropagation();
  }


  constructor(private firestore: Firestore) { }

  // simple function to get data from firestore returns a collection
  getData(item: string) {
    let dataCollection = collection(this.firestore, item);
   // console.log(dataCollection);
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
