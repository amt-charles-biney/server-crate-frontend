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
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { LOCALSTORAGE_TOKEN } from '../../../core/utils/constants';

@Injectable()
export class VerifyEffect {
  verifyEmail$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyingEmail),
      tap((x) => console.log('Verifying', x)),
      exhaustMap((user: Verify) => {
        return this.signUpService.verifyEmail(user).pipe(
          tap((verifiedUser) => {
            localStorage.setItem(LOCALSTORAGE_TOKEN, verifiedUser.token);
          }),
          map((verifiedUser: VerifiedUser) => {
            this.store.dispatch(
              setLoadingSpinner({
                status: false,
                message: 'Email verified successfully',
                isError: false,
              })
            );
            console.log('after signup', verifiedUser)
            setTimeout(() => {
              this.router.navigateByUrl('/settings', { replaceUrl: true });
            }, 2000);
            return verificationSuccess(verifiedUser);
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
  resendOtp$ = createEffect(() => {
    return this.action$.pipe(
        ofType(resendingOTP),
        exhaustMap((otpRequest: ResendOtp) => {
            console.log('resending otp')
            return this.signUpService.resendOtp({email: otpRequest.email, type: otpRequest.otpType }).pipe(
                map((message: Success) => {   
                    console.log('resent otp');
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
                    console.log('Err in resending', err);
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
    private profileService: ProfileService
  ) {}
}
