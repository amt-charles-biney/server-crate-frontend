import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectError, selectLoading, selectMessage, selectProductCartItem, selectProductCartItemError, selectProductCartItemLoading, selectProductConfigItemError, selectProductConfigItemLoading } from '../../../store/product-spec/product-spec.reducer';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, take, timer } from 'rxjs';
import { resetCartMessage } from '../../../store/product-spec/product-spec.action';

@Component({
  selector: 'app-product-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-loading.component.html',
})
export class ProductLoadingComponent implements OnInit {

  productLoading: boolean = false
  productConfigItemLoading: boolean = false;
  productCartItemLoading: boolean = false;

  productError$: Observable<String> = this.store.select(selectError)
  productConfigItemError$: Observable<String> = this.store.select(selectProductConfigItemError)
  productCartItemError$: Observable<String> = this.store.select(selectProductCartItemError)

  cartMsg$: Observable<String | null> = this.store.select(selectMessage)

  private subcriptions: Subscription[] = []

  ngOnInit() {
    this.subcriptions.push(

      this.store.select(selectLoading).subscribe(loader => this.productLoading = loader),

      this.store.select(selectProductConfigItemLoading).subscribe(loader => {
        this.productConfigItemLoading = loader;
        this.cdr.detectChanges()
      }),

      this.store.select(selectProductCartItemLoading).subscribe(loader => {
        this.productCartItemLoading = loader
        this.cdr.detectChanges()
      }),


      this.store.select(selectMessage).subscribe(() => {
        timer(3000).pipe(take(1)).subscribe(() => {
          this.store.dispatch(resetCartMessage());
        });
      })
    )

  }


  ngOnDestroy(): void {
    this.subcriptions.forEach(subscription => subscription.unsubscribe());
  }

  constructor(private store: Store, private cdr: ChangeDetectorRef) { }
}
