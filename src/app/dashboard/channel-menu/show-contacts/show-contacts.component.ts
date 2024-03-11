import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from '../add-new-channel/add-new-channel.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseCannelService } from 'app/services/firebase-services/firebase-cannel.service';
import { Observable, from, map, of, Subject} from 'rxjs';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { User } from 'app/models/user.class';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { ChannelMenuComponent } from '../channel-menu.component';
import { FormsModule } from '@angular/forms';

@Component({
  // Komponenten-Metadaten...
})
export class ShowContactsComponent implements OnInit {
  allUsers: any = [];
  firestore = inject(Firestore); // Firestore-Dienst injizieren

  globalFunctions = inject(GlobalFunctionsService);
  globalVariables = inject(GlobalVariablesService);

  constructor() {}

  ngOnInit() {
    this.loadChannelMembers();
  }

  async loadChannelMembers() {
    const memberIds = this.globalVariables.openChannel.members;
    if (memberIds && memberIds.length > 0) {
      const usersCollectionRef = collection(this.firestore, 'users');
      const q = query(usersCollectionRef, where('userId', 'in', memberIds));
      
      try {
        const querySnapshot = await getDocs(q);
        this.allUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
      }
    }
  }
}
