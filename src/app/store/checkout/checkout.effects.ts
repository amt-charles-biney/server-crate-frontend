import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { gotPaymentResponse, gotPaymentVerification, sendingPaymentRequest, verifyPayment } from "./checkout.actions";
import { catchError, exhaustMap, finalize, map, of, tap } from "rxjs";
import { PaymentService } from "../../core/services/payment/payment.service";
import { setLoadingSpinner } from "../loader/actions/loader.actions";
import { errorHandler } from "../../core/utils/helpers";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class CheckoutEffect {
    sendingPaymentRequest$ = createEffect(() => {
        return this.actions.pipe(
            ofType(sendingPaymentRequest),
            exhaustMap((paymentRequest) => {
                this.ngxService.start()
                return this.paymentService.postPayment(paymentRequest).pipe(
                    map(({data}) => {
                        window.open(data.authorization_url, '_self')
                        return gotPaymentResponse(data)
                    }),
                    catchError((err) => {
                        const errorMessage = errorHandler(err)
                        this.ngxService.stop()
                        this.toast.error(errorMessage, 'Error')
                        return of(setLoadingSpinner({
                            isError: true,
                            message: errorHandler(err),
                            status: false
                        }))
                    }),
                )
            })
        )
    })

    verifyPayment$ = createEffect(() => {
        return this.actions.pipe(
            ofType(verifyPayment),
            exhaustMap(({ reference }) => {
                this.ngxService.start()
                return this.paymentService.verifyPayment(reference).pipe(
                    map((props) => {
                        return gotPaymentVerification({ isVerified: true, message: props.message, status: props.status})
                    }),
                    catchError((err) => {
                        return of(setLoadingSpinner({
                            isError: true,
                            message: errorHandler(err),
                            status: false
                        }))
                    }),
                    finalize(() => {
                        this.ngxService.stop()
                    })
                )
            })
        )
    })


    constructor(private actions: Actions, private paymentService: PaymentService, private ngxService: NgxUiLoaderService, private toast: ToastrService) {}
}