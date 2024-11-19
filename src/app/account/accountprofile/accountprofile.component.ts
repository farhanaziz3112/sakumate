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
    PaginatorComponent,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
  ],
  templateUrl: './accountprofile.component.html',
  styleUrl: './accountprofile.component.css',
})
export class AccountprofileComponent implements OnInit {
  currentTheme = 'light';
  id: any;
  user: User | any;
  account: any;
  transactions: any;
  incomeTransactions: any;
  expenseTransactions: any;

  addMoneyForm: FormGroup | any;
  minusMoneyForm: FormGroup | any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dbService: DatabaseService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.getBudgets();
        this.dbService.transactionBudgetTagByUserId();
      }
    });
    this.dbService.accounts$.subscribe((acc) => {
      this.account = acc.filter((account) => account.id === this.id).at(0);
    });
    this.dbService.transactionsBudgetTag$.subscribe((trans) => {
      this.transactions = trans.filter(
        (transaction) => transaction.accountid === this.id
      );
      this.unfilteredTransactions = [...this.transactions];
      this.extractUniqueMonths();
      this.selectMonth(this.selectedMonth);
      this.updatePaginatedData();
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
      this.updateLineChartColors();
      this.updateLineChartColors2();
      this.updateBarChartColors();
      this.updateDonutChartColors();
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
    this.currentPage = 1;
    this.filteredTransactions = [...this.unfilteredTransactions];
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

    let monthsLenght = this.months.length;
    this.selectedMonth = this.months[monthsLenght - 1];
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
      label: 'Both',
      value: 'both',
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
          if (this.transactionType.value === 'both') {
            return (
              transaction.type === 'income' || transaction.type === 'expense'
            );
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
    console.log(this.filteredTransactions);
    console.log(this.unfilteredTransactions);
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

  incomebudgets: any;
  expensebudgets: any;

  addMoneyDialog: boolean = false;
  minusMoneyDialog: boolean = false;
  budgetDropdown: boolean = false;

  selectedIncomeBudget: any = null;
  selectedIncomeTag: any = null;

  selectedExpenseBudget: any = null;
  selectedExpenseTag: any = null;

  incometags: any[] = [];
  expensetags: any[] = [];

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

  async getBudgets() {
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
    if (expense_budgets && income_budgets) {
      for (let i = 0; i < this.incomebudgets.length; i++) {
        const tag = await this.getTag(this.incomebudgets.at(i).tagid);
        if (
          tag &&
          !this.incometags.some((existingTag) => existingTag.id === tag.id)
        ) {
          this.incometags.push(tag);
        }
      }
      for (let i = 0; i < this.expensebudgets.length; i++) {
        const tag = await this.getTag(this.expensebudgets.at(i).tagid);
        if (
          tag &&
          !this.expensetags.some((existingTag) => existingTag.id === tag.id)
        ) {
          this.expensetags.push(tag);
        }
      }
    }
  }

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
          budgetid: this.selectedExpenseBudget.id,
          accountid: this.account.id,
          userid: this.user.id,
          type: 'expense',
        });
        await this.dbService.updateAccount({
          ...this.account,
          currentbalance:
            this.account.currentbalance - this.minusMoneyForm.value['amount'],
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
      this.minusMoneyForm.reset();
      this.addMoneyForm.reset();
      this.addMoneyDialog = false;
      this.minusMoneyDialog = false;
    }
  }

  closeDialog() {
    this.selectedIncomeBudget = null;
    this.selectedIncomeTag = null;
    this.selectedExpenseBudget = null;
    this.selectedExpenseTag = null;
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

  //------------------------------------Line chart------------------------------------

  @ViewChild(BaseChartDirective) lineChart?: BaseChartDirective;

  public lineChartType: ChartType = 'line';

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

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
      },
    },
  };

  updateLineChartColors() {
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
      this.lineChartData.datasets[0].borderColor = 'rgba(248, 113, 113, 1)';
      this.lineChartData.datasets[1].borderColor = 'rgba(167, 139, 250, 1)';
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
      this.lineChartData.datasets[0].borderColor = 'rgba(248, 113, 113, 1)';
      this.lineChartData.datasets[1].borderColor = 'rgba(167, 139, 250, 1)';
    }
    this.lineChart?.update();
  }

  @ViewChild(BaseChartDirective) lineChart2?: BaseChartDirective;

  public lineChartType2: ChartType = 'line';

  public lineChartData2: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [2500, 2900, 2080, 2600, 2560, 2855, 3400],
        borderColor: 'rgba(74, 222, 128, 1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
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

  public lineChartOptions2: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  updateLineChartColors2() {
    if (this.currentTheme === 'dark') {
      this.lineChartOptions2 = {
        ...this.lineChartOptions2,
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
      };
    } else {
      this.lineChartOptions2 = {
        ...this.lineChartOptions2,
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
      };
    }
    this.lineChart2?.update();
  }

  //put in canvas in html
  // (chartHover)="chartHovered($event)"
  // (chartClick)="chartClicked($event)"

  // public chartClicked({
  //   event,
  //   active,
  // }: {
  //   event?: ChartEvent;
  //   active?: object[];
  // }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({
  //   event,
  //   active,
  // }: {
  //   event?: ChartEvent;
  //   active?: object[];
  // }): void {
  //   console.log(event, active);
  // }

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
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'August'],
    datasets: [
      {
        data: [4000, 4300, 4300, 4300, 4500, 4500, 4500],
        label: 'Income',
        backgroundColor: 'rgba(74, 222, 128, 1)',
      }, // Average Income per month
      {
        data: [2300, 2800, 2500, 2600, 3000, 2700, 2400],
        label: 'Expenses',
        backgroundColor: 'rgba(248, 113, 113, 1)',
      }, // Varied Average Expenses per month
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

  @ViewChild(BaseChartDirective) donutChart:
    | BaseChartDirective<'doughnut'>
    | undefined;

  @ViewChild(BaseChartDirective) donutChart2:
    | BaseChartDirective<'doughnut'>
    | undefined;

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Food', 'Petrol', 'Shopping'],
    datasets: [
      {
        data: [350, 450, 100],
        borderWidth: 1,
      },
    ],
  };

  public doughnutChartType = 'doughnut' as const;

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
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

  public doughnutChartType2 = 'doughnut' as const;

  public doughnutChartOptions2: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  updateDonutChartColors() {
    if (this.currentTheme === 'dark') {
      this.doughnutChartData = {
        ...this.doughnutChartData,
        datasets: [
          {
            data: [350, 450, 100],
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
      this.doughnutChartData2 = {
        ...this.doughnutChartData2,
        datasets: [
          {
            data: [3200, 450, 1000],
            backgroundColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(99, 102, 241, 1)',
              'rgba(37, 99, 235, 1)',
            ],
            borderWidth: 1,
            borderColor: 'rgba(15, 23, 42, 1)',
          },
        ],
      };
      this.doughnutChartOptions2 = {
        ...this.doughnutChartOptions2,
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
            data: [350, 450, 100],
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
      this.doughnutChartData2 = {
        ...this.doughnutChartData2,
        datasets: [
          {
            data: [3200, 450, 1000],
            backgroundColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(99, 102, 241, 1)',
              'rgba(37, 99, 235, 1)',
            ],
            borderWidth: 1,
            borderColor: 'white',
          },
        ],
      };
      this.doughnutChartOptions2 = {
        ...this.doughnutChartOptions2,
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
    this.donutChart2?.update();
  }
}
