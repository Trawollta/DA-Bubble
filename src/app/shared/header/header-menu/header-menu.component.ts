import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { GlobalVariablesService } from 'app/services/global-variables.service';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent {

globalVariables = inject (GlobalVariablesService);

active: boolean = false;

  menuClicked() {
    this.active = !this.active;
    if (this.active) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto'; 

  }

  stopPropagation(e:Event) {
    e.stopPropagation();
}
  

}