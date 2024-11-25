import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ThemeService } from '../../../service/theme.service';

@Component({
  selector: 'app-doughnut',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.css',
})
export class DoughnutComponent implements OnInit {
  currentTheme = '';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      this.updateChartOptions();
    });
  }

  @ViewChild(BaseChartDirective) chart:
    | BaseChartDirective<'doughnut'>
    | undefined;

  @Input() chartData: ChartData<'doughnut'> = {
    datasets: [],
  };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  chartType = 'doughnut' as const;

  updateChartOptions() {
    if (this.currentTheme === 'dark') {
      this.chartData = {
        ...this.chartData,
        datasets: this.chartData.datasets.map((dataset: any) => ({
          ...dataset,
          borderColor: '#0f172a',
        })),
      };
    } else {
      this.chartData = {
        ...this.chartData,
        datasets: this.chartData.datasets.map((dataset: any) => ({
          ...dataset,
          borderColor: 'white',
        })),
      };
    }
    this.chart?.update();
  }
}
