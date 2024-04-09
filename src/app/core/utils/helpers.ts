import { inject } from '@angular/core';
import { resetLoader } from '../../store/loader/actions/loader.actions';
import {
  Attribute,
  AttributeOption,
  CategoryConfig,
  CategoryEditResponse,
} from '../../types';
import { LOCALSTORAGE_EMAIL, LOCALSTORAGE_TOKEN, LOCALSTORAGE_USER } from './constants';
import { Store } from '@ngrx/store';

export function resetLoaderFn() {
  const store = inject(Store)
  store.dispatch(resetLoader({
    isError: false,
    message: '',
    status: false
  }))
}

export function isInStorage(id: string){
  const productsInStorage = JSON.parse(sessionStorage.getItem("products")!)
  if (!productsInStorage[id]) {
    return { productsInStorage, inStorage: false }
  }     
  return { productsInStorage, inStorage: true }
}

export function errorHandler(err: any): string {
  let errorMessage = '';
  if (err && err.error && err.error.detail) {
    errorMessage = err.error.detail;
  } else {
    errorMessage = 'Server response error';
  }
  return errorMessage;
}
export const logout = () => {
  clearStorage();
  sessionStorage.clear();
  window.location.reload();
};

export const clearStorage = () => {
  localStorage.removeItem(LOCALSTORAGE_USER);
  localStorage.removeItem(LOCALSTORAGE_TOKEN);
  localStorage.removeItem(LOCALSTORAGE_EMAIL);
};
export function isAttributeOption(obj: any): obj is AttributeOption {
  return obj && typeof obj.id === 'string';
}
export function isProductBrand(obj: any): obj is { name: string, price: number} {
  return obj && typeof obj.name === 'string' && typeof obj.price === 'number' 
}
export function isCategoryEditResponse(obj: any): obj is CategoryEditResponse {
  return obj && typeof obj.attributeOptionId === 'string';
}
export function convertToAttributeOption(
  categoryEdit: CategoryEditResponse,
  attributeId: string,
  optionId: string
): AttributeOption {
  const {
    baseAmount,
    isCompatible,
    isIncluded,
    isMeasured,
    maxAmount,
    media,
    name,
    price,
    priceFactor,
    type,
    unit,
    brand,
    incompatibleAttributeOptions,
    inStock,
  } = categoryEdit;
  return {
    additionalInfo: {
      baseAmount,
      maxAmount,
      priceFactor,
    },
    attribute: {
      id: attributeId,
      isMeasured,
      name: type,
      unit,
    },
    id: optionId,
    optionMedia: media,
    optionName: name,
    optionPrice: price,
    compatibleOptionId: categoryEdit.compatibleOptionId,
    brand,
    incompatibleAttributeOptions,
    inStock,
  };
}
export function convertToCategoryConfig(
  categoryEdit: CategoryEditResponse
): CategoryConfig {
  const {
    isCompatible,
    isIncluded,
    isMeasured,
    type,
    attributeId,
    attributeOptionId,
    size,
  } = categoryEdit;
  return {
    attributeId,
    attributeName: type,
    attributeOptionId,
    isCompatible,
    isIncluded,
    isMeasured,
    size,
  };
}
export function convertAttributeOptionToCategoryConfig(
  attributeOption: AttributeOption,
  isCompatible: boolean,
  isIncluded: boolean
): CategoryConfig {
  return {
    isCompatible,
    isIncluded,
    isMeasured: attributeOption.attribute.isMeasured,
    size: attributeOption.additionalInfo.baseAmount,
    attributeOptionId: attributeOption.id,
    attributeId: attributeOption.attribute.id,
    attributeName: attributeOption.attribute.name,
  };
}

export function removeFromLocalAttributes(
  localAttributes: Attribute[],
  optionId: string
) {
  let newLocalAttributes: Attribute[] = [];
  newLocalAttributes = localAttributes?.map((attribute) => {
    let newLocalAttributeOptions: AttributeOption[] =
      attribute.attributeOptions.filter(
        (attributeOption) => attributeOption.id !== optionId
      );
    return { ...attribute, attributeOptions: newLocalAttributeOptions };
  });
  return newLocalAttributes;
}

