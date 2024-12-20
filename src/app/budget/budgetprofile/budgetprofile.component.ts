import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { icons } from '../../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ThemeService } from '../../service/theme.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ProgressBarModule } from 'primeng/progressbar';
import { DonutComponent } from '../../component/donut/donut.component';
import { ProgressbarComponent } from '../../component/progressbar/progressbar.component';
import { TagComponent } from '../../component/tag/tag.component';
import { ChartConfiguration, ChartType } from 'chart.js';
import { PaginatorComponent } from '../../component/paginator/paginator.component';
import { ChartdataService } from '../../service/chartdata.service';
import { DatabaseService } from '../../service/database.service';
import { ColorService } from '../../service/color.service';

@Component({
  selector: 'app-budgetprofile',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    BaseChartDirective,
    DonutComponent,
    TagComponent,
    ProgressBarModule,
    ProgressbarComponent,
    PaginatorComponent
  ],
  templateUrl: './budgetprofile.component.html',
  styleUrl: './budgetprofile.component.css',
})
export class BudgetprofileComponent implements OnInit {

  accounts: any;

  months: any;
  selectedMonth: any;

  transactions: any;
  filteredTransactions: any[] = [];

  id: any;


  currentTheme = 'light';

  budget: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private chartDataService: ChartdataService,
    private dbService: DatabaseService,
    private colorService: ColorService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      this.updateLineChartColors();
    });
    this.dbService.budgetTag$.subscribe((budgets) => {
      if (budgets.length > 0) {
        this.budget = budgets.filter((budget) => budget.id === this.id).at(0);
      }
    })
    this.dbService.months$.subscribe((month) => {
      this.months = month.filter((month: any) => month !== 'All');
      this.selectedMonth = this.months[this.months.length - 1];
    });
  }

  ngOnInit() {}

  goToBudget() {
    this.router.navigate(['/budget']);
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  getColors(colorName: string) {
    return this.colorService.getColor(colorName, 'dark');
  }

  @ViewChild('monthDropdownButton', { static: false })
  monthDropdownButton!: ElementRef;
  @ViewChild('monthDropdownOverlay', { static: false })
  monthDropdownOverlay!: ElementRef;

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

  //------------------------------------Line chart------------------------------------

  @ViewChild(BaseChartDirective) lineChart?: BaseChartDirective;

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: Array.from(
          { length: 30 },
          () => Math.floor(Math.random() * 60) + 1
        ),
        label: 'Food',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      },
    ],
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
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
    }
    this.lineChart?.update();
  }
}
