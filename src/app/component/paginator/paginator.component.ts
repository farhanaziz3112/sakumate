import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { icons } from '../../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { DatabaseService } from '../../service/database.service';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DialogModule, TagComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() transactions: any[] = [];

  viewTransactionDialog: boolean = false;
  clickedTransaction: any;

  toggleTransactionDialog(transaction: any) {
    this.viewTransactionDialog = !this.viewTransactionDialog;
    this.clickedTransaction = transaction;
  }

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transactions'] && this.transactions.length > 0) {
      this.currentPage = 1;
      this.updatePaginatedData();
    }
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  itemsPerPage: number = 7;
  currentPage: number = 1;
  totalPage: number = 0;
  paginatedData: any[] = [];
  displayedPages: number[] = [];

  updatePaginatedData() {
    this.totalPage = Math.ceil(this.transactions.length / this.itemsPerPage);
    this.getDisplayedPages();
    let startIndex = (this.currentPage - 1) * this.itemsPerPage;
    let endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.transactions.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPage) {
      this.currentPage = page;
      this.updatePaginatedData();
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
}
