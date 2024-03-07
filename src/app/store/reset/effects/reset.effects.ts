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
import { ToastrService } from 'ngx-toastr';
import { errorHandler } from '../../../core/utils/helpers';

@Injectable()
export class ResetEffect {
  reset$ = createEffect(() => {
    return this.action$.pipe(
      ofType(sendingResetLink),
      exhaustMap(({ email }) => {
        this.authService.setEmail(email);
        return this.authService.resetPassword(email).pipe(
          tap(({ message }: Success) => {
            this.toast.success(message, 'Success');
            this.router.navigateByUrl('/forgot-password/otp', {
              replaceUrl: true,
            });
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return of();
          })
        );
      })
    );
  }, { dispatch: false });

  resendOtp$ = createEffect(() => {
    return this.action$.pipe(
      ofType(resendingOTP),
      exhaustMap((otpRequest: ResendOtp) => {
        return this.authService
          .resendOtp({ email: otpRequest.email, type: otpRequest.otpType })
          .pipe(
            tap(({ message }: Success) => {
              this.timerService.setTimer(5);
              this.toast.success(message, 'Success');
            }),
            catchError((err) => {
              this.toast.error(errorHandler(err), 'Error')
              return of();
            })
          );
      })
    );
  }, { dispatch: false });

  constructor(
    private action$: Actions,
    private router: Router,
    private authService: AuthService,
    private timerService: TimerService,
    private toast: ToastrService
  ) {}
}
