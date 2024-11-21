import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../../component/confirmdialog/confirmdialog.component';
import { Router } from '@angular/router';
import { ColorService } from '../../service/color.service';
import { ThemeService } from '../../service/theme.service';
import { icons, tagIconsString } from '../../component/icons/icons';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import { ToastService } from '../../service/toast.service';
import { login } from '../../state/auth/auth.actions';

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

  user: User | any;

  currentTheme = '';
  minDate: string | any;

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
      value: 'expense',
    },
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private colorService: ColorService,
    private toastService: ToastService,
    private dbService: DatabaseService,
    private authService: AuthService
  ) {
    const today = new Date();
    const min = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    );
    this.minDate = min.toISOString().split('T')[0];
    this.budgetForm = this.formBuilder.group({
      budgetname: ['', [Validators.required, Validators.minLength(3)]],
      budgettype: ['', [Validators.required]],
      description: [''],
      currentamount: 0,
      targetamount: ['', [Validators.required]],
      tagname: [
        'preview',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      color: ['blue', [Validators.required]],
      icon: ['faBurger', [Validators.required]],
    });
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnInit() {}

  isBudgetFormInvalid(controlName: string): boolean {
    const control = this.budgetForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
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
    this.budgetForm.get('color').setValue(color);
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
    this.budgetForm.get('icon').setValue(icon);
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

  async onSubmit() {
    if (this.budgetForm.valid) {
      try {
        const newTag = await this.dbService.createTag({
          userid: this.user.id,
          tagname: this.budgetForm.value['tagname'],
          tagtype: this.budgetForm.value['budgettype'],
          color: this.budgetForm.value['color'],
          icon: this.budgetForm.value['icon'],
        });
        const newBudget = await this.dbService.createBudget({
          budgetname: this.budgetForm.value['budgetname'],
          tagid: newTag.data?.at(0).id,
          description: this.budgetForm.value['description'],
          currentamount: this.budgetForm.value['currentamount'],
          targetamount: this.budgetForm.value['targetamount'],
          userid: this.user.id,
          budgettype: this.budgetForm.value['budgettype'],
        });
        this.toastService.showSuccessToast(
          'New Budget',
          'Budget: ' +
            this.budgetForm.value['goalname'] +
            ' is successfully added.'
        );
        this.router.navigate(['/budget']);
        this.confirmDialog = false;
      } catch (error) {
        this.toastService.showErrorToast(
          'Error',
          'There was an error adding new goal. Try again later.'
        );
        this.confirmDialog = false;
      } finally {
        this.budgetForm.reset();
      }
    }
  }

  onCancel() {
    this.confirmDialog = false;
  }
}
