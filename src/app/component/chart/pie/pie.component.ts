import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ThemeService } from '../../../service/theme.service';

@Component({
  selector: 'app-pie',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.css',
})
export class PieComponent {
  currentTheme = '';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      this.updateChartOptions();
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'pie'> | undefined;

  @Input() chartData: ChartData<'pie'> = {
    datasets: [],
  };

  chartOptions: ChartConfiguration<'pie'>['options'] = {
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

  chartType = 'pie' as const;

  updateChartOptions() {
    if (this.currentTheme === 'dark') {
      this.chartData = {
        ...this.chartData,
        datasets: this.chartData.datasets.map((dataset: any) => ({
          ...dataset,
          borderColor: '#0f172a',
        })),
      };
      this.chartOptions = {
        ...this.chartOptions,
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
      this.chartData = {
        ...this.chartData,
        datasets: this.chartData.datasets.map((dataset: any) => ({
          ...dataset,
          borderColor: 'white',
        })),
      };
      this.chartOptions = {
        ...this.chartOptions,
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
    this.chart?.update();
  }
}
