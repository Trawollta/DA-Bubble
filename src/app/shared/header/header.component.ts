import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  desktop:boolean = this.setDesktopFlag();

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void { 
    this.desktop = this.setDesktopFlag();
  }

  setDesktopFlag(){
    return (window.innerWidth > 600)? true : false;
  }
}
