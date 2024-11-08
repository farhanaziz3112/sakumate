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
import { SupabaseService } from '../../service/supabase.service';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmdialogComponent } from '../../component/confirmdialog/confirmdialog.component';
import { AuthService } from '../../service/auth.service';

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

  signUpForm: FormGroup | any;

  constructor(
    private router: Router,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.signUpForm = this.formBuilder.group({
      email: '',
      password: '',
    });
  }

  async onSubmit(): Promise<void> {
    try {
      await this.authService.signUp(
        this.signUpForm.value['email'],
        this.signUpForm.value['password']
      );
    } finally {
      this.signUpForm.reset();
    }
  }

  faArrowLeft = faArrowLeft;

  login(link: string) {
    this.router.navigate([link]);
  }
}
