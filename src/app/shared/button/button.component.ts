import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() caption: string = "";
  @Input() imgPath: string = "";
  @Input() type: string = "";
  @Input() isDisabled: boolean = false;
  @Input() classes?: string | string[] = [];
  @Output() clicked = new EventEmitter<Event>();

  onClick() {
    this.clicked.emit();
  }

}
