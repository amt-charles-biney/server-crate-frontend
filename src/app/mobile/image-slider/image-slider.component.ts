import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { CloudinaryUrlPipe } from '../../shared/pipes/cloudinary-url/cloudinary-url.pipe';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [NgOptimizedImage, CloudinaryUrlPipe, CommonModule],
  templateUrl: './image-slider.component.html',
  styleUrls: ['../../../../node_modules/keen-slider/keen-slider.min.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('imageSlider', { static: true})
  imageSlider!: ElementRef<HTMLElement>;
  slider!: KeenSliderInstance;
  @Input() images: string[] = [];

  currentSlide$ = new BehaviorSubject<number>(0)
  dotHelper$ = new BehaviorSubject<Array<Number>>([])

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.slider = new KeenSlider(this.imageSlider.nativeElement, {
        initial: this.currentSlide$.value,
        loop: true,
        slideChanged: (slide) => {
          this.currentSlide$.next(slide.track.details.rel)
        }
      });
      this.dotHelper$.next([
        ...Array(this.slider.track?.details?.slides.length ?? this.images.length).keys()
      ])
    }, 300);
  }

  ngOnDestroy(): void {    
    if (this.slider) this.slider.destroy();
  }
}
