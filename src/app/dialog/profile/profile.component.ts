import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profile = {
    img: 'assets/img/avatars/Frederik Beck.svg',
    profilename: 'Frederik Beck',
    email: 'emil@beispiel.com',
    online: true
  }

  profileNameBuffer:string = '';
  emailBuffer:string = '';

  firebaseService = inject(FirebaseUserupdateService);
  globalVariables = inject(GlobalVariablesService);

  close() {
    this.globalVariables.showProfile = false;
  }

  openMessage() {
    this.globalVariables.showWriteMessage = true;
  }

  editProfile(){
    this.globalVariables.showEditProfile = true;
    this.firebaseService.setActiveUserId(this.globalVariables.activeID);
    this.firebaseService.updateData();
  }
  cancelEdit(){
    this.profileNameBuffer = '';
    this.emailBuffer = '';
    this.globalVariables.showEditProfile = false
  }
  sumbitEdit(){

  }
}
