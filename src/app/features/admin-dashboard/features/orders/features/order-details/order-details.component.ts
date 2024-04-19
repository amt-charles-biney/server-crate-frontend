import { CacheService } from './../../../../../../core/services/cache/cache.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  cancelShipment,
  createShipment,
  getOrder,
  resetOrderDetail,
} from '../../../../../../store/orders/order.actions';
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
import { CustomSelectComponent } from '../../../../../../shared/components/custom-select/custom-select.component';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { AuthService } from '../../../../../../core/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ReasonModalComponent } from '../../../../../../shared/components/reason-modal/reason-modal.component';

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
    LoaderComponent,
    CustomSelectComponent,
  ],
  templateUrl: './order-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  CANCEL_ORDER = 'Cancelled'
  SHIP_ORDER = 'Ship Order'
  order$!: Observable<Content>;
  product!: SummarySubset;
  changeStatus!: FormControl;
  isAdmin: boolean = false;
  orderId!: string
  orderStatus!: string
  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private cacheService: CacheService
  ) {}
  ngOnInit(): void {
    this.changeStatus = new FormControl('');
    this.isAdmin = this.authService.isAdmin();
    this.orderId= this.activatedRoute.snapshot.paramMap.get('id')!;
    this.store.dispatch(getOrder({ id: this.orderId }));
    this.order$ = this.store.select(selectSingleOrderState).pipe(
      tap((order) => {
        this.orderStatus = order.status
        this.changeStatus.patchValue(order.trackingUrl ? 'Pre-transit' : 'Waiting for Admin')
        this.product = {
          productName: order.productName,
          quantity: order.configuredProduct[0]?.quantity,
          totalPrice: order.totalPrice,
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetOrderDetail());
  }

  goBackToOrders() {
    if (this.router.url.startsWith('/settings')) {
      this.router.navigate(['/settings/orders'], { replaceUrl: true });
    } else {
      this.router.navigate(['/admin/orders'], { replaceUrl: true });
    }
  }

  getChangeStatus(selectedStatus: MatSelectChange) {
    const status = selectedStatus.value

    if (status === 'Cancel Order') {
      this.orderStatus = status
      const dialogRef = this.dialog.open(ReasonModalComponent, {
        height: 'max-content',
        width: '40%',
        data: {
          id: this.orderId
        }
      })
      dialogRef.afterClosed().subscribe(
        (cancelOrder) => {
          this.orderStatus = !!cancelOrder ? this.CANCEL_ORDER : 'Assembling'
          if (!!cancelOrder) {
            this.changeStatus.patchValue('Cancelled')
          } else {
            this.changeStatus.patchValue('Waiting for Admin')
          }          
        })
    } else if (status === this.SHIP_ORDER) {
      this.store.dispatch(createShipment({ id: this.orderId }))
      this.cacheService.removeKeyFromCache('/admin/product')
      this.router.navigate([`/admin/orders/${this.orderId}`], { replaceUrl: true })
    }
  }
}
