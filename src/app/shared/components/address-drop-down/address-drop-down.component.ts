import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Address } from '../../../types';

@Component({
  selector: 'app-address-drop-down',
  standalone: true,
  imports: [],
  templateUrl: './address-drop-down.component.html',
  styleUrl: './address-drop-down.component.scss',
})
export class AddressDropDownComponent {
  @Input() predictions: google.maps.places.QueryAutocompletePrediction[] = [];
  @Input() sessionToken!: google.maps.places.AutocompleteSessionToken;
  @Output() placeEmitter = new EventEmitter<Address>();
  address!: Address

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
      console.log('Place ID', placeId);

      service.getDetails(request, (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => this.getAddress(place, status));
      if (this.address) {
        this.placeEmitter.emit(this.address)
      }
    }
  }

  getAddress(place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) {
    if (!place || status != google.maps.places.PlacesServiceStatus.OK) return;
    console.log('Place', place);
    
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
    console.log('Dropdown address', address)
    this.address = address
    console.log('this', this);
    
    this.placeEmitter.emit(this.address)
  }
}
