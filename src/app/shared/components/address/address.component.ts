import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Address } from '../../../types';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { ClickOutsideDirective } from '../../directives/click/click-outside.directive';
import { AddressDropDownComponent } from '../address-drop-down/address-drop-down.component';

declare var google: any;
@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomSelectComponent,
    CustomInputComponent,
    ClickOutsideDirective,
    AddressDropDownComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <label for="ship-address" class="relative flex flex-col gap-0.5 mt-4 ">
      <span>Address</span>
      <input
        id="ship-address"
        [formControl]="control"
        class="w-full overflow-hidden border-[1.5px] placeholder:text-figma-gray outline-figma-green px-4 py-2 rounded-md"
        placeholder="Address"
        autocomplete="off"
        #autocomplete
      />

      <app-address-drop-down
        [predictions]="predictions"
        (placeEmitter)="emitAddress($event)"
        [showPredictions]="showPredictions"
      />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent implements AfterViewInit {
  @ViewChild('autocomplete') autocomplete!: ElementRef;
  @Output() addressEmitter = new EventEmitter<Address>();
  @Input() control!: FormControl;
  predictions: any = [];
  googleAutocomplete: google.maps.places.Autocomplete | undefined;
  autocompleteService: google.maps.places.AutocompleteService | undefined;
  showPredictions: boolean = false;
  sessionToken!: google.maps.places.AutocompleteSessionToken;

  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();

    this.autocomplete.nativeElement.addEventListener(
      'input',
      async () => {
        const userInput = this.autocomplete.nativeElement.value;
        if (userInput) {
          this.showPredictions = true;          
          const response = await this.autocompleteService?.getPlacePredictions(
            {
              input: userInput,
              sessionToken: this.sessionToken,
            },
            this.callback
          );
          this.cdr.markForCheck()
          this.predictions = response?.predictions;
        } else {
          this.predictions = [];
          this.showPredictions = false;
        }
      }
    );
  }

  callback(
    predictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      return;
    }
  }

  emitAddress(address: Address) {
    this.addressEmitter.emit(address);
  }
}
