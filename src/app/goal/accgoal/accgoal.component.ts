import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../service/theme.service';
import { icons } from '../../component/icons/icons';
import { ChartType, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DonutComponent } from '../../component/donut/donut.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { PaginatorComponent } from '../../component/paginator/paginator.component';
import { TagComponent } from '../../component/tag/tag.component';
import { DatabaseService } from '../../service/database.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../service/toast.service';
import { ChartdataService } from '../../service/chartdata.service';
import { LineComponent } from '../../component/chart/line/line.component';

@Component({
  selector: 'app-accgoal',
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
    LineComponent,
  ],
  templateUrl: './accgoal.component.html',
  styleUrl: './accgoal.component.css',
})
export class AccgoalComponent implements OnInit {
  id: any;
  currentTheme = 'light';

  goal: any;
  transactions: any;
  months: any[] = [];
  monthlybalance: any;
  target: number[] = [];

  loading: boolean = true;

  editGoal: FormGroup | any;

  minDate: string | any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private dbService: DatabaseService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private chartDataService: ChartdataService
  ) {
    const today = new Date();
    const min = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    );
    this.minDate = min.toISOString().split('T')[0];
    let loadingTasks: boolean[] = [false, false];
    const taskCompleted = () => {
      if (loadingTasks.every((task) => task)) {
        this.loading = false;
      }
    };
    this.editGoal = this.fb.group({
      description: [''],
      goalname: ['', [Validators.required, Validators.minLength(3)]],
      targetamount: ['', [Validators.required]],
      duedate: ['', [Validators.required, this.futureDateValidator]],
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
    this.dbService.goalTag$.subscribe((goals) => {
      if (goals.length > 0) {
        this.goal = goals.filter((goal) => goal.id === this.id).at(0);
        this.getTimeLeft();
        this.editGoal.patchValue({
          description: this.goal.description,
          goalname: this.goal.goalname,
          targetamount: this.goal.targetamount,
          duedate: this.formatDate(this.goal.duedate),
        });
        loadingTasks[0] = true;
        taskCompleted();
      }
    });
    this.dbService.transactions$.subscribe((transactions) => {
      if (transactions.length > 0) {
        this.transactions = transactions;
        this.months = this.chartDataService.extractUniqueMonths(
          this.transactions
        );
        this.monthlybalance = this.chartDataService.getAccountMonthlyBalance(
          this.months,
          this.transactions,
          this.goal?.account.initialbalance,
          true
        ),
          this.target = [];
        this.monthlybalance.forEach(() => {
          this.target.push(this.goal?.targetamount);
        });
        this.updateGoalProgressLineChart();
        loadingTasks[1] = true;
        taskCompleted();
      }
    });
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      this.updateGoalProgressLineChart();
    });
  }

  formatDate(date: string | Date): string {
    const parsedDate = new Date(date); // Parse the Supabase date
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  }

  ngOnInit() {}

  goToGoal() {
    this.router.navigate(['/goal']);
  }

  goToAccount(id: string) {
    this.router.navigate(['/account', id]);
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  getTimeLeft() {
    const currentDate = new Date();
    const targetDate = new Date(this.goal.duedate);

    // if (targetDate < currentDate) {
    //   this.goal.monthsleft = 0;
    //   this.goal.daysleft = 0;
    // }

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
    if (monthsLeft && daysLeft) {
      this.goal.monthsleft = monthsLeft;
      this.goal.daysleft = daysLeft;
    }
  }

  getPercentage(number1: number, number2: number): number {
    return parseFloat(((number1 / number2) * 100).toFixed(2));
  }

  editGoalDialog: boolean = false;

  toggleEditGoalDialog() {
    this.editGoalDialog = !this.editGoalDialog;
  }

  isGoalFormInvalid(controlName: string): boolean {
    const control = this.editGoal.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    return selectedDate > currentDate
      ? null // Valid
      : { notFutureDate: true }; // Invalid
  }

  get f() {
    return this.editGoal.controls;
  }

  closeDialog() {
    this.editGoal.patchValue({
      description: this.goal.description,
      goalname: this.goal.goalname,
      targetamount: this.goal.targetamount,
      duedate: this.formatDate(this.goal.duedate),
    });
  }

  async submitEditedGoal() {
    try {
      if (this.editGoal.valid) {
        const { tag, account, monthsleft, daysleft, ...goalDataWithoutTag } =
          this.goal;
        await this.dbService.updateGoal({
          ...goalDataWithoutTag,
          description: this.editGoal.value['description'],
          goalname: this.editGoal.value['goalname'],
          targetamount: this.editGoal.value['targetamount'],
          duedate: this.editGoal.value['duedate'],
        });
        this.toastService.showSuccessToast(
          'Goal Updated',
          'Goal: ' +
            this.editGoal.value['goalname'] +
            ' is successfully edited.'
        );
      }
    } catch (error) {
      this.toastService.showErrorToast(
        'Error',
        'There was an error to edit your goal. Try again later.'
      );
    } finally {
      this.editGoal.patchValue({
        description: this.goal.description,
        goalname: this.goal.goalname,
        targetamount: this.goal.targetamount,
        duedate: this.formatDate(this.goal.duedate),
      });
      this.editGoalDialog = false;
    }
  }

  getMonthLabel() {
    return this.chartDataService.getMonthLabel(this.months);
  }

  //----------------------------------------Line chart--------------------------------------

  public goalProgressLineChart: ChartConfiguration['data'] = {
    datasets: [],
  };

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
          data: this.target,
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
