import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrls: [
    "../../../../../../node_modules/keen-slider/keen-slider.min.css",
  ],
})
export class FeedbackComponent {

  @ViewChild('feedbackSliderRef') feedbackSliderRef!: ElementRef<HTMLElement>;

  currentFeedbackSlide: number = 0
  dotHelper: Array<Number> = []
  feedbackSlider!: KeenSliderInstance;

  feedbacks: any[] = [
    {
      message: "Love the simplicity of the service and the prompt customer support. We can’t imagine working without it.",
      image: "/assets/user1.png",
      name: "Kelly Williams",
      position: "Head of Design, Layers",
      star: 4
    },
    {
      message: "Love the simplicity of the service and the prompt customer support. We can’t imagine working without it.",
      image: "/assets/user2.png",
      name: "Dickson Anyaele",
      position: "Head of Architecture, Tech",
      star: 2
    }
  ]

  ngAfterViewInit() {
    setTimeout(() => {
      this.feedbackSlider = new KeenSlider(this.feedbackSliderRef.nativeElement, {
        initial: this.currentFeedbackSlide,
        slideChanged: (s) => {
          this.currentFeedbackSlide = s.track.details.rel
          this.cdr.detectChanges()
        },
      })
      this.dotHelper = [
        ...Array(this.feedbackSlider.track.details.slides.length).keys(),
      ]
      
    })

  }

  ngOnDestroy() {
    if (this.feedbackSlider) this.feedbackSlider.destroy()
  }


  createStarArray = (num: number) => {
    let newArr = Array(num).fill(0)
    return newArr;
  }

  constructor(private cdr: ChangeDetectorRef) {}

}
