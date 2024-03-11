import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Firestore,
  doc,
  collection,
  onSnapshot,
} from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { ReactionsComponent } from 'app/shared/reactions/reactions.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { User } from 'app/models/user.class';

@Component({
  selector: 'app-current-user-message',
  standalone: true,
  imports: [ReactionsComponent, CommonModule, DatePipe],
  templateUrl: './current-user-message.component.html',
  styleUrl: './current-user-message.component.scss',
})
export class CurrentUserMessageComponent {
  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  openReaction: boolean = false;
  selectedMessage: string = '';

  @Input() message: any;

  postingTime: string | null = null;
  user: User = new User();

  unsubUser;
  userId: string = 'guest';

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    this.unsubUser = this.getUser(this.userId);
  }

  /**
   * this function unsubscribes the containing content
   */
  ngOnDestroy() {
    this.unsubUser;
  }

  /**
   * thsi function returns the reference to the user doc
   * @param docId - id of user
   * @returns - referenz of document
   */
  getUserRef(docId: string) {
    return doc(collection(this.firestore, 'users'), docId);
  }

  /**
   * this function get data of user and saves it in lokal user object
   * @param id - id of user
   * @returns - onSnapshot object
   */
  getUser(id: string) {
    return onSnapshot(this.getUserRef(id), (user) => {
      if (user.data()) {
        this.user = new User(user.data());
      }
    });
  }

  /**
   * this function calls function getUser() for providing userdata for the post
   */
  ngOnInit() {
    this.user = this.message.userId;
    this.getUser(this.message.userId);
    this.postingTime = this.message.timestamp;
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
    console.log('was ist in message current: ', this.message);
    this.globalVariables.showThread = !this.globalVariables.showThread;
    this.globalVariables.openChat = 'isChatVisable';
    this.globalVariables.messageData.answerto =
      this.message.userId + '_' + this.message.timestamp.toString();

    if (window.innerWidth < 1100) this.globalVariables.showChannelMenu = false;
    if (window.innerWidth < 700) {
      this.globalVariables.showChannelMenu = false;
      this.globalVariables.isChatVisable = false;
    }
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  onSelectMessage(message: string) {
    this.selectedMessage = message;
    this.openReaction = true;
  }

  onCloseReactions() {
    this.openReaction = false;
    this.selectedMessage = '';
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    // Überprüfen, ob der Klick außerhalb des app-reactions-Elements stattgefunden hat
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.onCloseReactions(); // Schließe das app-reactions-Element
    }
  }
}
