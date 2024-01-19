import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { Router, RouterLink } from '@angular/router';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { passwordRegex } from '../../../core/utils/constants';
import { checkIfPasswordsMatch, formValidator } from '../../../core/utils/validators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectOtp } from '../../../store/otp/otp.reducers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingStatus, ResetPassword } from '../../../types';
import { sendNewPassword } from '../../../store/reset/actions/reset.actions';
import { selectLoaderState } from '../../../store/loader/reducers/loader.reducers';
import { setLoadingSpinner } from '../../../store/loader/actions/loader.actions';
import { AuthLoaderComponent } from '../../../shared/components/auth-loader/auth-loader.component';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    CustomInputComponent,
    RouterLink,
    CustomButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    AuthLoaderComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm !: FormGroup
  otp: string = ''
  loadingState$!: Observable<LoadingStatus>
  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          passwordRegex
        ),
      ]),
      confirmPwd: new FormControl('', [
        Validators.required,
        checkIfPasswordsMatch(),
      ]),
    }, formValidator('password', 'confirmPwd'))
    this.loadingState$ = this.store.select(selectLoaderState)
  }

  constructor(private store: Store, private router: Router) {
    this.store.select(selectOtp).pipe(
      takeUntilDestroyed()
    ).subscribe((otp: string) => {
      if (otp === '') {
        this.router.navigateByUrl('/forgot-password/reset-link')
        return;
      }
      this.otp = otp
    })
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) return ;
    const email = localStorage.getItem('server-crate-email') ?? ''
    const { password, confirmPwd } = this.resetPasswordForm.value
    const changePassword: ResetPassword = {
      email,
      otpCode: this.otp,
      newPassword: password,
      confirmNewPassword: confirmPwd
    }
    // this.store.dispatch(setLoadingSpinner({ status: true, message: '', isError: false }))
    this.store.dispatch(sendNewPassword(changePassword))
  }

  get password() {
    return this.resetPasswordForm.get('password')
  }

  get confirmPwd() {
    return this.resetPasswordForm.get('confirmPwd');
  }
  
}
