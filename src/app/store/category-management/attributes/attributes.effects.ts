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
import { catchError, concatMap, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { AdminService } from '../../../core/services/admin/admin.service';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { GetAttribute } from '../../../types';

@Injectable()
export class AttributeEffect {
  upload$ = createEffect(() => {
    return this.action$.pipe(
      ofType(uploadImage),
      switchMap((props) => {
        return this.adminService.uploadImage(props.form).pipe(
          // tap(data => console.log('Upload response', data)),
          map(({ url }) => {
            return gotImage({ url, id: props.id });
          }),
          catchError(() => {
            return of();
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
          tap((data) => console.log('Upload response', props)),
          map((props: GetAttribute) => {
            return gotAttributes({ attributes: props.data });
          }),
          catchError(() => {
            return of();
          })
        );
      })
    );
  });

  getAttributes$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getAttributes),
      switchMap((props) => {
        return this.adminService.getAttributes().pipe(
          map((props: GetAttribute) => {
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
          return this.adminService.deleteAttributeOption(props.optionId).pipe(
            map(() => {
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
  })

  updateAtrribute$ = createEffect(() => {
    return this.action$.pipe(
        ofType(updateAttribute),
        exhaustMap((props) => {
          return this.adminService.updateAttribute(props).pipe(
            map(() => {
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
  })

  deleteAttribute$ = createEffect(() => {
    return this.action$.pipe(
        ofType(deleteAttribute),
        concatMap((props) => {
          return this.adminService.deleteAttribute(props.attributeId).pipe(
            map(() => {
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
  })
  deleteAll$ = createEffect(() => {
    return this.action$.pipe(
        ofType(deleteAll),
        exhaustMap((props) => {
          return this.adminService.deleteAll(props.deleteList).pipe(
            map(() => {
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
  })

  constructor(private action$: Actions, private adminService: AdminService) {}
}
