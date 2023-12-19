import { FormGroup } from "@angular/forms"
import { VerifyOtp } from "../../types";

export function saveChanges(formGroup: FormGroup) {
    console.log(formGroup.value)
}

export function isVerifyOtp(obj: any): obj is VerifyOtp {
    return obj?.otpCode !== undefined; // Adjust this condition as per your type structure
}