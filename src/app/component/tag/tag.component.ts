import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMinus,
  faPlus,
  faGasPump,
  faDollarSign,
  faBurger,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { icons } from '../icons/icons';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
})
export class TagComponent {
  @Input() name: string = '';
  @Input() color: string = '';
  @Input() icon: string = '';

  getIcon(icon: string) {
    return icons[icon] || null;
  }
}
