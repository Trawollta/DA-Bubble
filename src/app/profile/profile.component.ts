import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { user } from '@angular/fire/auth'; //wozu ist das hier nötig?
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { FirebaseUserupdateService } from 'app/services/firebase-services/firebase-userupdate.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { User } from 'app/models/user.class';

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



  profile: User = {
    img: this.globalVariables.currentUser.img,
    name: this.globalVariables.currentUser.name, 
    email: this.globalVariables.currentUser.email,
    isActive: this.globalVariables.currentUser.isActive 
  }

async ngOnInit(){
 // console.log('Aufruf des Profile. UserId:', this.globalVariables.profileUserId);
  const userData = await this.firebaseService.getUserData(this.globalVariables.profileUserId);
  //console.log('userData bei Ini: ', userData);
  this.profile = new User(userData);
 // console.log('proflie bei Ini: ', this.profile);
}

  close() {
    this.globalVariables.showProfile = false;
  }

  openMessage() {
    this.globalVariables.showWriteMessage = true;
  }

  editProfile() {
    this.nameBuffer = this.profile.name;
      this.emailBuffer = this.profile.email;
   /*  if (this.globalVariables.ownprofile) {
      this.profileNameBuffer = this.globalVariables.currentUser.name;
      this.emailBuffer = this.globalVariables.currentUser.email;

    } else {
      this.profileNameBuffer = this.globalVariables.userToChatWith.name;
      this.emailBuffer = this.globalVariables.userToChatWith.email;

    } */
    this.globalVariables.showEditProfile = true;
    //this.firebaseService.setActiveUserId(this.globalVariables.activeID);
  }

  cancelEdit() {
    this.nameBuffer = '';
    this.emailBuffer = '';
    this.globalVariables.showEditProfile = false
  }
  sumbitEdit() {
    if (this.emailBuffer !== this.profile.email) {
      // für später: ich brauche ein Objekt, dass den geänderten Wert aufnimmt und falls auch der Name geändert wurde mit diesem zusammenfügen. und möglicherweise muss in das Objekt noch der neue Bildpfad rein, wenn es geändert wurde
    }
    //ich muss an updateData dann das Array übergeben
    this.firebaseService.updateData(this.data);
  }

    // ich muss hier eine Möglichkeit schaffen, dass ich das Dokument updaten kann und dabei nur die Elemente angebe, die verändert werden sollen.
  // Ich könnte die Eingabe mit dem Wert aus der Datenbank vergleichen und es nur dann in das zu übertragende JSON einbauen, wenn der Wert unterschiedlich ist.
  // Ich will es nicht direkt ändern damit ich bei Abbruch die alten Werte noch habe. und erst ändere, wenn ich auf save klicke.

  data() {
    const nameChanged = this.nameBuffer !== this.profile.name;
    const emailChanged = this.emailBuffer !== this.profile.email;
    const data: { [key: string]: any } = {};
    if(nameChanged) data['name'] = this.nameBuffer;
    if(emailChanged) data['email'] = this.emailBuffer;
    
    return data;
  }
}
