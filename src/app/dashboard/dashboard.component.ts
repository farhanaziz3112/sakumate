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
  faChevronDown
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
      tag: 'petrol',
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
      tag: 'salary',
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
      tag: 'food',
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

  tags = [
    { name: 'Food', color: 'bg-orange-500', icon: 'faHamburger', type: 'expense' },
    { name: 'Shopping', color: 'bg-blue-500', icon: 'faShoppingCart', type: 'expense' },
    { name: 'Salary', color: 'bg-green-500', icon: 'faDollarSign', type: 'income' },
    { name: 'Transport', color: 'bg-teal-500', icon: 'faBus', type: 'expense' },
    { name: 'Entertainment', color: 'bg-purple-500', icon: 'faFilm', type: 'expense' },
    { name: 'Utilities', color: 'bg-yellow-500', icon: 'faLightbulb', type: 'expense' },
    { name: 'Healthcare', color: 'bg-red-500', icon: 'faHeartbeat', type: 'expense' },
    { name: 'Investments', color: 'bg-indigo-500', icon: 'faChartLine', type: 'income' },
    { name: 'Gifts', color: 'bg-pink-500', icon: 'faGift', type: 'expense' },
    { name: 'Education', color: 'bg-blue-400', icon: 'faBook', type: 'expense' },
    { name: 'Insurance', color: 'bg-gray-500', icon: 'faShieldAlt', type: 'expense' },
    { name: 'Rent', color: 'bg-gray-700', icon: 'faHome', type: 'expense' },
    { name: 'Dining Out', color: 'bg-orange-400', icon: 'faUtensils', type: 'expense' },
    { name: 'Bonuses', color: 'bg-green-600', icon: 'faMedal', type: 'income' },
    { name: 'Freelance', color: 'bg-green-400', icon: 'faBriefcase', type: 'income' },
    { name: 'Savings', color: 'bg-blue-600', icon: 'faPiggyBank', type: 'income' },
    { name: 'Groceries', color: 'bg-green-300', icon: 'faAppleAlt', type: 'expense' },
    { name: 'Clothing', color: 'bg-pink-400', icon: 'faShirt', type: 'expense' },
    { name: 'Travel', color: 'bg-blue-300', icon: 'faPlane', type: 'expense' },
    { name: 'Loan Payment', color: 'bg-red-700', icon: 'faUniversity', type: 'expense' },
    { name: 'Charity', color: 'bg-purple-600', icon: 'faHandsHelping', type: 'expense' },
    { name: 'Interest', color: 'bg-teal-400', icon: 'faPercentage', type: 'income' },
    { name: 'Commission', color: 'bg-yellow-600', icon: 'faChartPie', type: 'income' },
    { name: 'Childcare', color: 'bg-orange-600', icon: 'faChild', type: 'expense' },
    { name: 'Electronics', color: 'bg-gray-800', icon: 'faLaptop', type: 'expense' },
    { name: 'Pet Care', color: 'bg-teal-300', icon: 'faPaw', type: 'expense' },
    { name: 'Subscriptions', color: 'bg-indigo-600', icon: 'faTv', type: 'expense' },
    { name: 'Household', color: 'bg-yellow-400', icon: 'faCouch', type: 'expense' },
    { name: 'Tips', color: 'bg-purple-300', icon: 'faCoins', type: 'income' },
    { name: 'Investment Returns', color: 'bg-blue-700', icon: 'faChartBar', type: 'income' },
    { name: 'Other Income', color: 'bg-green-800', icon: 'faMoneyCheckAlt', type: 'income' },
    { name: 'Miscellaneous', color: 'bg-gray-400', icon: 'faQuestionCircle', type: 'expense' },
  ];

  incomeTags: any;
  expenseTags: any;
  

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

  constructor(private themeService: ThemeService) {
    Chart.register(this.customPlugin);
    this.currentTheme = this.themeService.currentTheme;
    this.incomeTags = this.tags.filter((tag) => tag.type === 'income');
  this.expenseTags = this.tags.filter((tag) => tag.type === 'expense');
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      // this.updateChart();
    });
  }

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
