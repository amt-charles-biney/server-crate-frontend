import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth/auth.service';
import { changePassword } from './changePassword.actions';
import { catchError, exhaustMap, of, tap } from 'rxjs';
import { ChangePassword } from '../../../types';
import { errorHandler } from '../../../core/utils/helpers';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ChangePasswordEffect {
  changePassword$ = createEffect(() => {
    return this.action$.pipe(
      ofType(changePassword),
      exhaustMap((newPassword: ChangePassword) => {
        return this.authService.changePasswordInProfile(newPassword).pipe(
          tap(({message}) => {
            this.toast.success(message, 'Success')
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return of();
          })
        );
      })
    );
  }, { dispatch: false });

  constructor(private action$: Actions, private authService: AuthService, private toast: ToastrService) {}
}
