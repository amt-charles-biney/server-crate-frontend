import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { gotPaymentResponse, sendingPaymentRequest, verifyPayment } from "./checkout.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { PaymentService } from "../../core/services/payment/payment.service";
import { setLoadingSpinner } from "../loader/actions/loader.actions";
import { errorHandler } from "../../core/utils/helpers";
import { Router } from "@angular/router";

@Injectable()
export class CheckoutEffect {
    sendingPaymentRequest$ = createEffect(() => {
        return this.actions.pipe(
            ofType(sendingPaymentRequest),
            exhaustMap((paymentRequest) => {
                return this.paymentService.postPayment(paymentRequest).pipe(
                    map(({data}) => {
                        window.open(data.authorization_url, '_blank')
                        return gotPaymentResponse(data)
                    }),
                    catchError((err) => {
                        return of(setLoadingSpinner({
                            isError: true,
                            message: errorHandler(err),
                            status: false
                        }))
                    })
                )
            })
        )
    })

    verifyPayment$ = createEffect(() => {
        return this.actions.pipe(
            ofType(verifyPayment),
            exhaustMap(({ reference }) => {
                console.log('Refernce', reference);
                
                return this.paymentService.verifyPayment(reference).pipe(
                    tap(() => console.log('Verification complete')
                    ),
                    catchError((err) => {
                        return of(setLoadingSpinner({
                            isError: true,
                            message: errorHandler(err),
                            status: false
                        }))
                    })
                )
            })
        )
    }, { dispatch: false })


    constructor(private actions: Actions, private paymentService: PaymentService) {}
}