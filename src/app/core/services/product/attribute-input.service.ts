import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attribute, AttributeOption } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class AttributeInputService {

  constructor() { }
  toFormGroup(attributes: Attribute[] ) {
    const group: any = {};
    attributes.forEach(attribute => {
      // const testAttr: AttributeOption = {
      //   additionalInfo: {
      //     baseAmount: 0,
      //     maxAmount: 0,
      //     priceFactor: 2,
      //   },
      //   attribute: {
      //     id: '23432',
      //     isMeasured: false,
      //     name: 'Motherboard',
      //   },
      //   id: '923943',
      //   optionMedia: 'something',
      //   optionName: 'Asus ROG Strix B550-F',
      //   optionPrice: 2300
      // }
      group[attribute.attributeName] = new FormControl('')
                                              
    });
    group['categoryName'] = new FormControl('', Validators.required)
    group['attributesInput'] = new FormControl('')
    group['variants'] = new FormControl('')
    return new FormGroup(group);
  }
  toSelectFormGroup(attributes: Attribute[] ) {
    const group: any = {};
    attributes.forEach(attribute => {
      group[attribute.attributeName] = new FormControl(null)                                      
    });
    return new FormGroup(group);
  }
  editFormGroup(obj: Record<string, string>) {
    const group: any = {};

    for (let key in obj) {
      group[key] = new FormControl(obj[key])
    }
    group['attributesInput'] = new FormControl('')
    return new FormGroup(group)
    
  }
}
