import { Component, inject } from '@angular/core';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';

@Component({
  selector: 'app-current-user-message',
  standalone: true,
  imports: [],
  templateUrl: './current-user-message.component.html',
  styleUrl: './current-user-message.component.scss'
})
export class CurrentUserMessageComponent {

  globalVariables = inject(GlobalVariablesService);

  openEmojis() {
    let emojiDiv = document.getElementById('emojis');
    if (emojiDiv && emojiDiv.classList.contains('d-none')) {
      emojiDiv.classList.remove('d-none');
    } else if (emojiDiv && emojiDiv.classList.contains('d-none') == false) {
      emojiDiv.classList.add('d-none');
    }
  }

  openAnswers() {
    this.globalVariables.showThread = !this.globalVariables.showThread;
    if(window.innerWidth < 1100)
    this.globalVariables.showChannelMenu = false;
  }
}
