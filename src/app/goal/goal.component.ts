import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { icons } from '../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartData } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../service/theme.service';
import { DonutComponent } from '../component/donut/donut.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { DatabaseService } from '../service/database.service';
import { ToastService } from '../service/toast.service';
import { User } from '@supabase/supabase-js';
import { TagComponent } from '../component/tag/tag.component';
import { PieComponent } from '../component/chart/pie/pie.component';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { ChartdataService } from '../service/chartdata.service';
import { BarComponent } from '../component/chart/bar/bar.component';

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    DonutComponent,
    TagComponent,
    PieComponent,
    BarComponent
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

  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private dbService: DatabaseService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private chartDataService: ChartdataService
  ) {
    let loadingTasks: boolean[] = [false, false];
    const taskCompleted = () => {
      if (loadingTasks.every((task) => task)) {
        this.loading = false;
      }
    };

    this.authService.user$.subscribe((user) => {
      if (user != null) {
        this.user = user;
        this.dbService.goalTagByUserId();
        loadingTasks[0] = true;
        taskCompleted();
      }
    });
    this.dbService.goalTag$.subscribe((goal) => {
      if (goal.length > 0) {
        this.goals = goal;
        this.getTimeLeft();
        this.accgoals = goal.filter((g) => g.tagid === null);
        this.othergoals = goal.filter((g) => g.tagid != null);
        this.getCompletedGoals();
        this.getTotalAllGoals();
        this.updateGoalCompletionPieChartData();
        this.updateGoalProgressBarChart();
        loadingTasks[1] = true;
        taskCompleted();
      }
    });
  }

  totalCompletedGoals: number = 0;
  totalIncompleteGoals: number = 0;

  totalAllGoalsValue: number = 0;
  totalAllGoalsTarget: number = 0;

  getCompletedGoals() {
    this.totalCompletedGoals = this.goals.filter(
      (goal: any) => goal.status === 'completed'
    ).length;
    this.totalIncompleteGoals = this.goals.filter(
      (goal: any) => goal.status === 'incomplete'
    ).length;
  }

  getTotalAllGoals() {
    let totalValue = 0;
    let totalTarget = 0;
    this.goals.forEach((goal: any) => {
      if (goal.account) {
        totalValue += goal.account.currentbalance;
        totalTarget += goal.targetamount;
      } else {
        totalValue += goal.currentamount;
        totalTarget += goal.targetamount;
      }
    });
    this.totalAllGoalsValue = totalValue;
    this.totalAllGoalsTarget = totalTarget;
  }

  getTimeLeft() {
    this.goals.forEach((goal: any) => {
      const { months, days } = this.calculateTimeLeft(goal.duedate);
      goal.monthsleft = months;
      goal.daysleft = days;
    });
  }

  calculateTimeLeft(dueDate: string): { months: number; days: number } {
    const currentDate = new Date();
    const targetDate = new Date(dueDate);

    if (targetDate < currentDate) {
      return { months: 0, days: 0 }; // Past due date
    }

    let yearsLeft = targetDate.getFullYear() - currentDate.getFullYear();
    let monthsLeft =
      yearsLeft * 12 + (targetDate.getMonth() - currentDate.getMonth());
    const daysInCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    let daysLeft: number;
    if (targetDate.getDate() >= currentDate.getDate()) {
      daysLeft = targetDate.getDate() - currentDate.getDate();
    } else {
      daysLeft =
        daysInCurrentMonth - currentDate.getDate() + targetDate.getDate();
      monthsLeft -= 1;
    }
    return {
      months: Math.max(monthsLeft, 0),
      days: daysLeft,
    };
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  getPercentage(number1: number, number2: number): number {
    return parseFloat(((number1 / number2) * 100).toFixed(2));
  }

  addGoal() {
    this.router.navigate(['/goal/addgoal']);
  }

  goToAccGoal(id: string) {
    this.router.navigate(['/goal/accgoal', id]);
  }

  goToOtherGoal(id: string) {
    this.router.navigate(['/goal/othergoal', id]);
  }

  resizeBarThickness: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth < 500 && !this.resizeBarThickness) {
      this.goalProgressBarChartData = {
        ...this.goalProgressBarChartData,
        datasets: this.goalProgressBarChartData.datasets.map((dataset: any) => ({
          ...dataset,
          barThickness: 20
        }))
      };
      this.resizeBarThickness = true;
    }
    if (window.innerWidth >= 500 && this.resizeBarThickness) {
      this.goalProgressBarChartData = {
        ...this.goalProgressBarChartData,
        datasets: this.goalProgressBarChartData.datasets.map((dataset: any) => ({
          ...dataset,
          barThickness: 50
        }))
      };
      this.resizeBarThickness = false;
    }

  }

  public goalCompletionPieChartData: ChartData<
    'pie',
    number[],
    string | string[]
  > = {
    datasets: [],
  };

  public goalProgressBarChartData: ChartData<'bar'> = {
    datasets: [],
  };

  updateGoalCompletionPieChartData() {
    this.goalCompletionPieChartData = {
      labels: ['Complete', 'Incomplete'],
      datasets: [
        {
          data: [this.totalCompletedGoals, this.totalIncompleteGoals],
          backgroundColor: ['rgba(74, 222, 128, 1)', 'rgba(248, 113, 113, 1)'],
        },
      ],
    };
  }

  updateGoalProgressBarChart() {
    this.goalProgressBarChartData = {
      ...this.goalProgressBarChartData,
      datasets: [
        {
          data: this.chartDataService.getGoalsProgressPercentage(this.goals),
          label: 'Goal Progress (%)',
          backgroundColor: '#a78bfa',
          barThickness: 50,
        },
      ],
      labels: this.chartDataService.getGoalLabel(this.goals),
    };
  }
}
