import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { icons } from '../../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DialogModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent implements OnInit {
  @Input() itemsPerPage: number = 2;
  @Input() accountid: string = '';

  transactions: any;

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

  constructor(private dbService: DatabaseService) {
    this.dbService.transactions$.subscribe((trans) => {
      this.transactions = trans.filter(
        (transaction) => transaction.accountid === this.accountid
      );
      this.updatedPaginatedData();
      console.log(this.transactions);
    });
  }

  ngOnInit() {}

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

    console.log(start, end);
    

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    this.displayedPages = pages;
    console.log(pages);
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }
}
