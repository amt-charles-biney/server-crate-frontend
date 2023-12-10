import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { RouterLink } from '@angular/router';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  checkIfPasswordsMatch,
  checkIfTermsAreAccepted,
  formValidator,
} from '../../core/utils/validators';
import { passwordRegex } from '../../core/utils/constants/patterns';
@Component({
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
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
      acceptTerms: new FormControl(null, [
        Validators.required,
        checkIfTermsAreAccepted(),
      ]),
    }, formValidator('password', 'confirmPwd'))
  }

  submitRegistrationForm() {
    console.log('Form Data', this.signUpForm.value, this.acceptTerms?.value);
    if (this.signUpForm.invalid) return;    
    console.log(
      'Form Data Submitted',
      this.signUpForm.value,
      this.acceptTerms?.value
    );
  }

  get name() {
    return this.signUpForm.get('name' ?? '');
  }

  get email() {
    return this.signUpForm.get('email' ?? '');
  }
  get password() {
    return this.signUpForm.get('password' ?? '');
  }
  get confirmPwd() {
    return this.signUpForm.get('confirmPwd' ?? '');
  }
  get acceptTerms() {
    return this.signUpForm.get('acceptTerms' ?? '');
  }
}
