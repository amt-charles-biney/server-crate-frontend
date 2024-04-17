import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Address } from '../../../types';
import { ClickOutsideDirective } from '../../directives/click/click-outside.directive';

@Component({
  selector: 'app-address-drop-down',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './address-drop-down.component.html',
})
export class AddressDropDownComponent implements OnChanges {
  @Input() predictions: google.maps.places.QueryAutocompletePrediction[] = [];
  @Input() sessionToken!: google.maps.places.AutocompleteSessionToken;
  @Input() showPredictions!: boolean
  @Output() placeEmitter = new EventEmitter<Address>();
  address!: Address

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['predictions'] && changes['predictions'].currentValue.length > 0) {
      this.showPredictions = true;
    }
  }
  selectPlace(placeId: string = '') {
    if (placeId) {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      const request = {
        placeId,
        fields: ['address_components', 'formatted_address'],
        sessionToken: this.sessionToken,
      };
      service.getDetails(request, (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => this.getAddress(place, status));
      if (this.address) {
        this.placeEmitter.emit(this.address)
      }
      this.showPredictions = false
    }
  }

  getAddress(place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) {
    if (!place || status != google.maps.places.PlacesServiceStatus.OK) return;    
    let address: Address = {
      address: place?.formatted_address,
      city: '',
      country: '',
      state: '',
      zipCode: '',
    };
    place?.address_components?.map((addressComponent) => {
      if (
        addressComponent.types.includes('locality') ||
        addressComponent.types.includes('sublocality')
      ) {
        address = {
          ...address,
          city: addressComponent.long_name,
        };
      } else if (addressComponent.types.includes('country')) {
        address = {
          ...address,
          country: addressComponent.short_name,
        };
      } else if (addressComponent.types.includes('postal_code')) {
        address = {
          ...address,
          zipCode: addressComponent.long_name,
        };
      } else if (
        addressComponent.types.includes('administrative_area_level_1')
      ) {
        address = {
          ...address,
          state: addressComponent.short_name,
        };
      }
    });
    this.address = address    
    this.placeEmitter.emit(this.address)
  }

  onClickOutside() {
    this.showPredictions = false;
  }
}
