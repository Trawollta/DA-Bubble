import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';

interface Emoji {
  character: string;
  codePoint: string;
}

@Component({
  selector: 'app-emoji-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emoji-container.component.html',
  styleUrl: './emoji-container.component.scss'
})
export class EmojiContainerComponent {

  globalVariables = inject(GlobalVariablesService);
  emojiList: Emoji[] = [];

  url =
  'https://emoji-api.com/emojis?access_key=60ede231f07183acd1dbb4bdd7dde0797f62e95e';


  /**
   * Fetch on init of the API.
   */
  ngOnInit(): void {
    this.getEmojis();
  }


   /**
   * Emoji fetch from API
   */
   getEmojis() {
    fetch(this.url)
      .then((res) => res.json())
      .then((data) => this.loadEmoji(data.slice(0, 100)));
      
  }

  /**
   * Load all Emojis from API into both Arrays
   * @param {[]} data - The data got info about emojis from the API.
   */
  loadEmoji(data: Emoji[]) {
    data.forEach((emoji) => {
      const { character, codePoint } = emoji;
      this.emojiList.push({ character, codePoint });
    });
  }

  takeEmoji(emoji: Emoji, isAddToMessage: boolean){
    this.globalVariables.selectedEmoji.character = emoji.character;
    this.globalVariables.selectedEmoji.codePoint = emoji.codePoint;
    if(isAddToMessage){
      this.globalVariables.newMessage += emoji.character;
    }
  }
}