export function putInLocalAttributes(
  localAttributes: Attribute[],
  newOption: AttributeOption
) {  
  let newLocalAttributes: Attribute[] = [];
  newLocalAttributes = localAttributes?.map((attribute) => {
    let newLocalAttributeOptions: AttributeOption[] = [];
    if (attribute.id === newOption.attribute.id) {
      newLocalAttributeOptions = [...attribute.attributeOptions, newOption];
      return { ...attribute, attributeOptions: newLocalAttributeOptions };
    }
    return attribute;
  });
  return newLocalAttributes;
}

export function getNumberOfIncompatibles(
  incompatibleSet: Record<string, AttributeOption[]>
) {
  return Object.values(incompatibleSet).length;
}

export function generateSizes(
  baseAmount: number,
  maxAmount: number,
  unit: string
) {
  const sizes: string[] = [];
  for (let size = baseAmount; size <= maxAmount; size = size + baseAmount) {
    sizes.push(`${size} ${unit}`);
  }
  return sizes;
}

export function generateStorageSizes(baseAmount: number, maxAmount: number, unit: string): string[] {
  const storageSize: string[] = []

  for (let size = baseAmount; size <= maxAmount; size *= 2) {
    storageSize.push(`${String(size)}`)
  }
  return storageSize
}

export function generateIncompatiblesTable(config: CategoryEditResponse[]) {
  const newIncompatibleSet: Record<string, AttributeOption[]> = {};
  config.forEach((categoryAttribute) => {
    if (!categoryAttribute.isCompatible) {
      if (newIncompatibleSet[categoryAttribute.type]) {
        newIncompatibleSet[categoryAttribute.type].push(
          convertToAttributeOption(
            categoryAttribute,
            categoryAttribute.attributeId,
            categoryAttribute.attributeOptionId
          )
        );
      } else {
        newIncompatibleSet[categoryAttribute.type] = [
          convertToAttributeOption(
            categoryAttribute,
            categoryAttribute.attributeId,
            categoryAttribute.attributeOptionId
          ),
        ];
      }
    }
  });

  return newIncompatibleSet;
}

export function getAttributeOptionsFromConfig(config: CategoryEditResponse) {
  return convertToAttributeOption(
    config,
    config.attributeId,
    config.attributeOptionId
  );
}

export function generateIncompatibleSet(
  incompatibleAttributeOptions: AttributeOption[]
) {
  const incompatibleSet: Record<string, AttributeOption[]> = {};
  incompatibleAttributeOptions.forEach((incompatibleAttribute) => {
    const name = incompatibleAttribute.attribute.name;
    if (incompatibleSet[name]) {
      incompatibleSet[name].push(incompatibleAttribute);
    } else {
      incompatibleSet[name] = [incompatibleAttribute];
    }
  });
  return incompatibleSet;
}
export function buildIncompatibleTable(
  incompatibleAttributeOptions: AttributeOption[] = [],
  currentIncompatibleSet: Record<string, AttributeOption[]> = {},
  localAttributes: Attribute[]
) {
  const incompatibleSet: Record<string, AttributeOption[]> =
    currentIncompatibleSet;
  incompatibleAttributeOptions.forEach((incompatibleAttribute) => {
    const name = incompatibleAttribute.attribute.name;
    if (incompatibleSet[name]) {
      incompatibleSet[name] = incompatibleSet[name].filter(
        (option) => option.id !== incompatibleAttribute.id
      );
      incompatibleSet[name].push(incompatibleAttribute);
    } else {
      incompatibleSet[name] = [incompatibleAttribute];
    }
    localAttributes = removeFromLocalAttributes(
      localAttributes,
      incompatibleAttribute.id
    );
  });

  return { incompatibleSet, localAttributes };
}

export function removeCloudinaryBaseUrl(url: string) {
  const prefix = 'http://res.cloudinary.com/dah4l2inx/image/upload/';
  if (url && url.startsWith(prefix)) {
    return url.substring(prefix.length);
  }
  return url;
}

export function isMasterCard(value: string) {
  return value === '2' || value === '5'
}

export function isVisaCard(value: string) {
  return value === '4'
}

