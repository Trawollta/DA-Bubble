import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProfileComponent } from 'app/profile/profile.component';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent
  ],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent {

  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  private userService = inject(FirebaseUserService);

  login() {
    this.userService.logout();
  }

  openProfile() {
    this.globalVariables.showProfile = true;
  }
  /* active: boolean = false;
  
    menuClicked() {
      this.active = !this.active;
      if (this.active) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'auto'; 
  
    }
  
    stopPropagation(e:Event) {
      e.stopPropagation();
  } */


}