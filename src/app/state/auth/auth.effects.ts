import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService // This service should handle Supabase authentication
  ) {}

  // signIn$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.login), // Listen for the signIn action
  //     switchMap(({ email, password }) => // Get the email and password from the action
  //       this.authService.signInWithEmail(email, password).pipe( // Call the signIn method with the parameters
  //         map(user => AuthActions.signInSuccess({ user })), // On success, dispatch signInSuccess
  //         catchError(error => [AuthActions.signInFailure({ error })]) // On failure, dispatch signInFailure
  //       )
  //     )
  //   );

  // login$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.login),
  //     mergeMap(() =>
  //       this.authService.signInWithEmail().pipe(
  //         map(user => AuthActions.loginSuccess({ user })),
  //         catchError(error => of(AuthActions.loginFailure({ error: error.message })))
  //       )
  //     )
  //   )
  // );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        from(this.authService.signInWithEmail(email, password)).pipe(
          map((user) => {
            console.log('Login successful', user);
            return AuthActions.loginSuccess({ user });
          }),
          catchError((error) => {
            console.error('Login error', error);
            return [AuthActions.loginFailure({ error })];
          })
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.authService.signOut()) // Perform logout in Supabase
      ),
    { dispatch: false }
  );
}
