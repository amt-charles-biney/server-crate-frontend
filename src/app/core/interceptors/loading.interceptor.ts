import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../store/loader/actions/loader.actions';
import { catchError, finalize, of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const toast = inject(ToastrService)
  store.dispatch(
    setLoadingSpinner({ status: true, message: '', isError: false })
  );
  
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 0 && error.error instanceof ProgressEvent) {
        toast.error('Lost connection to the server', 'Network Error')
      }      
      return throwError(() => error)
    }),
    finalize(() =>
      store.dispatch(
        resetLoader({ isError: false, message: '', status: false })
      )
    )
  );
};
