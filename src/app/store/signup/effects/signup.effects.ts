import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { Success, UserSignUp } from '../../../types';
import {
  signUp,
} from '../actions/signup.actions';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';

@Injectable()
export class SignUpEffect {
  signUp$ = createEffect(() =>
    this.action$.pipe(
      ofType(signUp),
      tap((userData) => console.log('userData', userData)),
      exhaustMap((signUpData: UserSignUp) => {
        console.log('Data', signUpData);

        return this.signUpService.signUp(signUpData).pipe(
          tap((data: Success) => console.log('Sign up', data)),
          map((data: Success) => {
            console.log('Successfull');
            // this.store.dispatch(
            //   setLoadingSpinner({
            //     status: false,
            //     message:
            //       'OTP has been sent to your email. Please verify your email',
            //     isError: false,
            //   })
            // );
            setTimeout(() => {
              this.router.navigateByUrl('/otp', { replaceUrl: true });
            }, 2000);
            return setLoadingSpinner({
              status: false,
              message:
                'OTP has been sent to your email. Please verify your email',
              isError: false,
            });
          }),
          catchError((error) => {
            const message = error.error.detail  ?? 'Couldn\'t reach the server';
            return of(setLoadingSpinner({ status: false, message, isError: true }));
          }),
          tap(console.log)
        );
      })
    )
  );

  constructor(
    private action$: Actions,
    private signUpService: AuthService,
    private router: Router,
    private store: Store
  ) {}
}
