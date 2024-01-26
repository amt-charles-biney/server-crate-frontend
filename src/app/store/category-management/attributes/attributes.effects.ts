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
import { catchError, concatMap, exhaustMap, map, of, switchMap, tap, throwError, timeout } from 'rxjs';
import { AdminService } from '../../../core/services/admin/admin.service';
import { resetLoader, setLoadingSpinner } from '../../loader/actions/loader.actions';
import { GetAttribute } from '../../../types';
import { Store } from '@ngrx/store';

@Injectable()
export class AttributeEffect {
  upload$ = createEffect(() => {
    return this.action$.pipe(
      ofType(uploadImage),
      switchMap((props) => {
        return this.adminService.uploadImage(props.form).pipe(
          // tap(data => console.log('Upload response', data)),
          map(({ url }) => {
            this.store.dispatch(setLoadingSpinner({
              isError: false,
              message: 'Picture uploaded',
              status: false
            }))
            setTimeout(() => {
              this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
            }, 1500);
            return gotImage({ url, id: props.id });
          }),
          catchError((err) => {
            return of(setLoadingSpinner({
              isError: true,
              message: err.error.detail,
              status: false
            }));
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
            this.store.dispatch(setLoadingSpinner({
              isError: false,
              message: 'Added attribute successfully',
              status: false
            }))
            setTimeout(() => {
              this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
            }, 1500);
            return gotAttributes({ attributes: props.data });
          }),
          timeout(5000),
          catchError((err) => {
            throwError(() => 'Request timed out');
            console.log('Could not add');
            setTimeout(() => {
              this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
            }, 5000);
            return of(setLoadingSpinner({
              isError: true,
              message: 'Fix: Adding attributes',
              status: false
            }));
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
            this.store.dispatch(setLoadingSpinner({
              isError: false,
              message: props.message,
              status: false
            }))
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
          return this.adminService.deleteAttributeOption(props.optionId, props.attributeId).pipe(
            map(() => {
              this.store.dispatch(setLoadingSpinner({
                isError: false,
                message: 'Deleted attribute successfully',
                status: false
              }))
              setTimeout(() => {
                this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
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
  })

  updateAtrribute$ = createEffect(() => {
    return this.action$.pipe(
        ofType(updateAttribute),
        exhaustMap((props) => {
          return this.adminService.updateAttribute(props).pipe(
            map(() => {
              this.store.dispatch(setLoadingSpinner({
                isError: false,
                message: 'Updated attribute successfully',
                status: false
              }))
              setTimeout(() => {
                this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
              }, 1500);
              return getAttributes();
            }),
            catchError((err) => {
              let errorMessage =  ''
              if (err && err.error && err.error.detail) {
                errorMessage = err.error.detail
              } else {
                errorMessage = 'Server response error'
              }
              setTimeout(() => {
                this.store.dispatch(resetLoader({
                  isError: true,
                  message: '',
                  status: false
                }))
              }, 1500);
              return of(
                setLoadingSpinner({
                  isError: true,
                  message: errorMessage,
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
              this.store.dispatch(setLoadingSpinner({
                isError: false,
                message: 'Deleted attribute',
                status: false
              }))
              setTimeout(() => {
                this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
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
  })
  deleteAll$ = createEffect(() => {
    return this.action$.pipe(
        ofType(deleteAll),
        exhaustMap((props) => {
          return this.adminService.deleteAll(props.deleteList).pipe(
            map(() => {
              setTimeout(() => {
                this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
              }, 1500);
              return getAttributes();
            }),
            catchError((err) => {
              let errorMessage =  ''
              if (err && err.error && err.error.detail) {
                errorMessage = err.error.detail
              } else {
                errorMessage = 'Server response error'
              }
              return of(
                setLoadingSpinner({
                  isError: true,
                  message: errorMessage,
                  status: false,
                })
              );
            })
          );
        })
      );
  })

  constructor(private action$: Actions, private adminService: AdminService, private store: Store) {}
}
