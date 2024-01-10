import { VerifiedUser } from './../../../types';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { signIn } from '../actions/login.actions';
import { SignIn } from '../../../types';
import { AuthService } from '../../../core/services/auth/auth.service';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { ProfileService } from '../../../core/services/user-profile/profile.service';

@Injectable()
export class LoginEffect {
  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(signIn),
      tap((x) => console.log('Loggin in', x)),
      exhaustMap((formData: SignIn) => {
        return this.authService.login(formData).pipe(
          tap((x) => console.log('service---->', x)),
          map((response: VerifiedUser) => {
            this.authService.setToken(response.token);
            this.profileService.setUser({ firstName: response.firstName, lastName: response.lastName})
            setTimeout(() => {
              if (response.role === 'ADMIN') {
                this.router.navigateByUrl('/admin', { replaceUrl: true });
              } else {
                this.router.navigateByUrl('/settings', { replaceUrl: true });
              }
            }, 1500);
            return setLoadingSpinner({
              status: false,
              message: 'Login Successful',
              isError: false,
            });
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                status: false,
                message: err.error.detail ?? '',
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