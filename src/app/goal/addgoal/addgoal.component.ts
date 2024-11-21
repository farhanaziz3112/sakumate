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
import { CalendarModule } from 'primeng/calendar';
import { ThemeService } from '../../service/theme.service';
import { ColorService } from '../../service/color.service';
import { icons, tagIconsString } from '../../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../../component/confirmdialog/confirmdialog.component';
import { ToastService } from '../../service/toast.service';
import { DatabaseService } from '../../service/database.service';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-addgoal',
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
  templateUrl: './addgoal.component.html',
  styleUrl: './addgoal.component.css',
})
export class AddgoalComponent implements OnInit {
  goalForm: FormGroup | any;

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

  user: User | any;

  currentTheme = '';

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
    this.goalForm = this.formBuilder.group({
      description: [''],
      goalname: ['', [Validators.required, Validators.minLength(3)]],
      targetamount: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
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
    this.currentTheme = this.themeService.currentTheme;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
      console.log(theme);
    });
  }

  isGoalFormInvalid(controlName: string): boolean {
    const control = this.goalForm.get(controlName);
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
    this.goalForm.get('color').setValue(color);
    this.colorOverlay = false;
  }

  goToGoal() {
    this.router.navigate(['/goal']);
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
    this.goalForm.get('icon').setValue(icon);
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
    if (this.goalForm.valid) {
      try {
        const newTag = await this.dbService.createTag({
          userid: this.user.id,
          tagname: this.goalForm.value['tagname'],
          tagtype: 'goal',
          color: this.goalForm.value['color'],
          icon: this.goalForm.value['icon'],
        });
        const newGoal = await this.dbService.createGoal({
          goalname: this.goalForm.value['goalname'],
          tagid: newTag.data?.at(0).id,
          description: this.goalForm.value['description'],
          currentamount: 0,
          targetamount: this.goalForm.value['targetamount'],
          duedate: this.goalForm.value['duedate'],
          userid: this.user.id,
          accountid: null,
          status: 'incomplete',
        });
        this.toastService.showSuccessToast(
          'New Goal',
          'Goal: ' + this.goalForm.value['goalname'] + ' is successfully added.'
        );
        this.router.navigate(['/goal']);
        this.confirmDialog = false;
      } catch (error) {
        this.toastService.showErrorToast(
          'Error',
          'There was an error adding new goal. Try again later.'
        );
        this.confirmDialog = false;
      } finally {
        this.goalForm.reset();
      }
    }
  }

  onCancel() {
    this.confirmDialog = false;
  }
}
