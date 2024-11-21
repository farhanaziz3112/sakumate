import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { icons } from '../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../service/theme.service';
import { DonutComponent } from '../component/donut/donut.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { DatabaseService } from '../service/database.service';
import { ToastService } from '../service/toast.service';
import { User } from '@supabase/supabase-js';
import { TagComponent } from "../component/tag/tag.component";

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    BaseChartDirective,
    DonutComponent,
    TagComponent
],
  templateUrl: './goal.component.html',
  styleUrl: './goal.component.css',
})
export class GoalComponent implements OnInit {  

  currentTheme = '';

  user: User | any;
  goals: any;
  accgoals: any;
  othergoals: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dbService: DatabaseService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.dbService.goalTagByUserId();
      }
    });
    this.dbService.goalTag$.subscribe((goal) => {
      this.goals = goal;
      this.accgoals = goal.filter((g) => g.tagid === null);
      this.othergoals = goal.filter((g) => g.tagid != null);
    });
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
