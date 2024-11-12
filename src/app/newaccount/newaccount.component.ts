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
  FormArray,
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

  currentStep = 0;

  userSession: AuthSession | any;
  user: User | any;
  profile: any;

  defaultTags: any;

  profileForm: FormGroup | any;
  accountForm: FormGroup | any;
  incomeBudgetForm: FormGroup | any;
  expenseBudgetForm: FormGroup | any;
  goalForm: FormGroup | any;

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
    this.incomeBudgetForm = this.formBuilder.group({
      budgets: this.formBuilder.array([]),
    });
    this.expenseBudgetForm = this.formBuilder.group({
      budgets: this.formBuilder.array([]),
    });
    this.goalForm = this.formBuilder.group({
      goals: this.formBuilder.array([]),
    });
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getDefaultTags();
    });
  }

  ngOnInit(): void {
    let newGoalGroup = this.formBuilder.group({
      description: [''],
      goalname: ['', [Validators.required, Validators.minLength(3)]],
      currentamount: ['0', [Validators.required]],
      targetamount: ['0', [Validators.required]],
      duedate: ['', [Validators.required]],
    });

    this.goals.push(newGoalGroup);
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  defaultIncomes: any;
  defaultExpenses: any;

  async getDefaultTags() {
    this.defaultTags = await this.supabase.allDefaultTag();
    this.defaultIncomes = this.defaultTags.data.filter(
      (tag: any) => tag.type === 'income'
    );
    this.defaultExpenses = this.defaultTags.data.filter(
      (tag: any) => tag.type === 'expense'
    );
  }

  async onSubmit(): Promise<void> {
    if (
      this.profileForm.valid &&
      this.accountForm.valid &&
      this.incomeBudgetForm.valid &&
      this.expenseBudgetForm.valid &&
      this.goalForm.valid
    ) {
      let profile = {
        username: this.profileForm.value['username'] as string,
        firstname: this.profileForm.value['firstname'] as string,
        lastname: this.profileForm.value['lastname'] as string,
      };

      let account = {
        username: this.profileForm.value['username'] as string,
        firstname: this.profileForm.value['firstname'] as string,
        lastname: this.profileForm.value['lastname'] as string,
      };

      try {
        await this.supabase.updateProfile({
          id: this.user.id,
          profile
        });
      } finally {
        this.profileForm.reset();
      }
    }
  }

  //---------------------------------------Income Budget---------------------------------------

  selectedIncomes: any[] = [];

  selectIncome(income: any) {
    if (!this.selectedIncomes.includes(income)) {
      this.selectedIncomes.push(income);
      this.defaultIncomes = this.defaultIncomes.filter(
        (tag: any) => tag.tagname !== income.tagname
      );
      this.addIncomeBudgetForm();
      console.log('Adding budget form');
    }
  }

  removeIncome(income: any, index: number) {
    if (!this.defaultIncomes.includes(income)) {
      this.defaultIncomes.push(income);
      this.selectedIncomes = this.selectedIncomes.filter(
        (tag: any) => tag.tagname !== income.tagname
      );
      this.removeIncomeBudgetForm(index);
      console.log('Remove budget form');
    }
  }

  get incomebudgets(): FormArray {
    return this.incomeBudgetForm.get('budgets') as FormArray;
  }

  addIncomeBudgetForm(): void {
    let budgetGroup = this.formBuilder.group({
      description: [''],
      currentamount: ['', [Validators.required]],
      targetamount: ['', [Validators.required]],
    });

    this.incomebudgets.push(budgetGroup);
  }

  removeIncomeBudgetForm(index: number): void {
    this.incomebudgets.removeAt(index);
  }

  //---------------------------------------Expense Budget---------------------------------------

  selectedExpenses: any[] = [];

  selectExpense(expense: any) {
    if (!this.selectedExpenses.includes(expense)) {
      this.selectedExpenses.push(expense);
      this.defaultExpenses = this.defaultExpenses.filter(
        (tag: any) => tag.tagname !== expense.tagname
      );
      this.addExpenseBudgetForm();
    }
  }

  removeExpense(expense: any, index: number) {
    if (!this.defaultExpenses.includes(expense)) {
      this.defaultExpenses.push(expense);
      this.selectedExpenses = this.selectedExpenses.filter(
        (tag: any) => tag.tagname !== expense.tagname
      );
      this.removeExpenseBudgetForm(index);
    }
  }

  get expensebudgets(): FormArray {
    return this.expenseBudgetForm.get('budgets') as FormArray;
  }

  addExpenseBudgetForm(): void {
    let budgetGroup = this.formBuilder.group({
      description: [''],
      currentamount: ['', [Validators.required]],
      targetamount: ['', [Validators.required]],
    });

    this.expensebudgets.push(budgetGroup);
  }

  removeExpenseBudgetForm(index: number): void {
    this.expensebudgets.removeAt(index);
  }

  //---------------------------------------Goal---------------------------------------

  get goals(): FormArray {
    return this.goalForm.get('goals') as FormArray;
  }

  addGoal(): void {
    let goalGroup = this.formBuilder.group({
      description: [''],
      goalname: ['', [Validators.required, Validators.minLength(3)]],
      targetamount: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
    });

    this.goals.push(goalGroup);
    console.log(this.goalForm.value);
  }

  removeGoal(index: number): void {
    this.goals.removeAt(index);
  }

  //--------------------------------Form Validators--------------------------------------

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

  isBudgetFormInvalid(
    isIncome: boolean,
    index: number,
    controlName: string
  ): boolean {
    const control = isIncome
      ? this.incomebudgets.at(index).get(controlName)
      : this.expensebudgets.at(index).get(controlName);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isGoalFormInvalid(index: number, controlName: string): boolean {
    const control = this.goals.at(index).get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitbudget() {
    console.log(this.incomeBudgetForm.value);
    console.log(this.expenseBudgetForm.value);
  }

  viewgoal() {
    console.log(this.goalForm.value);
  }

  previousStep(step: number) {
    this.currentStep = step;
  }

  nextStep(step: number) {
    if (step === 1 && this.profileForm.valid) {
      this.currentStep = 1;
    } else if (step === 2 && this.accountForm.valid) {
      this.goals
        .at(0)
        .get('goalname')
        ?.setValue(this.accountForm.get('accountname').value);
      this.currentStep = 2;
    } else if (
      step === 3 &&
      this.incomeBudgetForm.valid &&
      this.expenseBudgetForm.valid
    ) {
      this.currentStep = 3;
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
