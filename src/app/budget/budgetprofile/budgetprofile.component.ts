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

  id: any;
  currentTheme = 'light';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
    });
  }

  goToBudget() {
    this.router.navigate(['/budget']);
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

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
