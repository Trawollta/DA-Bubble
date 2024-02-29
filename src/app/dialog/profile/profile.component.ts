import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { user } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/button/button.component';
import { FirebaseUserupdateService } from 'app/firebase-services/firebase-userupdate.service';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';

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

  

  profileNameBuffer:string = '';
  emailBuffer:string = '';

  firebaseService = inject(FirebaseUserupdateService);
  globalVariables = inject(GlobalVariablesService);



  profile = {
    img: this.globalVariables.currentUser.img,
    profilename: this.globalVariables.currentUser.name,
    email: this.globalVariables.currentUser.email,
    online: this.globalVariables.currentUser.isActive
  } 
  close() {
    this.globalVariables.showProfile = false;
  }

  openMessage() {
    this.globalVariables.showWriteMessage = true;
  }

  editProfile(){
    this.profileNameBuffer = this.globalVariables.currentUser.name;
    this.emailBuffer = this.globalVariables.currentUser.email;
    this.globalVariables.showEditProfile = true;
    //this.firebaseService.setActiveUserId(this.globalVariables.activeID);
  }

  cancelEdit(){
    this.profileNameBuffer = '';
    this.emailBuffer = '';
    this.globalVariables.showEditProfile = false
  }
  sumbitEdit(){
    if(this.emailBuffer !== this.globalVariables.currentUser.email){
      // für später: ich brauche ein Objekt, dass den geänderten Wert aufnimmt und falls auch der Name geändert wurde mit diesem zusammenfügen. und möglicherweise muss in das Objekt noch der neue Bildpfad rein, wenn es geändert wurde
    }
    //ich muss an updateData dann das Array übergeben
    this.firebaseService.updateData();
  }
}
