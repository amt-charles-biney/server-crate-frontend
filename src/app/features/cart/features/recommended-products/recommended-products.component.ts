import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider'
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { UserProductItemComponent } from '../../../../shared/components/user-product-item/user-product-item.component';
import { selectRecommendedState } from '../../../../store/admin/products/products.reducers';
import { getRecommendations } from '../../../../store/admin/products/categories.actions';

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

  recommendedProductSlider!: KeenSliderInstance
  recommendedProducts$ = this.store.select(selectRecommendedState)
  currentRecommendedSlide = 0

  constructor(private store: Store, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.store.dispatch(getRecommendations())
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
