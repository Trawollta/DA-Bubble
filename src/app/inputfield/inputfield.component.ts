import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-inputfield',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inputfield.component.html',
  styleUrl: './inputfield.component.scss'
})
export class InputfieldComponent implements OnInit {
  @Input() type: string = "";
  @Input() id: string = "";
  @Input() placeholder: string = "";
  @Input() classes?: string | string[] = [];
  @Input() imgName: string = "";
  @Input() imgSize: string = "";
  imgActive: string = "";

  ngOnInit() {
    this.imgActive = this.imgName;
  }

  // Funktion zum Wechseln des Bildes bei Fokus
  onFokus() {
    this.imgActive = this.imgName + '_black';
  }

  // Funktion zum Zurücksetzen des Bildes, wenn der Fokus verloren geht
  onBlur() {
    this.imgActive = this.imgName;
  }
}
