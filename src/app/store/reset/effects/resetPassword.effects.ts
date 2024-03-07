import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { sendNewPassword } from '../actions/reset.actions';
import { ResetPassword, Success } from '../../../types';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { ToastrService } from 'ngx-toastr';
import { errorHandler } from '../../../core/utils/helpers';

@Injectable()
export class ResetPasswordEffect {
  resetPassword$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(sendNewPassword),
        exhaustMap((changePassword: ResetPassword) => {
          return this.authService.changePassword(changePassword).pipe(
            tap(({ message }: Success) => {
              this.router.navigateByUrl('/settings', { replaceUrl: true });
              this.toast.success(message, 'Success');
            }),
            catchError((err) => {
              this.toast.error(errorHandler(err), 'Error');
              return of();
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private action$: Actions,
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService
  ) {}
}
