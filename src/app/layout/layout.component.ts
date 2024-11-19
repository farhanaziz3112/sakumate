import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
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
import { filter } from 'rxjs';

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

  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private elRef: ElementRef
  ) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    // for (let i = 0; i < this.sideLink.length; i++) {
    //   if (this.router.url.includes(this.sideLink[i].link)) {
    //     this.currentActiveRoute = i;
    //     this.setActiveRoute(i);
    //     console.log(i);
    //   }
    // }
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveRoute();
      });
    this.updateActiveRoute();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.screenHeight = event.target.innerHeight;
    this.setActiveRoute(this.currentActiveRoute);
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

  verticalIndicatorStyle = {};
  horizontalIndicatorStyle = {};

  updateActiveRoute() {
    const currentUrl = this.router.url;
    const foundIndex = this.sideLink.findIndex((link) =>
      currentUrl.includes(link.link)
    );

    if (foundIndex !== -1) {
      this.setActiveRoute(foundIndex);
    }
  }

  setActiveRoute(route: number) {
    this.currentActiveRoute = route;
    this.setIndicator(route);
  }

  setIndicator(route: number) {
    if (this.screenWidth > 414) {
      let verticalOffset = route * 64 + 12;
      let horizontalOffset = route * 64 + 12;
      this.verticalIndicatorStyle = {
        transform: `translateY(${verticalOffset}px)`,
      };
      this.horizontalIndicatorStyle = {
        transform: `translateX(${horizontalOffset}px)`,
      };
    } else {
      let horizontalOffset = route * 48 + 4;
      this.horizontalIndicatorStyle = {
        transform: `translateX(${horizontalOffset}px)`,
      };
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.currentTheme;
  }
}
