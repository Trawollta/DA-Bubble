//import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, EventEmitter, Output } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { ButtonComponent } from 'app/shared/button/button.component';
import { FormsModule } from '@angular/forms';
// import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { mergeNsAndName } from '@angular/compiler';
import { ToastService } from 'app/services/app-services/toast.service';
import Aos from 'aos';

@Component({
  selector: 'app-add-new-channel',
  standalone: true,
  imports: [
    CommonModule,
    InputfieldComponent,
    ButtonComponent,
    FormsModule,],
  templateUrl: './add-new-channel.component.html',
  styleUrl: './add-new-channel.component.scss',
})
export class AddNewChannelComponent {
  toastService = inject(ToastService);

  @Output() closeOverlay = new EventEmitter<void>();
  @Output() nextOverlay = new EventEmitter<{ name: string, description: string }>();

  @Output() channelCreated = new EventEmitter<{ newChannelName: string, description: string }>();


  showError: boolean = false;
  channelName: string = '';
  description: string = '';

  isValid(): boolean {
    return this.channelName.trim().length > 0 && this.description.trim().length > 0;
  }

  onSubmit() {
    if (this.isValid()) {
      // Weiterleitung zur Benutzer-Auswahl mit den Channel-Daten
      this.nextOverlay.emit({ name: this.channelName, description: this.description });
    } else {
      alert("Bitte fülle alle Felder aus.");
    }
  }

  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
    Aos.init();
  }

  close() {
    this.closeOverlay.emit();
  }

}