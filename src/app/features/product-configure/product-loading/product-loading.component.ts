import { ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectError, selectLoading, selectMessage, selectProductCartItemError, selectProductCartItemLoading, selectProductConfigItemError, selectProductConfigItemLoading } from '../../../store/product-spec/product-spec.reducer';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { resetCartMessage } from '../../../store/product-spec/product-spec.action';

@Component({
  selector: 'app-product-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-loading.component.html',
})
export class ProductLoadingComponent {

  productLoading: boolean = false
  productConfigItemLoading: boolean = false;
  productCartItemLoading: boolean = false;

  productError: String | null = null;
  productConfigItemError: String | null = null;
  productCartItemError: String | null = null

  addToCartMessage: String | null = null;

  private subcriptions: Subscription[] = []

  ngOnInit() {
    this.subcriptions.push(

      this.store.select(selectLoading).subscribe(loader => this.productLoading = loader),
      this.store.select(selectProductConfigItemLoading).subscribe(loader => {
        this.productConfigItemLoading = loader
        this.cdr.detectChanges()
      }
      ),
      this.store.select(selectProductCartItemLoading).subscribe(loader => {
        this.productCartItemLoading = loader
        this.cdr.detectChanges()
      }),

      this.store.select(selectError).subscribe(error => this.productError = error),
      this.store.select(selectProductConfigItemError).subscribe(error => this.productConfigItemError = error),
      this.store.select(selectProductCartItemError).subscribe(error => this.productCartItemError = error),

      this.store.select(selectMessage).subscribe(message => {
        this.addToCartMessage = message;

        setTimeout(() => {
          this.store.dispatch(resetCartMessage())
        }, 3000)

        this.cdr.detectChanges();
      })


    )

  }


  ngOnDestroy(): void {
    this.subcriptions.forEach(subscription => subscription.unsubscribe());
  }

  constructor(private store: Store, private cdr: ChangeDetectorRef) { }
}
