import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseChartDirective } from 'ng2-charts';
import { DonutComponent } from '../component/donut/donut.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../service/theme.service';
import { icons } from '../component/icons/icons';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TagComponent } from '../component/tag/tag.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressbarComponent } from '../component/progressbar/progressbar.component';
import { DatabaseService } from '../service/database.service';
import { ColorService, colorToHex } from '../service/color.service';
import { DoughnutComponent } from '../component/chart/doughnut/doughnut.component';
import { ChartdataService } from '../service/chartdata.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    BaseChartDirective,
    ProgressBarModule,
    ProgressbarComponent,
    DoughnutComponent,
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent {
  currentTheme = '';

  accounts: any;

  budgets: any;
  incomebudgets: any;
  expensebudgets: any;

  transactions: any;
  incometransactions: any;
  expensetransactions: any;

  months: any;
  selectedMonth: any;

  filteredTransactions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dbService: DatabaseService,
    private colorService: ColorService,
    private chartDataService: ChartdataService
  ) {
    this.currentTheme = this.themeService.currentTheme;
    this.dbService.budgetTag$.subscribe((budget) => {
      this.budgets = budget;
      this.incomebudgets = budget.filter(
        (budget) => budget.budgettype === 'income'
      );
      this.expensebudgets = budget.filter(
        (budget) => budget.budgettype === 'expense'
      );
    });
    this.dbService.months$.subscribe((month) => {
      this.months = month;
      this.selectedMonth = this.months[this.months.length - 1];
    });
    this.dbService.accounts$.subscribe((acc) => {
      this.accounts = acc;
      this.accounts.push({
        id: 0,
        accountname: 'All Account',
      });
      this.selectedAcc = this.accounts[this.accounts.length - 1];
    });
    this.dbService.transactionsBudgetGoalTag$.subscribe((trans) => {
      if (trans.length > 0) {
        this.transactions = trans;
        this.incometransactions = trans.filter(
          (transaction) => transaction.type === 'income'
        );
        this.expensetransactions = trans.filter(
          (transaction) => transaction.type === 'expense'
        );
        this.selectMonth(this.selectedMonth);
        this.selectAcc(this.selectedAcc);
        this.updateIncomeDonutChart();
        this.updateExpenseDonutChart();
      }
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  getColors(colorName: string) {
    return this.colorService.getColor(colorName, 'dark');
  }

  addBudget() {
    this.router.navigate(['budget/addbudget']);
  }

  goToBudget(id: string) {
    this.router.navigate(['/budget', id]);
  }

  expenses = [
    {
      budgetName: 'Food',
      type: 'Expense',
      userID: 'user123',
      accountID: 'accountB',
      tagsID: 'food123',
      currentAmount: 150,
      targetAmount: 200,
      createdDate: '2024-02-05',
      month: 2,
      year: 2024,
    },
    {
      budgetName: 'Petrol',
      type: 'Expense',
      userID: 'user123',
      accountID: 'accountB',
      tagsID: 'petrol123',
      currentAmount: 60,
      targetAmount: 100,
      createdDate: '2024-02-05',
      month: 2,
      year: 2024,
    },
    {
      budgetName: 'Shopping',
      type: 'Expense',
      userID: 'user123',
      accountID: 'accountB',
      tagsID: 'shopping123',
      currentAmount: 0,
      targetAmount: 300,
      createdDate: '2024-02-10',
      month: 2,
      year: 2024,
    },
    {
      budgetName: 'Gifts',
      type: 'Expense',
      userID: 'user123',
      accountID: 'accountC',
      tagsID: 'gifts123',
      currentAmount: 30,
      targetAmount: 100,
      createdDate: '2024-02-12',
      month: 2,
      year: 2024,
    },
    {
      budgetName: 'Rent',
      type: 'Expense',
      userID: 'user123',
      accountID: 'accountB',
      tagsID: 'rent123',
      currentAmount: 800,
      targetAmount: 800,
      createdDate: '2024-01-01',
      month: 1,
      year: 2024,
    },
    {
      budgetName: 'Utilities',
      type: 'Expense',
      userID: 'user123',
      accountID: 'accountB',
      tagsID: 'utilities123',
      currentAmount: 100,
      targetAmount: 150,
      createdDate: '2024-01-15',
      month: 1,
      year: 2024,
    },
    {
      budgetName: 'Healthcare',
      type: 'Expense',
      userID: 'user123',
      accountID: 'accountB',
      tagsID: 'healthcare123',
      currentAmount: 10,
      targetAmount: 100,
      createdDate: '2024-03-10',
      month: 3,
      year: 2024,
    },
  ];

  incomes = [
    {
      budgetName: 'Salary',
      type: 'Income',
      userID: 'user123',
      accountID: 'accountA',
      tagsID: 'income123',
      currentAmount: 3000,
      targetAmount: 3000,
      createdDate: '2024-01-01',
      month: 1,
      year: 2024,
    },
    {
      budgetName: 'Freelance',
      type: 'Income',
      userID: 'user123',
      accountID: 'accountA',
      tagsID: 'freelance123',
      currentAmount: 800,
      targetAmount: 1000,
      createdDate: '2024-02-01',
      month: 2,
      year: 2024,
    },
    {
      budgetName: 'Savings',
      type: 'Income',
      userID: 'user123',
      accountID: 'accountA',
      tagsID: 'savings123',
      currentAmount: 400,
      targetAmount: 1000,
      createdDate: '2024-03-01',
      month: 3,
      year: 2024,
    },
  ];

  incomeTotalWithBudget: any;
  expenseTotalWithBudget: any;

  allIncomeTotal: any;
  allExpenseTotal: any;

  getTransactions() {
    this.allIncomeTotal = this.chartDataService.getTransactionOverallTotal(
      this.incometransactions,
      'income'
    );
    this.allExpenseTotal = this.chartDataService.getTransactionOverallTotal(
      this.expensetransactions,
      'expense'
    );
    this.incomeTotalWithBudget = this.chartDataService.getTransactionTotal(
      this.incomebudgets,
      this.incometransactions,
      'income'
    );
    this.expenseTotalWithBudget = this.chartDataService.getTransactionTotal(
      this.expensebudgets,
      this.expensetransactions,
      'expense'
    );
    console.log(this.incomeTotalWithBudget);
    
  }

  getPercentage(number1: number, number2: number): number {
    return parseFloat(((number1 / number2) * 100).toFixed(2));
  }

  @ViewChild('monthDropdownButton', { static: false })
  monthDropdownButton!: ElementRef;
  @ViewChild('monthDropdownOverlay', { static: false })
  monthDropdownOverlay!: ElementRef;

  monthDropdown: boolean = false;

  toggleMonthDropdown() {
    this.monthDropdown = !this.monthDropdown;
  }

  selectMonth(month: any) {
    this.selectedMonth = month;
    this.monthDropdown = false;
    this.filterTransactions();
  }

  @ViewChild('accDropdownButton', { static: false })
  accDropdownButton!: ElementRef;
  @ViewChild('accDropdownOverlay', { static: false })
  accDropdownOverlay!: ElementRef;

  selectedAcc: any = 'All';

  accDropdown: boolean = false;

  toggleAccDropdown() {
    this.accDropdown = !this.accDropdown;
  }

  selectAcc(acc: string) {
    this.selectedAcc = acc;
    this.accDropdown = false;
    this.filterTransactions();
  }

  filterTransactions() {
    if (this.selectedMonth === 'All') {
      if (this.selectedAcc.id === 0) {
        this.filteredTransactions = [...this.transactions];
      } else {
        this.filteredTransactions = this.transactions.filter(
          (transaction: any) => transaction.accountid === this.selectedAcc.id
        );
      }
    } else {
      let tempTransactions: any[] = [];
      this.transactions.forEach((transaction: any) => {
        const date = new Date(transaction.created_at);
        const monthYear = date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        if (monthYear === this.selectedMonth) {
          tempTransactions.push(transaction);
        }
      });
      if (this.selectedAcc.id === 0) {
        this.filteredTransactions = [...tempTransactions];
      } else {
        this.filteredTransactions = tempTransactions.filter(
          (transaction: any) => transaction.accountid === this.selectedAcc.id
        );
      }
    }
    this.incometransactions = this.filteredTransactions.filter(
      (transaction) => transaction.type === 'income'
    );
    this.expensetransactions = this.filteredTransactions.filter(
      (transaction) => transaction.type === 'expense'
    );
    this.getTransactions();
    this.updateIncomeDonutChart();
    this.updateExpenseDonutChart();
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (
      this.monthDropdownOverlay &&
      !this.monthDropdownButton.nativeElement.contains(target) &&
      (!this.monthDropdownOverlay ||
        !this.monthDropdownOverlay.nativeElement.contains(target))
    ) {
      this.monthDropdown = false;
    }
    if (
      this.accDropdownOverlay &&
      !this.accDropdownButton.nativeElement.contains(target) &&
      (!this.accDropdownOverlay ||
        !this.accDropdownOverlay.nativeElement.contains(target))
    ) {
      this.accDropdown = false;
    }
  }

  //------------------------------------Donut chart------------------------------------

  @ViewChild(BaseChartDirective) donutChart:
    | BaseChartDirective<'doughnut'>
    | undefined;

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Salary', 'Freelance', 'Other'],
    datasets: [
      {
        data: [1350, 4500, 100],
        borderWidth: 1,
      },
    ],
  };

  public doughnutChartType = 'doughnut' as const;

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  updateDonutChartColors() {
    if (this.currentTheme === 'dark') {
      this.doughnutChartData = {
        ...this.doughnutChartData,
        datasets: [
          {
            data: [1350, 4500, 100],
            backgroundColor: ['#FF6384', '#36A2EB', 'rgba(251, 146, 60, 1)'],
            borderWidth: 1,
            borderColor: 'rgba(15, 23, 42, 1)',
          },
        ],
      };
      this.doughnutChartOptions = {
        ...this.doughnutChartOptions,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'white',
            },
          },
        },
      };
    } else {
      this.doughnutChartData = {
        ...this.doughnutChartData,
        datasets: [
          {
            data: [1350, 4500, 100],
            backgroundColor: ['#FF6384', '#36A2EB', 'rgba(251, 146, 60, 1)'],
            borderWidth: 1,
            borderColor: 'white',
          },
        ],
      };
      this.doughnutChartOptions = {
        ...this.doughnutChartOptions,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'black',
            },
          },
        },
      };
    }
    this.donutChart?.update();
  }

  //------------------------------------Bar chart------------------------------------

  @ViewChild(BaseChartDirective) barChart:
    | BaseChartDirective<'bar'>
    | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
      // datalabels: {
      //   anchor: 'end',
      //   align: 'end',
      // },
    },
  };

  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'August'],
    datasets: [
      {
        data: [4300, 4300, 4500, 4500, 4500],
        label: 'Salary',
        backgroundColor: 'rgba(74, 222, 128, 1)',
        stack: 'a',
      },
      {
        data: [2500, 2600, 3000, 2700, 2400],
        label: 'Freelance',
        backgroundColor: 'rgba(248, 113, 113, 1)',
        stack: 'a',
      },
      {
        data: [250, 200, 300, 700, 400],
        label: 'Other',
        backgroundColor: 'rgba(248, 113, 113, 1)',
        stack: 'a',
      },
    ],
  };

  updateBarChartColors() {
    if (this.currentTheme === 'dark') {
      this.barChartOptions = {
        ...this.barChartOptions,
        scales: {
          y: {
            ticks: {
              color: 'white',
            },
            grid: {
              lineWidth: 1,
              color: 'rgba(107, 114, 128, 1)',
            },
          },
          x: {
            ticks: {
              color: 'white',
            },
            grid: {
              lineWidth: 1,
              color: 'rgba(107, 114, 128, 1)',
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'white',
            },
          },
        },
      };
    } else {
      this.barChartOptions = {
        ...this.barChartOptions,
        scales: {
          y: {
            ticks: {
              color: 'black',
            },
            grid: {
              lineWidth: 1,
              color: 'rgba(229, 231, 235, 1)',
            },
          },
          x: {
            ticks: {
              color: 'black',
            },
            grid: {
              lineWidth: 1,
              color: 'rgba(229, 231, 235, 1)',
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'black',
            },
          },
        },
      };
    }
    this.barChart?.update();
  }

  getTransactionsTotal(type: string) {
    if (type === 'income') {
      return this.incomeTotalWithBudget.map((item: any) => item.total);
    } else {
      return this.expenseTotalWithBudget.map((item: any) => item.total);
    }
  }

  getTransactionsColors(type: string) {
    if (type === 'income') {
      return this.incomebudgets.map((item: any) => {
        let colorToConvert = ('bg-' +
          item.tag.color +
          '-600') as keyof typeof colorToHex;
        return colorToHex[colorToConvert];
      });
    } else {
      return this.expensebudgets.map((item: any) => {
        let colorToConvert = ('bg-' +
          item.tag.color +
          '-600') as keyof typeof colorToHex;
        return colorToHex[colorToConvert];
      });
    }
  }

  getTransactionsLabel(type: string) {
    if (type === 'income') {
      return this.incomebudgets.map((item: any) => item.budgetname);
    } else {
      return this.expensebudgets.map((item: any) => item.budgetname);
    }
  }

  //------------------------------------Line chart------------------------------------

  public incomeDonutChartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  public expenseDonutChartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  updateIncomeDonutChart() {
    this.incomeDonutChartData = {
      ...this.incomeDonutChartData,
      labels: this.getTransactionsLabel('income'),
      datasets: [
        {
          data: this.getTransactionsTotal('income'),
          backgroundColor: this.getTransactionsColors('income'),
          borderWidth: 3,
        },
      ],
    };
  }

  updateExpenseDonutChart() {
    this.expenseDonutChartData = {
      ...this.expenseDonutChartData,
      labels: this.getTransactionsLabel('expense'),
      datasets: [
        {
          data: this.getTransactionsTotal('expense'),
          backgroundColor: this.getTransactionsColors('expense'),
          borderWidth: 3,
        },
      ],
    };
  }
}
