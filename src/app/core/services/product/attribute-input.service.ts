import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attribute, Case, CategoryAndConfig, CategoryEditResponse, Content } from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class AttributeInputService {
  constructor() {}
  toFormGroup(attributes: Attribute[]) {
    const group: Record<string, FormControl> = {};
    attributes.forEach((attribute) => {
      if (attribute.isMeasured) {
        group[`${attribute.attributeName}Size`] = new FormControl();
      }
      group[attribute.attributeName] = new FormControl('');
      // if (attribute.isRequired) {
      //   group[attribute.attributeName].setValidators(Validators.required)
      // }
    });
    group['categoryName'] = new FormControl('', Validators.required);
    group['attributesInput'] = new FormControl('');
    group['variants'] = new FormControl('');
    group['coverImage'] = new FormControl('')
    group['cases'] = new FormControl('')
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
    group['categoryName'] = new FormControl(name, {validators: Validators.required, updateOn: 'blur'});
    group['attributesInput'] = new FormControl('');
    group['variants'] = new FormControl('');
    group['cases'] = new FormControl()
    console.log('Edit of cases');
    
    return new FormGroup(group);
  }
  toSelectFormGroup(attributes: Attribute[] | CategoryAndConfig[] | Content[]) {
    const group: any = {};
    attributes.forEach((attribute) => {
      if ('attributeName' in attribute) {
        group[attribute.attributeName] = new FormControl(null);
      } else if( 'orderId' in attribute) {
        group[attribute.orderId] = new FormControl(null)
      }
      else {
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
