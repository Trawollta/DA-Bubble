import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.class';
import { Firestore, collection, addDoc, updateDoc, doc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/global-variables.service';



@Injectable({
  providedIn: 'root'
})
export class FirebaseUserupdateService {


  firestore: Firestore = inject(Firestore);
  globalVariablesService = inject(GlobalVariablesService);

  activeID: string = this.globalVariablesService.activeID;
  userProfileData: User = new User; //das brauche ich nicht mehr. Ich habe das ersetzt durch currentUser in den globalen Variablen

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

      if (user.data()&&this.globalVariablesService.currentUser.name != 'Guest') {
        let newUser = new User(user.data());
        this.userProfileData = newUser;
        this.globalVariablesService.currentUser = newUser;
        this.globalVariablesService.activeID = user.id;
      }
      console.log('userProfileData: ', this.globalVariablesService.currentUser);
      console.log('activeId: ', this.globalVariablesService.activeID);
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


 async setdata(){

    await setDoc(doc(this.firestore, "users3", "ok"), this.toJson(this.userProfileData));
  }

  async updateData (){

    await updateDoc (doc(this.firestore, "users3", "ok"), this.buildJson());
  }
  
  // ich muss hier eine Möglichkeit schaffen, dass ich das Dokument updaten kann und dabei nur die Elemente angebe, die verändert werden sollen.
  // Ich könnte die Eingabe mit dem Wert aus der Datenbank vergleichen und es nur dann in das zu übertragende JSON einbauen, wenn der Wert unterschiedlich ist.
  // Ich will es nicht direkt ändern damit ich bei Abbruch die alten Werte noch habe. und erst ändere, wenn ich auf save klicke.

  buildJson(): {} { 
    return {
      email: 'test@testmail.de',
    };
  }

  toJson(user: User): {} {
    return {
      name: user.name,
      email: user.email,
      isActive: user.isActive, //Alex 27.2.24--changed from status to active because it is only a boolean
      img: user.img
    };
  }
}
