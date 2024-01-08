import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../core/services/user/user.service";
import { filter } from "./users.actions";
import { catchError, map, of, shareReplay, switchMap } from "rxjs";
import { AllProducts } from "../../types";
import { gotProducts } from "../admin/products/categories.actions";

@Injectable()
export class UserEffect {
    filter$ = createEffect(() => {
        return this.action$.pipe(
            ofType(filter),
            switchMap((props) => {
                return this.userService.getProducts(props.page, props.params).pipe(
                    map((products: AllProducts) => {
                        console.log('Products', products);
                        
                        return gotProducts({ products });
                      }),
                      shareReplay(1),
                      catchError((err) => {
                        return of()
                      })
                )
            })
        )
    })

    constructor(private action$: Actions, private userService: UserService) {}
}