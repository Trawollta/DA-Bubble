import { Component } from '@angular/core';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [InputfieldComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

}
