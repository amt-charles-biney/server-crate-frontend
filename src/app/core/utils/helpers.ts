import { AttributeOption, CategoryConfig, CategoryEdit, CategoryEditResponse } from '../../types';

export const logout = () => {
  localStorage.clear();
  window.location.reload();
};

export function isAttributeOption(obj: any): obj is AttributeOption {
  return obj && typeof obj.id === 'string';
}

export function convertToCategoryEdit(attributeOption: AttributeOption, isCompatible: boolean, isIncluded: boolean): CategoryEdit {
    return {
      baseAmount: attributeOption.additionalInfo.baseAmount,
      isCompatible,
      isIncluded,
      isMeasured: attributeOption.attribute.isMeasured,
      maxAmount: attributeOption.additionalInfo.maxAmount,
      media: attributeOption.optionMedia,
      name: attributeOption.optionName,
      price: attributeOption.optionPrice,
      priceFactor: attributeOption.additionalInfo.priceFactor,
      type: attributeOption.attribute.name,
      unit: attributeOption.attribute.unit,
    }
}

export function convertToAttributeOption(categoryEdit: CategoryEditResponse, attributeId: string, optionId: string): AttributeOption {
  const {baseAmount, isCompatible, isIncluded, isMeasured, maxAmount, media, name, price, priceFactor, type, unit } = categoryEdit
  return {
    additionalInfo: {
      baseAmount,
      maxAmount,
      priceFactor
    },
    attribute: {
      id: attributeId,
      isMeasured,
      name: type,
      unit
    },
    id: optionId,
    optionMedia: media,
    optionName: name,
    optionPrice: price,
    compatibleOptionId: categoryEdit.compatibleOptionId
  }
}

export function getAttributeOptionList(categories: CategoryEditResponse[]): AttributeOption[] {
  const attributeOptionList: AttributeOption[] = categories.map((category) => {
    return convertToAttributeOption(category, category.attributeId, category.attributeOptionId)
  })
  return attributeOptionList
}

export function convertToCategoryConfig(categoryEdit: CategoryEditResponse): CategoryConfig {
  const { isCompatible, isIncluded, isMeasured, type, attributeId, attributeOptionId, size } = categoryEdit
  return {
    attributeId,
    attributeName: type,
    attributeOptionId,
    isCompatible,
    isIncluded,
    isMeasured,
    size
  }
}