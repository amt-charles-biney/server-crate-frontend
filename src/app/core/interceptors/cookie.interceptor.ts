import { HttpInterceptorFn } from '@angular/common/http';

export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
  const request = req.clone({
    withCredentials: true
  });
  return next(request)
};
