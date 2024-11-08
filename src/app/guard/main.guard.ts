import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../service/supabase.service';
import { inject } from '@angular/core';

export const mainGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const supabase = inject(SupabaseService);

  if (supabase.isAuthenticated()) {
    console.log('authenticated');
    return true;
  } else {
    console.log('not authenticated');
    router.navigate(['/login']);
    return false;
  }
};
