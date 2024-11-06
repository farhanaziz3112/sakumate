import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css',
})
export class ProgressbarComponent implements OnInit {
  @Input() currentAmount: number = 0;
  @Input() targetAmount: number = 100;
  @Input() type: string = '';

  color: any;

  constructor() {}

  ngOnInit() {
    if (this.type === 'income') {
      let perc = this.getPercentage();
      if (perc < 50) {
        this.color = 'bg-green-500';
      } else if (perc >= 50 && perc < 90) {
        this.color = 'bg-green-600';
      } else {
        this.color = 'bg-green-700';
      }
    } else {
      let perc = this.getPercentage();
      if (perc < 50) {
        this.color = 'bg-green-700';
      } else if (perc >= 50 && perc < 90) {
        this.color = 'bg-yellow-500';
      } else {
        this.color = 'bg-red-700';
      }
    }
  }

  getPercentage(): number {
    return parseFloat(
      ((this.currentAmount / this.targetAmount) * 100).toFixed(2)
    );
  }

  getProgressPercentage(): number {
    return Math.min(this.getPercentage(), 100);
  }
}
