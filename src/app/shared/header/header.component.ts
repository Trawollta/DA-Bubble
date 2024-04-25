import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { SearchbarComponent } from '../searchbar/searchbar/searchbar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HeaderMenuComponent, SearchbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  globalVariables = inject(GlobalVariablesService);
 
  openChannels() {
    this.globalVariables.showChannelMenu = true;
    this.globalVariables.isChatVisable = false;
    this.globalVariables.showThread = false;
  }

}
