import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../../component/confirmdialog/confirmdialog.component';
import { Router } from '@angular/router';
import { ColorService } from '../../service/color.service';
import { ThemeService } from '../../service/theme.service';
import { icons, tagIconsString } from '../../component/icons/icons';

@Component({
  selector: 'app-addbudget',
  standalone: true,
  imports: [
    ConfirmdialogComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    FontAwesomeModule,
    DialogModule,
  ],
  templateUrl: './addbudget.component.html',
  styleUrl: './addbudget.component.css',
})
export class AddbudgetComponent {
  budgetForm: FormGroup | any;
  tagForm: FormGroup | any;

  currentTheme = '';

  colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
  ];

  budgetType = [
    {
      label: 'Income',
      value: 'income',
    },
    {
      label: 'Expense',
      value: 'Expense',
    },
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private colorService: ColorService
  ) {
    this.budgetForm = this.formBuilder.group({
      budgetName: [''],
      type: ['income'],
      targetAmount: [0],
    });
    this.tagForm = this.formBuilder.group({
      tagName: ['tagname...'],
      type: ['budget'],
      color: ['green'],
      icon: ['faBurger'],
      createdDate: [''],
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      console.log(theme);
    });
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (
      this.colorOverlayPanel &&
      !this.colorTriggerButton.nativeElement.contains(target) &&
      (!this.colorOverlayPanel ||
        !this.colorOverlayPanel.nativeElement.contains(target))
    ) {
      this.colorOverlay = false;
    }
    if (
      this.iconOverlayPanel &&
      !this.iconTriggerButton.nativeElement.contains(target) &&
      (!this.iconOverlayPanel ||
        !this.iconOverlayPanel.nativeElement.contains(target))
    ) {
      this.iconOverlay = false;
    }
  }

  colorOverlay: boolean = false;
  @ViewChild('colorTriggerButton', { static: false })
  colorTriggerButton!: ElementRef;
  @ViewChild('colorOverlayPanel', { static: false })
  colorOverlayPanel!: ElementRef;

  toggleColorOverlay() {
    this.colorOverlay = !this.colorOverlay;
  }

  getColors(colorName: string) {
    return this.colorService.getColor(colorName, 'dark');
  }

  setColor(color: string) {
    this.tagForm.get('color').setValue(color);
    this.colorOverlay = false;
  }

  goToBudget() {
    this.router.navigate(['/budget']);
  }

  iconOverlay: boolean = false;
  @ViewChild('iconTriggerButton', { static: false })
  iconTriggerButton!: ElementRef;
  @ViewChild('iconOverlayPanel', { static: false })
  iconOverlayPanel!: ElementRef;

  toggleIconOverlay() {
    this.iconOverlay = !this.iconOverlay;
  }

  setIcon(icon: string) {
    this.tagForm.get('icon').setValue(icon);
    this.iconOverlay = false;
  }

  getIcon(icon: string) {
    return icons[icon] || null;
  }

  getIconStringArray() {
    return tagIconsString;
  }

  date: Date | undefined;

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
