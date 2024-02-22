import { Component, inject } from '@angular/core';
import { InputfieldComponent } from '../../inputfield/inputfield.component';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from 'app/services/global-variables.service';

@Component({
    selector: 'app-private-chat',
    standalone: true,
    templateUrl: './private-chat.component.html',
    styleUrl: './private-chat.component.scss',
    imports: [InputfieldComponent, CommonModule]
})
export class PrivateChatComponent {
  globalVariables = inject(GlobalVariablesService);
  currentUser: any;
  
  openAwnsers() {}

  openEmojis() {
    let emojiDiv = document.getElementById('emojis');
    if (emojiDiv && emojiDiv.classList.contains('d-none')) {
      emojiDiv.classList.remove('d-none');
    } else if (emojiDiv && emojiDiv.classList.contains('d-none') == false) {
      emojiDiv.classList.add('d-none');
    }
  }

  logFunction() {
    
    console.log(this.globalVariables.userToChatWith.userName);
    
  }
  
}
