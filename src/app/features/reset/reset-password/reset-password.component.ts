import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { RouterLink } from '@angular/router';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { passwordRegex } from '../../../core/utils/constants/patterns';
import { checkIfPasswordsMatch, formValidator } from '../../../core/utils/validators';
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
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm !: FormGroup

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
  }

  get password() {
    return this.resetPasswordForm.get('password')
  }

  get confirmPwd() {
    return this.resetPasswordForm.get('confirmPwd');
  }
  
}
