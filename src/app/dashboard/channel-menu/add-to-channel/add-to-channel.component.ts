import { Component, inject, Input } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { ChatChannelService } from 'app/services/chat-channel.service';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
// import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
// import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';


@Component({
  selector: 'app-add-to-channel',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    InputfieldComponent,
    FormsModule,
  ],
  templateUrl: './add-to-channel.component.html',
  styleUrl: './add-to-channel.component.scss',
})
export class AddToChannelComponent {

  // globalFunctions = inject(GlobalFunctionsService);
  // globalVariables = inject(GlobalVariablesService);
  // firebaseChannelService = inject(FirebaseChannelService);
  // firebaseUserService = inject(FirebaseUserService);

  selectedUserName: string = ''; 
  users: { name: string; id: string; img: string, isActive: boolean }[] = [];
  notInOpenChannelUser: { name: string; id: string; img: string, isActive: boolean }[] = [];
  selectedUsers: { name: string; id: string; img: string, isActive: boolean }[] = [];
  selectedUser: any = '';
  searchTerm: string = '';
  openChannel = {
    titel: '',
    desc: '',
    id: '',
    chatId: '',
    creator: '',
    memberCount: 0
  };
  @Input() channelData!: { name: string; description: string };
  @Input() newChannelName: string = '';
  @Input() description: string = '';

  constructor(
    private chatChannelService: ChatChannelService,  
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (userList: { name: string; id: string; img: string; isActive: boolean }[]) => {
        this.users = userList;
        this.notInOpenChannelUser = [...userList];
      },
      error: (error: any) => console.error("❌ Fehler beim Abrufen der Benutzer:", error)
    });
  }
  

  /**
   * this function filters the notInOpenChannelUser array for the searchTerm
   * @param searchTerm - string
   * @returns - void
   */
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    if (!searchTerm) {
      this.users = this.notInOpenChannelUser;
      return;
    }
    this.users = this.notInOpenChannelUser.filter(user => {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  }

  /**
   * this function moves the selected user to the selectedUsers and removes it from notInOpenChannelUser
   * @param user - Object - selected user Object 
   */
  selectUser(user: any) {
    this.selectedUsers.push(user);
    this.users = this.users.filter(u => u.id !== user.id); // Entferne Benutzer aus der Liste
  }

  /**
   * this function removes the seleced user from the selected user list and push it back to unselected.
   * @param i - number - index 
   */
  deleteUserFromSelect(i: number) {
    this.notInOpenChannelUser.push(this.selectedUsers[i]);
    this.selectedUsers.splice(i, 1);
  }

  /**
   * this function adds the selected user to the channel and adds the chatid to the selected user 
   */
  createChannel() {
    if (!this.channelData.name.trim()) {
      alert("Bitte einen Channel-Namen eingeben!");
      return;
    }

    if (this.selectedUsers.length === 0) {
      alert("Bitte wähle mindestens einen Benutzer aus!");
      return;
    }

    const creatorId = this.authService.getUserId();
    const selectedUserIds = this.selectedUsers.map(user => Number(user.id));

    const channelData = {
      name: this.channelData.name,
      description: this.channelData.description,
      created_by: creatorId,
      participants: selectedUserIds
    };

    console.log("📤 Sende Channel-Daten an API:", channelData);

    this.chatChannelService.createChannel(channelData).subscribe({
      next: (channel) => {
        console.log("✅ Neuer Channel erstellt:", channel);
      },
      error: (error) => {
        console.error("❌ Fehler beim Erstellen des Channels:", error);
      }
    });
  }
  
  
}
