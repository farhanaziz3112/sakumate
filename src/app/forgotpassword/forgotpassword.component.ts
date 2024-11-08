import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../service/supabase.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../component/confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-forgotpassword',
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
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css',
})
export class ForgotpasswordComponent {
  signInForm: FormGroup | any;
  resetPasswordForm: FormGroup | any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly supabase: SupabaseService
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

  async onSubmit(): Promise<void> {
    try {
      await this.supabase.signInWithEmail(
        this.signInForm.value['email'],
        this.signInForm.value['password']
      );
      this.router.navigate(['/dashboard']);
      alert('Signed In!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
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
      await this.supabase.resetPassword(this.resetPasswordForm.value['email']);
      alert('Email sent!');
      this.resetPasswordDialog = false;
      this.resetPasswordForm.reset();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
      this.resetPasswordDialog = false;
      this.resetPasswordForm.reset();
    }
  }
}
