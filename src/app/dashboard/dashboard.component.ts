import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { SupabaseService } from '../service/supabase.service';
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

  addMoneyDialog: boolean = true;
  minusMoneyDialog: boolean = false;

  accountDropdown: boolean = false;

  selectedAccount: any = null;

  selectAccount(acc: any) {
    this.selectedAccount = acc;
    this.accountDropdown = false;
    this.getBudgets(acc.id);
  }

  toggleAccountDropdown() {
    this.accountDropdown = !this.accountDropdown;
  }

  budgetDropdown: boolean = false;

  selectedBudget: any = null;

  selectBudget(budget: any) {
    this.selectedBudget = budget;
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

  constructor(
    private themeService: ThemeService,
    private supabase: SupabaseService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    Chart.register(this.customPlugin);
    this.currentTheme = this.themeService.currentTheme;
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getProfile();
      this.getAccounts();
    });
    this.addMoneyForm = this.fb.group({
      amount: ['', [Validators.required]],
      description: [''],
      name: [''],
      budgetid: ['', [Validators.required]],
      accountid: ['', [Validators.required]],
    });
  }

  async getProfile() {
    const { data } = await this.supabase.profile(this.user);
    this.profile = data;
  }

  async getAccounts() {
    const { data } = await this.supabase.allaccount(this.user);
    this.accounts = data;
    this.getTotalBalanceAllAcc(data);
  }

  async getBudgets(accId: string) {
    const { data } = await this.supabase.budgetByAccountId(accId);
    this.incomebudgets = data?.filter(
      (budget) => budget.budgettype === 'income'
    );
    this.expensebudgets = data?.filter(
      (budget) => budget.budgettype === 'expense'
    );
    console.log(this.incomebudgets);
    console.log(this.expensebudgets);
  }

  async getTag(tagId: string) {
    const { data } = await this.supabase.tagById(tagId);
    console.log(data);
    return data;
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

  // async submitProfile(): Promise<void> {
  //   let profile = {
  //     username: 'Farhan Aziz',
  //     firstname: 'Farhan',
  //     lastname: 'Aziz',
  //   };

  //   try {
  //     await this.supabase.updateProfile({
  //       id: this.user.id,
  //       username: 'Ngehhhhhhhhhhh',
  //       firstname: 'Farhan',
  //       lastname: 'Aziz',
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      // this.updateChart();
    });
  }

  incomeTags = [
    'Salary',
    'Investments',
    'Bonuses',
    'Freelance',
    'Savings',
    'Interest',
    'Commission',
    'Tips',
    'Investment Returns',
    'Other Income',
  ];

  expenseTags = [
    'Food',
    'Shopping',
    'Transport',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Gifts',
    'Education',
    'Insurance',
    'Rent',
    'Dining Out',
    'Groceries',
    'Clothing',
    'Travel',
    'Loan Payment',
    'Charity',
    'Childcare',
    'Electronics',
    'Pet Care',
    'Subscriptions',
    'Household',
    'Miscellaneous',
  ];

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
