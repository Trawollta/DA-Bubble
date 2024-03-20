import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { User } from 'app/models/user.class';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputfieldComponent, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  [x: string]: any;

  channels: any[] = [];
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseService = inject ( FirebaseUserService);
  

  editMode: { channelName: boolean; description: boolean; } = {
    channelName: false,
    description: false,
  };

  profile: User = {img: '', name: '', isActive: false, email: '',}



  async ngOnInit(){
    console.log('Profile User ID:', this.globalVariables.profileUserId);
    const userData = await this.firebaseService.getUserData(this.globalVariables.profileUserId);
    if (userData) {
      console.log('Ersteller-Daten geladen:', userData);
      this.profile = new User(userData);
    } else {
      console.error('Keine Daten für den Ersteller gefunden');
    }
  }
  

  channelBuffer = '';
  descriptionBuffer = '';
  // Beispiel eines Kanalobjekts. Stellen Sie sicher, dass dieses durch die ausgewählten Kanaldaten initialisiert wird.
  channel = { id: '', name: '', description: '' };

  constructor() {}

  // Vorbereitung der Bearbeitung mit den aktuellen Kanaldaten
  editChannel() {
    this.channelBuffer = this.channel.name;
    this.descriptionBuffer = this.channel.description;
    this.globalVariables.isEditingChannel = true; // Angenommen, dieser Zustand existiert und wird entsprechend verwendet
  }

  // Abbrechen der Bearbeitung
  cancelEditChannel() {
    this.channelBuffer = '';
    this.descriptionBuffer = '';
    this.globalVariables.isEditingChannel = false;
  }

  // Senden der bearbeiteten Daten
  async submitEdit() {
    // Annahme: Die Methode updateData erwartet die Sammlungs-ID, das Dokument-ID und die zu aktualisierenden Daten
    await this.globalFunctions.updateData('channels', this.channel.id, this.data());
    // Aktualisieren der UI oder weitere Schritte nach der Aktualisierung
    this.cancelEditChannel();
  }

  // Generierung der zu aktualisierenden Daten
  data(): { [key: string]: any } {
    const nameChanged = this.channelBuffer !== this.channel.name;
    const descriptionChanged = this.descriptionBuffer !== this.channel.description;
    const data: { [key: string]: any } = {};
    if (nameChanged) data['name'] = this.channelBuffer;
    if (descriptionChanged) data['description'] = this.descriptionBuffer;

    return data;
  }


  enableEdit(field: 'channelName' | 'description') {
    this['editMode'][field] = true;
  }


  toggleEdit(field: 'channelName' | 'description') {
    this.editMode[field] = !this.editMode[field];
  
    // Wenn der Modus von Bearbeiten auf Speichern wechselt, speichere die Änderungen
    if (!this.editMode[field]) {
      this.submitEdit();
    }
  }
  
}
