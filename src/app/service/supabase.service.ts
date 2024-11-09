// supabase.service.ts
import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthSession,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environments';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  private supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );
  private sessionSubject = new BehaviorSubject<AuthSession | null>(null);
  session$ = this.sessionSubject.asObservable();

  constructor(private router: Router) {
    // Restore session on initialization
    this._restoreSession();

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.sessionSubject.next(session);
      this._persistSession(session);
    });
  }

  // Load the initial session from Supabase
  private _restoreSession() {
    const sessionData = localStorage.getItem('supabase.session');
    if (sessionData) {
      const session = JSON.parse(sessionData) as AuthSession;
      this.sessionSubject.next(session);
    }
  }

  // Persist session in local storage
  private _persistSession(session: AuthSession | null) {
    if (session) {
      localStorage.setItem('supabase.session', JSON.stringify(session));
    } else {
      localStorage.removeItem('supabase.session');
    }
  }

  // Sign Up with Email and Password
  signUp(email: string, password: string, redirectUrl: string) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
  }

  // Sign In with Email and Password
  signInWithEmail(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  // Sign Out and clear session
  signOut() {
    localStorage.removeItem('supabase.session'); // Clear from storage
    return this.supabase.auth.signOut();
  }

  resetPassword(email: string, redirectUrl: string) {
    return this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
  }

  updatePassword(newPassword: string) {
    return this.supabase.auth.updateUser({
      password: newPassword
    });
  }

  async validateToken() {
    let session = await this.supabase.auth.getSession();
    return session?.data?.session !== null;
  }

  // Get the current session
  getSession(): AuthSession | null {
    return this.sessionSubject.value;
  }



  //-------------------------------Database---------------------------------

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }
}
