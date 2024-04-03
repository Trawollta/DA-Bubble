import { Injectable, inject } from '@angular/core';
import { User } from '../../models/user.class';
import {
  Firestore,
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseUserupdateService {
  firestore: Firestore = inject(Firestore);
  globalVariablesService = inject(GlobalVariablesService);

  activeID: string = this.globalVariablesService.activeID;
  userProfileData: User = new User(); //das brauche ich nicht mehr. Ich habe das ersetzt durch currentUser in den globalen Variablen

  unsubSingleUser;

  constructor() {
    this.unsubSingleUser = this.getSingleUser(this.activeID);
  }

  /**
   * this function unsubscribes each function within
   */
  ngOnDestroy() {
    this.unsubSingleUser();
  }

  /**
   * this function returns a reference of collection testusers
   * @returns reference to collection 'user'
   */
  getUserRef() {
    return collection(this.firestore, 'users');
  }

  /**
   * this function returns the reference of the singe user with id... from collection testusers
   * @param docId - document which should read
   * @returns - returns a single document of collection 'user'
   */
  getSingleUserRef(docId: string) {
    return doc(this.getUserRef(), docId);
  }

  /**
   * this function returns the user with id ... from collection testusers
   * @param id - id of active user
   * @returns - array with data of active user
   */
  getSingleUser(id: string) {
    return onSnapshot(this.getSingleUserRef(id), (user) => {
      if (
        user.data() &&
        this.globalVariablesService.currentUser.name != 'Guest'
      ) {
        let newUser = new User(user.data());
        this.globalVariablesService.currentUser = newUser;
        this.globalVariablesService.activeID = user.id;
      }
    });
  }

  /**
   * this function is used finally within the HTML to call the information of the clicked user
   * @param userId - the id of the user which should be called
   */
  setActiveUserId(userId: string | undefined) {
    userId ? (this.activeID = userId) : this.activeID;
    this.getSingleUser(this.activeID);
  }

  /**
   * this funktion updates the element
   * @param data -Json
   */
  async updateData(data: { [x: string]: any }) {
    await updateDoc(doc(this.firestore, 'users', this.activeID), data);
  }

  /**
   * this function returns the data of the user. This is no obserable.
   * @param id -id of user
   * @returns data of user
   */
  async getUserData(id: string) {
    const docSnap = await getDoc(this.getSingleUserRef(id));
    return docSnap.data();
  }

  // erst mal auskommentiert

  /* toJson(user: User): {} {
    return {
      name: user.name,
      email: user.email,
      isActive: user.isActive, //Alex 27.2.24--changed from status to active because it is only a boolean
      img: user.img
    };
  } */
}
