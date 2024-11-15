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
import { supabase } from './supabase.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSession = new BehaviorSubject<AuthSession | null>(null);
  private user = new BehaviorSubject<User | null>(null);

  userSession$ = this.userSession.asObservable();
  user$ = this.user.asObservable();

  constructor(private router: Router, private toastService: ToastService) {
    this.initializeSession();
    // this._restoreSession();
    // // Listen for auth changes
    // supabase.auth.onAuthStateChange((_, session) => {
    //   this.userSession.next(session);
    //   this.user.next(session ? session!.user : null);
    //   this._persistSession(session);
    // });
    // // this.supabase.session$.subscribe((session) => {
    // //   this.userSession.next(session);
    // //   this.user.next(session ? session!.user : null);
    // // });
  }

  private initializeSession() {
    // Restore session from local storage
    this._restoreSession();

    // Set up listener for authentication state changes only once
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);

      // Update BehaviorSubjects
      this.userSession.next(session);
      this.user.next(session ? session.user : null);

      // Persist session in local storage
      this._persistSession(session);
    });
  }

  /**
   * Restores the session from local storage if available.
   */
  private _restoreSession() {
    const sessionData = localStorage.getItem('supabase.session');
    if (sessionData) {
      const session = JSON.parse(sessionData) as AuthSession;

      // Update BehaviorSubjects with restored session
      this.userSession.next(session);
      this.user.next(session.user);
    }
  }

  /**
   * Persists the session in local storage.
   * Removes it if the session is null.
   *
   * @param session - The authentication session to be persisted.
   */
  private _persistSession(session: AuthSession | null) {
    if (session) {
      localStorage.setItem('supabase.session', JSON.stringify(session));
    } else {
      localStorage.removeItem('supabase.session');
    }
  }

  // Sign Up with Email and Password
  async signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:4200/newaccount',
        },
      });
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        this.toastService.showErrorToast(
          'Sign Out Failed',
          'There was an error signing up. Try again later.'
        );
      } else {
        this.router.navigate(['/login']);
        localStorage.removeItem('supabase.session');
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:4200/forgotpassword',
      });
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        this.toastService.showErrorToast(
          'Update Password Failed',
          'There was an error updating your password. Try again later.'
        );
      } else {
        await supabase.auth.signOut();
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

  async validateToken() {
    let session = await supabase.auth.getSession();
    return session?.data?.session !== null;
  }

  isAuthenticated(): boolean {
    return !!this.userSession.value;
  }

  // Get the current session
  getSession(): AuthSession | null {
    return this.userSession.value;
  }
}
