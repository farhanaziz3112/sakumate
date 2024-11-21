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
  Validators,
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
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';
import { ToastService } from '../../service/toast.service';
import { icons } from '../../component/icons/icons';

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
    DialogModule,
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

  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCheck = faCheck;
  faXmark = faXmark;

  accountForm: FormGroup | any;
  user: User | any;

  currentTheme = 'light';

  minDate: string | any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private colorService: ColorService,
    private authService: AuthService,
    private dbService: DatabaseService,
    private toastService: ToastService
  ) {
    const today = new Date();
    const min = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    );
    this.minDate = min.toISOString().split('T')[0];
    this.accountForm = this.formBuilder.group({
      accountname: ['', [Validators.required, Validators.minLength(3)]],
      accounttype: ['', [Validators.required]],
      currentbalance: ['', [Validators.required]],
      color1: ['yellow', [Validators.required]],
      color2: ['pink', [Validators.required]],
      description: [''],
      targetamount: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
    });
    this.currentTheme = this.themeService.currentTheme;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnInit() {}

  isAccountFormInvalid(controlName: string): boolean {
    const control = this.accountForm.get(controlName);
    let isInvalid = control?.invalid && (control?.dirty || control?.touched);
    return isInvalid;
  }

  getIcon(icon: string) {
    return icons[icon] || null;
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

  setColor(color: string, isColor1: boolean) {
    if (isColor1) {
      this.accountForm.get('color1').setValue(color);
      this.overlayOpen = false;
    } else {
      this.accountForm.get('color2').setValue(color);
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

  async submitAccount(): Promise<void> {
    if (this.accountForm.valid) {
      try {
        let account = {
          userid: this.user.id,
          accountname: this.accountForm.value['accountname'] as string,
          accounttype: this.accountForm.value['accounttype'] as string,
          currentbalance: this.accountForm.value['currentbalance'],
          color1: this.accountForm.value['color1'] as string,
          color2: this.accountForm.value['color2'] as string,
        };
        const newAccount = await this.dbService.createAccount(account);
        await this.dbService.createGoal({
          goalname: this.accountForm.value['accountname'] as string,
          tagid: null,
          description: this.accountForm.value['description'] as string,
          currentamount: null,
          targetamount: this.accountForm.value['targetamount'],
          duedate: this.accountForm.value['duedate'],
          userid: this.user.id,
          accountid: newAccount.data?.at(0).id,
          status: 'incomplete',
        });
        this.toastService.showSuccessToast(
          'New Account!',
          'Account: ' +
            this.accountForm.value['accountname'] +
            ' is successfully added.'
        );
        this.router.navigate(['/account']);
        this.confirmDialog = false;
      } catch (error) {
        this.toastService.showErrorToast(
          'Error',
          'There was an error adding new account. Try again later.'
        );
      } finally {
        this.accountForm.reset();
      }
    }
  }

  cancelAccount() {
    this.confirmDialog = false;
  }
}
