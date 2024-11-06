import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faMoon,
  faHouse,
  faCreditCard,
  faBullseye,
  faMoneyCheckDollar,
  faGear,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../service/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;
  faMoon = faMoon;
  faHouse = faHouse;
  faCreditCard = faCreditCard;
  faBullseye = faBullseye;
  faMoneyCheckDollar = faMoneyCheckDollar;
  faGear = faGear;
  faSun = faSun;

  currentActiveRoute = 0;

  currentTheme = 'light';

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    for (let i = 0; i < this.sideLink.length; i++) {
      if (this.router.url.includes(this.sideLink[i].link)) {
        this.currentActiveRoute = i;
      }
    }
  }

  sideLink = [
    {
      id: 0,
      link: '/dashboard',
      icon: faHouse,
    },
    {
      id: 1,
      link: '/account',
      icon: faCreditCard,
    },
    {
      id: 2,
      link: '/goal',
      icon: faBullseye,
    },
    {
      id: 3,
      link: '/budget',
      icon: faMoneyCheckDollar,
    },
    {
      id: 4,
      link: '/settings',
      icon: faGear,
    },
  ];

  setActiveRoute(route: number) {
    this.currentActiveRoute = route;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.currentTheme;
  }
}
