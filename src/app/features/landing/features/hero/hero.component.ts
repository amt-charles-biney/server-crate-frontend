import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { heroSlider } from './hero.interface';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import KeenSlider, { KeenSliderInstance } from 'keen-slider'
import { Router } from '@angular/router';
import { CloudinaryUrlPipe } from '../../../../shared/pipes/cloudinary-url/cloudinary-url.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CloudinaryUrlPipe],
  templateUrl: './hero.component.html',
  styleUrls: [
    "../../../../../../node_modules/keen-slider/keen-slider.min.css",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {

  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement> | any
  
  currentSlide: number = 0
  dotHelper: Array<Number> = []
  slider: KeenSliderInstance | any;

  image = "http://res.cloudinary.com/dah4l2inx/image/upload/v1714210781/adew94pjze3bjgwpjurj.jpg"

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
        mode: "free",
        slides: { perView: 1.15, spacing: 25 },
        slideChanged: (s) => {
          this.currentSlide = s.track.details.rel
          this.cdr.detectChanges()
        },
      })

      this.dotHelper = [
        ...Array(this.slider.track.details.slides.length).keys(),
      ]

    })
  }

  navigateToServers() {
    this.router.navigate(['/servers']);
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
  }


  constructor(private cdr: ChangeDetectorRef, private router: Router) {}
}
