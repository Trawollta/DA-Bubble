import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderMenuComponent } from './header-menu/header-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    HeaderMenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  
// desktop: boolean = this.setDesktopFlag();


 //der Eventlistener ist nur nötig, wenn man die Bildschirmgröße live ändern will
/*   @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.desktop = this.setDesktopFlag();
  }
 */
  setDesktopFlag() {
    return window.innerWidth > 600;
  } 

 
}
