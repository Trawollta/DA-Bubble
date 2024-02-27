import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.class';
import { Firestore, collection, addDoc, updateDoc, doc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/global-variables.service';



@Injectable({
  providedIn: 'root'
})
export class FirebaseUserService {

  firestore: Firestore = inject(Firestore);
  globalVariablesService = inject(GlobalVariablesService);

  activeID: string = this.globalVariablesService.activeID;
  activeUser: User = new User;

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
    return collection(this.firestore, 'testusers');
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

      if (user.data()) {
        let newUser = new User(user.data());
        this.activeUser = newUser;
      }
      console.log('activeUser: ', this.activeUser);
    });
  }

  /**
   * this function is used finally within the HTML to call the information of the clicked user
   * @param userId - the id of the user which should be called
   */
  setActiveUserId(userId:string | undefined){
    userId ? this.activeID = userId : this.activeID; // if a user id exist take this otherwhise the predefined one in gloablevariableservice
  //brauche ich das hier?
  //  this.globalVariablesService.activeID = this.activeID;
    
  console.log('aktive Id: ', this.activeID);
  
  this.getSingleUser(this.activeID)
  }
}
