import { Success } from './../../../types';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  changeUserInfo,
  getGeneralInfo,
  getShippingDetails,
  gotGeneralInfo,
  gotShippingDetails,
  saveShippingDetails,
} from './general-info.actions';
import { catchError, exhaustMap, map, of, share, shareReplay, tap } from 'rxjs';
import { UserInfo, GeneralInfo } from '../../../types';
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { Store } from '@ngrx/store';
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { ToastrService } from 'ngx-toastr';
import { errorHandler } from '../../../core/utils/helpers';

const cache = new Map();
@Injectable()
export class GeneralInfoEffect {
  getGeneralInfo$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getGeneralInfo),
      exhaustMap(({ type }) => {
        const action = JSON.stringify(type);
        return this.profileService.getGeneralInfo().pipe(
          map((generalInfo: GeneralInfo) => {
            cache.set(action, generalInfo);
            this.store.dispatch(gotGeneralInfo(generalInfo));
            return setLoadingSpinner({
              status: false,
              message: '',
              isError: false,
            });
          }),
          catchError((err) => {
            return of(
              setLoadingSpinner({
                status: false,
                message: err.error.detail ?? '',
                isError: true,
              })
            );
          })
        );
      })
    );
  });

  changeContact$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(changeUserInfo),
        exhaustMap((data: UserInfo) => {
          return this.profileService.updateGeneralInfo(data).pipe(
            tap(() => {
              this.toast.success(
                'Successfully changed your information',
                'Success'
              );
            }),
            catchError((err) => {
              this.toast.error(errorHandler(err), 'Error');
              return of();
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  saveShippingDetails$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(saveShippingDetails),
        exhaustMap((props) => {
            this.toast.success('Updated shipping details', 'Success')
          return this.profileService.saveShippingDetails(props).pipe();
        })
      );
    },
    { dispatch: false }
  );

  getShippingDetails$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getShippingDetails),
      exhaustMap(() => {
        return this.profileService.getShippingDetails().pipe(
          map((shippingDetails) => {
            return gotShippingDetails(shippingDetails);
          })
        );
      })
    );
  });

  constructor(
    private action$: Actions,
    private profileService: ProfileService,
    private store: Store,
    private toast: ToastrService
  ) {}
}
