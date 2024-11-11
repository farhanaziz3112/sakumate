import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { AuthService } from '../service/auth.service';
import { AuthSession, User } from '@supabase/supabase-js';
import { SupabaseService } from '../service/supabase.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ColorService } from '../service/color.service';
import { DialogModule } from 'primeng/dialog';
import { icons } from '../component/icons/icons';
import { TagComponent } from '../component/tag/tag.component';

@Component({
  selector: 'app-newaccount',
  standalone: true,
  imports: [
    DialogModule,
    StepperModule,
    CommonModule,
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TagComponent,
  ],
  templateUrl: './newaccount.component.html',
  styleUrl: './newaccount.component.css',
})
export class NewaccountComponent implements OnInit {
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

  incomes = ['Salary', 'Investments', 'Freelance', 'Savings'];

  selectedIncomes: string[] = [];

  selectIncome(income: string) {
    if (!this.selectedIncomes.includes(income)) {
      this.selectedIncomes.push(income);
      this.incomes = this.incomes.filter((tag) => tag !== income);
    }
  }

  expenses = ['Food', 'Petrol', 'Shopping', 'Transport', 'Entertainment'];

  selectedExpenses: string[] = [];

  selectExpense(expense: string) {
    if (!this.selectedExpenses.includes(expense)) {
      this.selectedExpenses.push(expense);
      this.expenses = this.expenses.filter((tag) => tag !== expense);
    }
  }

  pages = [
    {
      page: 'profile',
      label: 'Add Profile',
    },
    {
      page: 'account',
      label: 'Add Accounts',
    },
    {
      page: 'budget',
      label: 'Add Budgets',
    },
    {
      page: 'goal',
      label: 'Add Goals',
    },
  ];

  colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
  ];

  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;

  currentStep = 2;

  userSession: AuthSession | any;
  user: User | any;
  profile: any;

  profileForm: FormGroup | any;
  accountForm: FormGroup | any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private supabase: SupabaseService,
    private colorService: ColorService
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.accountForm = this.formBuilder.group({
      accountname: ['', [Validators.required, Validators.minLength(3)]],
      accounttype: ['', [Validators.required]],
      currentbalance: ['', [Validators.required]],
      color1: ['yellow', [Validators.required]],
      color2: ['pink', [Validators.required]],
    });
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getProfile();
    });
  }

  ngOnInit(): void {}

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  async getProfile() {
    this.profile = await this.supabase.profile(this.user);
    this.profileForm.patchValue({
      username: this.profile.data.username,
      firstname: this.profile.data.firstname,
      lastname: this.profile.data.lastname,
    });
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid) {
      let username = this.profileForm.value['username'] as string;
      let firstname = this.profileForm.value['firstname'] as string;
      let lastname = this.profileForm.value['lastname'] as string;

      try {
        await this.supabase.updateProfile({
          id: this.user.id,
          username,
          firstname,
          lastname,
        });
      } finally {
        this.profileForm.reset();
      }
    }
  }

  isProfileFormInvalid(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    let isInvalid = control?.invalid && (control?.dirty || control?.touched);
    return isInvalid;
  }

  isAccountFormInvalid(controlName: string): boolean {
    const control = this.accountForm.get(controlName);
    let isInvalid = control?.invalid && (control?.dirty || control?.touched);
    return isInvalid;
  }

  previousStep(step: number) {
    this.currentStep = step;
  }

  nextStep(step: number) {
    if (step === 1 && this.profileForm.valid) {
      this.currentStep = 1;
    } else if (step === 2 && this.accountForm.valid) {
      this.currentStep = 2;
    }
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }

  getColors(colorName: string) {
    return this.colorService.getColor(colorName, 'light');
  }

  getGradientClasses(color1: string, color2: string) {
    return `${this.colorService.getColor(
      color1,
      'lightFrom'
    )} + ${this.colorService.getColor(color2, 'lightTo')}`;
  }

  setColor(color: string, isColor1: boolean) {
    if (isColor1) {
      this.accountForm.get('color1').setValue(color);
      this.overlayOpen = false;
    } else {
      this.accountForm.get('color2').setValue(color);
      this.overlayOpen2 = false;
    }
  }

  overlayOpen: boolean = false;
  overlayOpen2: boolean = false;

  @ViewChild('triggerButton', { static: false }) triggerButton!: ElementRef;
  @ViewChild('triggerButton2', { static: false }) triggerButton2!: ElementRef;
  @ViewChild('overlayPanel', { static: false }) overlayPanel!: ElementRef;
  @ViewChild('overlayPanel2', { static: false }) overlayPanel2!: ElementRef;

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (
      this.overlayOpen2 &&
      !this.triggerButton2.nativeElement.contains(target) &&
      (!this.overlayPanel2 ||
        !this.overlayPanel2.nativeElement.contains(target))
    ) {
      this.overlayOpen2 = false;
    }
    if (
      this.overlayOpen &&
      !this.triggerButton.nativeElement.contains(target) &&
      (!this.overlayPanel || !this.overlayPanel.nativeElement.contains(target))
    ) {
      this.overlayOpen = false;
    }
  }

  toggleOverlay() {
    this.overlayOpen = !this.overlayOpen;
    this.overlayOpen2 = false;
  }

  toggleOverlay2() {
    this.overlayOpen2 = !this.overlayOpen2;
    this.overlayOpen = false;
  }
}
