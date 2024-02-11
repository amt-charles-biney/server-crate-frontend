import { AttributeOption, CategoryConfig, CategoryEditResponse } from "../../types";

export function errorHandler(err: any): string {
  let errorMessage = '';
  if (err && err.error && err.error.detail) {
    errorMessage = err.error.detail;
  } else {
    errorMessage = 'Server response error';
  }
  return errorMessage
}
export const logout = () => {
  localStorage.clear();
  sessionStorage.clear()
  window.location.reload();
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