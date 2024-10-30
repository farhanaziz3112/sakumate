import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-donut',
  standalone: true,
  imports: [],
  templateUrl: './donut.component.html',
  styleUrl: './donut.component.css',
})
export class DonutComponent {
  @Input() percentage: number = 0;
  @Input() color: string = '';
}
