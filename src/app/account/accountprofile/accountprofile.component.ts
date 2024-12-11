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
import { DoughnutComponent } from '../../component/chart/doughnut/doughnut.component';
import { LineComponent } from '../../component/chart/line/line.component';
import { BarComponent } from '../../component/chart/bar/bar.component';
import { ChartdataService } from '../../service/chartdata.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmdialogComponent } from '../../component/confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-accountprofile',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    DialogModule,
    TagComponent,
    DonutComponent,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    DoughnutComponent,
    LineComponent,
    BarComponent,
    PaginatorComponent,
    SkeletonModule,
    ConfirmdialogComponent,
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
  accGoal: any;

  monthlybalance: any;
  accgoaltarget: number[] = [];

  addMoneyForm: FormGroup | any;
  minusMoneyForm: FormGroup | any;

  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dbService: DatabaseService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private colorService: ColorService,
    private chartDataService: ChartdataService
  ) {
    let loadingTasks: boolean[] = [false, false, false, false, false, false];
    const taskCompleted = () => {
      if (loadingTasks.every((task) => task)) {
        this.loading = false;
      }
    };

    this.id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
    this.authService.user$.subscribe((user) => {
      if (user != null) {
        this.user = user;
        this.dbService.transactionBudgetGoalTagByUserId();
        this.dbService.budgetTagByUserId();
        loadingTasks[0] = true;
        taskCompleted();
      }
    });
    this.dbService.accounts$.subscribe((acc) => {
      if (acc.length > 0) {
        this.account = acc.filter((account) => account.id === this.id).at(0);
        loadingTasks[1] = true;
        taskCompleted();
      }
    });
    this.dbService.budgetTag$.subscribe((budget) => {
      if (budget.length > 0) {
        this.budgets = budget;
        this.incomebudgets = budget.filter(
          (budget) => budget.budgettype === 'income'
        );
        this.expensebudgets = budget.filter(
          (budget) => budget.budgettype === 'expense'
        );
        loadingTasks[2] = true;
        taskCompleted();
      }
    });
    this.dbService.goalTag$.subscribe((goal) => {
      if (goal.length > 0) {
        this.goals = goal;
        this.accGoal = goal
          .filter((goal) => goal.accountid === this.account.id)
          .at(0);
        this.otherGoals = goal.filter((goal) => goal.tagid != null);
        loadingTasks[3] = true;
        taskCompleted();
      }
    });
    this.dbService.months$.subscribe((months) => {
      this.months = months;
      this.selectedMonth = this.months[this.months.length - 1];
      loadingTasks[5] = true;
      taskCompleted();
    });
    this.dbService.transactionsBudgetGoalTag$.subscribe((trans) => {
      if (trans.length > 0) {
        this.transactions = trans.filter(
          (transaction) => transaction.accountid === this.id
        );
        (this.monthlybalance = this.chartDataService.getAccountMonthlyBalance(
          this.months,
          this.transactions,
          this.account.initialbalance,
          true
        )),
          (this.accgoaltarget = []);
        this.monthlybalance.forEach(() => {
          this.accgoaltarget.push(this.accGoal?.targetamount);
        });
        this.unfilteredTransactions = [...this.transactions];
        this.getUniqueGoals();
        this.getUniqueIncomes();
        this.getUniqueExpenses();
        this.selectMonth(this.selectedMonth);
        this.updateGoalProgressLineChart();
        this.updateNetIncomeLineChart();
        this.updateIncomeExpenseBarChart();
        this.updateGoalBarChart();
        this.updateGoalDonutChart();
        this.updateIncomeDonutChart();
        this.updateExpenseDonutChart();
        loadingTasks[4] = true;
        taskCompleted();
      }
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
    });
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  goToAccGoal(id: string) {
    this.router.navigate(['/goal/accgoal', id]);
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

  resizeBarThickness: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth < 500 && !this.resizeBarThickness) {
      this.incomeExpenseBarChartData = {
        ...this.incomeExpenseBarChartData,
        datasets: this.incomeExpenseBarChartData.datasets.map(
          (dataset: any) => ({
            ...dataset,
            barThickness: 20,
          })
        ),
      };
      this.resizeBarThickness = true;
    }
    if (window.innerWidth >= 500 && this.resizeBarThickness) {
      this.incomeExpenseBarChartData = {
        ...this.incomeExpenseBarChartData,
        datasets: this.incomeExpenseBarChartData.datasets.map(
          (dataset: any) => ({
            ...dataset,
            barThickness: 30,
          })
        ),
      };
      this.resizeBarThickness = false;
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
    this.filteredTransactions = [...this.unfilteredTransactions];
    this.getTransactions();
    this.updateDailyIncomeExpenseLineChart();
    this.updateMonthlyIncomeExpenseLineChart();
    this.updateIncomeDonutChart();
    this.updateExpenseDonutChart();
    this.updateGoalDonutChart();
  }

  selectedMonth: any;
  unfilteredTransactions: any[] = [];
  filteredTransactions: any[] = [];
  months: any[] = [];
  monthSet = new Set<any[]>();

  //-----------------------------------Transaction Filters--------------------------------

  viewFilterDialog: boolean = false;
  filterOn: boolean = false;

  transactionType: any;
  transactionSort: any;

  confirmChangeTarget: boolean = false;

  showConfirmChangeTarget() {
    this.confirmChangeTarget = true;
  }

  onCancelChangeTarget() {
    this.confirmChangeTarget = false;
  }

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
    this.viewFilterDialog = false;
    this.filterOn = true;
  }

  clearFilter() {
    this.filteredTransactions = [...this.unfilteredTransactions];
    this.transactionSort = null;
    this.transactionType = null;
    this.viewFilterDialog = false;
    this.filterOn = false;
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
          console.log('Not expense');
          let updatedGoal: any = { ...this.selectedGoal };
          delete updatedGoal?.tag;
          delete updatedGoal?.account;
          console.log({
            ...updatedGoal,
            currentamount:
              updatedGoal.currentamount + this.minusMoneyForm.value['amount'],
          });
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
        'There was an error with your new account registration. Try again later.'
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
    this.isExpense = true;
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

  //------------------------------------Charts Function------------------------------------

  getMonthLabel() {
    return this.chartDataService.getMonthLabel(this.months);
  }

  getDailyLabel() {
    if (this.selectedMonth != 'All') {
      return this.chartDataService.getDailyLabel(this.selectedMonth);
    } else {
      return [];
    }
  }

  uniqueGoals: any;
  uniqueIncome: any;
  uniqueExpense: any;

  //with budget or goal
  incomeTotalWithBudget: any;
  expenseTotalWithBudget: any;
  goalTotalWithGoal: any;

  allIncomeTotal: any;
  allExpenseTotal: any;
  allGoalsTotal: any;

  getUniqueIncomes() {
    this.uniqueIncome = this.chartDataService.getUniqueIncomes(
      this.transactions
    );
  }

  getUniqueExpenses() {
    this.uniqueExpense = this.chartDataService.getUniqueExpenses(
      this.transactions
    );
  }

  getUniqueGoals() {
    this.uniqueGoals = this.chartDataService.getUniqueGoals(this.transactions);
  }

  getTransactions() {
    this.allIncomeTotal = this.chartDataService.getTransactionOverallTotal(
      this.incomeTransactions,
      'income'
    );
    this.allExpenseTotal = this.chartDataService.getTransactionOverallTotal(
      this.expenseTransactions,
      'expense'
    );
    this.allGoalsTotal = this.chartDataService.getTransactionOverallTotal(
      this.goalTransactions,
      'goal'
    );
    this.incomeTotalWithBudget = this.chartDataService.getTransactionTotal(
      this.uniqueIncome,
      this.incomeTransactions,
      'income'
    );
    this.expenseTotalWithBudget = this.chartDataService.getTransactionTotal(
      this.uniqueExpense,
      this.expenseTransactions,
      'expense'
    );
    this.goalTotalWithGoal = this.chartDataService.getTransactionTotal(
      this.uniqueGoals,
      this.goalTransactions,
      'goal'
    );
  }

  getTransactionsTotal(type: string) {
    if (type === 'income') {
      return this.incomeTotalWithBudget.map((item: any) => item.total);
    } else if (type === 'expense') {
      return this.expenseTotalWithBudget.map((item: any) => item.total);
    } else {
      return this.goalTotalWithGoal.map((item: any) => item.total);
    }
  }

  getTransactionsColors(type: string) {
    if (type === 'income') {
      return this.uniqueIncome.map((item: any) => {
        let colorToConvert = ('bg-' +
          item.tag.color +
          '-600') as keyof typeof colorToHex;
        return colorToHex[colorToConvert];
      });
    } else if (type === 'expense') {
      return this.uniqueExpense.map((item: any) => {
        let colorToConvert = ('bg-' +
          item.tag.color +
          '-600') as keyof typeof colorToHex;
        return colorToHex[colorToConvert];
      });
    } else {
      return this.uniqueGoals.map((item: any) => {
        let colorToConvert = ('bg-' +
          item.tag.color +
          '-600') as keyof typeof colorToHex;
        return colorToHex[colorToConvert];
      });
    }
  }

  getTransactionsLabel(type: string) {
    if (type === 'income') {
      return this.uniqueIncome.map((item: any) => item.budgetname);
    } else if (type === 'expense') {
      return this.uniqueExpense.map((item: any) => item.budgetname);
    } else {
      return this.uniqueGoals.map((item: any) => item.goalname);
    }
  }

  //-----------------------------------Chart Data and Update------------------------------------

  public dailyIncomeLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  public dailyExpenseLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  public monthlyIncomeLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  public monthlyExpenseLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  public goalLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  public incomeExpenseBarChartData: ChartData<'bar'> = {
    datasets: [],
  };

  public goalBarChartData: ChartData<'bar'> = {
    datasets: [],
  };

  public netIncomeLineChartData: ChartConfiguration['data'] = {
    datasets: [],
  };

  public goalDonutChartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  public incomeDonutChartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  public expenseDonutChartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  public goalProgressLineChart: ChartConfiguration['data'] = {
    datasets: [],
  };

  updateIncomeExpenseBarChart() {
    this.incomeExpenseBarChartData = {
      ...this.incomeExpenseBarChartData,
      datasets: [
        {
          data: this.chartDataService.getMonthlyTransactionsData(
            this.months,
            this.transactions,
            'income'
          ),
          label: 'Incomes',
          backgroundColor: 'rgba(74, 222, 128, 1)',
          barThickness: 30,
        },
        {
          data: this.chartDataService.getMonthlyTransactionsData(
            this.months,
            this.transactions,
            'expense'
          ),
          label: 'Expenses',
          backgroundColor: 'rgba(248, 113, 113, 1)',
          barThickness: 30,
        },
      ],
      labels: this.chartDataService.getMonthLabel(this.months),
    };
  }

  updateGoalBarChart() {
    this.goalBarChartData = {
      ...this.goalBarChartData,
      datasets: this.chartDataService.getTransactionsStackedData(
        this.uniqueGoals,
        this.goalTransactions,
        this.months,
        'goal'
      ),
      labels: this.getMonthLabel(),
    };
  }

  updateGoalDonutChart() {
    this.goalDonutChartData = {
      ...this.goalDonutChartData,
      labels: this.getTransactionsLabel('goal'),
      datasets: [
        {
          data: this.getTransactionsTotal('goal'),
          backgroundColor: this.getTransactionsColors('goal'),
          borderWidth: 3,
        },
      ],
    };
  }

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

  updateDailyIncomeExpenseLineChart() {
    this.dailyIncomeLineChartData = {
      ...this.dailyIncomeLineChartData,
      datasets: [
        {
          data: this.chartDataService.getDailyTransactionsData(
            this.incomeTransactions,
            'income'
          ),
          label: 'Incomes',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: 'rgba(74, 222, 128, 1)',
        },
      ],
      labels: this.getDailyLabel(),
    };
    this.dailyExpenseLineChartData = {
      ...this.dailyExpenseLineChartData,
      datasets: [
        {
          data: this.chartDataService.getDailyTransactionsData(
            this.expenseTransactions,
            'expense'
          ),
          label: 'Expenses',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: 'rgba(248, 113, 113, 1)',
        },
      ],
      labels: this.getDailyLabel(),
    };
  }

  updateMonthlyIncomeExpenseLineChart() {
    this.monthlyIncomeLineChartData = {
      ...this.monthlyIncomeLineChartData,
      datasets: [
        {
          data: this.chartDataService.getMonthlyTransactionsData(
            this.months,
            this.transactions,
            'income'
          ),
          label: 'Incomes',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: 'rgba(74, 222, 128, 1)',
        },
      ],
      labels: this.getMonthLabel(),
    };
    this.monthlyExpenseLineChartData = {
      ...this.monthlyExpenseLineChartData,
      datasets: [
        {
          data: this.chartDataService.getMonthlyTransactionsData(
            this.months,
            this.transactions,
            'expense'
          ),
          label: 'Expenses',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: 'rgba(248, 113, 113, 1)',
        },
      ],
      labels: this.getMonthLabel(),
    };
  }

  updateNetIncomeLineChart() {
    this.netIncomeLineChartData = {
      ...this.netIncomeLineChartData,
      datasets: [
        {
          data: this.chartDataService.getMonthlyNetIncome(
            this.months,
            this.transactions
          ),
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
  }

  updateGoalProgressLineChart() {
    this.goalProgressLineChart = {
      ...this.goalProgressLineChart,
      datasets: [
        {
          data: this.monthlybalance,
          label: 'Goal Progress',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: '#6366f1',
        },
        {
          data: this.accgoaltarget,
          label: 'Target Amount',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          borderColor: 'rgba(74, 222, 128, 1)',
        },
      ],
      labels: this.getMonthLabel(),
    };
  }
}
