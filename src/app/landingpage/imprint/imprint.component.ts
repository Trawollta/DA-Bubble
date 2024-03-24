import { Component, inject } from '@angular/core';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { DialogComponent } from 'app/shared/dialog/dialog.component';
import { GoBackButtonComponent } from 'app/shared/go-back-button/go-back-button.component';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [DialogComponent, GoBackButtonComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {
  globalVariables = inject(GlobalVariablesService);
  constructor() {
    this.globalVariables.imprintActiv = true;
    this.globalVariables.signup = true;
  }

}
