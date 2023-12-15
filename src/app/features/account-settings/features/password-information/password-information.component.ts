import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { saveChanges } from '../../../../core/utils/settings';
import { passwordRegex } from '../../../../core/utils/constants/patterns';
import { checkIfPasswordsMatch, formValidator } from '../../../../core/utils/validators';

@Component({
  selector: 'app-password-information',
  standalone: true,
  imports: [CommonModule, CustomInputComponent, CustomButtonComponent, ReactiveFormsModule],
  templateUrl: './password-information.component.html',
  styleUrl: './password-information.component.scss'
})
export class PasswordInformationComponent implements OnInit {
  passwordForm!: FormGroup

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
  }

  savePasswordChanges() {
    if (this.passwordForm.invalid) return;
    saveChanges(this.passwordForm)
  }

  get newPwd() {
    return this.passwordForm.get('newPwd')
  }

  get confirmPwd() {
    return this.passwordForm.get('confirmPwd')
  }
}
