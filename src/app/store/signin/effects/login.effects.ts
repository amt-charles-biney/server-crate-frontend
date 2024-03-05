import { VerifiedUser } from './../../../types';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { signIn } from '../actions/login.actions';
import { SignIn } from '../../../types';
import { AuthService } from '../../../core/services/auth/auth.service';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { errorHandler } from '../../../core/utils/helpers';
import { getCartItems } from '../../cart/cart.actions';

@Injectable()
export class LoginEffect {
  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(signIn),
      exhaustMap((formData: SignIn) => {
        return this.authService.login(formData).pipe(
          map((response: VerifiedUser) => {
            this.authService.setToken(response.token);
            this.profileService.setUser({ firstName: response.firstName, lastName: response.lastName})
            if (response.role === 'ADMIN') {
              this.router.navigateByUrl('/admin/dashboard', { replaceUrl: true });
            } else {
              this.router.navigateByUrl('/settings', { replaceUrl: true });
            }
            return getCartItems()
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                status: false,
                message: errorHandler(err),
                isError: true,
              })
            );
          })
        );
      })
    );
  });
  constructor(
    private action$: Actions,
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}
}
