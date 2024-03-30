import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addCard,
  addMomoWallet,
  changeUserInfo,
  deletePaymentInfo,
  getCards,
  getGeneralInfo,
  getMomoWallet,
  getShippingDetails,
  gotCards,
  gotGeneralInfo,
  gotMomoWallet,
  gotShippingDetails,
  saveShippingDetails,
} from './general-info.actions';
import { EMPTY, catchError, exhaustMap, map, of, tap } from 'rxjs';
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
            
          return this.profileService.saveShippingDetails(props).pipe(
            tap(() => {
              this.toast.success('Updated shipping details', 'Success')
            }),
            catchError((err) => {
              this.toast.error(errorHandler(err), 'Error')
              return EMPTY
            })
          );
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
          }),
          catchError((error) => {
            return EMPTY
          })
        );
      })
    );
  });

  getMomoWallet$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getMomoWallet),
      exhaustMap(() => {
        return this.profileService.getMomoWallet().pipe(
          map((wallet) => {
            return gotMomoWallet({wallets: wallet.data})
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        )
      })
    )
  })
  getCreditCards$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCards),
      exhaustMap(() => {
        return this.profileService.getCreditCards().pipe(
          map((cards) => {
            return gotCards({creditCards: cards.data})
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        )
      })
    )
  })
  addMomoWallet$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addMomoWallet),
      exhaustMap((wallet) => {
        return this.profileService.addMomoWallet(wallet).pipe(
          map(() => {
            this.toast.success('Added wallet successfully', 'Success')
            return getMomoWallet()
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        )
      })
    )
  })
  addCreditCard$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addCard),
      exhaustMap((card) => {
        return this.profileService.addCreditCard(card).pipe(
          map(() => {
            this.toast.success('Added credit card successfully', 'Success')
            return getCards()
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        )
      })
    )
  })
  deleteMomoWallet$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deletePaymentInfo),
      exhaustMap(({ id, isWallet }) => {
        return this.profileService.deleteWallet(id).pipe(
          map(() => {
            this.toast.success(`Deleted ${ isWallet ? 'wallet' : 'card' } successfully`, 'Success')
            if (isWallet) {
              return getMomoWallet()
            }
            return getCards()
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error')
            return EMPTY
          })
        )
      })
    )
  })


  constructor(
    private action$: Actions,
    private profileService: ProfileService,
    private store: Store,
    private toast: ToastrService
  ) {}
}
