import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AdminService } from "../../core/services/admin/admin.service";
import { cancelShipment, createShipment, deleteAllAdminOrders, getAdminOrders, getOrder, getUserOrders, gotAdminOrders, gotOrder, gotUserOrders } from "./order.actions";
import { EMPTY, catchError, finalize, map, switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { errorHandler } from "../../core/utils/helpers";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CancelShipment } from "../../types";

@Injectable()
export class OrderEffects {
    getOrders$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getAdminOrders),
            switchMap(({ params }) => {
                return this.adminService.getAdminOrders(params).pipe(
                    map((orders) => {
                        return gotAdminOrders(orders)
                    }),
                    catchError((err) => {
                        this.toast.error(errorHandler(err), 'Error')
                        return EMPTY
                    })
                )
            })
        )
    })
    getOrder$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getOrder),
            switchMap(({ id }) => {
                this.ngxService.startLoader('orderDetails')
                return this.adminService.getOrder(id).pipe(
                    map((order) => {
                        return gotOrder(order)
                    }),
                    catchError((err) => {
                        this.toast.error(errorHandler(err), 'Error')
                        return EMPTY
                    }),
                    finalize(() => {
                        this.ngxService.stopLoader('orderDetails')
                    })
                )
            })
        )
    })
    
    getUserOrders$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getUserOrders),
            switchMap(({ params }) => {
                return this.adminService.getUserOrders(params).pipe(
                    map((orders) => {
                        return gotUserOrders(orders)
                    }),
                    catchError((err) => {
                        this.toast.error(errorHandler(err), 'Error')
                        return EMPTY
                    })
                )
            })
        )
    })

    deleteAllAdminOrders$ = createEffect(() => {
        return this.action$.pipe(
            ofType(deleteAllAdminOrders),
            switchMap(({ deleteList }) => {
                return this.adminService.deleteAllAdminOrders(deleteList).pipe(
                    map(() => {
                        this.toast.success('Deleted orders successfully', 'Success', { timeOut: 1500 })
                        return getAdminOrders({})
                    }),
                    catchError((err) => {
                        this.toast.error(errorHandler(err), 'Error')
                        return EMPTY
                    })
                )
            })
        )
    })

    createShipment$ = createEffect(() => {
        return this.action$.pipe(
            ofType(createShipment),
            switchMap(({ id }) => {
                this.ngxService.startLoader('orderDetails')
                return this.adminService.createShipment(id).pipe(
                    map(() => {
                        return getOrder({ id })
                    }),
                    catchError((err) => {
                        this.toast.error(errorHandler(err), "Error")
                        return EMPTY
                    })
                )
            })
        )
    })
    cancelShipment$ = createEffect(() => {
        return this.action$.pipe(
            ofType(cancelShipment),
            switchMap((props: CancelShipment) => {
                return this.adminService.cancelShipment(props).pipe(
                    map(() => {
                        this.ngxService.startLoader('orderDetails')
                        return getOrder({ id: props.id })
                    }),
                    catchError((err) => {
                        this.toast.error(errorHandler(err), "Error")
                        return EMPTY
                    })
                )
            })
        )
    })

    

    constructor(private action$: Actions, private adminService: AdminService, private toast: ToastrService, private ngxService: NgxUiLoaderService) {}
}