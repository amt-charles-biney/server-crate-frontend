import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider'
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { UserProductItemComponent } from '../../../../shared/components/user-product-item/user-product-item.component';
import { selectRecommendedState } from '../../../../store/admin/products/products.reducers';
import { getRecommendations } from '../../../../store/admin/products/categories.actions';
import { Observable } from 'rxjs';
import { ProductItem, ProductItemSubset } from '../../../../types';
import { loadFeaturedProducts } from '../../../../store/product/featured-product/featured-product.action';
import { selectFeaturedProducts } from '../../../../store/product/featured-product/featured-product.reducer';

@Component({
  selector: 'app-recommended-products',
  standalone: true,
  imports: [CommonModule, UserProductItemComponent],
  templateUrl: './recommended-products.component.html',
  styleUrls: [
    "../../../../../../node_modules/keen-slider/keen-slider.min.css"
  ],
})
export class RecommendedProductsComponent {
  @ViewChild('recommendedSliderRef') recommendedSliderRef!: ElementRef<HTMLElement>
  featuredProducts$!: Observable<ProductItem[] | []>;
  recommendedProducts$!: Observable<ProductItemSubset[] | []>;
  featuredProducts: ProductItem[] = []
  recommendedProductSlider!: KeenSliderInstance
  currentRecommendedSlide = 0
  
  constructor(private store: Store, private cdr: ChangeDetectorRef) { }
  
  ngOnInit() {
    this.store.dispatch(getRecommendations())
    this.store.dispatch(loadFeaturedProducts());
    this.recommendedProducts$ = this.store.select(selectRecommendedState)
    this.featuredProducts$ = this.store.select(selectFeaturedProducts)
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.recommendedSliderRef) {
        this.recommendedProductSlider = new KeenSlider(this.recommendedSliderRef.nativeElement, {
          initial: this.currentRecommendedSlide,
          loop: true,
          slideChanged: (s) => {
            this.currentRecommendedSlide = s.track.details.rel
          },
          mode: "free",
          slides: {
            perView: "auto",
            spacing: 16
          },
          breakpoints: {
            "(min-width: 1450px)": {
              slides: { perView: "auto", spacing: 0 }
            },
            "(max-width: 600px)": {
              slides: { perView: 1, spacing: 0 }
            },
            "(max-width: 1008px)": {
              slides: { perView: 2, spacing: 16}
            },
          }
        })
      }

      this.cdr.detectChanges();
    }, 2000)
  }


  ngOnDestroy() {
    if (this.recommendedProductSlider) this.recommendedProductSlider.destroy()
  }
}
