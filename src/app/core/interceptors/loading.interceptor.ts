import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { setLoadingSpinner } from '../../store/loader/actions/loader.actions';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store)
  store.dispatch(setLoadingSpinner({ status: true, message: '', isError: false }))
  return next(req);
};
