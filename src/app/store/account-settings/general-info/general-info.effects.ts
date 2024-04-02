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
import { ToastrService } from 'ngx-toastr';
import { errorHandler } from '../../../core/utils/helpers';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { validationFailure, validationSuccess } from '../../checkout/checkout.actions';
import { resetLoader } from '../../loader/actions/loader.actions';

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
            return gotGeneralInfo(generalInfo);
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return EMPTY;
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
              return EMPTY;
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  saveShippingDetails$ = createEffect(() => {
    return this.action$.pipe(
      ofType(saveShippingDetails),
      exhaustMap((props) => {
        this.ngxService.start();
        return this.profileService
          .saveShippingDetails(props.shippingPayload, props.isProfile)
          .pipe(
            map(() => {
              this.ngxService.stop();
              if (!props.isProfile) {
                this.toast.success('Verified user address', 'Success');
                return validationSuccess();
              }
              this.toast.success('Saved shipping details', 'Success');
              return resetLoader({
                isError: false,
                message: '',
                status: false
              });
            }),
            catchError((err) => {
              this.toast.error(errorHandler(err), 'Error');
              this.ngxService.stop();
              if (!props.isProfile) {
                return of(validationFailure())
              }
              return EMPTY;
            })
          );
      })
    );
  });

  getShippingDetails$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getShippingDetails),
      exhaustMap(() => {
        return this.profileService.getShippingDetails().pipe(
          map((shippingDetails) => {
            return gotShippingDetails(shippingDetails);
          }),
          catchError((error) => {
            if (error.status === 404 || error.status === 403) {
              return EMPTY;
            }
            this.toast.error(errorHandler(error), 'Error');
            return EMPTY;
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
            return gotMomoWallet({ wallets: wallet.data });
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return EMPTY;
          })
        );
      })
    );
  });
  getCreditCards$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCards),
      exhaustMap(() => {
        return this.profileService.getCreditCards().pipe(
          map((cards) => {
            return gotCards({ creditCards: cards.data });
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return EMPTY;
          })
        );
      })
    );
  });
  addMomoWallet$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addMomoWallet),
      exhaustMap((wallet) => {
        return this.profileService.addMomoWallet(wallet).pipe(
          map(() => {
            this.toast.success('Added wallet successfully', 'Success');
            return getMomoWallet();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return EMPTY;
          })
        );
      })
    );
  });
  addCreditCard$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addCard),
      exhaustMap((card) => {
        return this.profileService.addCreditCard(card).pipe(
          map(() => {
            this.toast.success('Added credit card successfully', 'Success');
            return getCards();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return EMPTY;
          })
        );
      })
    );
  });
  deleteMomoWallet$ = createEffect(() => {
    return this.action$.pipe(
      ofType(deletePaymentInfo),
      exhaustMap(({ id, isWallet }) => {
        return this.profileService.deleteWallet(id).pipe(
          map(() => {
            this.toast.success(
              `Deleted ${isWallet ? 'wallet' : 'card'} successfully`,
              'Success'
            );
            if (isWallet) {
              return getMomoWallet();
            }
            return getCards();
          }),
          catchError((err) => {
            this.toast.error(errorHandler(err), 'Error');
            return EMPTY;
          })
        );
      })
    );
  });

  constructor(
    private action$: Actions,
    private profileService: ProfileService,
    private toast: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {}
}
