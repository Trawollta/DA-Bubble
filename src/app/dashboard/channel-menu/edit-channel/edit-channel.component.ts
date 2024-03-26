import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { User } from 'app/models/user.class';
import { channel } from 'app/models/channel.class';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';


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
  firebaseChannelService = inject(FirebaseChannelService);
  firestore: Firestore = inject(Firestore);

  

  editMode: { channelName: boolean; description: boolean; } = {
    channelName: false,
    description: false,
  };

  profile: User = {img: '', name: '', isActive: false, email: '',}

  channelBuffer = '';
  descriptionBuffer = '';
  // Beispiel eines Kanalobjekts. Stellen Sie sicher, dass dieses durch die ausgewählten Kanaldaten initialisiert wird.
  
  channel: channel = {
    description: '',
    channelName: '',
    id: '',
    chatId: '',
    creator: '',
    channelMember: [],
  }

  channelId: string = '';


  editChannelDM = false;
  editedName = '';



  constructor(private channelService: FirebaseChannelService) {}

  async ngOnInit() {
    let idToSearch = this.globalVariables.channelData.id;
    const channelData = await this.firebaseChannelService.loadChannelData(idToSearch); // Implementieren Sie diese Funktion entsprechend
    if (channelData) {
      this.channel.channelName = channelData['channelName'];
    }
  }
  // Abbrechen der Bearbeitung
  cancelEditChannel() {
    this.channelBuffer = '';
    this.descriptionBuffer = '';
    this.globalVariables.isEditingChannel = false;
  }

  // Senden der bearbeiteten Daten
  async submitEdit(field: 'channelName' | 'description') {
    // Das Datenobjekt initialisieren
    const data: {[key: string]: string} = {};
  
    // Entscheiden, welche Daten basierend auf dem Feld aktualisiert werden sollen
    if (field === 'channelName') {
      data['name'] = this.globalVariables.channelData.channelName; // Stellen Sie sicher, dass der neue Wert korrekt ist
    } else if (field === 'description') {
      data['description'] = this.globalVariables.channelData.description; // Stellen Sie sicher, dass der neue Wert korrekt ist
    }
  
    // Prüfen, ob die channel.id gesetzt ist
    if (!this.channel.id) {
      console.error('Channel-ID ist nicht gesetzt. Abbruch der Aktualisierung.');
      return;
    }
  
    try {
      // Verwenden der updateData Funktion, um die Daten in Firebase zu aktualisieren
      await this.globalFunctions.updateData('channels', this.channel.id, data);
      console.log('Daten erfolgreich aktualisiert');
  
      // Optional: UI-Logik zur Bestätigung der erfolgreichen Aktualisierung
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Daten:', error);
    }
  

    await this.globalFunctions.updateData('channels', this.channel.id, data);
    // Aktualisieren der lokalen Kopie des Kanals nach der erfolgreichen Aktualisierung
    if (field === 'channelName') {
      this.channel.channelName = this.globalVariables.channelData.channelName;
    } else if (field === 'description') {
      this.channel.description = this.globalVariables.channelData.description;
    }
  }

  enableEdit(field: 'channelName' | 'description') {
    this['editMode'][field] = true;
  }


  toggleEdit() {
  }

  editChannelName() {
    this.editChannelDM = true;
  }

  saveChannelName() {
    this.channel.channelName = this.editedName;
    this.editChannelDM = false;
  }

  async sumbitEdit() {
    let idToSearch = this.globalVariables.channelData.id;
    this.firebaseChannelService.updateDataChannel(this.data(), idToSearch);
    const userData = await this.firebaseChannelService.loadChannelData(idToSearch);
    this.channel = new channel(userData);
    this.saveChannelName();
  }

 
  data():{} {
    const nameChanged = this.editedName !== this.channel.channelName;
     const data: { [key: string]: any } = {};
    if(nameChanged) data['channelName'] = this.editedName;
    return data;
  }

  async updateChannelName(channelId: string, newName: string): Promise<void> {
    const docRef = doc(this.firestore, `channels/${channelId}`);
    return updateDoc(docRef, { name: newName });
  }

  // Aktualisiert die Beschreibung des Kanals
  async updateChannelDescription(channelId: string, newDescription: string): Promise<void> {
    const docRef = doc(this.firestore, `channels/${channelId}`);
    return updateDoc(docRef, { description: newDescription });
  }


  saveChanges(field: 'channelName' | 'description') {
    
    // Stellen Sie sicher, dass channelId gesetzt ist.
    if (!this.channel || !this.channel.id) {
      console.error('Channel-ID ist nicht gesetzt. Abbruch der Aktualisierung.');
      return;
    }
  
    if (field === 'channelName') {
      // Aufruf der Methode zum Aktualisieren des Namens
      const newName = this.globalVariables.channelData.channelName;
      this.channelService.updateChannelName(this.channel.id, newName)
        .then(() => console.log('Kanalname aktualisiert'))
        .catch(error => console.error('Fehler beim Aktualisieren des Kanalnamens', error));
    } else if (field === 'description') {
      // Aufruf der Methode zum Aktualisieren der Beschreibung
      const newDescription = this.globalVariables.channelData.description;
      this.channelService.updateChannelDescription(this.channel.id, newDescription)
        .then(() => console.log('Beschreibung aktualisiert'))
        .catch(error => console.error('Fehler beim Aktualisieren der Beschreibung', error));
    }
  }
  

  saveChangesAndExit() {
    const channelId = this.globalVariables.currentChannelId;
    if (!channelId) {
      console.error('Channel-ID ist nicht gesetzt. Abbruch der Aktualisierung.');
      return;
    }
  
    // Annahme, dass `channelData` die aktuellen bearbeiteten Daten enthält
    const { channelName, description } = this.globalVariables.channelData;
    
    // Parallel das Aktualisieren von Kanalnamen und Beschreibung durchführen
    Promise.all([
      this.firebaseChannelService.updateChannelName(channelId, channelName),
      this.firebaseChannelService.updateChannelDescription(channelId, description),
    ]).then(() => {
      console.log('Kanal erfolgreich aktualisiert');
      this.globalFunctions.closeEditOverlay(); // Schließe das Overlay
    }).catch(error => {
      console.error('Fehler beim Aktualisieren des Kanals', error);
    });
  }
  


  
}
