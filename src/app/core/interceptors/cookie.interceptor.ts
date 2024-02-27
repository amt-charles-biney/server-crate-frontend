import { HttpInterceptorFn } from '@angular/common/http';
import { NO_AUTH } from '../utils/constants';

export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(NO_AUTH)) {
    const request = req.clone({
      withCredentials: true
    });
    return next(request)
  }
  return next(req)
};
