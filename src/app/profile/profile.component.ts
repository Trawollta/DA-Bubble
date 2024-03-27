import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { user } from '@angular/fire/auth'; //wozu ist das hier nötig?
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { FirebaseUserupdateService } from 'app/services/firebase-services/firebase-userupdate.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { User } from 'app/models/user.class';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ButtonComponent,
    InputfieldComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {



  nameBuffer: string = '';
  emailBuffer: string = '';

  firebaseService = inject(FirebaseUserupdateService);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);



  profile: User = {
    img: this.globalVariables.currentUser.img,
    name: this.globalVariables.currentUser.name, 
    email: this.globalVariables.currentUser.email,
    isActive: this.globalVariables.currentUser.isActive,
    relatedChats: this.globalVariables.currentUser.relatedChats as string[]
  }

async ngOnInit(){
  
  this.globalVariables.userToChatWith.id = this.globalVariables.profileUserId;
  const userData = await this.firebaseService.getUserData(this.globalVariables.profileUserId);
  this.profile = new User(userData);
}

  close() {
    this.globalVariables.showProfile = false;
  }


  editProfile() {
    this.nameBuffer = this.profile.name;
    this.emailBuffer = this.profile.email;
    this.globalVariables.showEditProfile = true;

  }

  cancelEdit() {
    this.nameBuffer = '';
    this.emailBuffer = '';
    this.globalVariables.showEditProfile = false
  }


 async sumbitEdit() {
    this.firebaseService.updateData(this.data());
    const userData = await this.firebaseService.getUserData(this.globalVariables.profileUserId);
    this.profile = new User(userData);
    this.cancelEdit();
  }

 
  data():{} {
    const nameChanged = this.nameBuffer !== this.profile.name;
    const emailChanged = this.emailBuffer !== this.profile.email;
    const data: { [key: string]: any } = {};
    if(nameChanged) data['name'] = this.nameBuffer;
    if(emailChanged) data['email'] = this.emailBuffer; // ich brauche noche eine Prüfung, ob die E-Mailadresse ok ist
    
    return data;
  }
}
