import { Component, inject} from '@angular/core';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

globalvariables = inject(GlobalVariablesService);

  closeThread(){
    this.globalvariables.showThread = false;
    this.globalvariables.showChannelMenu = true;
  }
}
