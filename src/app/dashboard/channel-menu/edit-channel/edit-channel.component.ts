import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { User } from 'app/models/user.class';
import { channel } from 'app/models/channel.class';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { ToastService } from 'app/services/app-services/toast.service';
import Aos from 'aos';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputfieldComponent, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss',
})
export class EditChannelComponent {
  [x: string]: any;

  channels: any[] = [];
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChannelService = inject(FirebaseChannelService);
  firebaseUpdate = inject(FirebaseUserService);
  firestore: Firestore = inject(Firestore);
  toastService = inject(ToastService);

  editMode: { channelName: boolean; description: boolean } = {
    channelName: false,
    description: false,
  };

  profile: User = { img: '', name: '', isActive: false, email: '', relatedChats: [] };

  channelBuffer = '';
  descriptionBuffer = '';

  channel: channel = {
    description: '',
    channelName: '',
    id: '',
    chatId: '',
    creator: '',
    channelMember: [],
  };
  showError: boolean = false;

  channelId: string = '';
  editChannelDM = false;
  editChannelDES = false;
  editedName = '';
  editedDescription = '';
  creator: boolean = false;
  creatorName: string = '';
  descriptionEdited = false;

  constructor() { }

  async ngOnInit() {
    let idToSearch = this.globalVariables.chatChannel.relatedChannelId;
    const channelData = await this.firebaseChannelService.loadChannelData(
      idToSearch
    );
    if (channelData) {
      this.channel = {
        description: channelData['description'],
        channelName: channelData['channelName'],
        id: '',
        chatId: channelData['chatId'],
        creator: channelData['creator'],
        channelMember: channelData['members'],
      };
      this.copyChannelInformationToGlobal();

    }
    this.getUserIdToName();
    this.compareCreator();
  }

  ngAfterViewInit() {
    Aos.init();
  }


  copyChannelInformationToGlobal() {
    this.globalVariables.openChannel.chatId = this.channel.chatId;
    this.globalVariables.openChannel.titel = this.channel.channelName;
    this.globalVariables.openChannel.creator = this.channel.creator;
    this.globalVariables.openChannel.desc = this.channel.description;
  }


  compareCreator() {
    if (this.globalVariables.activeID === this.channel.creator) {
      this.creator = true;
    } else {
      this.creator = false;
    }
  }

  cancelEditChannel() {
    this.channelBuffer = '';
    this.descriptionBuffer = '';
    this.globalVariables.isEditingChannel = false;
  }

  enableEdit(field: 'channelName' | 'description') {
    this['editMode'][field] = true;
  }

  async getUserIdToName() {
    let userId = this.channel.creator;
    let x = await this.firebaseUpdate.getUserData(userId);
    if (x && x.hasOwnProperty('name')) {
      let name = x['name'];
      this.creatorName = name;
    } else {
      console.log('Kein Nutzer gefunden')
    }
  }

  editChannelName() {
    this.editedName = this.globalVariables.openChannel.titel;
    this.editChannelDM = true;
  }

  editChannelDescripition() {
    this.editedDescription = this.globalVariables.openChannel.desc;
    this.editChannelDES = true;

  }

  saveChannelName() {
    this.channel.channelName = this.editedName;
    this.editChannelDM = false;
  }

  saveDescription() {
    this.channel.description = this.editedDescription;
    this.editChannelDES = false;
  }

  async sumbitEdit() {
    const result = await this.checkChannelName();
    if (result) {
      this.toastService.showMessage('Dieser Channelname exestiert bereits, bitte nutzen Sie einen anderen Namen.');
      return;
    }
    const oldName = this.globalVariables.openChannel.titel;
    this.changeChannelName(oldName, this.editedName);
    this.globalVariables.openChannel.titel = this.editedName; // Der neue Titel, den der Benutzer eingegeben hat
    let idToSearch = this.globalVariables.chatChannel.relatedChannelId;
    this.firebaseChannelService.updateDataChannel(this.data(), idToSearch);
    const userData = await this.firebaseChannelService.loadChannelData(idToSearch);
    this.channel = new channel(userData);
    this.saveChannelName();
    //this.firebaseChannelService.updateAllChannels(this.globalVariables.openChannel.titel, oldName);

  }

  /**
   * this function replaces the old channelname with the ne channel name for ChannelMenu
   * @param oldName - string old name
   * @param newName - string new name
   */
  changeChannelName(oldName: string, newName: string) {
    for (const channel of this.globalVariables.viewableChannelplusId) {
      if (channel.channelName === oldName) {
        channel.channelName = newName;
        break;
      }
    }
  }

  async submitEdit() {
    let idToSearch = this.globalVariables.chatChannel.relatedChannelId;
    this.firebaseChannelService.updateDataChannel(this.descData(), idToSearch);
    const userData = await this.firebaseChannelService.loadChannelData(
      idToSearch
    );
    this.channel = new channel(userData);
    this.saveDescription();
  }

  data(): {} {
    const nameChanged = this.editedName !== this.channel.channelName;
    const data: { [key: string]: any } = {};
    if (nameChanged) data['channelName'] = this.editedName;
    return data;
  }

  descData(): {} {
    const nameChanged = this.editedDescription !== this.channel.description;
    const data: { [key: string]: any } = {};
    if (nameChanged) data['description'] = this.editedDescription;
    return data;
  }

  async updateChannelName(channelId: string, newName: string): Promise<void> {
    const docRef = doc(this.firestore, `channels/${channelId}`);
    return updateDoc(docRef, { name: newName });
  }

  async updateChannelDescription(channelId: string, newDescription: string): Promise<void> {
    const docRef = doc(this.firestore, `channels/${channelId}`);
    return updateDoc(docRef, { name: newDescription });
  }


  leaveChannel() {
    this.removeChannelfromChannelArray(this.globalVariables.openChannel.id);
    this.firebaseUpdate.leaveChannel(this.channel.chatId, this.globalVariables.activeID);
    this.firebaseUpdate.leaveChannelUser(this.channel.chatId, this.globalVariables.activeID);
    this.globalFunctions.getStartChannel();
    this.globalFunctions.closeEditOverlay();
  }

  async deleteChannel() {
    await this.firebaseChannelService.deleteChanel(this.globalVariables.openChannel.chatId);
    this.removeChannelfromChannelArray(this.globalVariables.openChannel.id);
    this.globalFunctions.getStartChannel();
    this.globalFunctions.closeEditOverlay();
  }

  /**
   * this function removes the chanel from viewableChannelplusId
   * @param channelId - string Id of channel
   */
  removeChannelfromChannelArray(channelId: string) {
    let i = 0;
     for (const channel of this.globalVariables.viewableChannelplusId) {
      if (channel.channelId === channelId) {
        this.globalVariables.viewableChannelplusId.splice(i, 1);
        break; 
      }
      i++;
    }
  }

  async checkChannelName(): Promise<boolean> {
    let channelExist = await this.getCurrentUserChannel();
    return channelExist;
  }

  async getCurrentUserChannel(): Promise<boolean> {
    try {
      let docIdChats: string[] = [];
      for (
        let i = 0;
        i < this.globalVariables.currentUser.relatedChats.length;
        i++
      ) {
        const data = await this.firebaseChannelService.getDocId(
          this.globalVariables.currentUser.relatedChats[i]
        );
        docIdChats.push(data[0]);
      }
      for (let i = 0; i < docIdChats.length; i++) {
        const data = await this.firebaseChannelService.getChannelData(docIdChats[i]);
        if (
          data?.['channelName']?.toLowerCase() ===
          this.editedName?.toLowerCase()
        ) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error retrieving channel data:', error);
      return false;
    }
  }

}
