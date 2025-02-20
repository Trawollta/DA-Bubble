import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';
import { User } from 'app/models/user.class';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputfieldComponent, ClickedOutsideDirective],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() profile!: User;
  @Input() ownProfile: boolean = false;
  @Output() closeProfileEvent = new EventEmitter<void>();

  // Lokale Variable zum Umschalten des Bearbeitungsmodus
  showEditProfile: boolean = false;
  nameBuffer: string = '';
  emailBuffer: string = '';

  ngOnInit(): void {
    if (!this.profile) {
      console.warn("Profil ist noch nicht geladen, setze Standardwerte.");
      this.profile = {
        img: 'assets/img/avatars/default.svg',
        name: 'Unbekannter Benutzer',
        email: '',
        isActive: false,
        relatedChats: []
      };
    }

    this.nameBuffer = this.profile.name;
    this.emailBuffer = this.profile.email;
  }


  close(): void {
    this.closeProfileEvent.emit();
  }

  editProfile(): void {
    this.showEditProfile = true;
  }

  cancelEdit(): void {
    this.showEditProfile = false;
    // Buffer zurücksetzen
    this.nameBuffer = this.profile.name;
    this.emailBuffer = this.profile.email;
  }

  submitEdit(): void {
    // Hier sollte die Logik zur Aktualisierung der Profildaten erfolgen
    console.log("Änderungen gespeichert:", { name: this.nameBuffer, email: this.emailBuffer });
    // Beispiel: Profil-Daten lokal aktualisieren
    this.profile.name = this.nameBuffer;
    this.profile.email = this.emailBuffer;
    this.showEditProfile = false;
  }
}
