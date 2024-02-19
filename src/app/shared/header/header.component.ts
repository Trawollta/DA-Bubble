import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    HeaderMenuComponent,
    InputfieldComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  globalVariables = inject(GlobalVariablesService);

}
