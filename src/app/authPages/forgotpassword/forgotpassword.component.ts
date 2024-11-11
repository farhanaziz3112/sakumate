import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../service/supabase.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [
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
export class ForgotpasswordComponent implements OnInit {
  resetPasswordForm: FormGroup | any;
  token: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private readonly supabase: SupabaseService,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: '',
      confirmPassword: '',
    });
    this.token = window.location.hash;
  }

  ngOnInit(): void { }

  async resetPassword(): Promise<void> {
    let newPassword = this.resetPasswordForm.value['newPassword'];
    let confirmPassword = this.resetPasswordForm.value['confirmPassword'];
    if (newPassword === confirmPassword) {
      try {
        await this.authService.updatePassword(this.resetPasswordForm.value['confirmPassword']);
      } finally {
        this.resetPasswordForm.reset();
      }
    } else {
      alert('New password and confirm password are not the same!');
    }
  }

  login(link: string) {
    this.router.navigate([link]);
  }
}
