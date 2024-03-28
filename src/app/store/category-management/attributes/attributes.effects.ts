import { Injectable } from '@angular/core';
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
  EMPTY,
  catchError,
  concatMap,
  exhaustMap,
  finalize,
  map,
  switchMap,
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
import { getNotifications } from '../../admin/products/notifications.actions';

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
            return EMPTY;
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
            this.store.dispatch(getNotifications())
            return gotAttributes({ attributes: props.data });
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
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
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
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
              this.store.dispatch(getNotifications())
              return getAttributes();
            }),
            catchError((err) => {
              this.toast.error(errorHandler(err), "Error")
              return EMPTY
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
            // this.store.dispatch(getProducts({ page: 0 }))
            this.store.dispatch(getNotifications())
            return getAttributes();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY;
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
            this.store.dispatch(getNotifications())
            return getAttributes();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
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
            this.store.dispatch(getNotifications())
            return getAttributes();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), "Error")
            return EMPTY
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
