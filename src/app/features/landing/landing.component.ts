import { Component } from '@angular/core';
import { HeroComponent } from './features/hero/hero.component';
import { BannerComponent } from './features/banner/banner.component';
import { FeaturedProductsComponent } from './features/featured-products/featured-products.component';
import { AboutComponent } from './features/about/about.component';
import { PopularProductsComponent } from './features/popular-products/popular-products.component';
import { FeedbackComponent } from './features/feedback/feedback.component';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroComponent, BannerComponent, FeaturedProductsComponent, AboutComponent, PopularProductsComponent, FeedbackComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
