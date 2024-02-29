import { CommonModule } from '@angular/common';
import { Component,inject, input } from '@angular/core';
import { ButtonComponent } from 'app/button/button.component';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/global-functions.service';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InputfieldComponent, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {

  channels: any[] = [];
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);

}
