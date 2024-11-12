/* eslint-disable @typescript-eslint/no-empty-function */
import { createAction, props } from '@ngrx/store';
import { User } from '@supabase/supabase-js';

export const login = createAction(
  '[Auth] Login',
  props<{
    email: string;
    password: string;
  }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: any }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);
export const logout = createAction('[Auth] Logout');
