import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../service/supabase.service';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const mainGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    console.log('authenticated');
    return true;
  } else {
    console.log('not authenticated');
    router.navigate(['/login']);
    return false;
  }
};
