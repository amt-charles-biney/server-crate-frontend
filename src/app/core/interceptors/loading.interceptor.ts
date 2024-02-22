import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../store/loader/actions/loader.actions';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  store.dispatch(
    setLoadingSpinner({ status: true, message: '', isError: false })
  );
  return next(req).pipe(
    finalize(() =>
      store.dispatch(
        resetLoader({ isError: false, message: '', status: false })
      )
    )
  );
};
