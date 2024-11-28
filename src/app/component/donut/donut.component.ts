import { Component, Input } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donut',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donut.component.html',
  styleUrl: './donut.component.css',
})
export class DonutComponent {
  @Input() percentage: number = 0;
  @Input() color: string = '';

  currentTheme = '';

  constructor(private themeService: ThemeService) {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    })
  }
}
