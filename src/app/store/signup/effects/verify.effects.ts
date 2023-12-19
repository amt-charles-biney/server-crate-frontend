import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  verificationFailure,
  verificationSuccess,
  verifyingEmail,
} from '../actions/signup.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { VerifiedUser, Verify } from '../../../types';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class VerifyEffect {
  verifyEmail$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyingEmail),
      tap((x) => console.log('Verifying', x)),
      exhaustMap((user: Verify) => {
        return this.signUpService.verifyEmail(user).pipe(
          tap((verifiedUser) => {
            localStorage.setItem('server-crate-token', verifiedUser.token);
          }),
          map((data: VerifiedUser) => {
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message: 'Email verified successfully',
                isError: false,
              })
            );
            setTimeout(() => {
              this.router.navigateByUrl('/settings', { replaceUrl: true });
            }, 2000);
            return verificationSuccess(data);
          }),
          catchError((err) => {
            const message = err.error.detail;
            this.store.dispatch(
              setLoadingSpinner({ status: false, message, isError: true })
            );
            return of(verificationFailure({ errorMessage: err.error.detail }));
          })
        );
      })
    );
  });

  constructor(
    private action$: Actions,
    private router: Router,
    private signUpService: AuthService,
    private store: Store
  ) {}
}
