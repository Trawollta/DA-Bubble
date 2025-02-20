import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { ToastService } from 'app/services/app-services/toast.service';
import Aos from 'aos';
import { Channel } from 'app/models/channel.class';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputfieldComponent, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent implements OnInit {
  // Das zu bearbeitende Channel-Objekt vom Parent
  @Input() channelData!: { id: number; name: string; description: string; creator: string };
  @Output() closeOverlay = new EventEmitter<void>();

  // Lokaler Editiermodus
  editChannelDM: boolean = false;  // Editiermodus für den Channel-Namen
  editChannelDES: boolean = false; // Editiermodus für die Beschreibung

  // Lokale Zwischenspeicher für die Bearbeitung
  editedName: string = '';
  editedDescription: string = '';
  
  // Lokale Variable für den Ersteller-Namen
  creatorName: string = '';

  // Falls du den aktuell angemeldeten User (ID) benötigst:
  activeID: string = '';

  // Hier als public, damit im Template zugänglich
  constructor(public toastService: ToastService) {}

  ngOnInit(): void {
    Aos.init();
    if (this.channelData) {
      this.editedName = this.channelData.name;
      this.editedDescription = this.channelData.description;
      this.creatorName = this.channelData.creator;
    }
    // activeID kann hier ebenfalls gesetzt werden, z.B. via Input oder anderweitig
  }

  closeEditOverlay() {
    console.log("Edit-Channel-Overlay wird geschlossen");
    this.closeOverlay.emit();
  }

  editChannelName() {
    this.editChannelDM = true;
  }

  sumbitEdit() {
    if (this.editedName.trim() !== '') {
      this.channelData.name = this.editedName;
      this.editChannelDM = false;
      this.toastService.showMessage('Channel-Name aktualisiert');
    }
  }

  editChannelDescripition() {
    this.editChannelDES = true;
  }

  submitEdit() {
    if (this.editedDescription.trim() !== '') {
      this.channelData.description = this.editedDescription;
      this.editChannelDES = false;
      this.toastService.showMessage('Beschreibung aktualisiert');
    }
  }

  deleteChannel() {
    console.log("Channel löschen");
    this.toastService.showMessage('Channel gelöscht (Implementierung erforderlich)');
  }

  leaveChannel() {
    console.log("Channel verlassen");
    this.toastService.showMessage('Channel verlassen (Implementierung erforderlich)');
  }
}
