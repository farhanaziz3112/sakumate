import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-newaccount',
  standalone: true,
  imports: [StepperModule, CommonModule, ButtonModule],
  templateUrl: './newaccount.component.html',
  styleUrl: './newaccount.component.css'
})
export class NewaccountComponent {

  constructor() { }

}
