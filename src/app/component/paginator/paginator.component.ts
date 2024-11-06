import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { icons } from '../../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DialogModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent implements OnInit {
  transactions = [
    {
      transactionName: 'Salary',
      accountID: 'ACC123',
      userID: 'USR001',
      tagsID: 'TAG001',
      amount: 3000,
      type: 'income',
      description: 'Monthly salary for November 2024',
      createdDate: '2024-11-01',
    },
    {
      transactionName: 'Grocery Shopping',
      accountID: 'ACC124',
      userID: 'USR001',
      tagsID: 'TAG002',
      amount: 150,
      type: 'expense',
      description: 'Groceries for the week',
      createdDate: '2024-11-02',
    },
    {
      transactionName: 'Freelance Project',
      accountID: 'ACC123',
      userID: 'USR001',
      tagsID: 'TAG003',
      amount: 800,
      type: 'income',
      description: 'Payment received for web development project',
      createdDate: '2024-11-03',
    },
    {
      transactionName: 'Electricity Bill',
      accountID: 'ACC125',
      userID: 'USR001',
      tagsID: 'TAG004',
      amount: 120,
      type: 'expense',
      description: 'Monthly electricity bill payment',
      createdDate: '2024-11-04',
    },
    {
      transactionName: 'Dining Out',
      accountID: 'ACC126',
      userID: 'USR002',
      tagsID: 'TAG005',
      amount: 60,
      type: 'expense',
      description: 'Dinner at a restaurant with friends',
      createdDate: '2024-11-02',
    },
    {
      transactionName: 'Investment Returns',
      accountID: 'ACC127',
      userID: 'USR003',
      tagsID: 'TAG006',
      amount: 500,
      type: 'income',
      description: 'Returns from stock market investment',
      createdDate: '2024-11-05',
    },
    {
      transactionName: 'Gasoline Purchase',
      accountID: 'ACC128',
      userID: 'USR001',
      tagsID: 'TAG007',
      amount: 40,
      type: 'expense',
      description: 'Gasoline for the car',
      createdDate: '2024-11-03',
    },
    {
      transactionName: 'Online Course',
      accountID: 'ACC129',
      userID: 'USR002',
      tagsID: 'TAG008',
      amount: 200,
      type: 'expense',
      description: 'Payment for an online programming course',
      createdDate: '2024-11-01',
    },
    {
      transactionName: 'Gift Received',
      accountID: 'ACC130',
      userID: 'USR003',
      tagsID: 'TAG009',
      amount: 150,
      type: 'income',
      description: 'Birthday gift money from relatives',
      createdDate: '2024-11-05',
    },
    {
      transactionName: 'Monthly Subscription',
      accountID: 'ACC131',
      userID: 'USR002',
      tagsID: 'TAG010',
      amount: 15,
      type: 'expense',
      description: 'Monthly subscription to a music streaming service',
      createdDate: '2024-11-04',
    },
    {
      transactionName: 'Salary',
      accountID: 'ACC123',
      userID: 'USR001',
      tagsID: 'TAG001',
      amount: 3000,
      type: 'income',
      description: 'Monthly salary for November 2024',
      createdDate: '2024-11-01',
    },
    {
      transactionName: 'Grocery Shopping',
      accountID: 'ACC124',
      userID: 'USR001',
      tagsID: 'TAG002',
      amount: 150,
      type: 'expense',
      description: 'Groceries for the week',
      createdDate: '2024-11-02',
    },
    {
      transactionName: 'Freelance Project',
      accountID: 'ACC123',
      userID: 'USR001',
      tagsID: 'TAG003',
      amount: 800,
      type: 'income',
      description: 'Payment received for web development project',
      createdDate: '2024-11-03',
    },
    {
      transactionName: 'Electricity Bill',
      accountID: 'ACC125',
      userID: 'USR001',
      tagsID: 'TAG004',
      amount: 120,
      type: 'expense',
      description: 'Monthly electricity bill payment',
      createdDate: '2024-11-04',
    },
    {
      transactionName: 'Dining Out',
      accountID: 'ACC126',
      userID: 'USR002',
      tagsID: 'TAG005',
      amount: 60,
      type: 'expense',
      description: 'Dinner at a restaurant with friends',
      createdDate: '2024-11-02',
    },
    {
      transactionName: 'Investment Returns',
      accountID: 'ACC127',
      userID: 'USR003',
      tagsID: 'TAG006',
      amount: 500,
      type: 'income',
      description: 'Returns from stock market investment',
      createdDate: '2024-11-05',
    },
    {
      transactionName: 'Gasoline Purchase',
      accountID: 'ACC128',
      userID: 'USR001',
      tagsID: 'TAG007',
      amount: 40,
      type: 'expense',
      description: 'Gasoline for the car',
      createdDate: '2024-11-03',
    },
    {
      transactionName: 'Online Course',
      accountID: 'ACC129',
      userID: 'USR002',
      tagsID: 'TAG008',
      amount: 200,
      type: 'expense',
      description: 'Payment for an online programming course',
      createdDate: '2024-11-01',
    },
    {
      transactionName: 'Gift Received',
      accountID: 'ACC130',
      userID: 'USR003',
      tagsID: 'TAG009',
      amount: 150,
      type: 'income',
      description: 'Birthday gift money from relatives',
      createdDate: '2024-11-05',
    },
    {
      transactionName: 'Monthly Subscription',
      accountID: 'ACC131',
      userID: 'USR002',
      tagsID: 'TAG010',
      amount: 15,
      type: 'expense',
      description: 'Monthly subscription to a music streaming service',
      createdDate: '2024-11-04',
    },
  ];

  @Input() itemsPerPage: number = 5;
  @Input() name: string = '';

  currentPage: number = 1;
  totalPage: number = 0;

  data: any[] = [];
  paginatedData: any[] = [];
  displayedPages: number[] = [];

  viewDialog: boolean = false;
  clickedData: any;

  toggleDialog(data: any) {
    this.viewDialog = !this.viewDialog;
    this.clickedData = data;
  }

  constructor() {}

  ngOnInit() {
    if (this.name === 'transaction') {
      this.data = this.transactions;
      this.totalPage = Math.ceil(this.data.length / this.itemsPerPage);
      this.updatedPaginatedData();
    }
  }

  updatedPaginatedData() {
    this.getDisplayedPages();
    let startIndex = (this.currentPage - 1) * this.itemsPerPage;
    let endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.data.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.updatedPaginatedData();
    }
  }

  getDisplayedPages() {
    let pages: number[] = [];
    let total = this.totalPage;
    let range = 2;

    let start = Math.max(1, this.currentPage - range);
    let end = Math.min(total, this.currentPage + range);

    if (this.currentPage <= range + 1) {
      end = Math.min(total, range * 2 + 1);
    }
    if (this.currentPage >= total - range) {
      start = Math.max(1, total - range * 2);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    this.displayedPages = pages;
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }
}
