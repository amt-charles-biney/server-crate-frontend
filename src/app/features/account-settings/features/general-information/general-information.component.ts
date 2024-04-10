import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { Contact } from '../../../../types';
import { Store } from '@ngrx/store';
import {
  changeUserInfo,
  getGeneralInfo,
} from '../../../../store/account-settings/general-info/general-info.actions';
import {
  selectContact,
  selectEmail,
  selectFirstName,
  selectLastName,
} from '../../../../store/account-settings/general-info/general-info.reducers';
import { Subject, combineLatest, map, tap } from 'rxjs';
import { AuthLoaderComponent } from '../../../../shared/components/auth-loader/auth-loader.component';
import { ProfileService } from '../../../../core/services/user-profile/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [
    AuthLoaderComponent,
    CommonModule,
    CustomInputComponent,
    ReactiveFormsModule,
    CustomButtonComponent,
  ],
  templateUrl: './general-information.component.html',
})
export class GeneralInformationComponent implements OnInit, AfterViewInit {
  generalInfoForm!: FormGroup;
  showWarning: string = '';
  private generalForm$ = new Subject();
  generalForm = this.generalForm$.asObservable();
  @ViewChild('telInput', { static: false }) telInput!: ElementRef;
  intl!: any;
  constructor(
    private store: Store,
    private profileService: ProfileService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(getGeneralInfo());
    this.generalInfoForm = new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      lastName: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
      }),
      contact: new FormControl(''),
    });
    this.generalForm = combineLatest([
      this.store.select(selectFirstName),
      this.store.select(selectLastName),
      this.store.select(selectEmail),
      this.store.select(selectContact),
    ]).pipe(
      map(
        ([firstName, lastName, email, contact]: [
          firstName: string,
          lastName: string,
          email: string,
          contact: Contact
        ]) => {
          let contactValue = '';
          if (contact && contact.phoneNumber) {
            contactValue = contact.phoneNumber;
          }
          this.generalInfoForm.setValue({
            firstName,
            lastName,
            email,
            contact: contactValue,
          });
          this.intl?.setNumber(contactValue);
        }
      )
    );

    this.contact.valueChanges.pipe(
      tap(() => {
        this.showWarning = ''
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  ngAfterViewInit(): void {
    if (this.telInput) {
      this.intl = (<any>window).intlTelInput(this.telInput.nativeElement, {
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
      });
    }
  }

  saveGeneralInfoChanges() {
    const contact = this.intl?.getSelectedCountryData();
    const contactValue: Contact = {
      country: contact.name,
      dialCode: contact.dialCode,
      iso2Code: contact.iso2,
      phoneNumber: this.intl?.getNumber(),
    };
    
    if (!this.intl.isValidNumber() && this.intl?.getNumber()) {
      this.showWarning = 'Please enter a valid phone number';
      return;
    }
    const { firstName, lastName } = this.generalInfoForm.value;
    this.profileService.setUser({ firstName, lastName });
    if (contactValue.phoneNumber) {
      this.store.dispatch(
        changeUserInfo({ contact: contactValue, firstName, lastName })
      );
    } else {
      this.store.dispatch(
        changeUserInfo({ contact: null, firstName, lastName })
      );
    }
  }

  onFocus(control: AbstractControl) {
    const value = control.value;
    control.reset();
    control.patchValue(value);
  }

  get firstName() {
    return this.generalInfoForm.get('firstName')!;
  }
  get lastName() {
    return this.generalInfoForm.get('lastName')!;
  }

  get email() {
    return this.generalInfoForm.get('email')!;
  }

  get contact() {
    return this.generalInfoForm.get('contact')!;
  }
}
