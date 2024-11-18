import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ThemeService } from '../service/theme.service';
import { icons } from '../component/icons/icons';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../component/confirmdialog/confirmdialog.component';
import { AuthService } from '../service/auth.service';
import { ColorService } from '../service/color.service';
import { DatabaseService } from '../service/database.service';
import { ToastService } from '../service/toast.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ConfirmdialogComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    FontAwesomeModule,
    ConfirmdialogComponent,
    DialogModule,
  ],
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

  minDate: string | any;

  currentTheme = '';

  profileForm: FormGroup | any;

  user: User | any;
  profile: any;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private colorService: ColorService,
    private toastService: ToastService,
    private dbService: DatabaseService
  ) {
    const today = new Date();
    const min = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    );
    this.minDate = min.toISOString().split('T')[0];
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
    this.profileForm = this.formBuilder.group({
      username: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      firstname: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      lastname: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
    });
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log(user?.email);
        this.getProfile();
      }
    });
  }

  ngOnInit() {}

  isProfileFormInvalid(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    let isInvalid = control?.invalid && (control?.dirty || control?.touched);
    return isInvalid;
  }

  async getProfile() {
    const { data } = await this.dbService.profile();
    this.profile = data;
    this.profileForm.patchValue({
      username: this.profile.username,
      firstname: this.profile.firstname,
      lastname: this.profile.lastname,
    });
  }

  editProfile: boolean = false;

  enableEditProfile() {
    this.editProfile = true;
    this.profileForm.enable();
  }

  disableEditProfile() {
    this.editProfile = false;
    this.profileForm.patchValue({
      username: this.profile.username,
      firstname: this.profile.firstname,
      lastname: this.profile.lastname,
    });
    this.profileForm.disable();
  }

  confirmEditAccount: boolean = false;

  showConfirmEditAccount() {
    this.confirmEditAccount = true;
  }

  async onConfirmEditAccount() {
    try {
      let profile = {
        username: this.profileForm.value['username'] as string,
        firstname: this.profileForm.value['firstname'] as string,
        lastname: this.profileForm.value['lastname'] as string,
        id: this.user.id,
      };

      const newprofile = await this.dbService.updateProfile(profile);

      this.toastService.showSuccessToast(
        'Edit Profile',
        'Your profile has been updated!'
      );

      this.confirmEditAccount = false;
    } catch (error) {
      this.toastService.showErrorToast(
        'Error',
        'There was an error editing your profile. Try again later.'
      );
      this.confirmEditAccount = false;
    } finally {
      this.editProfile = false;
      this.confirmEditAccount = false;
    }
  }

  onCancelEditAccount() {
    this.confirmEditAccount = false;
  }

  async signOut(): Promise<void> {
    this.authService.signOut();
  }

  confirmSignOut: boolean = false;

  showConfirmSignOut() {
    this.confirmSignOut = true;
  }

  cancelSignOut() {
    this.confirmSignOut = false;
  }

  confirmEditAuth: boolean = false;

  showConfirmEditAuth() {
    this.confirmEditAuth = true;
  }

  async onConfirmEditAuth(): Promise<void> {
    try {
      await this.authService.signOut();
      await this.authService.resetPassword(this.user?.email);
    } finally {
      this.confirmEditAuth = false;
    }
  }

  onCancelEditAuth() {
    this.confirmEditAuth = false;
  }
}
