import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ThemeService } from '../../service/theme.service';
import { ColorService } from '../../service/color.service';
import { ConfirmdialogComponent } from '../../component/confirmdialog/confirmdialog.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-addaccount',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmdialogComponent,
    DialogModule
  ],
  templateUrl: './addaccount.component.html',
  styleUrl: './addaccount.component.css',
})
export class AddaccountComponent implements OnInit {
  accType = [
    {
      label: 'Savings Account',
      value: 'savings',
    },
    {
      label: 'Credit Card',
      value: 'creditcard',
    },
    {
      label: 'Investment',
      value: 'investment',
    },
    {
      label: 'Cash On Hand',
      value: 'cash',
    },
    {
      label: 'Digital Wallet',
      value: 'ewallet',
    },
  ];

  colors = [
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
    'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
  ];


  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;
  faXmark = faXmark;

  addAccountForm: FormGroup | any;

  currentTheme = 'light';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private colorService: ColorService
  ) {
    this.addAccountForm = this.formBuilder.group({
      accName: [''],
      accType: [''],
      currentBalance: [0],
      color1: ['yellow'],
      color2: ['pink'],
    });
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      console.log(theme);
    });
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  getColors(colorName: string) {
    if (this.currentTheme === 'light') {
      return this.colorService.getColor(colorName, 'light');
    } else {
      return this.colorService.getColor(colorName, 'dark');
    }
  }

  getGradientClasses(color1: string, color2: string) {
    if (this.currentTheme === 'light') {
      return `${this.colorService.getColor(color1, 'lightFrom')} + ${this.colorService.getColor(color2, 'lightTo')}`;
    } else {
      return `${this.colorService.getColor(color1, 'darkFrom')} + ${this.colorService.getColor(color2, 'darkTo')}`;
    }
  }

  setColor(color: string, isColor1: boolean) {
    if (isColor1) {
      this.addAccountForm.get('color1').setValue(color);
      this.overlayOpen = false;
    } else {
      this.addAccountForm.get('color2').setValue(color);
      this.overlayOpen2 = false;
    }
  }

  overlayOpen: boolean = false;
  overlayOpen2: boolean = false;
  overlayPosition: 'top' | 'bottom' = 'bottom';

  @ViewChild('triggerButton', { static: false }) triggerButton!: ElementRef;
  @ViewChild('triggerButton2', { static: false }) triggerButton2!: ElementRef;
  @ViewChild('overlayPanel', { static: false }) overlayPanel!: ElementRef;
  @ViewChild('overlayPanel2', { static: false }) overlayPanel2!: ElementRef;

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (
      this.overlayOpen2 &&
      !this.triggerButton2.nativeElement.contains(target) &&
      (!this.overlayPanel2 ||
        !this.overlayPanel2.nativeElement.contains(target))
    ) {
      this.overlayOpen2 = false;
    }
    if (
      this.overlayOpen &&
      !this.triggerButton.nativeElement.contains(target) &&
      (!this.overlayPanel || !this.overlayPanel.nativeElement.contains(target))
    ) {
      this.overlayOpen = false;
    }
  }

  toggleOverlay(position: 'top' | 'bottom') {
    this.overlayPosition = position;
    this.overlayOpen = !this.overlayOpen;
    this.overlayOpen2 = false;
  }

  toggleOverlay2(position: 'top' | 'bottom') {
    this.overlayPosition = position;
    this.overlayOpen2 = !this.overlayOpen2;
    this.overlayOpen = false;
  }

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
