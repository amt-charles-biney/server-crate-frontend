import {
  Attribute,
  AttributeOption,
  CategoryConfig,
  CategoryEditResponse,
} from '../../types';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USER } from './constants';

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
};
export function isAttributeOption(obj: any): obj is AttributeOption {
  return obj && typeof obj.id === 'string';
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

export function getConfigPayload(attributes: Attribute[]): CategoryConfig[] {
  const categoryConfig: CategoryConfig[] = []
  attributes.forEach((attribute) => {
    attribute.attributeOptions.forEach((attributeOption) => {
      categoryConfig.push(convertAttributeOptionToCategoryConfig(attributeOption, true, false))
    })
  })
  return categoryConfig
}

export function updateConfigPayload(optionId: string, attributeId: string, configPayload: CategoryConfig[]): CategoryConfig[] {
  const newPayload = configPayload.map((config) => {
    if (config.attributeOptionId === optionId) {
      return {
        ...config,
        isIncluded: true,
        isCompatible: true
      }
    } else if (config.attributeId === attributeId) {
      return {
        ...config,
        isIncluded: false,
        isCompatible: true
      }
    }
    return config
  })
  return newPayload
}
export function removeFromLocalAttributes(localAttributes: Attribute[], optionId: string) {
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

export function getNumberOfIncompatibles(incompatibleSet: Record<string, AttributeOption[]>) {
  return Object.values(incompatibleSet).length;
}

export function generateSizes(baseAmount: number, maxAmount: number, unit: string) {
  const sizes: string[] = [];
  for (let size = baseAmount; size <= maxAmount; size = size + baseAmount) {
    sizes.push(`${size} ${unit}`);
  }
  return sizes;
}