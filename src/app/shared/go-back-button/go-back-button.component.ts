import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location, CommonModule } from '@angular/common';

@Component({
  selector: 'app-go-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './go-back-button.component.html',
  styleUrl: './go-back-button.component.scss'
})
export class GoBackButtonComponent {
  @Output() clicked = new EventEmitter<Event>();
  @Input() goTo: string = "back";

  constructor(private location: Location) { }


  onClick() {
    this.clicked.emit();
  }

  goBack() {
    this.location.back();
  }
}
