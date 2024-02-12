import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { TokenPayload } from '../../types';
import { clearStorage } from '../utils/helpers';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const token = authService.getToken()
  if (token) {
    const decodedToken = jwtDecode<TokenPayload>(token)
    if (decodedToken.exp > Date.now() / 1000) {
      return true
    }
  }
  clearStorage()
  router.navigateByUrl('/login')
  return false
};
