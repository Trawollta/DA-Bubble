import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileComponent } from 'app/profile/profile.component';
import { FooterComponent } from '../../footer/footer.component';
import { UserService, User } from 'app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  imports: [
    CommonModule,
    ProfileComponent,
    FooterComponent
  ]
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
  userName = "";
  userAvatar = "assets/img/avatars/default.svg";
  isDesktop = window.innerWidth > 600;
  showProfile = false;

  showProfileMenu = false;
  showProfileOverlay = false;
  profileUserId: string | undefined = undefined;
  ownProfile = false;
  private userSub!: Subscription;

  constructor(private userService: UserService) {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit() {
    // Hole die User-ID aus localStorage (oder einem anderen Ort, wo sie gespeichert wird)
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userSub = this.userService.getUserById(userId).subscribe((user: User) => {
        console.log("Aktueller Benutzer:", user);
        // Verwende den Namen, oder als Fallback die E-Mail
        this.userName = user.name && user.name.trim() !== '' ? user.name : user.email;
        this.userAvatar = user.img || "assets/img/avatars/default.svg";
        this.profileUserId = user.id;
      });
    }
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  openProfile(ownProfile: boolean, userId?: string) {
    this.profileUserId = userId || this.profileUserId;
    this.ownProfile = ownProfile;
    this.showProfileOverlay = true;
    this.showProfileMenu = false;
  }
  
  closeProfile() {
    this.showProfileOverlay = false;
  }
  

  // closeProfileOverlay() {
  //   this.showProfileOverlay = false;
  // }

  logOut() {
    // Hier kannst du den Logout-Prozess ausführen
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    console.log('🚪 User ausgeloggt');
  }

  onResize() {
    this.isDesktop = window.innerWidth > 600;
  }
}
