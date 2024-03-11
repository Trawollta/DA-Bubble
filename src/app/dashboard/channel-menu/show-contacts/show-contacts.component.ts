import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core'; 
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChannelMenuComponent } from '../channel-menu.component';

@Component({
  selector: 'app-show-contacts',
  standalone: true,
  imports: [CommonModule, ChannelMenuComponent],
  templateUrl: './show-contacts.component.html',
  styleUrls: ['./show-contacts.component.scss']
})
export class ShowContactsComponent implements OnInit {
  allUsers: any = [];

  globalFunctions = inject(GlobalFunctionsService);
  globalVariables = inject(GlobalVariablesService);

  constructor() {}

  ngOnInit() {
 
  }

}
