import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  SupabaseClient,
  createClient,
  AuthSession,
  User,
} from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environments';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSession = new BehaviorSubject<AuthSession | null>(null);
  private user = new BehaviorSubject<User | null>(null);
  userSession$ = this.userSession.asObservable();
  user$ = this.user.asObservable();

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private toastService: ToastService
  ) {
    this.supabase.session$.subscribe((session) => {
      this.userSession.next(session);
      this.user.next(session ? session!.user : null);
    });
  }

  // Sign Up with Email and Password
  async signUp(email: string, password: string) {
    try {
      const { error } = await this.supabase.signUp(
        email,
        password,
        'http://localhost:4200/newaccount'
      );
      if (error) {
        this.toastService.showErrorToast(
          'Error',
          'There was an error signing up. Try again later.'
        );
      } else {
        this.router.navigate(['/newaccount']);
        this.toastService.showSuccessToast(
          'Sign Up Successful',
          'Welcome to Sakumate! Please complete the account registration below.'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.showErrorToast(
          'Error',
          'There was an error signing up. Try again later.'
        );
      }
    }
  }

  // Sign In with Email and Password
  async signInWithEmail(email: string, password: string) {
    try {
      const { error } = await this.supabase.signInWithEmail(email, password);
      if (error) {
        this.toastService.showErrorToast(
          'Sign In Failed',
          'Incorrect email or password!'
        );
      } else {
        this.router.navigate(['/dashboard']);
        this.toastService.showSuccessToast(
          'Sign In Successful',
          'Welcome to Sakumate!'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.showErrorToast(
          'Sign In Failed',
          'Incorrect email or password!'
        );
      }
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.signOut();
      if (error) {
        this.toastService.showErrorToast(
          'Sign Out Failed',
          'There was an error signing up. Try again later.'
        );
      } else {
        this.router.navigate(['/login']);
        this.toastService.showInfoToast(
          'Sign Out Successful',
          'Till we meet again!'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.showErrorToast(
          'Sign Out Failed',
          'There was an error signing up. Try again later.'
        );
      }
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.resetPassword(
        email,
        'http://localhost:4200/forgotpassword'
      );
      if (error) {
        this.toastService.showErrorToast(
          'Reset Password Failed',
          'There was an error resetting your password. Try again later.'
        );
      } else {
        this.router.navigate(['/login']);
        this.toastService.showSuccessToast(
          'Resetting Password',
          'An email has been sent to you! Check your inbox.'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.showErrorToast(
          'Reset Password Failed',
          'There was an error resetting your password. Try again later.'
        );
      }
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.supabase.updatePassword(newPassword);
      if (error) {
        this.toastService.showErrorToast(
          'Update Password Failed',
          'There was an error updating your password. Try again later.'
        );
      } else {
        await this.supabase.signOut();
        this.toastService.showSuccessToast(
          'Updating Password',
          'New password has been updated.'
        );
        this.router.navigate(['/login']);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.showErrorToast(
          'Update Password Failed',
          'There was an error updating your password. Try again later.'
        );
      }
    }
  }

  isAuthenticated(): boolean {
    return !!this.userSession.value;
  }

  // Get the current session
  getSession(): AuthSession | null {
    return this.userSession.value;
  }
}
