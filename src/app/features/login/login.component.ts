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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
      ]),
    })
  }

  submitRegistrationForm() {
    console.log('Form Data', this.loginForm.value);
    if (this.loginForm.invalid) return;    
    console.log(
      'Form Data Submitted',
      this.loginForm.value,
    );
  }

  get email() {
    return this.loginForm.get('email' ?? '');
  }
  get password() {
    return this.loginForm.get('password' ?? '');
  }
}
