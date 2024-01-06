import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth/auth.service';
import { sendingResetLink } from '../actions/reset.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ResendOtp, Success } from '../../../types';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../loader/actions/loader.actions';
import { resendingOTP } from '../../otp/otp.actions';
import { TimerService } from '../../../core/services/timer/timer.service';

@Injectable()
export class ResetEffect {
  reset$ = createEffect(() => {
    return this.action$.pipe(
      ofType(sendingResetLink),
      tap((x) => console.log('Received from of', x)),
      exhaustMap(({ email }) => {
        this.authService.setEmail(email);
        return this.authService.resetPassword(email).pipe(
          tap((x) => console.log('Auth', x)),
          map((message: Success) => {
            setTimeout(() => {
              this.router.navigateByUrl('/forgot-password/otp', {
                replaceUrl: true,
              });
            }, 2000);

            return setLoadingSpinner({
              status: false,
              message: message.message,
              isError: false,
            });
          }),
          catchError((err) => {
            console.log('Err', err);
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

  resendOtp$ = createEffect(() => {
    return this.action$.pipe(
      ofType(resendingOTP),
      exhaustMap((otpRequest: ResendOtp) => {
        console.log('resending otp');
        return this.authService
          .resendOtp({ email: otpRequest.email, type: otpRequest.otpType })
          .pipe(
            map((message: Success) => {
              console.log('resent otp');
              this.timerService.setTimer(5);
              setTimeout(() => {
                this.store.dispatch(
                  resetLoader({ isError: false, message: '', status: false })
                );
              }, 1500);
              return setLoadingSpinner({
                status: false,
                message: message.message,
                isError: false,
              });
            }),
            catchError((err) => {
              console.log('Err in resending', err);
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
    private store: Store,
    private timerService: TimerService
  ) {}
}
