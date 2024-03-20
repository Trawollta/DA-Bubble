import { Component } from '@angular/core';
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

}
