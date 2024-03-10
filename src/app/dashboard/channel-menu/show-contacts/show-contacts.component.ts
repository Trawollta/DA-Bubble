import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core'; 
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChannelMenuComponent } from '../channel-menu.component';
import { User } from 'app/models/user.class';
import { ChatChannel } from 'app/models/chatChannel.class';

@Component({
  selector: 'app-show-contacts',
  standalone: true,
  imports: [CommonModule, ChannelMenuComponent],
  templateUrl: './show-contacts.component.html',
  styleUrls: ['./show-contacts.component.scss'] // Fehlerkorrektur: styleUrls (plural) statt styleUrl
})
export class ShowContactsComponent  {
  allUsers: any = [];

  // Services über DI (Dependency Injection) injizieren


  globalFunctions = inject(GlobalFunctionsService);
  globalVariables = inject(GlobalVariablesService);

  constructor() {
    // Konstruktor bleibt für die Injektion leer, da wir die modernere inject-Methode verwenden
  }


  }

