import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inputfield',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inputfield.component.html',
  styleUrl: './inputfield.component.scss'
})
export class InputfieldComponent {
  @Input() type: string = "";
  @Input() placeholder: string = "";
  @Input() classes?: string | string[] = [];
}
