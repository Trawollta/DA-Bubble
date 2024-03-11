import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';

@Component({
  selector: 'app-reactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reactions.component.html',
  styleUrl: './reactions.component.scss',
})
export class ReactionsComponent {
  globaleVariable = inject(GlobalVariablesService);
  editMessage() {}
  @Output() newEmoji = new EventEmitter<string>();

  // Variable für das ausgewählte Emoji
  choosedEmoji: string = '';

  emojiList: Array<any> = [];
  allEmojis: Array<any> = [];

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
      .then((data) => this.loadEmoji(data));
  }

  /**
   * Load all Emojis from API into both Arrays
   * @param {[]} data - The data got info about emojis from the API.
   */
  loadEmoji(data: []) {
    data.forEach((emoji) => {
      this.emojiList.push(emoji);
      this.allEmojis.push(emoji);
    });
  }

  /**
   * Emits the choosen Emoji in newEmoji and sets it to choosedEmoji variable
   * @param {string} emoji - The selected emoji.
   */
  public showInInput(emoji: any): void {
    this.newEmoji.emit(emoji);
    this.choosedEmoji = emoji.character;
    console.log(this.choosedEmoji);
  }

  openEmojis() {
    const emojiDiv = document.getElementById('emoji-selector');
    if (emojiDiv) {
      if (emojiDiv.style.display === 'none') {
        emojiDiv.style.display = 'flex';
      } else {
        emojiDiv.style.display = 'none';
      }
    }
  }
}
