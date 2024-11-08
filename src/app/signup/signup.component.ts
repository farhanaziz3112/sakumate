import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { SupabaseService } from '../service/supabase.service';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../component/confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  loading = false;

  signUpForm: FormGroup | any;

  constructor(
    private router: Router,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {
    this.signUpForm = this.formBuilder.group({
      email: '',
      password: '',
    });
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true;
      await this.supabase.signUp(
        this.signUpForm.value['email'],
        this.signUpForm.value['password']
      );
      this.router.navigate(['/dashboard']);
      // alert('Check your email for the login link!');
      alert('Signed Up!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.signUpForm.reset();
      this.loading = false;
    }
  }

  faArrowLeft = faArrowLeft;

  login(link: string) {
    this.router.navigate([link]);
  }
}
