import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider'
import { Store } from '@ngrx/store';
import { selectNewProducts } from '../../../../store/product/featured-product/featured-product.reducer';
import { CommonModule } from '@angular/common';
import { UserProductItemComponent } from '../../../../shared/components/user-product-item/user-product-item.component';
import { loadNewProducts } from '../../../../store/product/featured-product/featured-product.action';

@Component({
  selector: 'app-popular-products',
  standalone: true,
  imports: [CommonModule, UserProductItemComponent],
  templateUrl: './popular-products.component.html',
  styleUrls: [
    "../../../../../../node_modules/keen-slider/keen-slider.min.css"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopularProductsComponent {
  @ViewChild('popularSliderRef') popularSliderRef!: ElementRef<HTMLElement>

  popularProductSlider!: KeenSliderInstance
  popularProducts$ = this.store.select(selectNewProducts)
  currentPopularSlide = 0

  constructor(private store: Store, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.store.dispatch(loadNewProducts())
      if (this.popularSliderRef) {
        this.popularProductSlider = new KeenSlider(this.popularSliderRef.nativeElement, {
          initial: this.currentPopularSlide,
          loop: true,
          slideChanged: (s) => {
            this.currentPopularSlide = s.track.details.rel
          },
          mode: "free",
          slides: {
            perView: "auto",
            spacing: 16
          },
          breakpoints: {
            "(min-width: 1451px)": {
              slides: { perView: 4, spacing: 16 }
            },
            "(max-width: 1450px)": {
              slides: { perView: 3, spacing: 16 }
            },
            "(max-width: 1008px)": {
              slides: { perView: 2, spacing: 16 }
            },
            "(max-width: 600px)": {
              slides: { perView: 1, spacing: 16 }
            }
          }
        })
      }

      this.cdr.detectChanges();
    }, 2000)
  }


  ngOnDestroy() {
    if (this.popularProductSlider) this.popularProductSlider.destroy()
  }

}
