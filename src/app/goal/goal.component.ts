import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { icons } from '../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../service/theme.service';
import { DonutComponent } from '../component/donut/donut.component';

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    BaseChartDirective,
    DonutComponent,
  ],
  templateUrl: './goal.component.html',
  styleUrl: './goal.component.css',
})
export class GoalComponent implements OnInit {
  accGoals = [
    {
      goalName: 'Account 1',
      userId: 1,
      currentAmount: 1500,
      targetAmount: 5000,
      dueDate: new Date('2025-06-30'),
      createdDate: new Date('2024-01-15'),
    },
    {
      goalName: 'Account 2',
      userId: 2,
      currentAmount: 800,
      targetAmount: 2000,
      dueDate: new Date('2024-12-01'),
      createdDate: new Date('2024-03-20'),
    },
  ];

  otherGoals = [
    {
      goalName: 'New Car Down Payment',
      userId: 3,
      currentAmount: 2000,
      targetAmount: 10000,
      dueDate: new Date('2026-01-01'),
      createdDate: new Date('2024-05-10'),
    },
    {
      goalName: 'Home Renovation',
      userId: 1,
      currentAmount: 5000,
      targetAmount: 15000,
      dueDate: new Date('2025-12-31'),
      createdDate: new Date('2024-07-05'),
    },
    {
      goalName: 'College Fund',
      userId: 2,
      currentAmount: 3000,
      targetAmount: 20000,
      dueDate: new Date('2028-09-01'),
      createdDate: new Date('2024-09-12'),
    },
    {
      goalName: 'Investments Fund',
      userId: 3,
      currentAmount: 1000,
      targetAmount: 10000,
      dueDate: new Date('2024-12-31'),
      createdDate: new Date('2024-02-25'),
    },
  ];

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
      this.updatePieChartColors();
    });
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  getPercentage(number1: number, number2: number): number {
    return parseFloat(((number1 / number2) * 100).toFixed(2));
  }

  addGoal() {
    this.router.navigate(['/goal/addgoal'])
  }

  goToGoal(id: string) {
    this.router.navigate(['/goal', id]);
  }

  //----------------------------------bar chart------------------------------

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
    },
  };

  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: [
      'Account 1',
      'Account 2',
      'Japan 2025',
      'Bromo 2025',
      'PS5',
      'Civic',
      'Umrah 2024',
    ],
    datasets: [
      {
        data: [4000, 4300, 4300, 4300, 4500, 4500, 4500],
        label: 'Goal',
        backgroundColor: 'rgba(99, 102, 241, 1)',
        stack: 'a',
      },
      {
        data: [2300, 2800, 2500, 2600, 3000, 2700, 2400],
        label: 'Progress',
        backgroundColor: 'rgba(165, 180, 252, 1)',
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

  //----------------------------------pie chart------------------------------

  @ViewChild(BaseChartDirective) pieChart:
    | BaseChartDirective<'bar'>
    | undefined;

  public pieChartType: ChartType = 'pie';

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Complete', 'Incomplete'],
    datasets: [
      {
        data: [3, 5],
        backgroundColor: ['rgba(74, 222, 128, 1)', 'rgba(248, 113, 113, 1)'],
      },
    ],
  };

  updatePieChartColors() {
    if (this.currentTheme === 'dark') {
      this.pieChartData = {
        ...this.pieChartData,
        datasets: [
          {
            data: [3, 5],
            backgroundColor: [
              'rgba(74, 222, 128, 1)',
              'rgba(248, 113, 113, 1)',
            ],
            borderColor: 'rgba(15, 23, 42, 1)',
          },
        ],
      };
      this.pieChartOptions = {
        ...this.pieChartOptions,
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
      this.pieChartData = {
        ...this.pieChartData,
        datasets: [
          {
            data: [3, 5],
            backgroundColor: [
              'rgba(74, 222, 128, 1)',
              'rgba(248, 113, 113, 1)',
            ],
            borderColor: 'white',
          },
        ],
      };
      this.pieChartOptions = {
        ...this.pieChartOptions,
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

    this.pieChart?.update();
  }
}
