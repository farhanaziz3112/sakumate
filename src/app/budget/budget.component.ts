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

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    BaseChartDirective,
    DonutComponent,
    TagComponent,
    ProgressBarModule,
    ProgressbarComponent,
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent {
  currentTheme = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      this.updateBarChartColors();
      this.updateDonutChartColors();
      this.updateLineChartColors();
    });
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  addBudget() {
    this.router.navigate(['budget/addbudget']);
  }

  goToBudget(id: string) {
    this.router.navigate(['/budget', id])
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

  months = [
    'All',
    'Jan 2022',
    'Feb 2022',
    'Mar 2022',
    'Apr 2022',
    'May 2022',
    'Jun 2022',
    'Jul 2022',
    'Aug 2022',
    'Sep 2022',
    'Oct 2022',
    'Nov 2022',
    'Dec 2022',
    'Jan 2023',
    'Feb 2023',
    'Mar 2023',
    'Apr 2023',
    'May 2023',
    'Jun 2023',
    'Jul 2023',
    'Aug 2023',
    'Sep 2023',
    'Oct 2023',
    'Nov 2023',
    'Dec 2023',
    'Jan 2024',
    'Feb 2024',
    'Mar 2024',
    'Apr 2024',
    'May 2024',
    'Jun 2024',
    'Jul 2024',
    'Aug 2024',
    'Sep 2024',
    'Oct 2024',
    'Nov 2024',
  ];

  accounts = ['Account 1', 'Account 2', 'All'];

  @ViewChild('monthDropdownButton', { static: false })
  monthDropdownButton!: ElementRef;
  @ViewChild('monthDropdownOverlay', { static: false })
  monthDropdownOverlay!: ElementRef;

  selectedMonth: any = 'Oct 2024';

  monthDropdown: boolean = false;

  toggleMonthDropdown() {
    this.monthDropdown = !this.monthDropdown;
  }

  selectMonth(month: string) {
    this.selectedMonth = month;
    this.monthDropdown = false;
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

  //------------------------------------Line chart------------------------------------

  @ViewChild(BaseChartDirective) lineChart?: BaseChartDirective;

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [45, 160, 80],
        label: 'Food',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      },
      {
        data: [200, 120, 310],
        label: 'Petrol',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
      },
      {
        data: [245, 359, 260],
        label: 'Shopping',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      },
      {
        data: [40, 20, 100],
        label: 'Others',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
      },
    ],
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
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
      this.lineChartData.datasets[2].borderColor = 'rgba(248, 113, 113, 1)';
      this.lineChartData.datasets[3].borderColor = 'rgba(167, 139, 250, 1)';
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
      this.lineChartData.datasets[2].borderColor = 'rgba(248, 113, 113, 1)';
      this.lineChartData.datasets[3].borderColor = 'rgba(167, 139, 250, 1)';
    }
    this.lineChart?.update();
  }
}
