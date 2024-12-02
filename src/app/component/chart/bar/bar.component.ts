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
  @Input() minY?: number;
  @Input() maxY?: number;

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  chartType = 'bar' as const;

  updateChartOptions() {
    const isCustomYAxis = this.minY !== undefined && this.maxY !== undefined;

    this.chartOptions = {
      ...this.chartOptions,
      scales: {
        y: isCustomYAxis
          ? {
              min: this.minY,
              max: this.maxY,
              ticks: {
                color: this.currentTheme === 'dark' ? 'white' : 'black',
              },
              grid: {
                lineWidth: 1,
                color:
                  this.currentTheme === 'dark'
                    ? 'rgba(107, 114, 128, 1)'
                    : 'rgba(229, 231, 235, 1)',
              },
            }
          : {
              ticks: {
                color: this.currentTheme === 'dark' ? 'white' : 'black',
              },
              grid: {
                lineWidth: 1,
                color:
                  this.currentTheme === 'dark'
                    ? 'rgba(107, 114, 128, 1)'
                    : 'rgba(229, 231, 235, 1)',
              },
            },
        x: {
          ticks: {
            color: this.currentTheme === 'dark' ? 'white' : 'black',
          },
          grid: {
            lineWidth: 1,
            color:
              this.currentTheme === 'dark'
                ? 'rgba(107, 114, 128, 1)'
                : 'rgba(229, 231, 235, 1)',
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: this.currentTheme === 'dark' ? 'white' : 'black',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    };

    // Ensure the chart updates
    this.chart?.update();
  }
}
