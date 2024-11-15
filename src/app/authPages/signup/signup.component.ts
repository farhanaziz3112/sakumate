import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
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
    private readonly formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.signUpForm.valid) {
      try {
        await this.authService.signUp(
          this.signUpForm.value['email'],
          this.signUpForm.value['password']
        );
      } finally {
        this.signUpForm.reset();
      }
    }
  }

  isSignUpFormInvalid(controlName: string): boolean {
    const control = this.signUpForm.get(controlName);
    let isInvalid = control?.invalid && (control?.dirty || control?.touched);
    return isInvalid;
  }


  faArrowLeft = faArrowLeft;

  login(link: string) {
    this.router.navigate([link]);
  }
}
