import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Address } from '../../../types';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var google: any;
@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label for="ship-address" class="flex flex-col gap-0.5 mt-4 ">
      <span>Address</span>
    <input
      id="ship-address"
      [formControl]="control"
      class="w-full overflow-hidden border-[1.5px] placeholder:text-figma-gray outline-figma-green px-4 py-2 rounded-md"
      placeholder="Address"
      #autocomplete
    />
  </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent implements AfterViewInit {
  @ViewChild('autocomplete') autocomplete!: ElementRef;
  @Output() addressEmitter = new EventEmitter<Address>()
  @Input() control!: FormControl

  googleAutocomplete: google.maps.places.Autocomplete | undefined;

  ngAfterViewInit(): void {
    this.googleAutocomplete = new google.maps.places.Autocomplete(
      this.autocomplete.nativeElement,
      {
        fields: ['address_components', "formatted_address"]
      }
    );

    this.googleAutocomplete?.addListener('place_changed', () => {
      const place = this.googleAutocomplete?.getPlace();
      let address: Address = {
        address: place?.formatted_address,
        city: '',
        country: '',
        state: '',
        zipCode: ''
      }
      place?.address_components?.map((addressComponent) => {
        if (addressComponent.types.includes('locality') || addressComponent.types.includes('sublocality')) {
          address = {
            ...address,
            city: addressComponent.long_name
          }
        } else if (addressComponent.types.includes('country')) {
          address = {
            ...address,
            country: addressComponent.short_name
          }
        } else if (addressComponent.types.includes('postal_code')) {
          address = {
            ...address,
            zipCode: addressComponent.long_name
          }
        }
        else if (addressComponent.types.includes('administrative_area_level_1')) {
          address = {
            ...address,
            state: addressComponent.short_name
          }
        }
      })
      this.addressEmitter.emit(address)
    });
  }
}
