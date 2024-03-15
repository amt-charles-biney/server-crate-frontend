import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../store/loader/actions/loader.actions';
import { EMPTY, catchError, finalize, of, throwError, timeout } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const toast = inject(ToastrService)
  const ngxService = inject(NgxUiLoaderService)
  store.dispatch(
    setLoadingSpinner({ status: true, message: '', isError: false })
  );
  
  return next(req).pipe(
    timeout({each: 120000, with: () => {
      console.log('Timeout');
      ngxService.stopAll()
      toast.error('Connection timed out. Please try again later', 'Error')
      return EMPTY
  } }),
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
