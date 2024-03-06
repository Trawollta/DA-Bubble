import { Component, inject, Input } from '@angular/core';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';


@Component({
  selector: 'app-other-user-message',
  standalone: true,
  imports: [],
  templateUrl: './other-user-message.component.html',
  styleUrl: './other-user-message.component.scss'
})
export class OtherUserMessageComponent {

  globalVariables = inject(GlobalVariablesService);
  @Input() message: any;

  getUserName(){
    // ich hole mir hier den Usernamen anhand der zur Vergfügung gestellten id
  }

  getDate(){
     // ich hole mir hier den Usernamen anhand der zur Vergfügung timestamp
  }

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
    this.globalVariables.openChat = 'isPrivatChatVisable';
    if (window.innerWidth < 1100)
      this.globalVariables.showChannelMenu = false;
    if (window.innerWidth < 700) {
      this.globalVariables.showChannelMenu = false;
      // this.globalVariables.isPrivatChatVisable = false;
    }
  }

}
