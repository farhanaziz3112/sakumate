import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
export class TagComponent implements OnInit {
  @Input() name: string = '';
  tag: any;
  

  constructor() {}

  ngOnInit() {
    this.tag = this.tags.find((tag) => tag.name === this.name);
  }

  tags = [
    {
      name: 'Food',
      color: 'bg-orange-500',
      icon: 'faHamburger',
      type: 'expense',
    },
    {
      name: 'Petrol',
      color: 'bg-blue-500',
      icon: 'faGasPump',
      type: 'expense',
    },
    {
      name: 'Shopping',
      color: 'bg-pink-500',
      icon: 'faShoppingCart',
      type: 'expense',
    },
    {
      name: 'Salary',
      color: 'bg-green-500',
      icon: 'faDollarSign',
      type: 'income',
    },
    { name: 'Transport', color: 'bg-teal-500', icon: 'faBus', type: 'expense' },
    {
      name: 'Entertainment',
      color: 'bg-purple-500',
      icon: 'faFilm',
      type: 'expense',
    },
    {
      name: 'Utilities',
      color: 'bg-yellow-500',
      icon: 'faLightbulb',
      type: 'expense',
    },
    {
      name: 'Healthcare',
      color: 'bg-red-500',
      icon: 'faHeartbeat',
      type: 'expense',
    },
    {
      name: 'Investments',
      color: 'bg-indigo-500',
      icon: 'faChartLine',
      type: 'income',
    },
    { name: 'Gifts', color: 'bg-pink-500', icon: 'faGift', type: 'expense' },
    {
      name: 'Education',
      color: 'bg-blue-400',
      icon: 'faBook',
      type: 'expense',
    },
    {
      name: 'Insurance',
      color: 'bg-gray-500',
      icon: 'faShieldAlt',
      type: 'expense',
    },
    { name: 'Rent', color: 'bg-gray-700', icon: 'faHome', type: 'expense' },
    {
      name: 'Dining Out',
      color: 'bg-orange-400',
      icon: 'faUtensils',
      type: 'expense',
    },
    { name: 'Bonuses', color: 'bg-green-600', icon: 'faMedal', type: 'income' },
    {
      name: 'Freelance',
      color: 'bg-green-400',
      icon: 'faBriefcase',
      type: 'income',
    },
    {
      name: 'Savings',
      color: 'bg-blue-600',
      icon: 'faPiggyBank',
      type: 'income',
    },
    {
      name: 'Groceries',
      color: 'bg-green-300',
      icon: 'faAppleAlt',
      type: 'expense',
    },
    {
      name: 'Clothing',
      color: 'bg-pink-400',
      icon: 'faShirt',
      type: 'expense',
    },
    { name: 'Travel', color: 'bg-blue-300', icon: 'faPlane', type: 'expense' },
    {
      name: 'Loan Payment',
      color: 'bg-red-700',
      icon: 'faUniversity',
      type: 'expense',
    },
    {
      name: 'Charity',
      color: 'bg-purple-600',
      icon: 'faHandsHelping',
      type: 'expense',
    },
    {
      name: 'Interest',
      color: 'bg-teal-400',
      icon: 'faPercentage',
      type: 'income',
    },
    {
      name: 'Commission',
      color: 'bg-yellow-600',
      icon: 'faChartPie',
      type: 'income',
    },
    {
      name: 'Childcare',
      color: 'bg-orange-600',
      icon: 'faChild',
      type: 'expense',
    },
    {
      name: 'Electronics',
      color: 'bg-gray-800',
      icon: 'faLaptop',
      type: 'expense',
    },
    { name: 'Pet Care', color: 'bg-teal-300', icon: 'faPaw', type: 'expense' },
    {
      name: 'Subscriptions',
      color: 'bg-indigo-600',
      icon: 'faTv',
      type: 'expense',
    },
    {
      name: 'Household',
      color: 'bg-yellow-400',
      icon: 'faCouch',
      type: 'expense',
    },
    { name: 'Tips', color: 'bg-purple-300', icon: 'faCoins', type: 'income' },
    {
      name: 'Investment Returns',
      color: 'bg-blue-700',
      icon: 'faChartBar',
      type: 'income',
    },
    {
      name: 'Other Income',
      color: 'bg-green-800',
      icon: 'faMoneyCheckAlt',
      type: 'income',
    },
    {
      name: 'Miscellaneous',
      color: 'bg-gray-400',
      icon: 'faQuestionCircle',
      type: 'expense',
    },
  ];

  getIcon(icon: string) {
    return icons[icon] || null;
  }
}
