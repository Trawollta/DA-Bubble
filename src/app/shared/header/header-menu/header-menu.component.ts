import { CommonModule } from '@angular/common';
import { Component,} from '@angular/core';


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

  //desktop: boolean = this.setDesktopFlag();
  active: boolean = false;

 /* ngOnInit() {
   this.active = false;
 } */

  //der Eventlistener ist nur nötig, wenn man die Bildschirmgröße live ändern will
/*   @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.desktop = this.setDesktopFlag();
  }

  setDesktopFlag() {
    return window.innerWidth > 600;
  } */


  menuClicked() {
    this.active = !this.active;
    if (this.active) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto'; 

  }
  
}
