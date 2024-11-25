import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ThemeService } from '../../../service/theme.service';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.css',
})
export class BarComponent {
  currentTheme = '';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      this.updateChartOptions();
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  @Input() chartData: ChartData<'bar'> = {
    datasets: [],
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  chartType = 'bar' as const;

  updateChartOptions() {
    if (this.currentTheme === 'dark') {
      this.chartOptions = {
        ...this.chartOptions,
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
          tooltip: {
            enabled: true,
          },
        },
      };
    } else {
      this.chartOptions = {
        ...this.chartOptions,
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
          tooltip: {
            enabled: true,
          },
        },
      };
    }
    this.chart?.update();
  }
}
