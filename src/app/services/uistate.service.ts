import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  private _activeID = new BehaviorSubject<string | null>(null);
  activeID$ = this._activeID.asObservable();

  private userNameSubject = new BehaviorSubject<string>('Gast');
  userName$ = this.userNameSubject.asObservable();

  setUserName(name: string) {
    this.userNameSubject.next(name);
  }

  private _userAvatar = new BehaviorSubject<string>('assets/img/avatars/default.svg');
  userAvatar$ = this._userAvatar.asObservable();

  private _isDesktop = new BehaviorSubject<boolean>(window.innerWidth > 600);
  isDesktop$ = this._isDesktop.asObservable();

  private _showProfileMenu = new BehaviorSubject<boolean>(false);
  showProfileMenu$ = this._showProfileMenu.asObservable();

  private _showProfileOverlay = new BehaviorSubject<boolean>(false);
showProfileOverlay$ = this._showProfileOverlay.asObservable();

  private _showEditProfile = new BehaviorSubject<boolean>(false);
  showEditProfile$ = this._showEditProfile.asObservable();

  private _showThread = new BehaviorSubject<boolean>(false);
  showThread$ = this._showThread.asObservable();

  private _openChannel = new BehaviorSubject<{ id: string; title: string } | null>(null);
  openChannel$ = this._openChannel.asObservable();

  private _addUser = new BehaviorSubject<boolean>(false);
  addUser$ = this._addUser.asObservable();

  private _isUserChat = new BehaviorSubject<boolean>(false);
  isUserChat$ = this._isUserChat.asObservable();

  private _ownProfile = new BehaviorSubject<boolean>(false);
  ownProfile$ = this._ownProfile.asObservable();

  private _openChannelUser = new BehaviorSubject<any[]>([]);
  openChannelUser$ = this._openChannelUser.asObservable();

  private _viewableChannel = new BehaviorSubject<string[]>([]);
viewableChannel$ = this._viewableChannel.asObservable();

private _showProfile = new BehaviorSubject<boolean>(false);
showProfile$ = this._showProfile.asObservable();



toggleShowProfileMenu() {
  console.log(`🔄 Profilmenü wird auf ${!this._showProfileMenu.value} gesetzt`);
  this._showProfileMenu.next(!this._showProfileMenu.value);
}

setShowProfileMenu(state: boolean) {
  console.log(`✅ Profilmenü explizit auf ${state} gesetzt`);
  this._showProfileMenu.next(state);
}

setOwnProfile(value: boolean) {
  console.log(`👤 Ist eigenes Profil: ${value}`);
  this._ownProfile.next(value);
}

private _profileUserId = new BehaviorSubject<string | null>(null);
profileUserId$ = this._profileUserId.asObservable();





  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this._isDesktop.next(event.target.innerWidth > 600);
  }

  setActiveID(id: string) {
    this._activeID.next(id);
  }

  setViewableChannels(channels: string[]) {
    this._viewableChannel.next(channels);
  }

  setShowThread(value: boolean) {
    this._showThread.next(value);
  }

  setProfileUserId(userId: string) {
    console.log(`🔄 Profil-User-ID wird auf ${userId} gesetzt`);
    this._profileUserId.next(userId);
  }
  

  setUserAvatar(url: string) {
    this._userAvatar.next(url);
  }

  setShowProfileOverlay(value: boolean) {
    console.log(`👤 Profil-Overlay wird auf ${value} gesetzt`);
    this._showProfileOverlay.next(value);
  }

  setOpenChannelUser(users: any[] = []) {
    this._openChannelUser.next(users);
  }

  setAddUser(value: boolean) {
    this._addUser.next(value);
  }

  setOpenChannel(channel: { id: string; title: string } | null) {
    this._openChannel.next(channel);
  }

  setIsUserChat(value: boolean) {
    this._isUserChat.next(value);
  }

  setShowProfile(value: boolean) {
    console.log(`👤 Profil-Overlay wird auf ${value} gesetzt`);
    this._showProfile.next(value);
  }

  setShowEditProfile(value: boolean) {
    this._showEditProfile.next(value);
  }
}
