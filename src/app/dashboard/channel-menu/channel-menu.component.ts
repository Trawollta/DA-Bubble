import { Component,inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/global-functions.service';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { AddNewChannelComponent } from './add-new-channel/add-new-channel.component';


@Component({
    selector: 'app-channel-menu',
    standalone: true,
    templateUrl: './channel-menu.component.html',
    styleUrl: './channel-menu.component.scss',
    imports: [RouterLink, CommonModule, AddNewChannelComponent]
})
export class ChannelMenuComponent {

  globalVariables = inject (GlobalVariablesService);
  globalFunctions = inject (GlobalFunctionsService);

  openChannels() {}





}
