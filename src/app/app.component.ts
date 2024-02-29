import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { ButtonComponent } from './shared/button/button.component';
import { HeaderComponent } from './shared/header/header.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { GlobalVariablesService } from './services/app-services/global-variables.service';
import { ProfileComponent } from './profile/profile.component';
import { GlobalFunctionsService } from './services/app-services/global-functions.service';
import { AddNewChannelComponent } from './dashboard/channel-menu/add-new-channel/add-new-channel.component';
import { AddContactsComponent } from './dashboard/channel-menu/add-contacts/add-contacts.component';
import { PrivateChatComponent } from './dashboard/private-chat/private-chat.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ButtonComponent,
    DialogComponent,
    HeaderComponent,
    ProfileComponent,
    AddNewChannelComponent,
    AddContactsComponent,
    PrivateChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);

  title = 'da-bubble';

  redirectToDashboard() {
    window.location.href = '/dashboard';
  }

  //der Eventlistener ist nur nötig, wenn man die Bildschirmgröße live ändern will
  //aber wir können hier feste Breakpoints festlegen und können so die Screenbeiten anpassen ohne die Werte in den jeweiligen SCSS Fisles zu suchen
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setDesktopFlag();
  }
  setDesktopFlag() {
    this.globalVariables.desktop600 = window.innerWidth > 600;
    this.globalVariables.desktop900 = window.innerWidth > 900;
  }
}
