import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attribute, AttributeOption, CategoryAndConfig, CategoryConfig, CategoryEdit, CategoryEditResponse } from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class AttributeInputService {
  constructor() {}
  toFormGroup(attributes: Attribute[]) {
    const group: Record<string, FormControl> = {};
    attributes.forEach((attribute) => {
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
      if (attribute.isMeasured) {
        group[`${attribute.attributeName}Size`] = new FormControl();
      }
      group[attribute.attributeName] = new FormControl('');
    });
    group['categoryName'] = new FormControl('', Validators.required);
    group['attributesInput'] = new FormControl('');
    group['variants'] = new FormControl('');
    return new FormGroup(group);
  }
  editFormGroup(attributes: CategoryEditResponse[], name: string) {    
    const group: Record<string, FormControl> = {};
    attributes.forEach((attribute) => {
      if (attribute.isMeasured && attribute.isIncluded) {        
        group[`${attribute.type}Size`] = new FormControl(`${attribute.size} ${attribute.unit}`);        
      }
      if (attribute.isIncluded) {
        group[attribute.type] = new FormControl(attribute);
      }
    });
    group['categoryName'] = new FormControl(name, Validators.required);
    group['attributesInput'] = new FormControl('');
    group['variants'] = new FormControl('');
    return new FormGroup(group);
  }
  toSelectFormGroup(attributes: Attribute[] | CategoryAndConfig[]) {
    const group: any = {};
    attributes.forEach((attribute) => {
      if ('attributeName' in attribute) {
        group[attribute.attributeName] = new FormControl(null);
      } else {
        group[attribute.name] = new FormControl(null);
      }
    });
    return new FormGroup(group);
  }
  createInitialForm(formValues: Record<string, string>){
    const group: Record<string, FormControl> = {}
    for (let key in formValues) {
      group[key] = new FormControl(formValues[key])
    }
    return new FormGroup(group)
  }
}
