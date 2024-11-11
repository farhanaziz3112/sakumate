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

  dropdown: boolean = false;

  selectedTag: any = null;

  selectTag(tag: any) {
    this.selectedTag = tag;
    this.dropdown = false;
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }

  toggleAddMoneyDialog() {
    this.addMoneyDialog = !this.addMoneyDialog;
  }

  toggleMinusMoneyDialog() {
    this.minusMoneyDialog = !this.minusMoneyDialog;
  }

  // email: string = ''
  userSession: AuthSession | any;
  profile: any;

  constructor(
    private themeService: ThemeService,
    private supabase: SupabaseService,
    private authService: AuthService,
    private router: Router
  ) {
    Chart.register(this.customPlugin);
    this.currentTheme = this.themeService.currentTheme;
    console.log(this.authService.isAuthenticated());
    this.authService.userSession$.subscribe((session) => {
      this.userSession = session;
    });
  }

  async getProfile() {
    const { user } = await this.userSession;
    this.profile = await this.supabase.profile(user);
    console.log(user);
    console.log(this.profile.data);
  }

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
