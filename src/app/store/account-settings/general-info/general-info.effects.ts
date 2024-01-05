import { Success } from './../../../types';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { changeNumber, getGeneralInfo, gotGeneralInfo } from "./general-info.actions";
import { catchError, exhaustMap, map, of, share, shareReplay } from "rxjs";
import { ChangeContact, GeneralInfo } from "../../../types";
import { ProfileService } from "../../../core/services/user-profile/profile.service";
import { Store } from "@ngrx/store";
import { setLoadingSpinner } from "../../loader/actions/loader.actions";

const cache = new Map()
@Injectable()
export class GeneralInfoEffect {
    getGeneralInfo$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getGeneralInfo),
            exhaustMap(({type}) => {
                const action = JSON.stringify(type)
                // if (cache.has(action)) {
                //     return of(gotGeneralInfo(cache.get(action)))
                // }
                return this.profileService.getGeneralInfo().pipe(
                    map((generalInfo: GeneralInfo) => {
                        cache.set(action, generalInfo)
                        this.store.dispatch(gotGeneralInfo(generalInfo))
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
                    }),
                )  
            })
        )
    })

    changeContact$ = createEffect(() => {
        return this.action$.pipe(
            ofType(changeNumber),
            exhaustMap((data: ChangeContact) => {
                return this.profileService.updateGeneralInfo(data).pipe(
                    map((response: Success) => {
                        console.log('Loading');
                        setTimeout(() => {
                            this.store.dispatch(
                                setLoadingSpinner({
                                status: false,
                                message: '',
                                isError: false,
                            }))
                        }, 2000);
                        return setLoadingSpinner({
                            status: false,
                            message: 'Successfully changed your contact',
                            isError: false,
                        });
                    }),
                    catchError((err) => {
                        console.log('Err', err)
                        return of(
                            setLoadingSpinner({
                              status: false,
                              message: err.error.detail,
                              isError: true,
                            })
                          );
                    }),
                )
            })
        )
    })


    constructor(private action$: Actions, private profileService: ProfileService, private store: Store) {}
}