import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const settingsGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const isAuthenticated = authService.isAuthenticated()

  if (!isAuthenticated) {
    router.navigateByUrl('/login')
    return false
  } 
  return true;
};
