import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProfileComponent } from 'app/profile/profile.component';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseUserupdateService } from 'app/services/firebase-services/firebase-userupdate.service';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-header-menu',
  standalone: true,
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss',
  imports: [
    CommonModule,
    ProfileComponent,
    FooterComponent
  ]
})
export class HeaderMenuComponent {

  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  private userService = inject(FirebaseUserService);
  private userUpdateServce = inject(FirebaseUserupdateService);

  constructor() {
    this.globalVariables.showProfileMenu = false;
    this.userUpdateServce.setActiveUserId(this.globalVariables.activeID);
  }

  logOut() {
    this.userService.logout();
  }


}