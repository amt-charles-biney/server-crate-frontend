import { AttributeOption, CategoryEditResponse } from "../../types";

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