import { Attribute, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getAttributes, gotAttributes } from "./category.actions";
import { exhaustAll, exhaustMap, map } from "rxjs";
import { AdminService } from "../../core/services/admin/admin.service";

@Injectable()
export class CategoryManagementEffect {
    loadAttributes$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getAttributes),
            exhaustMap(() => {
                return this.adminService.getAttributes().pipe(
                    map((attributes: Attribute[]) => {
                        return gotAttributes({ attributes })
                    })
                )
            })
        )
    })

    constructor(private action$: Actions, private adminService: AdminService) {}
}