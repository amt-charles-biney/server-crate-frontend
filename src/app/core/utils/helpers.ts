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