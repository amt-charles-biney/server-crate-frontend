import { FormGroup } from "@angular/forms"

export function saveChanges(formGroup: FormGroup) {
    console.log(formGroup.value)
}