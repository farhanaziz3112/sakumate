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

@Component({
  selector: 'app-goalprofile',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    DialogModule,
    TagComponent,
    DonutComponent,
    BaseChartDirective,
    PaginatorComponent,
  ],
  templateUrl: './goalprofile.component.html',
  styleUrl: './goalprofile.component.css',
})
export class GoalprofileComponent implements OnInit {
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

  goToGoal() {
    this.router.navigate(['/goal']);
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

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

  selectedMonth: any = 'Oct 2024';

  monthDropdown: boolean = false;

  toggleMonthDropdown() {
    this.monthDropdown = !this.monthDropdown;
  }

  selectMonth(month: string) {
    this.selectedMonth = month;
    this.monthDropdown = false;
  }

  //----------------------------------------Line chart--------------------------------------

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
}
