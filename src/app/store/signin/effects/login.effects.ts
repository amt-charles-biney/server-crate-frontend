import { VerifiedUser } from './../../../types';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { signIn } from '../actions/login.actions';
import { SignIn } from '../../../types';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { errorHandler } from '../../../core/utils/helpers';
import { getCartItems } from '../../cart/cart.actions';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { getWishlist } from '../../admin/products/categories.actions';

@Injectable()
export class LoginEffect {
  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(signIn),
      exhaustMap((formData: SignIn) => {
        return this.authService.login(formData).pipe(
          map((response: VerifiedUser) => {
            this.authService.setToken(response.token);
            this.profileService.setUser({
              firstName: response.firstName,
              lastName: response.lastName,
            });
            if (response.role === 'ADMIN') {
              this.router.navigateByUrl('/admin/dashboard', {
                replaceUrl: true,
              });
            } else {
              this.router.navigateByUrl('/settings/general', { replaceUrl: true });
            }
            this.toast.success('Login successful', 'Success', {
              timeOut: 1500,
            });
            this.store.dispatch(getWishlist())
            return getCartItems();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return of();
          })
        );
      })
    );
  });
  constructor(
    private action$: Actions,
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private toast: ToastrService,
    private store: Store
  ) {}
}
