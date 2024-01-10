import { Component, ElementRef, ViewChild } from '@angular/core';
import { heroSlider } from './hero.interface';
import { CommonModule } from '@angular/common';
import KeenSlider, { KeenSliderInstance } from 'keen-slider'

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: [
    "../../../../../../node_modules/keen-slider/keen-slider.min.css",
    "./hero.component.scss",
  ],
})
export class HeroComponent {

  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement> | any
  
  currentSlide: number = 0
  dotHelper: Array<Number> = []
  slider: KeenSliderInstance | any;

  sliders: heroSlider[] = [{
    img: "/assets/hero1.jpg",
    text: "high quality work",
    subtext: "help"
  },
  {
    img: "/assets/hero2.jpg",
    text: "high quality work",
    subtext: "help"
  }, 
  {
    img: "/assets/hero3.jpg",
    text: "high quality work",
    subtext: "help"
  }
]

  ngAfterViewInit() {
    setTimeout(() => {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: this.currentSlide,
        slideChanged: (s) => {
          this.currentSlide = s.track.details.rel
        },
      })
      this.dotHelper = [
        ...Array(this.slider.track.details.slides.length).keys(),
      ]
    })
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
  }



}
