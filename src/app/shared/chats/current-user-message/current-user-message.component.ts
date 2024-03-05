import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { ReactionsComponent } from 'app/shared/reactions/reactions.component';

@Component({
  selector: 'app-current-user-message',
  standalone: true,
  imports: [ReactionsComponent, CommonModule],
  templateUrl: './current-user-message.component.html',
  styleUrl: './current-user-message.component.scss',
})

export class CurrentUserMessageComponent {
  globalVariables = inject(GlobalVariablesService);
  globaleFunctions = inject(GlobalFunctionsService);

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
    this.globalVariables.openChat = 'isChatVisable';
    if (window.innerWidth < 1100) this.globalVariables.showChannelMenu = false;
    if (window.innerWidth < 700) {
      this.globalVariables.showChannelMenu = false;
      this.globalVariables.isChatVisable = false;
    }
  }

  openReactionDialog() {
    console.log('test');
  }
}
