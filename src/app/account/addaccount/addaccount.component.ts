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
} from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ThemeService } from '../../service/theme.service';
import { ColorService } from '../../service/color.service';

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
    {
      name: 'red',
      light: 'bg-red-300',
      dark: 'bg-red-600',
    },
    {
      name: 'orange',
      light: 'bg-orange-300',
      dark: 'bg-orange-600',
    },
    {
      name: 'amber',
      light: 'bg-amber-300',
      dark: 'bg-amber-600',
    },
    {
      name: 'yellow',
      light: 'bg-yellow-300',
      dark: 'bg-yellow-600',
    },
    {
      name: 'lime',
      light: 'bg-lime-300',
      dark: 'bg-lime-600',
    },
    {
      name: 'green',
      light: 'bg-green-300',
      dark: 'bg-green-600',
    },
    {
      name: 'emerald',
      light: 'bg-emerald-300',
      dark: 'bg-emerald-600',
    },
    {
      name: 'teal',
      light: 'bg-teal-300',
      dark: 'bg-teal-600',
    },
    {
      name: 'cyan',
      light: 'bg-cyan-300',
      dark: 'bg-cyan-600',
    },
    {
      name: 'sky',
      light: 'bg-sky-300',
      dark: 'bg-sky-600',
    },
    {
      name: 'blue',
      light: 'bg-blue-300',
      dark: 'bg-blue-600',
    },
    {
      name: 'indigo',
      light: 'bg-indigo-300',
      dark: 'bg-indigo-600',
    },
    {
      name: 'violet',
      light: 'bg-violet-300',
      dark: 'bg-violet-600',
    },
    {
      name: 'purple',
      light: 'bg-purple-300',
      dark: 'bg-purple-600',
    },
    {
      name: 'fuchsia',
      light: 'bg-fuchsia-300',
      dark: 'bg-fuchsia-600',
    },
    {
      name: 'pink',
      light: 'bg-pink-300',
      dark: 'bg-pink-600',
    },
    {
      name: 'rose',
      light: 'bg-rose-300',
      dark: 'bg-rose-600',
    },
  ];

  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;

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
}
