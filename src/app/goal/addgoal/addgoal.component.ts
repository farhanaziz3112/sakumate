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
import { CalendarModule } from 'primeng/calendar';
import { ThemeService } from '../../service/theme.service';
import { ColorService } from '../../service/color.service';
import { icons, tagIconsString } from '../../component/icons/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../../component/confirmdialog/confirmdialog.component';

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
  addGoalForm: FormGroup | any;
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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private colorService: ColorService
  ) {
    this.addGoalForm = this.formBuilder.group({
      goalName: [''],
      currentAmount: [0],
      targetAmount: [0],
      dueDate: [''],
      createdDate: [''],
    });
    this.tagForm = this.formBuilder.group({
      tagName: ['tag name'],
      type: ['goal'],
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
