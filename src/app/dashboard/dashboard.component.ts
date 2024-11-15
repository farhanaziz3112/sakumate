import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMinus,
  faPlus,
  faGasPump,
  faDollarSign,
  faBurger,
  faShoppingCart,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartData,
  ChartEvent,
  ChartOptions,
  ChartType,
  Plugin,
} from 'chart.js';
import { NgxGaugeModule } from 'ngx-gauge';
import { DonutComponent } from '../component/donut/donut.component';
import { TagComponent } from '../component/tag/tag.component';
import { ThemeService } from '../service/theme.service';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { AuthSession, User } from '@supabase/supabase-js';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { descriptors } from 'chart.js/dist/core/core.defaults';
import { ToastService } from '../service/toast.service';
import { loginFailure } from '../state/auth/auth.actions';
import { DatabaseService } from '../service/database.service';
import { ColorService } from '../service/color.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    BaseChartDirective,
    NgxGaugeModule,
    DonutComponent,
    TagComponent,
    DialogModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  mockExpensesData = [
    {
      accName: 'Account 1',
      color1: 'yellow',
      color2: 'pink',
      amount: 120.5,
      tag: 'Petrol',
      tagColor: 'bg-blue-500',
      icon: 'faGasPump',
      type: 'out',
      date: '29/10/2024',
    },
    {
      accName: 'Account 2',
      color1: 'teal',
      color2: 'blue',
      amount: 3700,
      tag: 'Salary',
      tagColor: 'bg-green-500',
      icon: 'faDollarSign',
      type: 'in',
      date: '28/10/2024',
    },
    {
      accName: 'Account 1',
      color1: 'yellow',
      color2: 'pink',
      amount: 23.65,
      tag: 'Food',
      tagColor: 'bg-orange-500',
      icon: 'faHamburger',
      type: 'out',
      date: '24/10/2024',
    },
  ];

  mockBillsData = [
    {
      id: 1,
      type: 'Tax',
      name: 'Income Tax',
      amount: 1200,
      dueDate: '2024-11-15',
      status: 'Pending',
      category: 'Annual',
      description: 'Federal income tax payment due for 2024',
    },
    {
      id: 2,
      type: 'Tax',
      name: 'Property Tax',
      amount: 850,
      dueDate: '2024-12-31',
      status: 'Pending',
      category: 'Annual',
      description: 'Yearly property tax payment for primary residence',
    },
    {
      id: 3,
      type: 'Bill',
      name: 'Electricity Bill',
      amount: 65,
      dueDate: '2024-10-30',
      status: 'Overdue',
      category: 'Monthly',
      description: 'Electricity bill for October 2024',
    },
    {
      id: 4,
      type: 'Bill',
      name: 'Internet Bill',
      amount: 55,
      dueDate: '2024-10-25',
      status: 'Paid',
      category: 'Monthly',
      description: 'Home internet bill for high-speed connection',
    },
  ];

  faPlus = faPlus;
  faMinus = faMinus;
  faGasPump = faGasPump;
  faDollarSign = faDollarSign;
  faBurger = faBurger;
  faShoppingCart = faShoppingCart;
  faChevronDown = faChevronDown;

  currentTheme = 'light';
  private chartInstance: Chart | any;

  addMoneyDialog: boolean = false;
  minusMoneyDialog: boolean = false;

  accountDropdown: boolean = false;

  selectedAccount: any = null;

  selectAccount(acc: any) {
    if (acc != this.selectedAccount) {
      this.selectedAccount = acc;
    }
    this.accountDropdown = false;
  }

  toggleAccountDropdown() {
    this.accountDropdown = !this.accountDropdown;
  }

  budgetDropdown: boolean = false;

  selectedIncomeBudget: any = null;
  selectedIncomeTag: any = null;

  selectedExpenseBudget: any = null;
  selectedExpenseTag: any = null;

  selectIncomeBudget(budget: any, index: number) {
    this.selectedIncomeBudget = budget;
    this.selectedIncomeTag = this.incometags[index];
    this.budgetDropdown = false;
  }

  selectExpenseBudget(budget: any, index: number) {
    this.selectedExpenseBudget = budget;
    this.selectedExpenseTag = this.expensetags[index];
    this.budgetDropdown = false;
  }

  toggleBudgetDropdown() {
    this.budgetDropdown = !this.budgetDropdown;
  }

  toggleAddMoneyDialog() {
    this.addMoneyDialog = !this.addMoneyDialog;
  }

  toggleMinusMoneyDialog() {
    this.minusMoneyDialog = !this.minusMoneyDialog;
  }

  user: User | any;
  profile: any;
  accounts: any;
  incomebudgets: any;
  expensebudgets: any;
  allAccTotal: number = 0;

  addMoneyForm: FormGroup | any;
  minusMoneyForm: FormGroup | any;

  constructor(
    private themeService: ThemeService,
    private dbService: DatabaseService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private colorService: ColorService
  ) {
    Chart.register(this.customPlugin);
    this.currentTheme = this.themeService.currentTheme;
    this.authService.user$.subscribe((user) => {
        console.log(user);
      // if (user) {
      //   console.log(user);
      //   this.user = user;
      //   this.getProfile();
      //   this.getBudgets();
      // }
    });
    this.dbService.accounts$.subscribe((acc) => {
      this.accounts = acc;
      this.getTotalBalanceAllAcc(acc);
    });
    this.addMoneyForm = this.fb.group({
      amount: ['', [Validators.required]],
      description: [''],
      title: [''],
    });
    this.minusMoneyForm = this.fb.group({
      amount: ['', [Validators.required]],
      description: [''],
      title: [''],
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      // this.updateChart();
    });
  }

  async getProfile() {
    const { data } = await this.dbService.profile();
    this.profile = data;
  }

  async getBudgets() {
    console.log('get budgets function called');
    
    let income_budgets = await this.dbService.budgetByUserId_type(
      this.user,
      'income'
    );
    let expense_budgets = await this.dbService.budgetByUserId_type(
      this.user,
      'expense'
    );
    this.incomebudgets = income_budgets.data;
    this.expensebudgets = expense_budgets.data;
    console.log(this.incomebudgets);
    console.log(this.expensebudgets);

    if (expense_budgets && income_budgets) {
      console.log(this.incomebudgets.length);
      for (let i = 0; i < this.incomebudgets.length; i++) {
        console.log(this.incomebudgets.at(i));
        const tag = await this.getTag(this.incomebudgets.at(i).tagid);
        if (tag) {
          this.incometags.push(tag);
        }
      }
      for (let i = 0; i < this.expensebudgets.length; i++) {
        const tag = await this.getTag(this.expensebudgets.at(i).tagid);
        if (tag) {
          this.expensetags.push(tag);
        }
      }
    }
  }

  incometags: any[] = [];
  expensetags: any[] = [];

  async getTag(tagId: string) {
    const { data } = await this.dbService.tagById(tagId);
    return data;
  }

  async submitTransaction(isIncome: boolean) {
    try {
      if (isIncome) {
        await this.dbService.createTransaction({
          amount: this.addMoneyForm.value['amount'],
          description: this.addMoneyForm.value['description'],
          title: this.addMoneyForm.value['title'],
          budgetid: this.selectedIncomeBudget.id,
          accountid: this.selectedAccount.id,
          userid: this.user.id,
          type: 'income',
        });
        await this.dbService.updateAccount({
          ...this.selectedAccount,
          currentbalance:
            this.selectedAccount.currentbalance +
            this.addMoneyForm.value['amount'],
        });
      } else {
        await this.dbService.createTransaction({
          amount: this.minusMoneyForm.value['amount'],
          description: this.minusMoneyForm.value['description'],
          title: this.minusMoneyForm.value['title'],
          budgetid: this.selectedExpenseBudget.id,
          accountid: this.selectedAccount.id,
          userid: this.user.id,
          type: 'expense',
        });
        await this.dbService.updateAccount({
          ...this.selectedAccount,
          currentbalance:
            this.selectedAccount.currentbalance -
            this.minusMoneyForm.value['amount'],
        });
      }
      this.toastService.showSuccessToast(
        'New Transaction!',
        'Transaction successfully submitted.'
      );
    } catch (error) {
      this.toastService.showErrorToast(
        'Error',
        'There was an error during with your new account registration. Try again later.'
      );
    } finally {
      this.selectedIncomeBudget = null;
      this.selectedIncomeTag = null;
      this.selectedExpenseBudget = null;
      this.selectedExpenseTag = null;
      this.selectedAccount = null;
      this.minusMoneyForm.reset();
      this.addMoneyForm.reset();
      this.addMoneyDialog = false;
      this.minusMoneyDialog = false;
      this.incometags = [];
      this.expensetags = [];
    }
  }

  closeDialog() {
    this.selectedIncomeBudget = null;
    this.selectedIncomeTag = null;
    this.selectedExpenseBudget = null;
    this.selectedExpenseTag = null;
    this.selectedAccount = null;
    this.minusMoneyForm.reset();
    this.addMoneyForm.reset();
    this.addMoneyDialog = false;
    this.minusMoneyDialog = false;
    this.budgetDropdown = false;
    this.accountDropdown = false;
  }

  getTotalBalanceAllAcc(acc: any) {
    let total = 0;
    for (let i = 0; i < acc.length; i++) {
      total += acc[i].currentbalance;
    }
    this.allAccTotal = total;
  }

  isAddMoneyFormInvalid(controlName: string): boolean {
    const control = this.addMoneyForm.get(controlName);
    let isInvalid = control?.invalid && (control?.dirty || control?.touched);
    return isInvalid;
  }

  isMinusMoneyFormInvalid(controlName: string): boolean {
    const control = this.minusMoneyForm.get(controlName);
    let isInvalid = control?.invalid && (control?.dirty || control?.touched);
    return isInvalid;
  }

  getColors(colorName: string, type: string) {
    return this.colorService.getColor(colorName, type);
  }

  getGradientClasses(color1: string, color2: string) {
    if (this.currentTheme === 'light') {
      return `${this.colorService.getColor(
        color1,
        'lightFrom'
      )} + ${this.colorService.getColor(color2, 'lightTo')}`;
    } else {
      return `${this.colorService.getColor(
        color1,
        'darkFrom'
      )} + ${this.colorService.getColor(color2, 'darkTo')}`;
    }
  }

  // @ViewChild('transactionOverlayPanel', { static: false })
  // transactionOverlayPanel!: ElementRef;
  // @ViewChild('insidePanel', { static: false })
  // insidePanel!: ElementRef;
  // @ViewChild('triggerButton', { static: false })
  // triggerButton!: ElementRef;
  // @ViewChild('transactionOverlayPanel2', { static: false })
  // transactionOverlayPanel2!: ElementRef;
  // @ViewChild('insidePanel2', { static: false })
  // insidePanel2!: ElementRef;
  // @ViewChild('triggerButton2', { static: false })
  // triggerButton2!: ElementRef;

  // @HostListener('document:click', ['$event.target'])
  // onClickOutside(target: HTMLElement) {
  //   const clickInsidePanel =
  //     this.transactionOverlayPanel &&
  //     this.transactionOverlayPanel.nativeElement.contains(target);
  //   const clickInsideAccountDropdown =
  //     this.insidePanel && this.insidePanel.nativeElement.contains(target);
  //   const clickInsideTriggerButton =
  //     this.triggerButton && this.triggerButton.nativeElement.contains(target);
  //   const clickInsidePanel2 =
  //     this.transactionOverlayPanel2 &&
  //     this.transactionOverlayPanel2.nativeElement.contains(target);
  //   const clickInsideAccountDropdown2 =
  //     this.insidePanel2 && this.insidePanel2.nativeElement.contains(target);
  //   const clickInsideTriggerButton2 =
  //     this.triggerButton2 && this.triggerButton2.nativeElement.contains(target);

  //   if (
  //     !clickInsidePanel &&
  //     !clickInsideAccountDropdown &&
  //     !clickInsideTriggerButton
  //   ) {
  //     this.addMoneyDialog = false;
  //     this.accountDropdown = false;
  //     this.budgetDropdown = false;
  //   }
  //   if (
  //     !clickInsidePanel2 &&
  //     !clickInsideAccountDropdown2 &&
  //     !clickInsideTriggerButton2
  //   ) {
  //     this.minusMoneyDialog = false;
  //     this.accountDropdown = false;
  //     this.budgetDropdown = false;
  //   }
  // }

  // onChartReady(chart: any) {
  //   this.chartInstance = chart; // Store the chart instance
  // }

  // private updateChart() {
  //   if (this.currentTheme === 'light') {
  //     console.log('light');
  //     this.chartOptions.plugins!.title = {
  //       color: 'black',
  //       align: 'center',
  //       display: true,
  //       position: 'bottom',
  //       text: 'Light title',
  //     };
  //   } else {
  //     console.log('dark');
  //     this.chartOptions.plugins!.title = {
  //       color: 'white',
  //       align: 'center',
  //       display: true,
  //       position: 'bottom',
  //       text: 'Dark title',
  //     };
  //   }
  //   if (this.chartInstance) {
  //     console.log('updating chart');
  //     this.chartInstance.update();
  //   }
  // }

  public doughnutChartLabels: string[] = [
    'Foods',
    'Petrol',
    'Shopping',
    'Games',
    'Others',
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [350, 450, 100, 230, 40],
        backgroundColor: [
          '#f97316',
          '#3b82f6',
          '#ec4899',
          '#10b981',
          '#71717a',
        ],
      },
    ],
  };
  public chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '50%',
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  public customPlugin: Plugin<'doughnut'> = {
    id: 'centerText', // Plugin ID
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;

      const centerText = 'Total Expenses';
      const totalExpense = '1350.90';
      const fontSize = '16px';
      const fontFamily = '"Garet"';
      const textColor = this.currentTheme === 'light' ? 'black' : 'white';

      ctx.save();
      ctx.font = `${fontSize} ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Calculate center position
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      // Draw the center text
      ctx.fillText(centerText, centerX, centerY);
      ctx.fillStyle = textColor;
      ctx.fillText(totalExpense, centerX, centerY + 20);

      ctx.restore();
    },
  };

  gaugeType = 'semi';
  gaugeValue = 28.3;
  gaugeLabel = 'Speed';
  gaugeAppendText = 'km/hr';
}
