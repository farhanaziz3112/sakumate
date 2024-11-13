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
import { icons, tagIconsString } from '../component/icons/icons';
import { TagComponent } from '../component/tag/tag.component';
import { ToastService } from '../service/toast.service';

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

  currentStep = 3;

  userSession: AuthSession | any;
  user: User | any;
  profile: any;

  defaultTags: any;

  profileForm: FormGroup | any;
  accountForm: FormGroup | any;
  incomeBudgetForm: FormGroup | any;
  expenseBudgetForm: FormGroup | any;
  goalForm: FormGroup | any;

  minDate: string | any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private supabase: SupabaseService,
    private colorService: ColorService,
    private toastService: ToastService
  ) {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    this.minDate = min.toISOString().split('T')[0];
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
      (tag: any) => tag.tagtype === 'income'
    );
    this.defaultExpenses = this.defaultTags.data.filter(
      (tag: any) => tag.tagtype === 'expense'
    );
  }

  async submitProfile(): Promise<void> {
    // let profile = {
    //   username: this.profileForm.value['username'] as string,
    //   firstname: this.profileForm.value['firstname'] as string,
    //   lastname: this.profileForm.value['lastname'] as string,
    //   id: this.user.id,
    // };

    // try {
    //   const { data, error } = await this.supabase.updateProfile(profile);
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Data', data[0]);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }

    // let account = {
    //   userid: this.user.id,
    //   accountname: this.accountForm.value['accountname'],
    //   accounttype: this.accountForm.value['accounttype'],
    //   currentbalance: this.accountForm.value['currentbalance'],
    //   color1: this.accountForm.value['color1'],
    //   color2: this.accountForm.value['color2'],
    // };

    // console.log(account);
    // const accountcreated = await this.supabase.createAccount(account);
    // console.log(accountcreated.data?.at(0));

    let budget: any[] = [];
    for (let i = 0; i < this.incomebudgets.length; i++) {
      budget.push({
        budgetname: this.incomebudgets.at(i).value['budgetname'],
        tagid: this.incomebudgets.at(i).value['tagid'],
        description: this.incomebudgets.at(i).value['description'],
        currentamount: this.incomebudgets.at(i).value['currentamount'],
        targetamount: this.incomebudgets.at(i).value['targetamount'],
        accountid: null,
        userid: this.user.id,
        budgettype: 'income',
      });
    }

    for (let i = 0; i < this.expensebudgets.length; i++) {
      budget.push({
        budgetname: this.expensebudgets.at(i).value['budgetname'],
        tagid: this.expensebudgets.at(i).value['tagid'],
        description: this.expensebudgets.at(i).value['description'],
        currentamount: this.expensebudgets.at(i).value['currentamount'],
        targetamount: this.expensebudgets.at(i).value['targetamount'],
        accountid: null,
        userid: this.user.id,
        budgettype: 'expense',
      });
    }

    const newbudgets = await this.supabase.createMultipleBudget(budget);
    console.log(newbudgets.data);

    // for (let i = 0; i < budget.length; i++) {
    //   console.log(budget[i]);
    //   const newbudgets = await this.supabase.createBudget(budget);
    //   console.log(newbudgets.data);
    // }

    // let budget = {
    //   budgetname: 'ngeh',
    //   tagid: null,
    //   description: '',
    //   currentamount: 500,
    //   targetamount: 1000,
    //   accountid: null,
    //   userid: this.user.id,
    //   budgettype: 'expense',
    // };

    // console.log(budget);
    // const newbudget = await this.supabase.createBudget(budget);
    // console.log(newbudget.data);

    // let goal = {
    //   goalname: 'ngehhhh',
    //   tagid: '',
    //   description: '',
    //   currentamount: 200,
    //   targetamount: 500,
    //   duedate: new Date(),
    //   userid: this.user.id,
    // };

    // console.log(goal);
    // const newGoal = await this.supabase.createGoal(goal);
    // console.log(newGoal.data);

    let tag = {
      userid: null,
      tagname: 'ngeh',
      tagtype: 'goal',
      color: 'purple',
      icon: 'faBurger',
    };

    console.log(tag);
    const newTag = await this.supabase.createTag(tag);
    console.log(newTag.data);
  }

  async onSubmit(): Promise<void> {
    if (
      this.profileForm.valid &&
      this.accountForm.valid &&
      this.incomeBudgetForm.valid &&
      this.expenseBudgetForm.valid &&
      this.goalForm.valid
    ) {
      try {
        let profile = {
          username: this.profileForm.value['username'] as string,
          firstname: this.profileForm.value['firstname'] as string,
          lastname: this.profileForm.value['lastname'] as string,
          id: this.user.id,
        };

        const newprofile = await this.supabase.updateProfile(profile);

        let account = {
          userid: this.user.id,
          accountname: this.accountForm.value['accountname'] as string,
          accounttype: this.accountForm.value['accounttype'] as string,
          currentbalance: this.accountForm.value['currentbalance'],
          color1: this.accountForm.value['color1'] as string,
          color2: this.accountForm.value['color2'] as string,
        };

        const newaccount = await this.supabase.createAccount(account);

        let budget: any[] = [];
        for (let i = 0; i < this.incomebudgets.length; i++) {
          budget.push({
            budgetname: this.incomebudgets.at(i).value['budgetname'],
            tagid: this.incomebudgets.at(i).value['tagid'],
            description: this.incomebudgets.at(i).value['description'],
            currentamount: this.incomebudgets.at(i).value['currentamount'],
            targetamount: this.incomebudgets.at(i).value['targetamount'],
            accountid: newaccount.data?.at(0).id,
            userid: this.user.id,
            budgettype: 'income',
          });
        }

        for (let i = 0; i < this.expensebudgets.length; i++) {
          budget.push({
            budgetname: this.expensebudgets.at(i).value['budgetname'],
            tagid: this.expensebudgets.at(i).value['tagid'],
            description: this.expensebudgets.at(i).value['description'],
            currentamount: this.expensebudgets.at(i).value['currentamount'],
            targetamount: this.expensebudgets.at(i).value['targetamount'],
            accountid: newaccount.data?.at(0).id,
            userid: this.user.id,
            budgettype: 'expense',
          });
        }

        const newbudgets = await this.supabase.createMultipleBudget(budget);
        console.log(newbudgets.data);

        for (let i = 0; i < this.goals.length; i++) {
          if (i === 0) {
            await this.supabase.updateGoal({
              goalname: this.goals.at(i).value['goalname'],
              tagid: null,
              description: this.goals.at(i).value['description'],
              currentamount: this.accountForm.value['currentbalance'],
              targetamount: this.goals.at(i).value['targetamount'],
              duedate: this.goals.at(i).value['duedate'],
              userid: this.user.id,
              accountid: newaccount.data?.at(0).id,
            });
          } else {
            const newTag = await this.supabase.createTag({
              userid: this.user.id,
              tagname: this.goals.at(i).value['tagname'],
              tagtype: 'goal',
              color: this.goals.at(i).value['color'],
              icon: this.goals.at(i).value['icon'],
            });
            const newGoal = await this.supabase.createGoal({
              goalname: this.goals.at(i).value['goalname'],
              tagid: newTag.data?.at(0).id,
              description: this.goals.at(i).value['description'],
              currentamount: 0,
              targetamount: this.goals.at(i).value['targetamount'],
              duedate: this.goals.at(i).value['duedate'],
              userid: this.user.id,
              accountid: null,
            });
          }
        }
        this.toastService.showSuccessToast(
          'Welcome to Sakumate!',
          'New account registration is complete.'
        );
        this.router.navigate(['/dashboard']);
      } catch (e) {
        this.toastService.showErrorToast(
          'Error',
          'There was an error during with your new account registration. Try again later.'
        );
      } finally {
        this.profileForm.reset();
        this.accountForm.reset();
        this.incomeBudgetForm.reset();
        this.expenseBudgetForm.reset();
        this.goalForm.reset();
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
      this.addIncomeBudgetForm(income);
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

  addIncomeBudgetForm(income: any): void {
    let budgetGroup = this.formBuilder.group({
      budgetname: [income.tagname],
      tagid: [income.id],
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
      this.addExpenseBudgetForm(expense);
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

  addExpenseBudgetForm(expense: any): void {
    let budgetGroup = this.formBuilder.group({
      budgetname: [expense.tagname],
      tagid: [expense.id],
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
      tagname: ['preview...', [Validators.required]],
      color: ['blue', [Validators.required]],
      icon: ['faBurger', [Validators.required]],
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

  async nextStep(step: number) {
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

  getColors(colorName: string, type: string) {
    return this.colorService.getColor(colorName, type);
  }

  getGradientClasses(color1: string, color2: string) {
    return `${this.colorService.getColor(
      color1,
      'lightFrom'
    )} + ${this.colorService.getColor(color2, 'lightTo')}`;
  }

  setAccountColor(color: string, isColor1: boolean) {
    if (isColor1) {
      this.accountForm.get('color1').setValue(color);
      this.colorOverlayOpen = false;
    } else {
      this.accountForm.get('color2').setValue(color);
      this.colorOverlayOpen2 = false;
    }
  }

  setTagColor(color: string, index: number) {
    this.goals.at(index).get('color')?.setValue(color);
    this.colorOverlayOpen3 = false;
  }

  setIcon(icon: string, index: number) {
    this.goals.at(index).get('icon')?.setValue(icon);
    this.iconOverlay = false;
  }

  getIconStringArray() {
    return tagIconsString;
  }

  //--------------------------------Overlay--------------------------------------

  colorOverlayOpen: boolean = false;
  colorOverlayOpen2: boolean = false;
  colorOverlayOpen3: boolean = false;
  iconOverlay: boolean = false;

  @ViewChild('colorTriggerButton', { static: false })
  colorTriggerButton!: ElementRef;
  @ViewChild('colorTriggerButton2', { static: false })
  colorTriggerButton2!: ElementRef;
  @ViewChild('colorTriggerButton3', { static: false })
  colorTriggerButton3!: ElementRef;
  @ViewChild('colorOverlayPanel', { static: false })
  colorOverlayPanel!: ElementRef;
  @ViewChild('colorOverlayPanel2', { static: false })
  colorOverlayPanel2!: ElementRef;
  @ViewChild('colorOverlayPanel3', { static: false })
  colorOverlayPanel3!: ElementRef;
  @ViewChild('iconTriggerButton', { static: false })
  iconTriggerButton!: ElementRef;
  @ViewChild('iconOverlayPanel', { static: false })
  iconOverlayPanel!: ElementRef;

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (
      this.colorOverlayOpen2 &&
      !this.colorTriggerButton2.nativeElement.contains(target) &&
      (!this.colorOverlayPanel2 ||
        !this.colorOverlayPanel2.nativeElement.contains(target))
    ) {
      this.colorOverlayOpen2 = false;
    }
    if (
      this.colorOverlayOpen &&
      !this.colorTriggerButton.nativeElement.contains(target) &&
      (!this.colorOverlayPanel ||
        !this.colorOverlayPanel.nativeElement.contains(target))
    ) {
      this.colorOverlayOpen = false;
    }
    if (
      this.colorOverlayOpen3 &&
      !this.colorTriggerButton3.nativeElement.contains(target) &&
      (!this.colorOverlayPanel3 ||
        !this.colorOverlayPanel3.nativeElement.contains(target))
    ) {
      this.colorOverlayOpen3 = false;
    }
  }

  toggleOverlay() {
    this.colorOverlayOpen = !this.colorOverlayOpen;
    this.colorOverlayOpen2 = false;
  }

  toggleOverlay2() {
    this.colorOverlayOpen2 = !this.colorOverlayOpen2;
    this.colorOverlayOpen = false;
  }

  toggleOverlay3() {
    this.colorOverlayOpen3 = !this.colorOverlayOpen3;
  }

  toggleIconOverlay() {
    this.iconOverlay = !this.iconOverlay;
  }
}
