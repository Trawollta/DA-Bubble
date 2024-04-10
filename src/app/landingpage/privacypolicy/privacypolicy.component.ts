import { Component, inject } from '@angular/core';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { DialogComponent } from 'app/shared/dialog/dialog.component';
import { GoBackButtonComponent } from 'app/shared/go-back-button/go-back-button.component';

@Component({
  selector: 'app-privacypolicy',
  standalone: true,
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.scss',
  imports: [DialogComponent, GoBackButtonComponent]
})
export class PrivacypolicyComponent {
  globalVariables = inject(GlobalVariablesService);
  constructor() {
    this.globalVariables.imprintActive = true;
    this.globalVariables.signup = true;
  }

}
