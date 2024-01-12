import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../core/services/user/user.service";
import { filter, search } from "./users.actions";
import { catchError, map, of, shareReplay, switchMap, tap } from "rxjs";
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

    search$ = createEffect(() => {
        return this.action$.pipe(
            ofType(search),
            switchMap(({ searchValue }) => {
                return this.userService.getSearchResults(searchValue).pipe(
                    tap((data: AllProducts) => 
                        console.log('Search results', data)
                    ),
                    // map((products: AllProducts) => {
                    //     console.log('Products', products);
                        
                    //     return gotProducts({ products });
                    //   }),
                    //   shareReplay(1),
                    //   catchError((err) => {
                    //     return of()
                    //   })
                    
                )
            })
        )
    }, { dispatch: false })

    constructor(private action$: Actions, private userService: UserService) {}
}