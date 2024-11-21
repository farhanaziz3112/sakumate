import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { icons } from '../../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagComponent } from '../../component/tag/tag.component';
import { ThemeService } from '../../service/theme.service';
import { DonutComponent } from '../../component/donut/donut.component';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PaginatorComponent } from '../../component/paginator/paginator.component';
import { DatabaseService } from '../../service/database.service';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../service/auth.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../service/toast.service';
import { Sidebar } from 'primeng/sidebar';
import { SidebarModule } from 'primeng/sidebar';
import { ChangeDetectorRef } from '@angular/core';
import { ColorService, colorToHex } from '../../service/color.service';

@Component({
  selector: 'app-accountprofile',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    DialogModule,
    TagComponent,
    DonutComponent,
    BaseChartDirective,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
  ],
  templateUrl: './accountprofile.component.html',
  styleUrl: './accountprofile.component.css',
})
export class AccountprofileComponent implements OnInit {
  currentTheme = '';
  id: any;
  user: User | any;
  account: any;
  transactions: any;
  incomeTransactions: any;
  expenseTransactions: any;
  goalTransactions: any;
  goals: any;
  otherGoals: any;
  accGoals: any;

  addMoneyForm: FormGroup | any;
  minusMoneyForm: FormGroup | any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dbService: DatabaseService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private colorService: ColorService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.dbService.transactionBudgetGoalTagByUserId();
        this.dbService.budgetTagByUserId();
      }
    });
    this.dbService.accounts$.subscribe((acc) => {
      this.account = acc.filter((account) => account.id === this.id).at(0);
    });
    this.dbService.budgetTag$.subscribe((budget) => {
      this.budgets = budget;
      this.incomebudgets = budget.filter(
        (budget) => budget.budgettype === 'income'
      );
      this.expensebudgets = budget.filter(
        (budget) => budget.budgettype === 'expense'
      );
    });
    this.dbService.goalTag$.subscribe((goal) => {
      this.goals = goal;
      this.accGoals = goal.filter((goal) => goal.tagid === null);
      this.otherGoals = goal.filter((goal) => goal.tagid != null);
    });
    this.dbService.transactionsBudgetGoalTag$.subscribe((trans) => {
      this.transactions = trans.filter(
        (transaction) => transaction.accountid === this.id
      );
      this.unfilteredTransactions = [...this.transactions];
      this.extractUniqueMonths();
      this.selectMonth(this.selectedMonth);
      this.updateNetIncomeLineChart();
      this.updateIncomeExpenseBarChart();
      this.updateGoalBarChart();
      this.updateGoalDonutChart();
      // this.cdr.detectChanges();
      this.updatePaginatedData();
    });
    this.addMoneyForm = this.fb.group({
      amount: ['', [Validators.required]],
      description: [''],
      title: ['', [Validators.required]],
    });
    this.minusMoneyForm = this.fb.group({
      amount: ['', [Validators.required]],
      description: [''],
      title: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      this.updateLineChartOptions();
      // this.updateLineChartColors();
      //this.updateLineChartColors2();
      // this.updateBarChartColors();
      // this.updateDonutChartColors();
    });
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  getTotalTransactions(transactions: any): number {
    let total = 0;
    for (let i = 0; i < transactions.length; i++) {
      total += transactions[i].amount;
    }
    return total;
  }

  //-----------------------------------Month Set--------------------------------

  monthDropdown: boolean = false;
  @ViewChild('monthDropdownButton', { static: false })
  monthDropdownButton!: ElementRef;
  @ViewChild('monthDropdownPanel', { static: false })
  monthDropdownPanel!: ElementRef;

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (
      this.monthDropdownPanel &&
      !this.monthDropdownButton.nativeElement.contains(target) &&
      (!this.monthDropdownPanel ||
        !this.monthDropdownPanel.nativeElement.contains(target))
    ) {
      this.monthDropdown = false;
    }
  }

  toggleMonthDropdown() {
    this.monthDropdown = !this.monthDropdown;
  }

  selectMonth(month: any) {
    this.selectedMonth = month;
    this.monthDropdown = false;
    if (month === 'All') {
      this.unfilteredTransactions = [...this.transactions];
    } else {
      let tempTransactions: any[] = [];
      this.transactions.forEach((transaction: any) => {
        const date = new Date(transaction.created_at);
        const monthYear = date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        if (monthYear === month) {
          tempTransactions.push(transaction);
        }
      });
      this.unfilteredTransactions = [...tempTransactions];
    }
    this.incomeTransactions = this.unfilteredTransactions.filter(
      (transaction) =>
        transaction.type === 'income' && transaction.accountid === this.id
    );
    this.expenseTransactions = this.unfilteredTransactions.filter(
      (transaction) =>
        transaction.type === 'expense' && transaction.accountid === this.id
    );
    this.goalTransactions = this.unfilteredTransactions.filter(
      (transaction) =>
        transaction.type === 'goal' && transaction.accountid === this.id
    );
    this.currentPage = 1;
    this.filteredTransactions = [...this.unfilteredTransactions];
    this.updateIncomeExpenseLineChart();
    this.updatePaginatedData();
  }

  selectedMonth: any;
  unfilteredTransactions: any[] = [];
  filteredTransactions: any[] = [];
  months: any[] = [];
  monthSet = new Set<any[]>();

  extractUniqueMonths() {
    const monthSet = new Set<string>();

    this.transactions.forEach((transaction: any) => {
      const date = new Date(transaction.created_at);
      const monthYear = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      monthSet.add(monthYear);
    });

    this.months = Array.from(monthSet).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA.getTime() - dateB.getTime();
    });

    this.months.push('All');
    this.selectedMonth = this.months[this.months.length - 1];
  }

  //-----------------------------------Transaction Filters--------------------------------

  viewFilterDialog: boolean = false;
  filterOn: boolean = false;

  transactionType: any;
  transactionSort: any;

  types = [
    {
      label: 'Income',
      value: 'income',
    },
    {
      label: 'Expense',
      value: 'expense',
    },
    {
      label: 'Goal',
      value: 'goal',
    },
    {
      label: 'All',
      value: 'all',
    },
  ];

  sorts = [
    {
      label: 'Title: A to Z',
      value: 'a-z',
    },
    {
      label: 'Title: Z to A',
      value: 'z-a',
    },
    {
      label: 'Amount: Low to High',
      value: 'high-to-low',
    },
    {
      label: 'Amount: High to Low',
      value: 'low-to-high',
    },
    {
      label: 'Date: Latest to Oldest',
      value: 'latest',
    },
    {
      label: 'Date: Oldest to Latest',
      value: 'oldest',
    },
  ];

  toggleFilterDialog() {
    this.viewFilterDialog = !this.viewFilterDialog;
  }

  onTypeChange(value: any) {
    this.transactionType = value;
  }

  onSortChange(value: any) {
    this.transactionSort = value;
  }

  onHideFilterDialog() {
    if (!this.filterOn) {
      this.transactionSort = null;
      this.transactionType = null;
    }
  }

  applyFilter() {
    if (this.transactionType) {
      this.filteredTransactions = this.unfilteredTransactions.filter(
        (transaction: any) => {
          if (this.transactionType.value === 'all') {
            return transaction;
          } else {
            return transaction.type === this.transactionType.value;
          }
        }
      );
    }

    if (this.transactionSort) {
      if (this.transactionSort.value === 'a-z') {
        this.filteredTransactions.sort((a: any, b: any) =>
          a.title.localeCompare(b.title)
        );
      } else if (this.transactionSort.value === 'z-a') {
        this.filteredTransactions.sort((a: any, b: any) =>
          b.title.localeCompare(a.title)
        );
      } else if (this.transactionSort.value === 'high-to-low') {
        this.filteredTransactions.sort((a: any, b: any) => a.amount - b.amount);
      } else if (this.transactionSort.value === 'low-to-high') {
        this.filteredTransactions.sort((a: any, b: any) => b.amount - a.amount);
      } else if (this.transactionSort.value === 'latest') {
        this.filteredTransactions.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        this.filteredTransactions.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateA.getTime() - dateB.getTime();
        });
      }
    }
    this.currentPage = 1;
    this.updatePaginatedData();
    this.viewFilterDialog = false;
    this.filterOn = true;
  }

  clearFilter() {
    this.filteredTransactions = [...this.unfilteredTransactions];
    this.transactionSort = null;
    this.transactionType = null;
    this.currentPage = 1;
    this.updatePaginatedData();
    this.viewFilterDialog = false;
    this.filterOn = false;
  }

  //-----------------------------------Paginators--------------------------------

  viewTransactionDialog: boolean = false;
  clickedTransaction: any;

  toggleTransactionDialog(transaction: any) {
    this.viewTransactionDialog = !this.viewTransactionDialog;
    this.clickedTransaction = transaction;
  }

  itemsPerPage: number = 7;
  currentPage: number = 1;
  totalPage: number = 0;
  paginatedData: any[] = [];
  displayedPages: number[] = [];

  updatePaginatedData() {
    this.totalPage = Math.ceil(
      this.filteredTransactions.length / this.itemsPerPage
    );
    this.getDisplayedPages();
    let startIndex = (this.currentPage - 1) * this.itemsPerPage;
    let endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredTransactions.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  getDisplayedPages() {
    let pages: number[] = [];
    let total = this.totalPage;
    let range = 2;

    let start = Math.max(1, this.currentPage - range);
    let end = Math.min(total, this.currentPage + range);

    if (this.currentPage <= range + 1) {
      end = Math.min(total, range * 2 + 1);
    }
    if (this.currentPage >= total - range) {
      start = Math.max(1, total - range * 2);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    this.displayedPages = pages;
  }

  //-----------------------------------Add / Minus Money --------------------------------

  budgets: any;
  incomebudgets: any;
  expensebudgets: any;

  addMoneyDialog: boolean = false;
  minusMoneyDialog: boolean = false;
  budgetDropdown: boolean = false;

  selectedIncomeBudget: any = null;
  selectedExpenseBudget: any = null;
  selectedGoal: any = null;

  isExpense: boolean = true;

  toggleExpense() {
    this.isExpense = !this.isExpense;
    this.selectedExpenseBudget = null;
    this.selectedGoal = null;
  }

  selectIncomeBudget(budget: any) {
    this.selectedIncomeBudget = budget;
    this.budgetDropdown = false;
  }

  selectExpenseBudget(budget: any) {
    this.selectedExpenseBudget = budget;
    this.budgetDropdown = false;
  }

  selectGoal(goal: any) {
    this.selectedGoal = goal;
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

  async submitTransaction(isIncome: boolean) {
    try {
      if (isIncome) {
        await this.dbService.createTransaction({
          amount: this.addMoneyForm.value['amount'],
          description: this.addMoneyForm.value['description'],
          title: this.addMoneyForm.value['title'],
          budgetid: this.selectedIncomeBudget.id,
          accountid: this.account.id,
          userid: this.user.id,
          type: 'income',
        });
        await this.dbService.updateAccount({
          ...this.account,
          currentbalance:
            this.account.currentbalance + this.addMoneyForm.value['amount'],
        });
      } else {
        await this.dbService.createTransaction({
          amount: -this.minusMoneyForm.value['amount'],
          description: this.minusMoneyForm.value['description'],
          title: this.minusMoneyForm.value['title'],
          budgetid: this.isExpense ? this.selectedExpenseBudget.id : null,
          goalid: this.isExpense ? null : this.selectedGoal.id,
          accountid: this.account.id,
          userid: this.user.id,
          type: this.isExpense ? 'expense' : 'goal',
        });
        await this.dbService.updateAccount({
          ...this.account,
          currentbalance:
            this.account.currentbalance - this.minusMoneyForm.value['amount'],
        });
        if (!this.isExpense) {
          let updatedGoal: any = { ...this.selectedGoal };
          delete updatedGoal?.tag;
          delete updatedGoal?.account;
          await this.dbService.updateGoal({
            ...updatedGoal,
            currentamount:
              updatedGoal.currentamount + this.minusMoneyForm.value['amount'],
          });
        }
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
      this.selectedExpenseBudget = null;
      this.minusMoneyForm.reset();
      this.addMoneyForm.reset();
      this.addMoneyDialog = false;
      this.minusMoneyDialog = false;
    }
  }

  closeDialog() {
    this.selectedIncomeBudget = null;
    this.selectedExpenseBudget = null;
    this.selectedGoal = null;
    this.minusMoneyForm.reset();
    this.addMoneyForm.reset();
    this.addMoneyDialog = false;
    this.minusMoneyDialog = false;
    this.budgetDropdown = false;
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

  //------------------------------------Incomes and Expenses Line Chart------------------------------------

  monthsLabel = [
    'Jan',
    'Feb',
    'Mac',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  dayslabel = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) incomeLineChart?: BaseChartDirective;

  public incomeLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  @ViewChild(BaseChartDirective) expenseLineChart?: BaseChartDirective;

  public expenseLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  @ViewChild(BaseChartDirective) goalLineChart?: BaseChartDirective;

  public goalLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  getMonthLabel() {
    const currentDate = new Date();
    let monthsWithoutAll = [...this.months];
    monthsWithoutAll = monthsWithoutAll.filter((month) => month !== 'All');
    return monthsWithoutAll;
  }

  getDailyLabel() {
    const currentDate = new Date();
    const [monthStr, yearStr] = this.selectedMonth.split(' ');
    const date = new Date(`${monthStr} 1, ${yearStr}`);
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (date.getMonth() === currentDate.getMonth()) {
      return this.dayslabel.slice(0, currentDate.getDate());
    } else {
      return this.dayslabel.slice(0, newDate.getDate());
    }
  }

  getDailyIncomesData() {
    let data: any[] = [];
    for (let i = 1; i < 32; i++) {
      let total = 0;
      this.unfilteredTransactions.forEach((transaction) => {
        let date = new Date(transaction.created_at);
        if (transaction.type === 'income' && date.getDate() === i) {
          total += transaction.amount;
        }
      });
      data.push(total);
    }
    return data;
  }

  getDailyExpensesData() {
    let data: any[] = [];
    for (let i = 1; i < 32; i++) {
      let total = 0;
      this.unfilteredTransactions.forEach((transaction) => {
        let date = new Date(transaction.created_at);
        if (transaction.type === 'expense' && date.getDate() === i) {
          total += -transaction.amount;
        }
      });
      data.push(total);
    }
    return data;
  }

  getMonthlyIncomesData() {
    let data: any[] = [];
    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i] === 'All') {
        continue;
      }
      let total = 0;
      const [monthStr, yearStr] = this.months[i].split(' ');
      const date = new Date(`${monthStr} 1, ${yearStr}`);
      this.unfilteredTransactions.forEach((transaction) => {
        let transactiondate = new Date(transaction.created_at);
        if (
          transaction.type === 'income' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          total += transaction.amount;
        }
      });
      data.push(total);
    }
    return data;
  }

  getMonthlyExpensesData() {
    let data: any[] = [];
    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i] === 'All') {
        continue;
      }
      let total = 0;
      const [monthStr, yearStr] = this.months[i].split(' ');
      const date = new Date(`${monthStr} 1, ${yearStr}`);
      this.unfilteredTransactions.forEach((transaction) => {
        let transactiondate = new Date(transaction.created_at);
        if (
          transaction.type === 'expense' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          total += -transaction.amount;
        }
      });
      data.push(total);
    }
    return data;
  }

  getMonthlyGoalData() {
    let goals: any[] = [];

    this.transactions.forEach((transaction: any) => {
      if (transaction.type === 'goal' && transaction.goal) {
        let exists = goals.find((goal: any) => goal.id === transaction.goal.id);
        if (!exists) {
          goals.push(transaction.goal);
        }
      }
    });

    let data: any[] = [];

    for (let i = 0; i < goals.length; i++) {
      let monthlyTotal: any[] = [];
      for (let j = 0; j < this.months.length; j++) {
        if (this.months[j] === 'All') {
          continue;
        }
        let total = 0;
        const [monthStr, yearStr] = this.months[j].split(' ');
        const date = new Date(`${monthStr} 1, ${yearStr}`);
        this.unfilteredTransactions.forEach((transaction) => {
          let transactiondate = new Date(transaction.created_at);
          if (
            transaction.type === 'goal' &&
            transaction.goal.id === goals[i].id &&
            date.getMonth() === transactiondate.getMonth()
          ) {
            total += -transaction.amount;
          }
        });
        monthlyTotal.push(total);
      }
      let colorToConvert = ('bg-' +
        goals[i].tag.color +
        '-400') as keyof typeof colorToHex;
      data.push({
        data: monthlyTotal,
        label: goals[i].goalname,
        backgroundColor: colorToHex[colorToConvert],
        stack: 'a',
        barThickness: 50,
      });
    }
    return data;
  }

  getMonthlyGoalTotal() {
    let goals: any[] = [];

    this.transactions.forEach((transaction: any) => {
      if (transaction.type === 'goal' && transaction.goal) {
        let exists = goals.find((goal: any) => goal.id === transaction.goal.id);
        if (!exists) {
          goals.push(transaction.goal);
        }
      }
    });

    let data: any[] = [];

    for (let i = 0; i < goals.length; i++) {
      let total = 0;
      for (let j = 0; j < this.months.length; j++) {
        if (this.months[j] === 'All') {
          continue;
        }
        const [monthStr, yearStr] = this.months[j].split(' ');
        const date = new Date(`${monthStr} 1, ${yearStr}`);
        this.unfilteredTransactions.forEach((transaction) => {
          let transactiondate = new Date(transaction.created_at);
          if (
            transaction.type === 'goal' &&
            transaction.goal.id === goals[i].id &&
            date.getMonth() === transactiondate.getMonth()
          ) {
            total += -transaction.amount;
          }
        });
      }
      data.push(total);
    }
    return data;
  }

  getMonthlyGoalColors() {
    let goals: any[] = [];
    let colors: any[] = [];

    this.transactions.forEach((transaction: any) => {
      if (transaction.type === 'goal' && transaction.goal) {
        let exists = goals.find((goal: any) => goal.id === transaction.goal.id);
        if (!exists) {
          let colorToConvert = ('bg-' +
            transaction.goal.tag.color +
            '-400') as keyof typeof colorToHex;
          goals.push(transaction.goal);
          colors.push(colorToHex[colorToConvert]);
        }
      }
    });

    return colors;
  }

  updateIncomeExpenseLineChart() {
    this.incomeLineChartData = {
      ...this.incomeLineChartData,
      datasets: [
        {
          data:
            this.selectedMonth === 'All'
              ? this.getMonthlyIncomesData()
              : this.getDailyIncomesData(),
          label: 'Incomes',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: 'rgba(74, 222, 128, 1)',
        },
      ],
      labels:
        this.selectedMonth === 'All'
          ? this.getMonthLabel()
          : this.getDailyLabel(),
    };
    this.expenseLineChartData = {
      ...this.expenseLineChartData,
      datasets: [
        {
          data:
            this.selectedMonth === 'All'
              ? this.getMonthlyExpensesData()
              : this.getDailyExpensesData(),
          label: 'Expenses',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: 'rgba(248, 113, 113, 1)',
        },
      ],
      labels:
        this.selectedMonth === 'All'
          ? this.getMonthLabel()
          : this.getDailyLabel(),
    };
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
      },
    },
  };

  //------------------------------------Net Income Line Chart------------------------------------

  @ViewChild(BaseChartDirective) netIncomeLineChart?: BaseChartDirective;

  public netIncomeLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  @ViewChild(BaseChartDirective) lineChart?: BaseChartDirective;

  getMonthlyNetIncome() {
    let data: any[] = [];
    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i] === 'All') {
        continue;
      }
      let incomeTotal = 0;
      let expenseTotal = 0;
      let goalTotal = 0;
      const [monthStr, yearStr] = this.months[i].split(' ');
      const date = new Date(`${monthStr} 1, ${yearStr}`);
      this.unfilteredTransactions.forEach((transaction) => {
        let transactiondate = new Date(transaction.created_at);
        if (
          transaction.type === 'income' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          incomeTotal += transaction.amount;
        }
        if (
          transaction.type === 'expense' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          expenseTotal += -transaction.amount;
        }
        if (
          transaction.type === 'goal' &&
          date.getMonth() === transactiondate.getMonth()
        ) {
          goalTotal += -transaction.amount;
        }
      });
      data.push(incomeTotal - (expenseTotal + goalTotal));
    }
    return data;
  }

  updateNetIncomeLineChart() {
    this.netIncomeLineChartData = {
      ...this.netIncomeLineChartData,
      datasets: [
        {
          data: this.getMonthlyNetIncome(),
          label: 'Net Income',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: 'rgba(74, 222, 128, 1)',
        },
      ],
      labels: this.getMonthLabel(),
    };
    this.netIncomeLineChart?.update();
  }

  //------------------------------------Update Chart Option------------------------------------

  updateLineChartOptions() {
    if (this.currentTheme === 'dark') {
      this.lineChartOptions = {
        ...this.lineChartOptions,
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
          tooltip: {
            enabled: true,
          },
        },
      };
    } else {
      this.lineChartOptions = {
        ...this.lineChartOptions,
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
          tooltip: {
            enabled: true,
          },
        },
      };
    }
    this.incomeLineChart?.update();
    this.expenseLineChart?.update();
    this.netIncomeLineChart?.update();
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [14500, 15900, 16080, 15600, 16560, 17855, 18400],
        label: 'Current Balance',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      },
      {
        data: [20000, 20000, 20000, 20000, 20000, 20000, 20000],
        label: 'Account Goal',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
      },
    ],
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
    ],
  };

  //------------------------------------Bar chart------------------------------------

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  public barChartType = 'bar' as const;

  @ViewChild(BaseChartDirective) incomeExpenseBarChart:
    | BaseChartDirective<'bar'>
    | undefined;

  public incomeExpenseBarChartData: ChartData<'bar'> = {
    datasets: [],
  };

  @ViewChild(BaseChartDirective) goalBarChart:
    | BaseChartDirective<'bar'>
    | undefined;

  public goalBarChartData: ChartData<'bar'> = {
    datasets: [],
  };

  updateIncomeExpenseBarChart() {
    this.incomeExpenseBarChartData = {
      ...this.incomeExpenseBarChartData,
      datasets: [
        {
          data: this.getMonthlyIncomesData(),
          label: 'Incomes',
          backgroundColor: 'rgba(74, 222, 128, 1)',
        },
        {
          data: this.getMonthlyExpensesData(),
          label: 'Expenses',
          backgroundColor: 'rgba(248, 113, 113, 1)',
        },
      ],
      labels: this.getMonthLabel(),
    };
    this.incomeExpenseBarChart?.update();
  }

  updateGoalBarChart() {
    this.goalBarChartData = {
      ...this.goalBarChartData,
      datasets: this.getMonthlyGoalData(),
      labels: this.getMonthLabel(),
    };
    this.incomeExpenseBarChart?.update();
  }

  @ViewChild(BaseChartDirective) barChart2:
    | BaseChartDirective<'bar'>
    | undefined;

  public barChartOptions2: ChartConfiguration<'bar'>['options'] = {
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
    },
  };

  //------------------------------------Donut chart------------------------------------

  public doughnutChartType = 'doughnut' as const;

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  @ViewChild(BaseChartDirective) goalDonutChart:
    | BaseChartDirective<'doughnut'>
    | undefined;

  @ViewChild(BaseChartDirective) donutChart2:
    | BaseChartDirective<'doughnut'>
    | undefined;

  public goalDonutChartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  public doughnutChartData2: ChartData<'doughnut'> = {
    labels: ['Salary', 'Investments', 'Freelance'],
    datasets: [
      {
        data: [3200, 450, 1000],
        backgroundColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(37, 99, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  updateGoalDonutChart() {
    this.goalDonutChartData = {
      ...this.goalDonutChartData,
      datasets: [
        {
          data: this.getMonthlyGoalTotal(),
          backgroundColor: this.getMonthlyGoalColors(),
          borderWidth: 1,
          borderColor: 'white',
        },
      ],
    };
    // this.doughnutChartOptions = {
    //   ...this.doughnutChartOptions,
    //   plugins: {
    //     legend: {
    //       display: true,
    //       position: 'top',
    //       labels: {
    //         color: 'white',
    //       },
    //     },
    //   },
    // };
    // this.doughnutChartData2 = {
    //   ...this.doughnutChartData2,
    //   datasets: [
    //     {
    //       data: [3200, 450, 1000],
    //       backgroundColor: [
    //         'rgba(34, 197, 94, 1)',
    //         'rgba(99, 102, 241, 1)',
    //         'rgba(37, 99, 235, 1)',
    //       ],
    //       borderWidth: 1,
    //       borderColor: 'rgba(15, 23, 42, 1)',
    //     },
    //   ],
    // };
    // this.doughnutChartOptions2 = {
    //   ...this.doughnutChartOptions2,
    //   plugins: {
    //     legend: {
    //       display: true,
    //       position: 'top',
    //       labels: {
    //         color: 'white',
    //       },
    //     },
    //   },
    // };
    // } else {
    //   this.doughnutChartData = {
    //     ...this.doughnutChartData,
    //     datasets: [
    //       {
    //         data: [350, 450, 100],
    //         backgroundColor: ['#FF6384', '#36A2EB', 'rgba(251, 146, 60, 1)'],
    //         borderWidth: 1,
    //         borderColor: 'white',
    //       },
    //     ],
    //   };
    //   this.doughnutChartOptions = {
    //     ...this.doughnutChartOptions,
    //     plugins: {
    //       legend: {
    //         display: true,
    //         position: 'top',
    //         labels: {
    //           color: 'black',
    //         },
    //       },
    //     },
    //   };
    //   this.doughnutChartData2 = {
    //     ...this.doughnutChartData2,
    //     datasets: [
    //       {
    //         data: [3200, 450, 1000],
    //         backgroundColor: [
    //           'rgba(34, 197, 94, 1)',
    //           'rgba(99, 102, 241, 1)',
    //           'rgba(37, 99, 235, 1)',
    //         ],
    //         borderWidth: 1,
    //         borderColor: 'white',
    //       },
    //     ],
    //   };
    //   this.doughnutChartOptions2 = {
    //     ...this.doughnutChartOptions2,
    //     plugins: {
    //       legend: {
    //         display: true,
    //         position: 'top',
    //         labels: {
    //           color: 'black',
    //         },
    //       },
    //     },
    //   };
    // }
    // this.donutChart?.update();
    // this.donutChart2?.update();
  }
}
