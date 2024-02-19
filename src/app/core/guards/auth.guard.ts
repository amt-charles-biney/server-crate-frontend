import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { TokenPayload } from '../../types';
import { clearStorage } from '../utils/helpers';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  console.log('Token', token, router.url);
  
  if (token) {
    const decodedToken = jwtDecode<TokenPayload>(token);
    if (decodedToken.exp > Date.now() / 1000) {
      return true;
    } else {
      clearStorage();
      router.navigateByUrl('/login')
      return false
    }
  } else {
    clearStorage();
    router.navigateByUrl('/')
    return false
  }
};