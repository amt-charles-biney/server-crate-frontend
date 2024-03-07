import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  verificationFailure,
  verificationSuccess,
  verifyingEmail,
} from '../actions/signup.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ResendOtp, Success, VerifiedUser, Verify } from '../../../types';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { resetLoader, setLoadingSpinner } from '../../loader/actions/loader.actions';
import { Store } from '@ngrx/store';
import { resendingOTP } from '../../otp/otp.actions';
import { TimerService } from '../../../core/services/timer/timer.service';
import { LOCALSTORAGE_TOKEN } from '../../../core/utils/constants';
import { ToastrService } from 'ngx-toastr';
import { errorHandler } from '../../../core/utils/helpers';

@Injectable()
export class VerifyEffect {
  verifyEmail$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyingEmail),
      exhaustMap((user: Verify) => {
        return this.signUpService.verifyEmail(user).pipe(
          tap((verifiedUser) => {
            localStorage.setItem(LOCALSTORAGE_TOKEN, verifiedUser.token);
          }),
          map((verifiedUser: VerifiedUser) => {
            this.toast.success('Email verified successfully', 'Success')
            this.router.navigateByUrl('/settings', { replaceUrl: true });
            return verificationSuccess(verifiedUser);
          }),
          catchError((err) => {
            const errorMessage = errorHandler(err)
            this.toast.success(errorMessage, 'Error')
            return of(verificationFailure({ errorMessage: errorMessage }));
          })
        );
      })
    );
  });
  resendOtp$ = createEffect(() => {
    return this.action$.pipe(
        ofType(resendingOTP),
        exhaustMap((otpRequest: ResendOtp) => {
            return this.signUpService.resendOtp({email: otpRequest.email, type: otpRequest.otpType }).pipe(
                map((message: Success) => {   
                    this.timerService.setTimer(5)
                    setTimeout(() => {
                      this.store.dispatch(resetLoader({ isError: false, message: '', status: false }))
                  }, 1500);
                    return setLoadingSpinner({
                        status: false,
                        message: message.message,
                        isError: false,
                      });
                }),
                catchError((err) => {
                    return of(setLoadingSpinner({ status: false, message: err.error.detail, isError: true}))
                }),
            )
        })
    )
})

  constructor(
    private action$: Actions,
    private router: Router,
    private signUpService: AuthService,
    private store: Store,
    private timerService: TimerService,
    private toast: ToastrService    
  ) {}
}
