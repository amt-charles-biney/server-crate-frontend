import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth/auth.service';
import { verifyingOtp } from '../actions/reset.actions';
import { catchError, exhaustMap, of, tap } from 'rxjs';
import { Success, VerifyOtp } from '../../../types';
import { errorHandler } from '../../../core/utils/helpers';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class VerifyOtpEffects {
  verifyOtp$ = createEffect(() => {
    return this.action$.pipe(
      ofType(verifyingOtp),
      exhaustMap((data: VerifyOtp) => {
        return this.signUpService.verifyOtp(data).pipe(
          tap(({ message }: Success) => {
            this.toast.success(message, 'Success')
            this.router.navigateByUrl('/forgot-password/reset-password', {
              replaceUrl: true,
            });
          }),
          catchError((err) => {
            const errorMessage = errorHandler(err)
            this.toast.error(errorMessage, 'Error')
            return of();
          })
        );
      })
    );
  }, { dispatch: false });

  constructor(
    private action$: Actions,
    private router: Router,
    private signUpService: AuthService,
    private toast: ToastrService
  ) {}
}
