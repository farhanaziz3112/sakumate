import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ThemeService } from '../service/theme.service';
import { icons } from '../component/icons/icons';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../component/confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ConfirmdialogComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    FontAwesomeModule,
    DialogModule,],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  settingsLink = [
    {
      id: 0,
      label: 'Profile',
      icon: 'faUser',
    },
    {
      id: 1,
      label: 'General',
      icon: 'faCogs',
    },
    {
      id: 2,
      label: 'Tags',
      icon: 'faTags',
    },
    {
      id: 3,
      label: 'Help',
      icon: 'faCircleQuestion',
    },
    {
      id: 4,
      label: 'About',
      icon: 'faInfoCircle',
    },
  ];

  activePage: number = 0;
  indicatorStyle = {};

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  setActivePage(page: number) {
    this.activePage = page;

    let offset = page * 48 + 4;
    this.indicatorStyle = {
      transform: `translateY(${offset}px)`,
    };
  }

  currentTheme = 'light';

  profileForm: FormGroup | any;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.currentTheme = this.themeService.currentTheme;
    this.profileForm = this.formBuilder.group({
      userName: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
    });
  }

  ngOnInit() {}

  confirmDialog: boolean = false;

  showConfirmDialog() {
    this.confirmDialog = true;
  }

  submitAccount() {
    this.confirmDialog = false;
  }

  cancelAccount() {
    this.confirmDialog = false;
  }
}
