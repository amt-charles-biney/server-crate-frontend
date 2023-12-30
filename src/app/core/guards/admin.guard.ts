import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../services/user-profile/profile.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const profileService = inject(ProfileService)
  const router = inject(Router)
  const userIsAdmin = profileService.isAdmin()
  console.log('userAdmin', userIsAdmin);
  
  if (userIsAdmin) {
    return true
  }
  router.navigateByUrl('/settings')
  return false
};
