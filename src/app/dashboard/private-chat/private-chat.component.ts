import { Component, inject } from '@angular/core';
import { InputfieldComponent } from '../../shared/inputfield/inputfield.component';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';

@Component({
  selector: 'app-private-chat',
  standalone: true,
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.scss',
  imports: [InputfieldComponent, CommonModule, ]
})
export class PrivateChatComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  currentUser: any;


  openAnswers() {
    this.globalVariables.showThread = !this.globalVariables.showThread;
  }

  openEmojis() {
    let emojiDiv = document.getElementById('emojis');
    if (emojiDiv && emojiDiv.classList.contains('d-none')) {
      emojiDiv.classList.remove('d-none');
    } else if (emojiDiv && emojiDiv.classList.contains('d-none') == false) {
      emojiDiv.classList.add('d-none');
    }
  }
}
