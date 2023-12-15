import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { CustomSelectComponent } from '../../../../shared/components/custom-select/custom-select.component';
import { saveChanges } from '../../../../core/utils/settings';


@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [CommonModule, CustomInputComponent, ReactiveFormsModule, CustomButtonComponent, CustomSelectComponent],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss'
})
export class GeneralInformationComponent implements OnInit {
  generalInfoForm!: FormGroup
  ngOnInit(): void {
    this.generalInfoForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required]),
      gender: new FormControl(''),
    })
  }

  saveGeneralInfoChanges() {
    saveChanges(this.generalInfoForm)
  }

  get name() {
    return this.generalInfoForm.get('name')
  }

  get email() {
    return this.generalInfoForm.get('email')
  }

  get contact() {
    return this.generalInfoForm.get('contact')
  }
}
