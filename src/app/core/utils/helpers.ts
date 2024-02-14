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

export function getConfigPayload(
  attributes: Attribute[]
): Map<string, CategoryConfig[]> {
  let categoryConfigMap: Map<string, CategoryConfig[]> = new Map();
  attributes.forEach((attribute: Attribute) => {
    attribute.attributeOptions.forEach((attributeOption) => {
      if (categoryConfigMap.has(attribute.attributeName)) {
        categoryConfigMap.set(attribute.attributeName, [
          ...categoryConfigMap.get(attribute.attributeName)!,
          convertAttributeOptionToCategoryConfig(attributeOption, true, false),
        ]);
      } else {
        categoryConfigMap.set(attribute.attributeName, [
          convertAttributeOptionToCategoryConfig(attributeOption, true, false),
        ]);
      }
    });
  });
  return categoryConfigMap;
}

export function updateConfigPayload(
  attributeOption: AttributeOption,
  configPayload: Map<string, CategoryConfig[]>,
  included: boolean
): Map<string, CategoryConfig[]> {
  if (!configPayload.has(attributeOption.attribute.name)) {
    configPayload.set(attributeOption.attribute.name, [
      {
        attributeId: attributeOption.attribute.id,
        attributeName: attributeOption.attribute.name,
        attributeOptionId: attributeOption.id,
        isCompatible: true,
        isIncluded: included,
        isMeasured: attributeOption.attribute.isMeasured,
        size: attributeOption.additionalInfo.baseAmount 
      }
    ])
  }
  const newPayload = configPayload.get(attributeOption.attribute.name)!.map((config) => {
    if (config.attributeOptionId === attributeOption.id) {      
      return {
        ...config,
        isIncluded: included,
        isCompatible: true,
      };
    } else if (config.attributeId === attributeOption.attribute.id) {
      return {
        ...config,
        isIncluded: false,
        isCompatible: true,
      };
    }
    return config;
  });
  configPayload.set(attributeOption.attribute.name, newPayload);
  return configPayload;
}


export function getEditConfigPayload(configs: CategoryEditResponse[]) {
  const mapping: Map<string, CategoryConfig[]> = new Map();
  configs.forEach((config) => {
    if (mapping.has(config.type)) {
      mapping.set(config.type, 
       [ ...mapping.get(config.type)!,
        convertToCategoryConfig(config)],
      );
    } else {
      mapping.set(config.type, [
        convertToCategoryConfig(config),
      ]);
    }
  });
  return mapping

}

export function updateConfigSizes(
  attributeName: string,
  optionId: string,
  configPayload: Map<string, CategoryConfig[]>,
  size: number
) {
  const newPayload = configPayload.get(attributeName)!.map((config) => {
    if (config.attributeOptionId === optionId) {
      return {
        ...config,
        size,
      };
    }
    return config;
  });
  configPayload.set(attributeName, newPayload);
  return configPayload;
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
  return (
    convertToAttributeOption(
      config,
      config.attributeId,
      config.attributeOptionId
    )
  );
}
export function getMapping(configs: CategoryEditResponse[]) {
  const mapping: Map<string, AttributeOption[]> = new Map();
  configs.forEach((config) => {
    if (mapping.has(config.type)) {
      mapping.set(config.type, 
       [ ...mapping.get(config.type)!,
        getAttributeOptionsFromConfig(config)],
      );
    } else {
      mapping.set(config.type, [
        getAttributeOptionsFromConfig(config),
      ]);
    }
  });
  return mapping
}
export function convertIncompatiblesToCategoryConfig(
  incompatibleAttributes: Record<string, AttributeOption[]>
) {
  let categoryConfigList: CategoryConfig[] = [];
  for (let key in incompatibleAttributes) {
    const incompatibleAttribute = incompatibleAttributes[key];
    incompatibleAttribute.forEach((attribute) => {
      const categoryConfig: CategoryConfig = {
        size: attribute.additionalInfo.baseAmount,
        isCompatible: false,
        isIncluded: false,
        isMeasured: attribute.attribute.isMeasured,
        attributeId: attribute.id,
        attributeName: attribute.attribute.name,
        attributeOptionId: attribute.id,
      };
      categoryConfigList.push(categoryConfig);
    });
  }
  return categoryConfigList;
}
export function removeFromPayload(
  categoryConfigPayload: Map<string, CategoryConfig[]>,
  attributeName: string,
  incompatibleAttributeOptions: AttributeOption[]
) {
  const optionIds = incompatibleAttributeOptions.map(
    (attributeOption) => attributeOption.id
  );
  const newConfig = categoryConfigPayload
    .get(attributeName)!
    .map(
      (categoryConfig) => {
        if (optionIds.includes(categoryConfig.attributeOptionId)) {
          return {
            ...categoryConfig,
            isCompatible: false,
            isIncluded: false
          }
        }
        return categoryConfig
      }
        
    );
  const newCategoryConfigPayload = categoryConfigPayload.set(
    attributeName,
    newConfig
  );
  return newCategoryConfigPayload;
}