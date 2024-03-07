import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth/auth.service';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { UserSignUp } from '../../../types';
import { signUp } from '../actions/signup.actions';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { errorHandler } from '../../../core/utils/helpers';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SignUpEffect {
  signUp$ = createEffect(() =>
    this.action$.pipe(
      ofType(signUp),
      exhaustMap((signUpData: UserSignUp) => {
        this.signUpService.setEmail(signUpData.email);
        return this.signUpService.signUp(signUpData).pipe(
          map(() => {
            this.profileService.setUser({
              firstName: signUpData.firstName,
              lastName: signUpData.lastName,
            });
            this.toast.success('OTP has been sent to your email. Please verify your email', 'Success')
            this.router.navigateByUrl('/otp', { replaceUrl: true });
          }),
          catchError((error) => {
            this.toast.error(errorHandler(error), 'Error')
            return of()
          }),
        );
      })
    ), { dispatch: false }
  );

  constructor(
    private action$: Actions,
    private signUpService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private toast: ToastrService
  ) {}
}
