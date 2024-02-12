import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth/auth.service';
import { TokenPayload } from '../../types';
import { clearStorage } from '../utils/helpers';
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const token = authService.getToken()
  let userIsAdmin;
  if (token) {
    const decodedToken = jwtDecode<TokenPayload>(token)
    if (decodedToken.exp < Date.now() / 1000) {
      clearStorage()
      router.navigateByUrl('/login')
      return false
    }
    userIsAdmin = decodedToken.role === 'ADMIN'
  }
  if (userIsAdmin) {
    return true
  }
  router.navigateByUrl('/settings')
  return false
};
