import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../../component/confirmdialog/confirmdialog.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    FontAwesomeModule,
    DialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  signInForm: FormGroup | any;
  resetPasswordForm: FormGroup | any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.signInForm = this.formBuilder.group({
      email: '',
      password: '',
    });
    this.resetPasswordForm = this.formBuilder.group({
      email: '',
    });
  }

  signUp() {
    this.router.navigate(['/signup']);
  }

  async signIn(): Promise<void> {
    try {
      await this.authService.signInWithEmail(
        this.signInForm.value['email'],
        this.signInForm.value['password']
      );
    } finally {
      this.signInForm.reset();
    }
  }

  resetPasswordDialog: boolean = false;

  showResetPassword() {
    this.resetPasswordDialog = true;
  }

  async resetPassword(): Promise<void> {
    try {
      await this.authService.resetPassword(
        this.resetPasswordForm.value['email']
      );
    } finally {
      this.resetPasswordForm.reset();
      this.resetPasswordDialog = false;
    }
  }
}
