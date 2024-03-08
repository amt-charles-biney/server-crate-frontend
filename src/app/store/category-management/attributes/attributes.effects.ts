import { Attribute, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addAttribute,
  deleteAll,
  deleteAttribute,
  deleteAttributeOption,
  getAttributes,
  gotAttributes,
  gotImage,
  updateAttribute,
  uploadImage,
} from './attributes.actions';
import {
  catchError,
  concatMap,
  exhaustMap,
  finalize,
  map,
  of,
  switchMap,
  tap,
  throwError,
  timeout,
} from 'rxjs';
import { AdminService } from '../../../core/services/admin/admin.service';
import {
  resetLoader,
  setLoadingSpinner,
} from '../../loader/actions/loader.actions';
import { GetAttribute } from '../../../types';
import { Store } from '@ngrx/store';
import { errorHandler } from '../../../core/utils/helpers';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { getProducts } from '../../admin/products/categories.actions';

@Injectable()
export class AttributeEffect {
  upload$ = createEffect(() => {
    return this.action$.pipe(
      ofType(uploadImage),
      switchMap((props) => {
        this.ngxService.startLoader('attributes')
        return this.adminService.uploadImage(props.form).pipe(
          map(({ url }) => {
            this.toast.success('Image uploaded successfully', 'Success')
            return gotImage({ url, id: props.id });
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return of();
          }),
          finalize(() => {
            this.ngxService.stopLoader('attributes')
          })
        );
      })
    );
  });

  addAttribute$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addAttribute),
      switchMap((props) => {
        return this.adminService.addAttribute(props).pipe(
          map((props: GetAttribute) => {
            this.store.dispatch(
              setLoadingSpinner({
                isError: false,
                message: 'Added attribute successfully',
                status: false,
              })
            );
            setTimeout(() => {
              this.store.dispatch(
                resetLoader({ isError: false, message: '', status: false })
              );
            }, 1500);
            return gotAttributes({ attributes: props.data });
          }),
          timeout(5000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            setTimeout(() => {
              this.store.dispatch(
                resetLoader({ isError: false, message: '', status: false })
              );
            }, 5000);
            return of(
              setLoadingSpinner({
                isError: true,
                message: 'Fix: Adding attributes',
                status: false,
              })
            );
          })
        );
      })
    );
  });

  getAttributes$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getAttributes),
      switchMap(() => {
        return this.adminService.getAttributes().pipe(
          map((props: GetAttribute) => {
            this.store.dispatch(
              setLoadingSpinner({
                isError: false,
                message: props.message,
                status: false,
              })
            );
            return gotAttributes({ attributes: props.data });
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: err.error.detail,
                status: false,
              })
            );
          })
        );
      })
    );
  });

  deleteAttributeOption$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteAttributeOption),
      switchMap((props) => {
        return this.adminService
          .deleteAttributeOption(props.optionId, props.attributeId)
          .pipe(
            map(() => {
              this.store.dispatch(
                setLoadingSpinner({
                  isError: false,
                  message: 'Deleted attribute successfully',
                  status: false,
                })
              );
              setTimeout(() => {
                this.store.dispatch(
                  resetLoader({ isError: false, message: '', status: false })
                );
              }, 1500);
              return getAttributes();
            }),
            catchError((err) => {
              return of(
                setLoadingSpinner({
                  isError: true,
                  message: err.error.detail,
                  status: false,
                })
              );
            })
          );
      })
    );
  });

  updateAtrribute$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateAttribute),
      exhaustMap((props) => {
        return this.adminService.updateAttribute(props).pipe(
          map(() => {
            this.toast.success('Updated attribute successfully', 'Success', { timeOut: 1500 })
            this.store.dispatch(getProducts({ page: 0 }))
            return getAttributes();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return of();
          })
        );
      })
    );
  });

  deleteAttribute$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteAttribute),
      concatMap((props) => {
        return this.adminService.deleteAttribute(props.attributeId).pipe(
          map(() => {
            this.store.dispatch(
              setLoadingSpinner({
                isError: false,
                message: 'Deleted attribute',
                status: false,
              })
            );
            setTimeout(() => {
              this.store.dispatch(
                resetLoader({ isError: false, message: '', status: false })
              );
            }, 1500);
            return getAttributes();
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: err.error.detail,
                status: false,
              })
            );
          })
        );
      })
    );
  });
  deleteAll$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deleteAll),
      exhaustMap((props) => {
        return this.adminService.deleteAll(props.deleteList).pipe(
          map(() => {
            setTimeout(() => {
              this.store.dispatch(
                resetLoader({ isError: false, message: '', status: false })
              );
            }, 1500);
            return getAttributes();
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                isError: true,
                message: errorHandler(err),
                status: false,
              })
            );
          })
        );
      })
    );
  });

  constructor(
    private action$: Actions,
    private adminService: AdminService,
    private store: Store,
    private ngxService: NgxUiLoaderService,
    private toast: ToastrService
  ) {}
}
