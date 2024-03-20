import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private router = inject(Router);

  goToImprint() {
    this.router.navigate(['/imprint']);
  }
  goToPrivacyPolicy() {
    this.router.navigate(['/privacypolicy']);
  }
}
