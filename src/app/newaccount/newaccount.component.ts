import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newaccount',
  standalone: true,
  imports: [StepperModule, CommonModule, ButtonModule, FontAwesomeModule],
  templateUrl: './newaccount.component.html',
  styleUrl: './newaccount.component.css',
})
export class NewaccountComponent {
  accType = [
    {
      label: 'Savings Account',
      value: 'savings',
    },
    {
      label: 'Credit Card',
      value: 'creditcard',
    },
    {
      label: 'Investment',
      value: 'investment',
    },
    {
      label: 'Cash On Hand',
      value: 'cash',
    },
    {
      label: 'Digital Wallet',
      value: 'ewallet',
    },
  ];

  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;

  currentStep = 0;

  constructor(private router: Router) {}

  changeStep(step: number) {
    this.currentStep = step;
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }
}
