import { Component, OnInit, ViewChild } from '@angular/core';
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
    PaginatorComponent
  ],
  templateUrl: './accountprofile.component.html',
  styleUrl: './accountprofile.component.css',
})
export class AccountprofileComponent implements OnInit {
  currentTheme = 'light';
  id: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
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

  addMoneyDialog: boolean = false;
  minusMoneyDialog: boolean = false;

  dropdown: boolean = false;

  selectedTag: any = null;

  selectTag(tag: string) {
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

  months = [
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

  selectedMonth: any = 'Oct 2024';

  monthDropdown: boolean = false;

  toggleMonthDropdown() {
    this.monthDropdown = !this.monthDropdown;
  }

  selectMonth(month: string) {
    this.selectedMonth = month;
    this.monthDropdown = false;
    this.updateBarChartColors();
  }

  transactions = [
    {
      transactionName: 'Salary',
      accountID: 'ACC123',
      userID: 'USR001',
      tagsID: 'TAG001',
      amount: 3000,
      type: 'income',
      description: 'Monthly salary for November 2024',
      createdDate: '2024-11-01',
    },
    {
      transactionName: 'Grocery Shopping',
      accountID: 'ACC124',
      userID: 'USR001',
      tagsID: 'TAG002',
      amount: 150,
      type: 'expense',
      description: 'Groceries for the week',
      createdDate: '2024-11-02',
    },
    {
      transactionName: 'Freelance Project',
      accountID: 'ACC123',
      userID: 'USR001',
      tagsID: 'TAG003',
      amount: 800,
      type: 'income',
      description: 'Payment received for web development project',
      createdDate: '2024-11-03',
    },
    {
      transactionName: 'Electricity Bill',
      accountID: 'ACC125',
      userID: 'USR001',
      tagsID: 'TAG004',
      amount: 120,
      type: 'expense',
      description: 'Monthly electricity bill payment',
      createdDate: '2024-11-04',
    },
    {
      transactionName: 'Dining Out',
      accountID: 'ACC126',
      userID: 'USR002',
      tagsID: 'TAG005',
      amount: 60,
      type: 'expense',
      description: 'Dinner at a restaurant with friends',
      createdDate: '2024-11-02',
    },
    {
      transactionName: 'Investment Returns',
      accountID: 'ACC127',
      userID: 'USR003',
      tagsID: 'TAG006',
      amount: 500,
      type: 'income',
      description: 'Returns from stock market investment',
      createdDate: '2024-11-05',
    },
    {
      transactionName: 'Gasoline Purchase',
      accountID: 'ACC128',
      userID: 'USR001',
      tagsID: 'TAG007',
      amount: 40,
      type: 'expense',
      description: 'Gasoline for the car',
      createdDate: '2024-11-03',
    },
    {
      transactionName: 'Online Course',
      accountID: 'ACC129',
      userID: 'USR002',
      tagsID: 'TAG008',
      amount: 200,
      type: 'expense',
      description: 'Payment for an online programming course',
      createdDate: '2024-11-01',
    },
    {
      transactionName: 'Gift Received',
      accountID: 'ACC130',
      userID: 'USR003',
      tagsID: 'TAG009',
      amount: 150,
      type: 'income',
      description: 'Birthday gift money from relatives',
      createdDate: '2024-11-05',
    },
    {
      transactionName: 'Monthly Subscription',
      accountID: 'ACC131',
      userID: 'USR002',
      tagsID: 'TAG010',
      amount: 15,
      type: 'expense',
      description: 'Monthly subscription to a music streaming service',
      createdDate: '2024-11-04',
    },
  ];

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
