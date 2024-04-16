import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Address } from '../../../types';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import '@googlemaps/extended-component-library/place_picker.js';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, tap } from 'rxjs';
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
    AddressDropDownComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- <gmpx-api-loader key="AIzaSyCrc5r3uSr0cUwrxqLcIzVYy8yfUOrRxkM"></gmpx-api-loader>
    <gmpx-place-picker placeholder="Enter a place" id="place-picker" style="width: 100%">
  </gmpx-place-picker> -->
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
      @if (showPredictions) {
      <div
        appClickOutside
        (clickOutside)="onClickOutside()"
        #results
      >
      <app-address-drop-down [predictions]="predictions" (placeEmitter)="emitAddress($event)"/>
    </div>
  }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent implements AfterViewInit {
  @ViewChild('autocomplete') autocomplete!: ElementRef;
  @ViewChild('results') results!: ElementRef<HTMLDivElement>;
  @ViewChildren('dropDownItem') dropDownItems!: QueryList<HTMLDivElement>
  @Output() addressEmitter = new EventEmitter<Address>();
  @Input() control!: FormControl;
  predictions: any = [];
  prediction$ = new BehaviorSubject<any>([]);
  googleAutocomplete: google.maps.places.Autocomplete | undefined;
  autocompleteService: google.maps.places.AutocompleteService | undefined;
  showPredictions: boolean = false;
  sessionToken!: google.maps.places.AutocompleteSessionToken
  
  ngAfterViewInit(): void {
    console.log('is focused', this.autocomplete.nativeElement === document.activeElement);
    
    // this.googleAutocomplete = new google.maps.places.Autocomplete(
    //   this.autocomplete.nativeElement,
    //   {
    //     fields: ['address_components', 'formatted_address'],
    //   }
    // );

    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
    
    google.maps.event.addDomListener(
      this.autocomplete.nativeElement,
      'input',
      async () => {
        const userInput = this.autocomplete.nativeElement.value;
        if (userInput) {
          this.showPredictions = true
          
          const response = await this.autocompleteService?.getPlacePredictions(
            {
              input: userInput,
              sessionToken: this.sessionToken,
            },
            this.callback
          );
          console.log('Response', response);
          this.predictions = response?.predictions;
        } else {
          this.predictions = []
          this.showPredictions = false
        }
      }
    );
    console.log("DropDownItems", this.dropDownItems);
    
    this.dropDownItems.forEach((dropDownItem) => {
      console.log('Drop Down', dropDownItem);
    })
    
    // this.googleAutocomplete?.addListener('place_changed', () => {
    //   const place = this.googleAutocomplete?.getPlace();
    //   console.log('Place', place);

    //   let address: Address = {
    //     address: place?.formatted_address,
    //     city: '',
    //     country: '',
    //     state: '',
    //     zipCode: '',
    //   };
    //   place?.address_components?.map((addressComponent) => {
    //     if (
    //       addressComponent.types.includes('locality') ||
    //       addressComponent.types.includes('sublocality')
    //     ) {
    //       address = {
    //         ...address,
    //         city: addressComponent.long_name,
    //       };
    //     } else if (addressComponent.types.includes('country')) {
    //       address = {
    //         ...address,
    //         country: addressComponent.short_name,
    //       };
    //     } else if (addressComponent.types.includes('postal_code')) {
    //       address = {
    //         ...address,
    //         zipCode: addressComponent.long_name,
    //       };
    //     } else if (
    //       addressComponent.types.includes('administrative_area_level_1')
    //     ) {
    //       address = {
    //         ...address,
    //         state: addressComponent.short_name,
    //       };
    //     }
    //   });
    //   this.addressEmitter.emit(address);
    // });
  }

  callback(
    predictions: google.maps.places.QueryAutocompletePrediction[] | null,
    status: google.maps.places.PlacesServiceStatus
  ) {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      return;
    }
    console.log('Predictions', predictions);
  }

  onPredictionSelected(event: MatAutocompleteSelectedEvent) {}
  selectPlace(placeId: string = '') {
    if (placeId) {
      console.log('Place ID', placeId);
      
    }
  }

  emitAddress(address: Address) {
    console.log('Address', address)
    this.addressEmitter.emit(address)
    this.showPredictions = false;
  }

  onClickOutside() {
    console.log('Setting predictions to false');
    
  }
}
