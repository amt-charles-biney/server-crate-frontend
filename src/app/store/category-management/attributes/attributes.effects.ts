import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { addAttribute, gotImage, uploadImage } from "./attributes.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { AdminService } from "../../../core/services/admin/admin.service";

@Injectable()
export class AttributeEffect {
    upload$ = createEffect(() => {
        return this.action$.pipe(
            ofType(uploadImage),
            switchMap((props) => {
                return this.adminService.uploadImage(props.form).pipe(
                    // tap(data => console.log('Upload response', data)),
                    map(({url}) => {
                        return gotImage({ url, id: props.id })
                    }),
                    catchError(() => {
                        return of()
                    })
                )
            })
        )
    })

    addAttribute$ = createEffect(() => {
        return this.action$.pipe(
            ofType(addAttribute),
            switchMap((props) => {
                return this.adminService.addAttribute(props).pipe(
                    tap(data => console.log('Upload response', props)),
                   
                    catchError(() => {
                        return of()
                    })
                )
            })
        )
    }, { dispatch: false })

    constructor(private action$: Actions, private adminService: AdminService) {}
}