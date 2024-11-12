import { User } from "@supabase/supabase-js";

export interface AuthState {
    user: User | null;  // User will be your user model (either from Supabase or custom-defined)
    loading: boolean;
    error: string | null;
  }
  
  export const initialAuthState: AuthState = {
    user: null,
    loading: false,
    error: null,
  };
  