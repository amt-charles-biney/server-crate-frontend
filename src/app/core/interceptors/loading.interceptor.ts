import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../store/loader/actions/loader.actions';
import { EMPTY, catchError, finalize, of, tap, throwError, timeout } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CacheService } from '../services/cache/cache.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheService)
  const store = inject(Store);
  const toast = inject(ToastrService)
  const ngxService = inject(NgxUiLoaderService)
  const url = req.urlWithParams
  store.dispatch(
    setLoadingSpinner({ status: true, message: '', isError: false })
  );
  if (req.method === 'GET') {
    if (cacheService.cache.has(url)) {
      store.dispatch(
        resetLoader({ isError: false, message: '', status: false })
      )
      return of(new HttpResponse({ body: cacheService.cache.get(url) }));
    }
  } else {    
    cacheService.removeFromCache(url)
  }
  
  return next(req).pipe(
    tap((httpEvent: HttpEvent<any>) => {
      if (httpEvent instanceof HttpResponse) {
        if (req.method !== 'PATCH') {          
          cacheService.addToCache(url, httpEvent.body)

        }
      }
    }),
    timeout({each: 120000, with: () => {
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
