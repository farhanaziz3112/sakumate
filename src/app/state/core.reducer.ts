import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { State } from './core.state';
import * as authReducer from './auth/auth.reducer';

export const reducers: ActionReducerMap<State> = {
  auth: authReducer.reducer,
};

export const metaReducers: MetaReducer<State>[] = [];
