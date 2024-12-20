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
import { LineComponent } from '../component/chart/line/line.component';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ProgressBarModule,
    DoughnutComponent,
    TagComponent,
    LineComponent,
    DonutComponent,
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

  activePage = 0;
  budgetPaging = [
    {
      label: 'Incomes',
      icon: 'faSignIn',
    },
    {
      label: 'Expense',
      icon: 'faSignOut',
    },
    {
      label: 'Recurring',
      icon: 'faClock',
    },
    {
      label: 'Statistics',
      icon: 'faChartBar',
    },
  ];

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
      this.months = month.filter((month: any) => month !== 'All');
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
        this.transactions = trans.filter((trans) => trans.budget);
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
        this.updateIncomeLineChart();
        this.updateExpenseLineChart();
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
  }

  getPercentage(number1: number, number2: number): number {
    let percentage = parseFloat(((number1 / number2) * 100).toFixed(2));
    if (percentage >= 100) {
      return 100;
    } else {
      return percentage;
    }
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

  getBudgetMonthlyData(type: string) {
    let data: any[] = [];
    if (type === 'income') {
      this.incomebudgets.forEach((income: any) => {
        let colorToConvert = ('bg-' +
          income.tag.color +
          '-600') as keyof typeof colorToHex;

        data.push({
          data: this.chartDataService.getMonthlyBudgetTotal(
            income,
            this.months,
            this.transactions
          ),
          label: income.budgetname,
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: colorToHex[colorToConvert],
        });
      });
    } else {
      this.expensebudgets.forEach((expense: any) => {
        let colorToConvert = ('bg-' +
          expense.tag.color +
          '-600') as keyof typeof colorToHex;

        data.push({
          data: this.chartDataService.getMonthlyBudgetTotal(
            expense,
            this.months,
            this.transactions
          ),
          label: expense.budgetname,
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: colorToHex[colorToConvert],
        });
      });
    }
    console.log(data);
    return data;
  }

  getMonthLabel() {
    return this.chartDataService.getMonthLabel(this.months);
  }

  //------------------------------------Line chart------------------------------------

  public incomeDonutChartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  public expenseDonutChartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  public incomeLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  public expenseLineChartData: ChartConfiguration['data'] = {
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

  updateIncomeLineChart() {
    this.incomeLineChartData = {
      ...this.incomeLineChartData,
      datasets: this.getBudgetMonthlyData('income'),
      labels: this.getMonthLabel(),
    };
  }

  updateExpenseLineChart() {
    this.expenseLineChartData = {
      ...this.expenseLineChartData,
      datasets: this.getBudgetMonthlyData('expense'),
      labels: this.getMonthLabel(),
    };
  }
}
