import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { ColorService } from '../../service/color.service';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
})
export class TagComponent implements OnInit {
  @Input() tag: any;

  @Output() onClick = new EventEmitter<void>();

  constructor(private colorService: ColorService) {}

  ngOnInit() {}

  getColors(colorName: string) {
    return this.colorService.getColor(colorName, 'dark');
  }

  click() {
    this.onClick.emit();
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  // tags = [
  //   {
  //     name: 'Food',
  //     color: 'orange',
  //     icon: 'faHamburger',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Petrol',
  //     color: 'red',
  //     icon: 'faGasPump',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Shopping',
  //     color: 'pink',
  //     icon: 'faShoppingCart',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Salary',
  //     color: 'green',
  //     icon: 'faDollarSign',
  //     type: 'income',
  //   },
  //   { name: 'Transport', color: 'amber', icon: 'faBus', type: 'expense' },
  //   {
  //     name: 'Entertainment',
  //     color: 'purple',
  //     icon: 'faFilm',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Electric Bill',
  //     color: 'yellow',
  //     icon: 'faLightbulb',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Healthcare',
  //     color: 'red',
  //     icon: 'faHeartbeat',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Investments',
  //     color: 'indigo',
  //     icon: 'faChartLine',
  //     type: 'income',
  //   },
  //   { name: 'Gifts', color: 'pink', icon: 'faGift', type: 'expense' },
  //   {
  //     name: 'Education',
  //     color: 'blue',
  //     icon: 'faBook',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Insurance',
  //     color: 'gray',
  //     icon: 'faShieldAlt',
  //     type: 'expense',
  //   },
  //   { name: 'Rent', color: 'gray', icon: 'faHome', type: 'expense' },
  //   {
  //     name: 'Dining Out',
  //     color: 'orange',
  //     icon: 'faUtensils',
  //     type: 'expense',
  //   },
  //   // { name: 'Bonuses', color: 'green', icon: 'faMedal', type: 'income' },
  //   {
  //     name: 'Freelance',
  //     color: 'emerald',
  //     icon: 'faBriefcase',
  //     type: 'income',
  //   },
  //   {
  //     name: 'Savings',
  //     color: 'blue',
  //     icon: 'faPiggyBank',
  //     type: 'income',
  //   },
  //   {
  //     name: 'Groceries',
  //     color: 'green',
  //     icon: 'faAppleAlt',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Clothing',
  //     color: 'pink',
  //     icon: 'faShirt',
  //     type: 'expense',
  //   },
  //   { name: 'Travel', color: 'blue', icon: 'faPlane', type: 'expense' },
  //   {
  //     name: 'Loan Payment',
  //     color: 'red',
  //     icon: 'faUniversity',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Charity',
  //     color: 'purple',
  //     icon: 'faHandsHelping',
  //     type: 'expense',
  //   },
  //   // {
  //   //   name: 'Interest',
  //   //   color: 'teal',
  //   //   icon: 'faPercentage',
  //   //   type: 'income',
  //   // },
  //   // {
  //   //   name: 'Commission',
  //   //   color: 'yellow',
  //   //   icon: 'faChartPie',
  //   //   type: 'income',
  //   // },
  //   {
  //     name: 'Childcare',
  //     color: 'orange',
  //     icon: 'faChild',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Electronics',
  //     color: 'gray',
  //     icon: 'faLaptop',
  //     type: 'expense',
  //   },
  //   { name: 'Pet Care', color: 'teal', icon: 'faPaw', type: 'expense' },
  //   {
  //     name: 'Subscriptions',
  //     color: 'indigo',
  //     icon: 'faTv',
  //     type: 'expense',
  //   },
  //   {
  //     name: 'Taxes',
  //     color: 'yellow',
  //     icon: 'faCouch',
  //     type: 'expense',
  //   },
  //   // { name: 'Tips', color: 'purple', icon: 'faCoins', type: 'income' },
  //   // {
  //   //   name: 'Investment Returns',
  //   //   color: 'blue',
  //   //   icon: 'faChartBar',
  //   //   type: 'income',
  //   // },
  //   // {
  //   //   name: 'Other Income',
  //   //   color: 'green',
  //   //   icon: 'faMoneyCheckAlt',
  //   //   type: 'income',
  //   // },
  //   {
  //     name: 'Miscellaneous',
  //     color: 'gray',
  //     icon: 'faQuestionCircle',
  //     type: 'expense',
  //   },
  // ];

  
}
