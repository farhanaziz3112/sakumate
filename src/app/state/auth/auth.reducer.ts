import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState, initialAuthState } from '../model';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, state => ({ ...state, loading: true })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialAuthState)
);


export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
