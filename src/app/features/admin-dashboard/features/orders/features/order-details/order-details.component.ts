import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getOrder, resetOrderDetail } from '../../../../../../store/orders/order.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Content, SummarySubset } from '../../../../../../types';
import { selectSingleOrderState } from '../../../../../../store/orders/order.reducers';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ShippingStatusComponent } from '../../../../../../shared/components/shipping-status/shipping-status.component';
import { CustomStepperComponent } from '../../../../../../shared/components/custom-stepper/custom-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CloudinaryUrlPipe } from '../../../../../../shared/pipes/cloudinary-url/cloudinary-url.pipe';
import { SummaryComponent } from '../../../../../../shared/components/summary/summary.component';
import { LoaderComponent } from '../../../../../../core/components/loader/loader.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    ShippingStatusComponent,
    CustomStepperComponent,
    CdkStepperModule,
    CloudinaryUrlPipe,
    NgOptimizedImage,
    SummaryComponent,
    LoaderComponent
  ],
  templateUrl: './order-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  order$!: Observable<Content>;
  product!: SummarySubset
  constructor(private store: Store, private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.store.dispatch(getOrder({ id }));
    this.order$ = this.store.select(selectSingleOrderState).pipe(
      tap((order) => {      
        console.log('Order status', order.status);
          
        this.product = {
          productName: order.productName,
          quantity: order.configuredProduct[0]?.quantity,
          totalPrice: order.totalPrice
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetOrderDetail())
  }

  goBackToOrders() {
    this.router.navigate(['/admin/orders'], { replaceUrl: true })
  }
}
