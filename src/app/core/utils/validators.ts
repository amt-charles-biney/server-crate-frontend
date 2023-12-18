import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function checkIfTermsAreAccepted(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value ? null : { acceptTerms: { value: control.value } };
  };
}

export function checkIfPasswordsMatch(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get('password');
    const confirmPwd = control.parent?.get('confirmPwd');
    const confirmPassword = password?.value === confirmPwd?.value;
    return confirmPassword
      ? null
      : { confirmPwd: { value: 'Passwords do not match' } };
  };
}

export function formValidator(
  password: string,
  confirmPwd: string
): ValidatorFn {
  return (control: AbstractControl) => {
    const passwordControl = control.get(password);
    const confirmPwdControl = control.get(confirmPwd);
    if (passwordControl && confirmPwdControl) {
      if (passwordControl.value !== confirmPwdControl.value) {
        const error = { confirmPwd: { value: 'Passwords do not match' } };
        confirmPwdControl.setErrors(error);
        return error;
      }
    }
    confirmPwdControl?.setErrors(null);
    return null;
  };
}
