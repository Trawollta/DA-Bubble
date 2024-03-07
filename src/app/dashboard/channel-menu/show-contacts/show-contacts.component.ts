import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { user } from '@angular/fire/auth';



@Component({
  selector: 'app-show-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-contacts.component.html',
  styleUrl: './show-contacts.component.scss'
})
export class ShowContactsComponent {
  allUsers: any = [];

  globalFunctions = inject(GlobalFunctionsService);
  globalVariables= inject (GlobalVariablesService)

  openDirectMessageUser(user: any) {
  let userToChatWith = [user];
    this.globalVariables.isUserChat = true;
    this.globalVariables.userToChatWith.name = user.name;
    this.globalVariables.userToChatWith.img = user.img;
   
   
  }

}
