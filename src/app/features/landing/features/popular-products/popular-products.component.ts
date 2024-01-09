import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductItem } from '../../../../types';
import KeenSlider, { KeenSliderInstance } from 'keen-slider'
import { ProductItemComponent } from '../../../../shared/components/product-item/product-item.component';

@Component({
  selector: 'app-popular-products',
  standalone: true,
  imports: [ProductItemComponent],
  templateUrl: './popular-products.component.html',
  styleUrls: [
    "../../../../../../node_modules/keen-slider/keen-slider.min.css"
  ],
})
export class PopularProductsComponent {

  @ViewChild("productSliderRef") sliderRef: ElementRef<HTMLElement> | any
  
  currentProductSlide: number = 0
  productDotHelper: Array<Number> = []
  productSlider: any;

  popularProducts: ProductItem[] = []

  ngAfterViewInit() {
    setTimeout(() => {
      this.productSlider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: this.currentProductSlide,
        slideChanged: (s) => {
          this.currentProductSlide = s.track.details.rel
        },
      })
      this.productDotHelper = [
        ...Array(this.productSlider.track.details.slides.length).keys(),
      ]
    })
  }

  ngOnDestroy() {
    if (this.productSlider) this.productSlider.destroy()
  }




}
