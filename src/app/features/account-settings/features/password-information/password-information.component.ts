import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordRegex } from '../../../../core/utils/constants';
import { checkIfPasswordsMatch, formValidator } from '../../../../core/utils/validators';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ChangePassword, LoadingStatus } from '../../../../types';
import { Store } from '@ngrx/store';
import { changePassword } from '../../../../store/profile/changePassword/changePassword.actions';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { Observable } from 'rxjs';
import { selectLoaderState } from '../../../../store/loader/reducers/loader.reducers';

@Component({
  selector: 'app-password-information',
  standalone: true,
  imports: [CommonModule, CustomInputComponent, CustomButtonComponent, ReactiveFormsModule, AuthLoaderComponent],
  templateUrl: './password-information.component.html',
})
export class PasswordInformationComponent implements OnInit {
  passwordForm!: FormGroup
  loadingState$!: Observable<LoadingStatus>
  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      currentPwd: new FormControl('', Validators.required),
      newPwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(passwordRegex),
      ]),
      confirmPwd: new FormControl('', [
        Validators.required,
        checkIfPasswordsMatch(),
      ])
    }, formValidator('newPwd', 'confirmPwd'))
    this.loadingState$ = this.store.select(selectLoaderState)
  }

  constructor(private store: Store) {}

  savePasswordChanges() {
    if (this.passwordForm.invalid) return;
    const { currentPwd, newPwd, confirmPwd } = this.passwordForm.value
    const password: ChangePassword = {
      confirmNewPassword: confirmPwd,
      currentPassword: currentPwd,
      newPassword: newPwd
    }
    this.store.dispatch(changePassword(password))
    this.passwordForm.reset({
      currentPwd: '',
      newPwd: '',
      confirmPwd: ''
    })
  }

  get newPwd() {
    return this.passwordForm.get('newPwd')
  }

  get confirmPwd() {
    return this.passwordForm.get('confirmPwd')
  }
}
