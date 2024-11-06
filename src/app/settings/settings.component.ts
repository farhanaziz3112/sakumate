import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ThemeService } from '../service/theme.service';
import { icons } from '../component/icons/icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  settingsLink = [
    {
      id: 0,
      label: 'General',
      link: '/',
      icon: 'faCogs',
    },
    {
      id: 0,
      label: 'Tags',
      link: '/',
      icon: 'faTags',
    },
    {
      id: 0,
      label: 'Appearance',
      link: '/',
      icon: 'faDisplay',
    },
    {
      id: 0,
      label: 'Help',
      link: '/',
      icon: 'faCircleQuestion',
    },
    {
      id: 0,
      label: 'About',
      link: '/',
      icon: 'faInfoCircle',
    },
  ];

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  currentTheme = 'light';

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {}
}
