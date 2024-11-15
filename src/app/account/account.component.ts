import { Component } from '@angular/core';
import { icons } from '../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faA, faAdd } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DatabaseService } from '../service/database.service';
import { ColorService } from '../service/color.service';
import { ThemeService } from '../service/theme.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  faAdd = faAdd;

  accounts: any;
  currentTheme = '';

  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private themeService: ThemeService,
    private colorService: ColorService
  ) {
    this.dbService.accounts$.subscribe((acc) => {
      this.accounts = acc;
      console.log(acc);
    });
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  addAccount() {
    this.router.navigate(['/account/addaccount']);
  }

  goToAccount(id: string) {
    this.router.navigate(['/account', id]);
  }

  getColors(colorName: string, type: string) {
    return this.colorService.getColor(colorName, type);
  }

  getGradientClasses(color1: string, color2: string) {
    if (this.currentTheme === 'light') {
      return `${this.colorService.getColor(
        color1,
        'lightFrom'
      )} + ${this.colorService.getColor(color2, 'lightTo')}`;
    } else {
      return `${this.colorService.getColor(
        color1,
        'darkFrom'
      )} + ${this.colorService.getColor(color2, 'darkTo')}`;
    }
  }
}
