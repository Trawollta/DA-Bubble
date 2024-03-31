import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
//import { user } from '@angular/fire/auth'; //wozu ist das hier nötig?
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { FirebaseUserupdateService } from 'app/services/firebase-services/firebase-userupdate.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { User } from 'app/models/user.class';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ButtonComponent,
    InputfieldComponent,
    CommonModule,
    FormsModule,
    ClickedOutsideDirective
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {


  isPopupOpen: boolean = false;
  isEditElementclicked = false;
  nameBuffer: string = '';
  emailBuffer: string = '';

  firebaseService = inject(FirebaseUserupdateService);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);


  //initial setting
  profile: User = {
    img: this.globalVariables.currentUser.img,
    name: this.globalVariables.currentUser.name,
    email: this.globalVariables.currentUser.email,
    isActive: this.globalVariables.currentUser.isActive,
    relatedChats: this.globalVariables.currentUser.relatedChats as string[]
  }

  /**
   * this function sets the isPopupOpen flag and take over profile data for the choosen user
   */
  async ngOnInit() {
    this.isPopupOpen = true;   
    this.globalVariables.userToChatWith.id = this.globalVariables.profileUserId; 
    const userData = await this.firebaseService.getUserData(this.globalVariables.profileUserId);
    this.profile = new User(userData); 
  }

  /**
   * this function just closes the profile
   */
  close() {
    this.globalVariables.showProfile = false;
  }

  /**
   * this function just shows the edit elements
   */
  editProfile() {
    this.nameBuffer = this.profile.name;
    this.emailBuffer = this.profile.email;
    this.globalVariables.showEditProfile = true;
    this.isEditElementclicked = true;
  }

  /**
   * this function just closes the edit elements
   */
  cancelEdit() {
    this.nameBuffer = '';
    this.emailBuffer = '';
    this.globalVariables.showEditProfile = false
    this.isEditElementclicked = true;
  }

  /**
  * this function calls the update function from firebase service
  */
  async sumbitEdit() {
    this.firebaseService.updateData(this.data());
    const userData = await this.firebaseService.getUserData(this.globalVariables.profileUserId);
    this.profile = new User(userData);
    this.cancelEdit();
    this.isEditElementclicked = false;
  }

  /**
   * This function returns the a JSON which contains the data need to be updated
   * @returns JSON 
   */
  data(): {} {
    const nameChanged = this.nameBuffer !== this.profile.name;
    const emailChanged = this.emailBuffer !== this.profile.email;
    const data: { [key: string]: any } = {};
    if (nameChanged) data['name'] = this.nameBuffer;
    if (emailChanged) data['email'] = this.emailBuffer; // ich brauche noche eine Prüfung, ob die E-Mailadresse ok ist
    return data;
  }



  /**
  * this function closes the showContacts popup by using appClickedOutside from ClickedOutsideDirective
  */
  closeProfile() {
    if (this.isEditElementclicked) {
      this.isEditElementclicked = false;
    } else if (this.isPopupOpen) {
      this.isPopupOpen = false;
    }
    else {
      this.globalVariables.showProfile = false;
    }
  }

}
