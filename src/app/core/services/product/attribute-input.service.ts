import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class AttributeInputService {

  constructor() { }
  toFormGroup(attributes: Attribute[] ) {
    const group: any = {};
    attributes.forEach(attribute => {
      group[attribute.attributeName] = new FormControl('', Validators.required)
                                              
    });
    return new FormGroup(group);
  }
  toSelectFormGroup(attributes: Attribute[] ) {
    const group: any = {};
    attributes.forEach(attribute => {
      group[attribute.attributeName] = new FormControl(null)
                                              
    });
    return new FormGroup(group);
  }
}
