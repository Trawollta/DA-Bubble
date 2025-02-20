import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonComponent } from './shared/button/button.component';
import { HeaderComponent } from './shared/header/header.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { GlobalVariablesService } from './services/app-services/global-variables.service';
import { ProfileComponent } from './profile/profile.component';
import { GlobalFunctionsService } from './services/app-services/global-functions.service';
import { AddNewChannelComponent } from './dashboard/channel-menu/add-new-channel/add-new-channel.component';
import { AddContactsComponent } from './dashboard/channel-menu/add-contacts/add-contacts.component';
import { UiStateService } from 'app/services/uistate.service';
// import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { FooterComponent } from './shared/footer/footer.component';
//import { PrivateChatComponent } from './dashboard/private-chat/private-chat.component';


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
    FooterComponent,
    ProfileComponent,
    AddNewChannelComponent,
    AddContactsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  // userService = inject(FirebaseUserService);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  public uiStateService = inject(UiStateService);

  desktop500: boolean = window.innerWidth > 500;
  desktop600: boolean = window.innerWidth > 600;
  desktop700: boolean = window.innerWidth > 700;
  desktop800: boolean = window.innerWidth > 800;
  desktop900: boolean = window.innerWidth > 900;
  desktop1200: boolean = window.innerWidth > 1200;

  title = 'da-bubble';

  ngOnInit() {
    // this.auth.onAuthStateChanged(user => {
    //   if (user && this.globalVariables.logout === false) {
    //     this.userService.updateCurrentUser(user.uid);
    //   } else {
    //   }
    // });
  }


  //der Eventlistener ist nur nötig, wenn man die Bildschirmgröße live ändern will
  //aber wir können hier feste Breakpoints festlegen und können so die Screenbeiten anpassen ohne die Werte in den jeweiligen SCSS Files zu suchen
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setDesktopFlag();
  }


  setDesktopFlag() {
    this.desktop500 = window.innerWidth >= 500;
    this.desktop600 = window.innerWidth >= 600;
    this.desktop700 = window.innerWidth >= 700;
    this.desktop800 = window.innerWidth >= 800;
    this.desktop900 = window.innerWidth >= 900;
    this.desktop1200 = window.innerWidth >= 1200;
    this.showDasbordElement800();
    // this.globalFunctions.showDashboardElement(1200);

  }

  showDasbordElement800() {
    // if (window.innerWidth < 800) { // if screen width below 800px
    //   if (this.globalVariables.showThread) { // if showThread true other elments false
    //     this.globalVariables.showChannelMenu = false;
    //     this.globalVariables.isChatVisable = false;
    //   } else if (this.globalVariables.isChatVisable) {// if showThread false ist and isChatVisable true --> showChannelMenu false 
    //     this.globalVariables.showChannelMenu = false;
    //   } else { // if showThread false and isChatVisable false --> showChannelMenu true 
    //     this.globalVariables.showChannelMenu = true;
    //   }
    // } else { // if screen width >= 800px 
    //   this.globalVariables.showChannelMenu = true;
    //   this.globalVariables.isChatVisable = true;
    // }
  }

}
