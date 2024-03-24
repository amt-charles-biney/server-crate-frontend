import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AdminService } from "../../../core/services/admin/admin.service";
import { getNotifications, gotNotifications } from "./notifications.actions";
import { exhaustMap, map } from "rxjs";

@Injectable()
export class NotificationEffect {
    getNotifications$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getNotifications),
            exhaustMap(() => {
                return this.adminService.getNotifications().pipe(
                    map(({ data }) => {
                        return gotNotifications(data)
                    })
                )
            })
        )
    })
    constructor(private action$: Actions, private adminService: AdminService){}
}